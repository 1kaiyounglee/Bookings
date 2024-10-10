from helper_modules import db_helper as db, util as ut
from datetime import datetime
data = db.fetch_data(query="SELECT * FROM Users")
print(data)

# ut.update_user("hjgkgjhka2dgfhf@fdgh", "testesttestetestest", True)