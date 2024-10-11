from flask import Blueprint, request, jsonify
from helper_modules import db_helper as db
import pandas as pd
import bcrypt  # Import bcrypt for password hashing

api_db = Blueprint('database', __name__)

# Dynamic route for executing SQL queries based on input from frontend
@api_db.route('/fetch_query', methods=['POST'])
def execute_query():
    try:
        # Get the SQL query from the frontend request
        data = request.json
        query = data.get('query')

        if not query:
            return jsonify({'error': 'No SQL query provided.'}), 400

        # Fetch data using the db_helper function
        df = db.fetch_data(query)

        # Convert the DataFrame to a list of dictionaries for JSON serialization
        if df is not None and not df.empty:
            result_data = df.to_dict(orient='records')
            return jsonify(result_data), 200
        else:
            return jsonify({'message': 'No data found.'}), 404

    except Exception as e:
        print(str(e))
        return jsonify({'error': str(e)}), 500


@api_db.route('/create_user', methods=['POST'])
def create_user():
    try:
        # Get the user data from the frontend request
        data = request.json
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email')
        password = data.get('password')
        phone_number = data.get('phone_number')

        # Check if email exists in the database
        check_query = f"SELECT * FROM Users WHERE email = '{email}'"
        existing_user = db.fetch_data(check_query)

        if existing_user is not None and not existing_user.empty:
            return jsonify({'error': 'Email already exists.'}), 400

        # Hash the password using bcrypt before storing it in the database
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        # Insert the new user into the database using upsert
        user_data = {
            'email': email,
            'phone_number': phone_number,
            'password': hashed_password.decode('utf-8'),  # Store the hashed password
            'first_name': first_name,
            'last_name': last_name,
            'is_admin': False,
        }

        df = pd.DataFrame([user_data])
        if db.upsert_data('Users', df):
            return jsonify({'message': 'User created successfully!'}), 201
        else:
            return jsonify({'error': 'Failed to create user.'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

