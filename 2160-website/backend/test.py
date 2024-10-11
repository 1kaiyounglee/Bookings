from helper_modules import db_helper as db, util as ut
from datetime import datetime
# query1 = """
# SELECT 
#     o.order_id, o.email, o.total_price, o.order_date, o.payment_status, 
#     b.start_date, b.end_date, b.number_of_travellers, b.price, b.status, 
#     p.name, p.duration, 
#     l.country, l.city
# FROM Orders o 
# JOIN OrderItems oi ON o.order_id = oi.order_id
# JOIN Bookings b ON oi.booking_id = b.booking_id
# JOIN Packages p ON b.package_id = p.package_id
# JOIN Locations l ON p.location_id = l.location_id

# WHERE o.email = 'jettv224@gmail.com'
# ORDER BY o.order_date DESC,
#     CASE 
#         WHEN b.status = 'pending' THEN 1
#         WHEN b.status = 'confirmed' THEN 2
#         WHEN b.status = 'cancelled' THEN 3
#     END;
# """
# data = db.fetch_data(query1)
# print(data)
# ut.update_admin('austingod1@gmail.com')
ut.fetch_and_print_all_tables()