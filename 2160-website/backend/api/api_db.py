from flask import Blueprint, request, jsonify
from helper_modules import db_helper as db

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
        return jsonify({'error': str(e)}), 500
