from flask import Flask, jsonify
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from flask_cors import CORS
from helper_modules import db_helper as db

app = Flask(__name__)
CORS(app)
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        query = "SELECT * FROM Users"
        df = db.fetch_data(query)

        if df is not None:
            users_data = df.to_dict(orient='records')
            return jsonify(users_data)
        else:
            return jsonify({'error': 'No data found'}), 404
    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'error': 'An error occurred while fetching the data.'}), 500

if __name__ == "__main__":
    app.run(debug=True)