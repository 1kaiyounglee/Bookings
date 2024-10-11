from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Users, Packages, Bookings, Orders, OrderItems, Locations, Categories, PackageCategory, PackageImages
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
        Locations(country="USA", city="New York", image_path="location_images/new_york.jpg"),
        Locations(country="France", city="Paris", image_path="location_images/paris.jpg"),
        Locations(country="Italy", city="Rome", image_path="location_images/rome.jpg"),
        Locations(country="Japan", city="Tokyo", image_path="location_images/tokyo.jpg"),
        Locations(country="Australia", city="Sydney", image_path="location_images/sydney.jpg"),
        Locations(country="Australia", city="Melbourne", image_path="location_images/melbourne.jpg"),
        Locations(country="Australia", city="Gold Coast", image_path="location_images/gold_coast.jpg"),
    ]
    session.add_all(locations)

    # Sample users
    users = [
        Users(email="jettv224@gmail.com", password="$2b$12$oMaUFceU71wqjybIwAvKtuiFuZoQfQkpBVUpUrWW.IiHJIgF5GF0O", phone_number="555-1234", first_name="Jett", last_name="Vongxayasy", is_admin=True), # password is 1234
        Users(email="john.doe@example.com", password="password123", phone_number="555-1234", first_name="John", last_name="Doe", is_admin=False),
        Users(email="jane.smith@example.com", password="password456", phone_number="555-5678", first_name="Jane", last_name="Smith", is_admin=False),
        Users(email="alice.wonderland@example.com", password="wonder123", phone_number="555-9876", first_name="Alice", last_name="Wonderland", is_admin=False),
        Users(email="bob.builder@example.com", password="builder456", phone_number="555-1111", first_name="Bob", last_name="Builder", is_admin=False),
        Users(email="clark.kent@example.com", password="superman", phone_number="555-2222", first_name="Clark", last_name="Kent", is_admin=False),
    ]
    session.add_all(users)

    # Sample packages (default_hotel_id removed)
    packages = [
        Packages(location_id=1, name="NYC 3-Day Tour", description="Explore the vibrant streets of New York City on this 3-day tour. Visit iconic landmarks such as the Statue of Liberty, Times Square, and Central Park. Enjoy the city's diverse culinary scene and world-renowned entertainment options, all while experiencing the unique energy of the Big Apple.", duration=3, price=499.99),
        Packages(location_id=2, name="Paris Luxury Package", description="Indulge in the beauty and elegance of Paris with this 5-day luxury package. Stay in a premier hotel, enjoy fine dining, and explore the city's most famous attractions, including the Eiffel Tower, the Louvre, and the Champs-Élysées. A perfect blend of culture, history, and luxury awaits you in the City of Light.", duration=5, price=899.99),
        Packages(location_id=3, name="Rome Historical Tour", description="Immerse yourself in ancient history with this 4-day tour of Rome. Visit world-famous sites like the Colosseum, the Roman Forum, and the Pantheon. Walk through the city's cobbled streets while discovering its rich history, architecture, and art. Ideal for history enthusiasts and culture lovers.", duration=4, price=699.99),
        Packages(location_id=4, name="Tokyo Adventure", description="Experience the dynamic energy of Tokyo with this 7-day adventure. Discover both the modern and traditional sides of Japan, from cutting-edge technology to ancient temples. Explore bustling markets, neon-lit districts, and serene parks, all while indulging in Tokyo’s unique cuisine.", duration=7, price=1199.99),
        Packages(location_id=5, name="Sydney Beach Escape", description="Relax on Sydney’s famous beaches with this 6-day getaway. Enjoy sun, sand, and surf as you visit iconic beaches like Bondi and Manly. Explore the vibrant city life, including the Sydney Opera House and Harbour Bridge, while experiencing the laid-back Australian lifestyle.", duration=6, price=999.99),
        Packages(location_id=1, name="New York City Food Tour", description="Savor the flavors of New York City on this 3-day food tour. Visit local markets, food trucks, and renowned restaurants to taste the city's diverse culinary offerings. From classic New York pizza to international cuisine, this tour is a must for food lovers.", duration=3, price=599.99),
        Packages(location_id=2, name="Romantic Paris Honeymoon", description="Celebrate love in the romantic city of Paris with this 7-day honeymoon package. Stay in a luxurious hotel, dine in fine restaurants, and take private tours of the city’s most iconic landmarks, including a romantic Seine River cruise. Perfect for newlyweds seeking a magical Parisian escape.", duration=7, price=1299.99),
        Packages(location_id=3, name="Rome Gladiator Experience", description="Step into the shoes of a gladiator with this 5-day experience in Rome. Explore the Colosseum and learn about the history of gladiatorial combat. This tour combines historical education with hands-on experiences, making it perfect for adventure seekers and history buffs alike.", duration=5, price=799.99),
        Packages(location_id=4, name="Tokyo Tech Expo", description="Discover the latest innovations in technology at the Tokyo Tech Expo during this 4-day tour. Attend exhibitions, explore interactive displays, and see the future of tech firsthand. This tour is ideal for tech enthusiasts eager to explore Japan’s leadership in innovation.", duration=4, price=1099.99),
        Packages(location_id=5, name="Sydney Wildlife Safari", description="Discover the unique wildlife of Australia with this 5-day Sydney safari. Visit local zoos and wildlife parks, explore the natural habitats of koalas, kangaroos, and more. Enjoy guided tours and learn about the conservation efforts to protect Australia’s diverse fauna.", duration=5, price=899.99),
        Packages(location_id=6, name="Melbourne Art & Culture Tour", description="Explore the cultural heart of Melbourne with this 4-day tour, visiting world-class museums, galleries, and theaters. Experience the city’s vibrant street art scene, cultural festivals, and historic landmarks while enjoying the cosmopolitan atmosphere that Melbourne is known for.", duration=4, price=699.99),
        Packages(location_id=7, name="Gold Coast Surfing Adventure", description="Ride the waves on Australia’s stunning Gold Coast with this 6-day surfing adventure. Whether you’re a beginner or an experienced surfer, this package includes lessons and guided surf sessions. Enjoy the sun, sand, and surf in one of the world’s best surfing destinations.", duration=6, price=799.99),
        Packages(location_id=4, name="Tokyo Nightlife Experience", description="Experience Tokyo’s legendary nightlife with this 3-day tour. Explore the neon-lit districts of Shinjuku and Shibuya, visit trendy bars and clubs, and enjoy live music performances. This tour offers a unique glimpse into the dynamic and vibrant nightlife scene of Japan’s capital city.", duration=3, price=999.99),
        Packages(location_id=3, name="Rome Culinary Delights", description="Savor the flavors of Italy with this 6-day culinary tour of Rome. Visit local markets, participate in cooking classes, and dine in authentic Roman restaurants. This experience offers a deep dive into Italian cuisine, perfect for food lovers and aspiring chefs.", duration=6, price=1099.99),
        Packages(location_id=1, name="NYC Broadway Extravaganza", description="Experience the magic of Broadway with this 4-day New York City theater tour. Enjoy VIP tickets to top Broadway shows, meet cast members, and explore the city’s vibrant theater district. Perfect for theater enthusiasts and those looking to immerse themselves in the arts.", duration=4, price=899.99),
    ]
    session.add_all(packages)

    # Sample bookings
    bookings = [
        Bookings(email="jettv224@gmail.com", package_id=1, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=3), number_of_travellers=2, price=499.99, status='confirmed'),
        Bookings(email="jettv224@gmail.com", package_id=2, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=5), number_of_travellers=1, price=899.99, status='pending'),
        Bookings(email="jettv224@gmail.com", package_id=3, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=4), number_of_travellers=4, price=699.99, status='confirmed'),
        Bookings(email="jettv224@gmail.com", package_id=5, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=4), number_of_travellers=4, price=699.99, status='pending'),
        Bookings(email="jettv224@gmail.com", package_id=7, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=4), number_of_travellers=4, price=699.99, status='cancelled'),
        Bookings(email="john.doe@example.com", package_id=1, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=3), number_of_travellers=2, price=499.99, status='confirmed'),
        Bookings(email="jane.smith@example.com", package_id=2, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=5), number_of_travellers=1, price=899.99, status='pending'),
        Bookings(email="alice.wonderland@example.com", package_id=3, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=4), number_of_travellers=4, price=699.99, status='confirmed'),
        Bookings(email="bob.builder@example.com", package_id=4, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=7), number_of_travellers=3, price=1199.99, status='cancelled'),
        Bookings(email="clark.kent@example.com", package_id=5, start_date=datetime.now(), end_date=datetime.now() + timedelta(days=6), number_of_travellers=5, price=999.99, status='confirmed'),
    ]
    session.add_all(bookings)

    # Sample orders
    orders = [
        Orders(email="jettv224@gmail.com", total_price = 1098.33, order_date=datetime.now(), payment_date=datetime.now(), payment_status='paid'),
        Orders(email="jettv224@gmail.com", total_price = 175.32, order_date=datetime.now() - timedelta(days=7), payment_date=datetime.now() - timedelta(days=7), payment_status='paid'),
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
        OrderItems(order_id=1, booking_id=2),
        OrderItems(order_id=1, booking_id=3),
        OrderItems(order_id=2, booking_id=4),
        OrderItems(order_id=2, booking_id=5),
        OrderItems(order_id=3, booking_id=6),
        OrderItems(order_id=4, booking_id=7),
        OrderItems(order_id=5, booking_id=8),
    ]
    session.add_all(order_items)

    # Sample categories
    categories = [
        Categories(name="Luxury", image_path="category_images/luxury.jpg"),
        Categories(name="Adventure", image_path="category_images/adventure.jpg"),
        Categories(name="Historical", image_path="category_images/historical.jpg"),
        Categories(name="Family", image_path="category_images/family.jpg"),
        Categories(name="Budget", image_path="category_images/budget.jpg"),
        Categories(name="Wellness", image_path="category_images/wellness.jpg"),
        Categories(name="Cultural", image_path="category_images/cultural.jpg"),
        Categories(name="Nature", image_path="category_images/nature.jpg"),
    ]
    session.add_all(categories)

    # Sample package categories
    package_categories = [
        PackageCategory(package_id=1, category_id=1),
        PackageCategory(package_id=1, category_id=2),
        PackageCategory(package_id=2, category_id=1),
        PackageCategory(package_id=3, category_id=3),
        PackageCategory(package_id=3, category_id=7),
        PackageCategory(package_id=4, category_id=2),
        PackageCategory(package_id=5, category_id=8),
        PackageCategory(package_id=6, category_id=7),
    ]
    session.add_all(package_categories)


    # imagepath = "imageid packageid.jpg"
    package_images = [
        PackageImages(package_id=1, image_path="package_images/1.jpg"),
        PackageImages(package_id=1, image_path="package_images/2.jpg"),
        PackageImages(package_id=1, image_path="package_images/3.jpg"),
        PackageImages(package_id=2, image_path="package_images/4.jpg"),
        PackageImages(package_id=3, image_path="package_images/5.jpg"),
        PackageImages(package_id=3, image_path="package_images/6.jpg"),
        PackageImages(package_id=4, image_path="package_images/7.jpg"),
        PackageImages(package_id=4, image_path="package_images/8.jpg"),
        PackageImages(package_id=5, image_path="package_images/9.jpg"),
        PackageImages(package_id=6, image_path="package_images/10.jpg"),
        PackageImages(package_id=7, image_path="package_images/11.jpg"),
        PackageImages(package_id=7, image_path="package_images/12.jpg"),
        PackageImages(package_id=8, image_path="package_images/13.jpg"),
        PackageImages(package_id=9, image_path="package_images/14.jpg"),
        PackageImages(package_id=10, image_path="package_images/15.jpg"),
        PackageImages(package_id=11, image_path="package_images/16.jpg"),
        PackageImages(package_id=12, image_path="package_images/17.jpg"),
        PackageImages(package_id=13, image_path="package_images/18.jpg"),
        PackageImages(package_id=14, image_path="package_images/19.jpg"),
        PackageImages(package_id=15, image_path="package_images/20.jpg"),
    ]
    session.add_all(package_images)

    session.commit()
    print("Sample data inserted into all tables!")

if __name__ == "__main__":
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary