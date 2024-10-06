from sqlalchemy.orm import sessionmaker
import pandas as pd
import traceback
from sqlalchemy import text
from db_config import Session
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
