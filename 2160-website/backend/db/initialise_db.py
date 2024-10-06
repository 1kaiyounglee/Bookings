from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models.users import Users

# Define the engine and base
engine = create_engine('sqlite:///holidaybookinsystem.db')

# Step 4: Create the Database and Tables from Scratch
def setup_database():
    from models import Base  # Ensure that the Base is imported from the correct location
    Base.metadata.create_all(engine)  # This creates all tables defined
    print("Database and tables created!")

# Step 5: Insert Sample Data
def insert_sample_data():
    Session = sessionmaker(bind=engine)
    session = Session()

    # Insert sample users
    sample_users = [
        Users(email='kai@gmail.com', password='forntie', is_admin=False),
        Users(email='haha@gmail.com', password='skibidi', is_admin=True),
    ]

    session.add_all(sample_users)
    session.commit()
    print("Sample data inserted into Users table")

if __name__ == "__main__":
    setup_database()  # Create the database and tables
    insert_sample_data()  # Insert initial data if necessary
