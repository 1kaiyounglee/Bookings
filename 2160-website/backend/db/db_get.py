import sqlite3

def fetch_data(query, params=None):
    """
    Fetches data from the SQLite database based on the provided query and parameters.
    
    Args:
        query (str): The SQL query to execute.
        params (tuple): A tuple of parameters to pass into the query (optional).
    
    Returns:
        list: A list of rows retrieved from the query.
    """
    connection = sqlite3.connect('holidaybookingsystem.db')
    cursor = connection.cursor()
    
    if params is None:
        cursor.execute(query)
    else:
        cursor.execute(query, params)
    
    rows = cursor.fetchall()
    
    connection.close()
    return rows