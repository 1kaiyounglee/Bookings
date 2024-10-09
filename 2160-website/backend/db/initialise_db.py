from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Users, Packages, Bookings, Orders, OrderItems, Locations, Categories, PackageCategory
from db_config import engine, Session
from datetime import datetime, timedelta


# Step 4: Create the Database and Tables from Scratch
def setup_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.create_all(engine)  # This creates all tables defined
    print("Database and tables created!")


# Step 5: Insert Sample Data
def insert_sample_data():
    session = Session()

    # Sample locations
    locations = [
        Locations(country="USA", city="New York", image_path="ny_image.jpg"),
        Locations(country="France", city="Paris", image_path="paris_image.jpg"),
        Locations(country="Italy", city="Rome", image_path="rome_image.jpg"),
        Locations(country="Japan", city="Tokyo", image_path="tokyo_image.jpg"),
        Locations(country="Australia", city="Sydney", image_path="sydney_image.jpg"),
    ]
    session.add_all(locations)

    # Sample users
    users = [
        Users(email="john.doe@example.com", password="password123", phone_number="555-1234", first_name="John", last_name="Doe", is_admin=False),
        Users(email="jane.smith@example.com", password="password456", phone_number="555-5678", first_name="Jane", last_name="Smith", is_admin=False),
        Users(email="alice.wonderland@example.com", password="wonder123", phone_number="555-9876", first_name="Alice", last_name="Wonderland", is_admin=False),
        Users(email="bob.builder@example.com", password="builder456", phone_number="555-1111", first_name="Bob", last_name="Builder", is_admin=True),
        Users(email="clark.kent@example.com", password="superman", phone_number="555-2222", first_name="Clark", last_name="Kent", is_admin=True),
    ]
    session.add_all(users)

    # Sample packages (default_hotel_id removed)
    packages = [
        Packages(location_id=1, description="NYC 3-Day Tour", duration=3, price=499.99),
        Packages(location_id=2, description="Paris Luxury Package", duration=5, price=899.99),
        Packages(location_id=3, description="Rome Historical Tour", duration=4, price=699.99),
        Packages(location_id=4, description="Tokyo Adventure", duration=7, price=1199.99),
        Packages(location_id=5, description="Sydney Beach Escape", duration=6, price=999.99),
    ]
    session.add_all(packages)

    # Sample bookings
    bookings = [
        Bookings(email="john.doe@example.com", package_id=1, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=3), number_of_travellers=2, price=499.99, status='confirmed'),
        Bookings(email="jane.smith@example.com", package_id=2, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=5), number_of_travellers=1, price=899.99, status='pending'),
        Bookings(email="alice.wonderland@example.com", package_id=3, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=4), number_of_travellers=4, price=699.99, status='confirmed'),
        Bookings(email="bob.builder@example.com", package_id=4, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=7), number_of_travellers=3, price=1199.99, status='cancelled'),
        Bookings(email="clark.kent@example.com", package_id=5, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=6), number_of_travellers=5, price=999.99, status='confirmed'),
    ]
    session.add_all(bookings)

    # Sample orders
    orders = [
        Orders(email="john.doe@example.com", total_price=499.99, order_date=datetime.now(), payment_date=datetime.now(), payment_status='paid'),
        Orders(email="jane.smith@example.com", total_price=899.99, order_date=datetime.now(), payment_status='pending'),
        Orders(email="alice.wonderland@example.com", total_price=699.99, order_date=datetime.now(), payment_date=datetime.now(), payment_status='paid'),
        Orders(email="bob.builder@example.com", total_price=1199.99, order_date=datetime.now(), payment_status='pending'),
        Orders(email="clark.kent@example.com", total_price=999.99, order_date=datetime.now(), payment_date=datetime.now(), payment_status='paid'),
    ]
    session.add_all(orders)

    # Sample order items
    order_items = [
        OrderItems(order_id=1, booking_id=1),
        OrderItems(order_id=2, booking_id=2),
        OrderItems(order_id=3, booking_id=3),
        OrderItems(order_id=4, booking_id=4),
        OrderItems(order_id=5, booking_id=5),
    ]
    session.add_all(order_items)

    # Sample categories
    categories = [
        Categories(name="Luxury", image_path="luxury_image.jpg"),
        Categories(name="Adventure", image_path="adventure_image.jpg"),
        Categories(name="Historical", image_path="historical_image.jpg"),
    ]
    session.add_all(categories)

    # Sample package categories
    package_categories = [
        PackageCategory(package_id=1, category_id=1),
        PackageCategory(package_id=2, category_id=1),
        PackageCategory(package_id=3, category_id=3),
        PackageCategory(package_id=4, category_id=2),
        PackageCategory(package_id=5, category_id=2),
    ]
    session.add_all(package_categories)

    session.commit()
    print("Sample data inserted into all tables!")

if __name__ == "__main__":
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary
