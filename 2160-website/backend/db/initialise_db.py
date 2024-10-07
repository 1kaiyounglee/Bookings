from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.Users import Users
from db_config import engine, Session
# Define the engine and base

# Step 4: Create the Database and Tables from Scratch
def setup_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.create_all(engine)  # This creates all tables defined
    print("Database and tables created!")

# Step 5: Insert Sample Data
def insert_sample_data():
    session = Session()

    # Insert sample users
    sample_users = [
        Users(email='kai@gmail.com', password='forntie', is_admin=False),
        Users(email='haha@gmail.com', password='skibidi', is_admin=True),
        Users(email='asd@gmail.com', password='sasdasdkibidi', is_admin=True),
        Users(email='haha@asdasdasd.com', password='skibiasdasdasdasdsaddi', is_admin=True),

    ]

    session.add_all(sample_users)
    session.commit()
    print("Sample data inserted into Users table")

if __name__ == "__main__":
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary
