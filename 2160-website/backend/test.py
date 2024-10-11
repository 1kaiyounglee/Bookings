from helper_modules import db_helper as db, util as ut
from datetime import datetime
data = db.fetch_data(query="SELECT * FROM Users")
print(data)
# ut.update_admin('austingod1@gmail.com')
# ut.fetch_and_print_all_tables()