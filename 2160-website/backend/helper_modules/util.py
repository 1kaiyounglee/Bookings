import traceback
from helper_modules import db_helper as db
import pandas as pd


def update_user(email, password, is_admin=False):
    """
    Create or update a user in the Users table.
    
    Args:
        email (str): The email of the user.
        password (str): The password of the user.
        is_admin (bool): Whether the user is an admin or not (default: False).
    """
    # Prepare the user data in a DataFrame
    try:
        user_data = pd.DataFrame({
            'email': [email],
            'password': [password],
            'is_admin': [is_admin]
        })
        
        print(user_data)
        # Generate the UPSERT SQL for the Users table
        cmd_text = db.upsert_data('Users', user_data)
        print(cmd_text)
        # db.exec_cmd(cmd_text)
    except Exception:
        print(traceback.format_exc())



def fetch_and_print_all_tables():
    # List of SQL queries for all tables
    queries = {
        "Users": "SELECT * FROM Users;",
        "Packages": "SELECT * FROM Packages;",
        "Bookings": "SELECT * FROM Bookings;",
        "Orders": "SELECT * FROM Orders;",
        "OrderItems": "SELECT * FROM OrderItems;",
        "Locations": "SELECT * FROM Locations;",
        "Categories": "SELECT * FROM Categories;",
        "PackageCategory": "SELECT * FROM PackageCategory;",
        "PackageImages": "SELECT * FROM PackageImages;"

    }
    
    for table, query in queries.items():
        print(f"Fetching data from {table} table:")
        data = db.fetch_data(query)
        if data is not None:
            print(data)
        else:
            print(f"No data found or error in fetching data from {table}.")
        print("\n" + "="*50 + "\n")
