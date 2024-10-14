from helper_modules import db_helper as db, util as ut
from datetime import datetime

print(db.fetch_data("SELECT * From Bookings"))
print(db.fetch_data("SELECT * From Orders"))
print(db.fetch_data("SELECT * From OrderItems"))



# ut.fetch_and_print_all_tables()