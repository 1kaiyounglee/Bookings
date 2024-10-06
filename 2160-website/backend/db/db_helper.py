import sqlite3
import traceback

def fetch_data(query, params=None):
    """
    Fetches data from the SQLite database based on the provided query and parameters.
    
    Args:
        query (str): The SQL query to execute.
        params (tuple): A tuple of parameters to pass into the query (optional).
    
    Returns:
        list: A list of rows retrieved from the query.
    """
    try:
        with sqlite3.connect('holidaybookingsystem.db') as cnxn:
            cursor = cnxn.cursor()
            
            if params is None:
                cursor.execute(query)
            else:
                cursor.execute(query, params)
            
            rows = cursor.fetchall()
            
            return rows
    except Exception:
        traceback.format_exc()


def execute_query(query, params=None):
    """
    Executes an SQL query that modifies the database (INSERT, UPDATE, DELETE).
    
    Args:
        query (str): The SQL query to execute.
        params (tuple): A tuple of parameters to pass into the query (optional).
    """
    try:
        with sqlite3.connect('holidaybookingsystem.db') as cnxn:
            cursor = cnxn.cursor()
            
            if params is None:
                cursor.execute(query)
            else:
                cursor.execute(query, params)
        
            cnxn.commit()
        
    except Exception:
        traceback.format_exc()


def create_upsert_cmd(table_name, data):
    pass
    