from sqlalchemy.orm import sessionmaker
import pandas as pd
import traceback
from sqlalchemy import text
from db.db_config import Session
import sys
import sys
import os
from datetime import datetime
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)
# Define the session

def fetch_data(query, params=None):
    """
    Fetches data from the database using a raw SQL query and returns a pandas DataFrame.
    
    Args:
        query (str): The SQL query to execute.
        params (dict): Optional dictionary of parameters to bind to the query.
    
    Returns:
        pd.DataFrame: A pandas DataFrame containing the retrieved rows.
    """
    try:
        session = Session()

        # Execute the raw SQL query
        if params:
            result = session.execute(text(query), params)
        else:
            result = session.execute(text(query))

        # Fetch all rows and column names
        rows = result.fetchall()
        column_names = result.keys()

        # Convert to a pandas DataFrame
        df = pd.DataFrame(rows, columns=column_names)

        # Close the session
        session.close()

        return df
    except Exception:
        print(traceback.format_exc())
        return None

def create_upsert(table_name, df):
    """
    Generates an UPSERT SQL command text with embedded values (no placeholders).
    
    Args:
        table_name (str): The name of the table to upsert data into.
        df (pd.DataFrame): The DataFrame containing data to insert/update.
    
    Returns:
        str: The generated UPSERT SQL command with values directly embedded.
    """
    
    # Extract column names from the DataFrame
    try:
        columns = df.columns.tolist()
        
        # Convert DataFrame values to a list of tuples
        values = df.values.tolist()[0]  # Assuming one row; extend logic if multiple rows
        
        # Build the SQL command with values directly embedded
        column_names = ', '.join(columns)
        value_placeholders = ', '.join([f"'{str(value)}'" for value in values])  # Embed values directly
        
        # Generate conflict target, assuming the first column is the primary key or unique constraint
        conflict_target = columns[0]
        
        # Build the SET clause for updating on conflict
        set_clause = ', '.join([f"{col} = '{str(value)}'" for col, value in zip(columns[1:], values[1:])])
        
        # Construct the full UPSERT SQL command with embedded values
        cmd_text = f"""
        INSERT INTO {table_name} ({column_names})
        VALUES ({value_placeholders})
        ON CONFLICT ({conflict_target})
        DO UPDATE SET {set_clause};
        """
    except Exception:
        print(traceback.format_exc())
    return cmd_text
   

def exec_cmd(sql_command):
    """
    Executes a given SQL command using SQLAlchemy.

    Args:
        sql_command (str): The SQL command to execute.
    """
    session = Session()
    try:
        # Use session.execute to run the raw SQL command
        session.execute(text(sql_command))
        session.commit()  # Commit if the command modifies the database (INSERT, UPDATE, DELETE, etc.)
        print("SQL command executed successfully.")
    except Exception as e:
        session.rollback()  # Rollback in case of an error
        print(f"An error occurred: {traceback.format_exc()}")
    finally:
        session.close()  # Always close the session


def make_backup(tablename):
    # Fetch the data
    df = fetch_data(f"SELECT * FROM {tablename}")
    
    if df is None or df.empty:
        print(f"No data found in table: {tablename}")
        return
    
    # Get the absolute path to the current file (db_helper.py)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Create the full path to the backups folder inside backend/db
    backup_folder = os.path.join(current_dir, "..", "db", "backups")
    
    # Create the backups folder if it doesn't exist
    if not os.path.exists(backup_folder):
        os.makedirs(backup_folder)
    
    # Get the current date and time formatted as day-month-year - hour-minute
    current_time = datetime.now().strftime("%d-%m-%Y_%H-%M")
    
    # Create the backup file path
    backup_file = os.path.join(backup_folder, f"{tablename} backup - {current_time}.json")
    
    # Convert the DataFrame to JSON and save it to the backup file
    try:
        df.to_json(backup_file, orient='records', indent=4)  # Save the DataFrame to a JSON file
        print(f"Backup of {tablename} saved to {backup_file}")
    except Exception as e:
        print(f"Error saving backup: {traceback.format_exc()}")


def read_backup(filename):
    # Get the absolute path to the current file (db_helper.py)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Construct the full path to the backups folder inside backend/db
    backup_folder = os.path.join(current_dir, "..", "db", "backups")
    backup_file = os.path.join(backup_folder, filename)

    # Check if the file exists
    if not os.path.exists(backup_file):
        print(f"File {filename} does not exist in backups folder.")
        return None
    
    # Read the JSON file and convert it to a DataFrame
    try:
        df = pd.read_json(backup_file)
        print(f"Backup {filename} successfully read.")
        return df
    except Exception as e:
        print(f"Error reading backup: {e}")
        return None