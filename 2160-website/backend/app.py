from flask import Flask, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from helper_modules import db_helper as db

app = Flask(__name__)

@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        # Define the SQL query to fetch data from the Users table
        query = "SELECT * FROM Users"
        
        # Fetch the data using the fetch_data function from db_helper
        df = db.fetch_data(query)

        # Convert the DataFrame to a list of dictionaries for JSON serialization
        if df is not None:
            users_data = df.to_dict(orient='records')
            return jsonify(users_data)
        else:
            return jsonify({'error': 'No data found'}), 404
        print(f"An error occurred: {e}")
    except Exception as e:
        return jsonify({'error': 'An error occurred while fetching the data.'}), 500

if __name__ == "__main__":
    app.run(debug=True)
