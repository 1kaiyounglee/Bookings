from flask import Blueprint, request, jsonify
import traceback
from datetime import datetime
import os
from helper_modules import db_helper as db
from paypalcheckoutsdk.core import PayPalHttpClient, SandboxEnvironment
from paypalcheckoutsdk.orders import OrdersCreateRequest, OrdersCaptureRequest
from dotenv import load_dotenv
import time

api_orders = Blueprint('orders', __name__)
load_dotenv()

# PayPal credentials from environment variables
PAYPAL_CLIENT_ID = os.getenv("PAYPAL_CLIENT_ID")
PAYPAL_CLIENT_SECRET = os.getenv("PAYPAL_CLIENT_SECRET")
print(f"PAYPAL_CLIENT_ID: {PAYPAL_CLIENT_ID}")
print(f"PAYPAL_CLIENT_SECRET: {PAYPAL_CLIENT_SECRET}")
environment = SandboxEnvironment(client_id=PAYPAL_CLIENT_ID, client_secret=PAYPAL_CLIENT_SECRET)
client = PayPalHttpClient(environment)

# Route to create PayPal order
@api_orders.route('/create', methods=['POST'])
def create_order():
    try:
        cart = request.json.get('cart')
        total_price = 0
        for order in cart:
            total_price += order['quantity'] * order['price']
        total_price = round(total_price, 2)
        print(f'TOTAL PRICE: {total_price}')

        request_order = OrdersCreateRequest()
        request_order.prefer('return=minimal')
        request_order.request_body({
            "intent": "CAPTURE",
            "purchase_units": [{
                "amount": {
                    "currency_code": "AUD",
                    "value": str(total_price)
                }
            }]
        })

        response = client.execute(request_order)
        # Manually extract relevant fields
        order_result = {
            "id": response.result.id,
            "status": response.result.status,
            "links": [{"href": link.href, "rel": link.rel, "method": link.method} for link in response.result.links]
        }
        # print(order_result)
        return jsonify(order_result), response.status_code

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

@api_orders.route('/<order_id>/capture', methods=['POST'])
def capture_order(order_id):
    try:
        request_capture = OrdersCaptureRequest(order_id)

        # Execute the PayPal request to capture the payment
        response = client.execute(request_capture)

        # Extract the details from the response in a JSON-friendly format
        capture_result = {
            "id": response.result.id,
            "status": response.result.status,
            "payment_source": {
                "paypal": {
                    "email_address": response.result.payment_source.paypal.email_address,
                    "account_id": response.result.payment_source.paypal.account_id,
                    "account_status": response.result.payment_source.paypal.account_status,
                    "name": {
                        "given_name": response.result.payment_source.paypal.name.given_name,
                        "surname": response.result.payment_source.paypal.name.surname,
                    },
                    "address": {
                        "country_code": response.result.payment_source.paypal.address.country_code,
                    },
                }
            },
            "purchase_units": [
                {
                    "reference_id": unit.reference_id,
                    "shipping": {
                        "name": unit.shipping.name.full_name,
                        "address": {
                            "address_line_1": unit.shipping.address.address_line_1,
                            "address_line_2": unit.shipping.address.address_line_2,
                            "admin_area_1": unit.shipping.address.admin_area_1,
                            "admin_area_2": unit.shipping.address.admin_area_2,
                            "postal_code": unit.shipping.address.postal_code,
                            "country_code": unit.shipping.address.country_code,
                        }
                    },
                    "payments": {
                        "captures": [
                            {
                                "id": capture.id,
                                "status": capture.status,
                                "amount": {
                                    "currency_code": capture.amount.currency_code,
                                    "value": capture.amount.value,
                                },
                                "final_capture": capture.final_capture,
                                "seller_protection": capture.seller_protection.status,
                                "seller_receivable_breakdown": {
                                    "gross_amount": {
                                        "currency_code": capture.seller_receivable_breakdown.gross_amount.currency_code,
                                        "value": capture.seller_receivable_breakdown.gross_amount.value,
                                    },
                                    "paypal_fee": {
                                        "currency_code": capture.seller_receivable_breakdown.paypal_fee.currency_code,
                                        "value": capture.seller_receivable_breakdown.paypal_fee.value,
                                    },
                                    "net_amount": {
                                        "currency_code": capture.seller_receivable_breakdown.net_amount.currency_code,
                                        "value": capture.seller_receivable_breakdown.net_amount.value,
                                    }
                                },
                                "create_time": capture.create_time,
                                "update_time": capture.update_time,
                                "links": [
                                    {"href": link.href, "rel": link.rel, "method": link.method} for link in capture.links
                                ],
                            }
                            for capture in unit.payments.captures
                        ]
                    }
                }
                for unit in response.result.purchase_units
            ],
            "payer": {
                "name": {
                    "given_name": response.result.payer.name.given_name,
                    "surname": response.result.payer.name.surname,
                },
                "email_address": response.result.payer.email_address,
                "payer_id": response.result.payer.payer_id,
                "address": {
                    "country_code": response.result.payer.address.country_code,
                }
            },
            "links": [
                {"href": link.href, "rel": link.rel, "method": link.method} for link in response.result.links
            ]
        }
        # print(f"CAPTURE RESUTL DATA: {capture_result}")
        # Return the formatted response
        return jsonify(capture_result), response.status_code

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@api_orders.route('/update-orders', methods=['POST'])
def update_bookings_and_orders():
    try:
        # Get data from the request
        data = request.json
        cart_items = data.get('cart_items')
        user_email = data.get('user_email')
        total_price = round(data.get('total_price'), 2)
        print(cart_items)
        print(user_email)
        print(total_price)
        if not cart_items or not user_email or not total_price:
            return jsonify({"error": "Invalid input data"}), 400

        # Insert a new row into the Orders table and get the last inserted order_id
        insert_order_query = """
            INSERT INTO Orders (email, total_price, order_date, payment_date, payment_status)
            VALUES (:email, :total_price, :order_date, :payment_date, 'paid')
        """
        order_params = {
            'email': user_email,
            'total_price': total_price,
            'order_date': datetime.now().strftime('%Y-%m-%d'),
            'payment_date': datetime.now().strftime('%Y-%m-%d')
        }
        db.execute_query(insert_order_query, order_params)
        fetch_order_id_query = """
            SELECT order_id FROM Orders
            WHERE email = :email AND total_price = :total_price AND order_date = :order_date AND payment_date = :payment_date
            ORDER BY order_id DESC LIMIT 1
        """

        order_id = int(db.fetch_data(fetch_order_id_query, order_params)['order_id'][0])
        print(f"ORDERID: {order_id}")
        if not order_id:
            return jsonify({"error": "Failed to retrieve order ID"}), 500

        # Link the order to the respective bookings in the OrderItems table
        for item in cart_items:
            booking_id = item['bookingId']  # Assuming id is the bookingId

            # Insert into OrderItems table to link order with booking IDs
            insert_order_item_query = """
                INSERT INTO OrderItems (order_id, booking_id)
                VALUES (:order_id, :booking_id)
            """
            db.execute_query(insert_order_item_query, {'order_id': order_id, 'booking_id': booking_id})

            # Optionally update the booking status to 'confirmed' or any other status
            update_booking_query = """
                UPDATE Bookings SET status = 'pending'
                WHERE booking_id = :booking_id
            """
            db.execute_query(update_booking_query, {'booking_id': booking_id})

        return jsonify({"success": True, "order_id": order_id}), 200

    except Exception as e:
        print(f"Error updating database: {traceback.format_exc()}")
        return jsonify({"error": str(e)}), 500

