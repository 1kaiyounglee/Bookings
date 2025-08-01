from flask import Blueprint, request, jsonify, send_from_directory, current_app
from helper_modules import db_helper as db
import pandas as pd
import bcrypt  # Import bcrypt for password hashing
import traceback
import os

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

# deletes an entry from a specific table
# i'm using this for the remove from cart feature so idk if it will work properly with other things lol
# nvrm just hard coded in the tablename and primary key hahaha
@api_db.route('/delete_entry', methods=['DELETE'])
def delete_entry():
    try:
        # Get the table name and conditions for deletion from the frontend request
        data = request.json
        table_name = data.get('table')
        entry_id = data.get('id')

        if not table_name or not entry_id:
            return jsonify({'error': 'Table name or entry id for deletion not provided.'}), 400

        # Construct the SQL delete query dynamically
        delete_query = f"DELETE FROM {table_name}s WHERE {table_name}_id = {entry_id}"

        print(delete_query)
        # Execute the delete query
        result = db.execute_query(delete_query)

        # Check if rows were affected
        if result.rowcount > 0:
            return jsonify({'message': f'{result.rowcount} entry deleted successfully.'}), 200
        else:
            return jsonify({'message': 'No matching rows found to delete.'}), 404

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

# Route to update or insert user admin status
@api_db.route('/update_user', methods=['POST'])
def update_user():
    data = request.json
    try:
        user_data = {
            'email': data['email'],
            'phone_number':data['phone_number'],
            'first_name':data['first_name'],
            'last_name':data['last_name'],
            'is_admin': data['is_admin']
        }
        df = pd.DataFrame([user_data])
        success = db.upsert_data('Users', df)
        if success:
            return jsonify({"message": "User updated successfully"}), 200
        else:
            return jsonify({"message": f"Failed to update user {user_data}"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Route to update or insert booking status
@api_db.route('/update_booking', methods=['POST'])
def update_booking():
    data = request.json
    try:
        booking_data = {
            'booking_id': data.get('booking_id', None),
            'email': data['email'],
            'package_id': data['package_id'],
            'start_date': data['start_date'],
            'end_date': data['end_date'],
            'number_of_travellers': data['number_of_travellers'],
            'price': data['price'],
            'status': data['status']
        }
        print(booking_data)
        df = pd.DataFrame([booking_data])
        success = db.upsert_data('Bookings', df)
        if success:
            return jsonify({"message": "Booking updated successfully"}), 200
        else:
            return jsonify({"message": "Failed to update booking"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@api_db.route('/upsert_package', methods=['POST'])
def upsert_package():
    data = request.json
    print(data)
    try:
        # Extracting all necessary fields for package data
        package_data = {
            'package_id': data['package_id'],  # Auto-increment for new records
            'name': data['name'],
            'description': data['description'],
            'location_id': data['location_id'],
            'duration': data['duration'],
            'price': data['price']
        }

        # Upsert the package data into the Packages table
        package_query = """
        INSERT INTO Packages (package_id, name, description, location_id, duration, price)
        VALUES (:package_id, :name, :description, :location_id, :duration, :price)
        ON CONFLICT(package_id) DO UPDATE SET 
            name = :name, 
            description = :description,
            location_id = :location_id,
            duration = :duration,
            price = :price
        """
        db.execute_query(package_query, package_data)
        print("exec successful")
        package_id = data['package_id']

        # Extract category names from the request and get the category_ids
        category_names = data.get('categories', [])  # These are the category_name values
        new_category_ids = set()

        # Use a for loop to fetch each category_id based on the category_name
        for category_name in category_names:
            query = """
                SELECT category_id FROM Categories WHERE name = :name
            """
            result = db.execute_query(query, {'name': category_name}).fetchone()
            if result:
                new_category_ids.add(result[0])  # Access the first element of the result tuple

        # If package_id is not 'new', we handle updating categories
        if package_id != 'new':
            # Fetch existing category ids for this package
            query = "SELECT category_id FROM PackageCategory WHERE package_id = :package_id"
            existing_categories = db.execute_query(query, {'package_id': package_id}).fetchall()
            existing_category_ids = set([cat[0] for cat in existing_categories])  # Access first element of each tuple

            # Find categories to add and categories to remove
            categories_to_add = new_category_ids - existing_category_ids
            categories_to_remove = existing_category_ids - new_category_ids

            # Add new categories
            for category_id in categories_to_add:
                package_category_query = """
                INSERT INTO PackageCategory (package_id, category_id)
                VALUES (:package_id, :category_id)
                """
                db.execute_query(package_category_query, {'package_id': package_id, 'category_id': category_id})

            # Remove categories no longer assigned
            for category_id in categories_to_remove:
                delete_query = "DELETE FROM PackageCategory WHERE package_id = :package_id AND category_id = :category_id"
                db.execute_query(delete_query, {'package_id': package_id, 'category_id': category_id})

        else:
            # Handle the case for a new package (only adding categories)
            for category_id in new_category_ids:
                package_category_query = """
                INSERT INTO PackageCategory (package_id, category_id)
                VALUES (:package_id, :category_id)
                """
                db.execute_query(package_category_query, {'package_id': package_id, 'category_id': category_id})

        return jsonify({"message": "Package upserted successfully, categories updated"}), 200
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500







@api_db.route('/delete_package', methods=['POST'])
def delete_package():
    data = request.json
    try:
        # Delete the package from the database
        query = "DELETE FROM Packages WHERE package_id = :package_id"
        db.execute_query(query, data)
        return jsonify({"message": "Package deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

    
@api_db.route('/change_password', methods=['POST'])
def change_password():
    try:
        data = request.json
        email = data.get('email')
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        # Fetch the user by email
        query = f"SELECT * FROM Users WHERE email = '{email}'"
        user = db.fetch_data(query)

        if user.empty:
            return jsonify({'error': 'User not found'}), 404

        # Verify the current password
        stored_password = user.iloc[0]['password']
        if not bcrypt.checkpw(current_password.encode('utf-8'), stored_password.encode('utf-8')):
            return jsonify({'error': 'Current password is incorrect'}), 400

        # Hash the new password and update it
        hashed_new_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        update_query = f"UPDATE Users SET password = '{hashed_new_password}' WHERE email = '{email}'"
        db.execute_query(update_query)

        return jsonify({'message': 'Password changed successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


#### STUFF FOR FILE UPLOAD ACCORDING TO A GOOD FRIEND
# Configure the upload folder
ALLOWED_EXTENSIONS = {'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@api_db.route('/upload', methods=['POST'])
def upload_file():
    try:
        package_id = request.form.get('package_id')
        print(f"Received package_id: {package_id}")  # Debugging

        if not package_id:
            print("Package ID is missing")  # Debugging
            return jsonify({'error': 'Package ID is required'}), 400

        if 'images' not in request.files:
            print("No image file provided")  # Debugging
            return jsonify({'error': 'No image file provided'}), 400

        files = request.files.getlist('images')
        print(f"Received files: {files}")  # Debugging
        uploaded_file_urls = []

        for file in files:
            if file and allowed_file(file.filename):
                print(f"Processing file: {file.filename}")  # Debugging
                
                # Inserting new image into the database
                temp_filename = f"temp{os.path.splitext(file.filename)[1]}"
                image_insert_query = """
                    INSERT INTO PackageImages (package_id, image_path)
                    VALUES (:package_id, :image_path)
                """
                image_data = {'package_id': package_id, 'image_path': temp_filename}
                db.execute_query(image_insert_query, image_data)

                # Generating the new image id
                result = db.execute_query("SELECT MAX(image_id) FROM PackageImages").fetchone()[0]
                new_image_id = (result or 0)

                # Renaming the file
                filename = f"{new_image_id}{os.path.splitext(file.filename)[1]}"  # Use the image_id with original file extension
                upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'])
                file.save(os.path.join(upload_folder, filename))
                print(f"added new image: {os.path.join(upload_folder, filename)}")

                # Step 4: Update the image path in the database with the correct filename
                update_image_path_query = """
                    UPDATE PackageImages SET image_path = :image_path WHERE image_id = :image_id
                """
                update_data = {'image_path': f"package_images/{filename}", 'image_id': new_image_id}
                db.execute_query(update_image_path_query, update_data)

                # Append the file URL to return to the frontend
                uploaded_file_urls.append(f"/uploads/{filename}")

        print("All files processed successfully")  # Debugging
        return jsonify({'message': 'Images uploaded successfully!', 'fileUrls': uploaded_file_urls}), 200

    except Exception as e:
        print("Error occurred during file upload")
        print(traceback.format_exc())  # Print detailed error traceback to the logs
        return jsonify({'error': 'An error occurred during the upload process'}), 500


# Route to serve the uploaded images
@api_db.route('/uploads/<filename>')
def uploaded_file(filename):
    try:
        # Access UPLOAD_FOLDER from current_app.config
        upload_folder = current_app.config['UPLOAD_FOLDER']
        return send_from_directory(upload_folder, filename)
    except Exception as e:
        traceback.print_exc()
        return jsonify({'error': 'File not found'}), 404
    

@api_db.route('/delete_package_images', methods=['DELETE'])
def delete_package_images():
    try:
        # Get the image IDs from the request body (should be an array of image IDs)
        data = request.json
        image_ids = data.get('image_ids', [])

        if not image_ids:
            return jsonify({"error": "No image IDs provided"}), 400

        fetch_query = f"SELECT image_path FROM PackageImages WHERE image_id IN ({', '.join(map(str, image_ids))})"
        result = db.execute_query(fetch_query)

        # Accessing the result by index (assuming image_path is the first column)
        image_paths = [row[0] for row in result]  # row[0] if image_path is the first column
        
        # Delete each image from the file system
        for image_path in image_paths:
            full_image_path = os.path.join(current_app.config['UPLOAD_FOLDER'], image_path.replace('package_images/', ''))
            if os.path.exists(full_image_path):
                os.remove(full_image_path)
                print(f"Deleted file: {full_image_path}")
            else:
                print(f"File not found: {full_image_path}")

        delete_query = f"DELETE FROM PackageImages WHERE image_id IN ({', '.join(map(str, image_ids))})"
        result = db.execute_query(delete_query)

        return jsonify({"message": f"{result.rowcount} images deleted successfully."}), 200

    except Exception as e:
        print(str(e))
        return jsonify({"error": str(e)}), 500
