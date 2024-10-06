from db import db_helper as db

data = db.fetch_data(query="SELECT * FROM Users")
print(data)