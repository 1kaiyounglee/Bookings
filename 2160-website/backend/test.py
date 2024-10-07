from helper_modules import db_helper as db, util as ut
from datetime import datetime
data = db.fetch_data(query="SELECT * FROM Users")
print(data)
print(data.dtypes)
