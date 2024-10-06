#IMPORTS

import sqlite3
import traceback
import pandas as pd

#DEFINITIONS

#FUNCTIONS
###########################################################################
def fetch_data(query, params=None):
###########################################################################
    """
    Fetches data from the SQLite database based on the provided query and parameters and returns a pandas DataFrame.
    
    Args:
        query (str): The SQL query to execute.
        params (tuple): A tuple of parameters to pass into the query (optional).
    
    Returns:
        pd.DataFrame: A pandas DataFrame containing the retrieved rows.
    """
    try:
        with sqlite3.connect('db/holidaybookingsystem.db') as cnxn:
            cursor = cnxn.cursor()
            
            if params is None:
                cursor.execute(query)
            else:
                cursor.execute(query, params)
            
            # Fetch all rows and column names
            rows = cursor.fetchall()
            column_names = [description[0] for description in cursor.description]
            
            # Convert to a pandas DataFrame
            df = pd.DataFrame(rows, columns=column_names)
            
            return df
    except Exception:
        print(traceback.format_exc())
        return None
###########################################################################


###########################################################################
def execute_query(query, params=None):
###########################################################################
    """
    Executes an SQL query that modifies the database (INSERT, UPDATE, DELETE).
    
    Args:
        query (str): The SQL query to execute.
        params (tuple): A tuple of parameters to pass into the query (optional).
    """
    try:
        with sqlite3.connect('db/holidaybookingsystem.db') as cnxn:
            cursor = cnxn.cursor()
            
            if params is None:
                cursor.execute(query)
            else:
                cursor.execute(query, params)
        
            cnxn.commit()
        
    except Exception:
        traceback.format_exc()
###########################################################################
