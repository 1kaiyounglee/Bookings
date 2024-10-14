from helper_modules import db_helper as db, util as ut
from datetime import datetime

print(db.fetch_data("SELECT * From PackageImages"))

