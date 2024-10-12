from helper_modules import db_helper as db, util as ut
from datetime import datetime
query1 = """
SELECT * FROM Users"""
data = db.fetch_data(query1)
print(data)
# ut.update_admin('austingod1@gmail.com')
# ut.fetch_and_print_all_tables()