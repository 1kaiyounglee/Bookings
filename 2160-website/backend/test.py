from helper_modules import db_helper as db, util as ut
from datetime import datetime
print(db.fetch_data("SELECT * FROM Packages"))
print(db.fetch_data("SELECT * FROM Categories"))
print(db.fetch_data("SELECT * FROM PackageCategory"))

