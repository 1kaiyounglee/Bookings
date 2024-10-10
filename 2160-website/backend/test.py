from helper_modules import db_helper as db, util as ut
from datetime import datetime
data = db.fetch_data(query="SELECT * FROM Users")
print(data)
query = "SELECT * FROM Users WHERE email = :email AND password = :password"
params = {"email": 'austingod1@gmail.com', "password": 'Poopoo12'}
user = db.fetch_data(query, params)
print(user)
# ut.update_user("hjgkgjhka2dgfhf@fdgh", "testesttestetestest", True)