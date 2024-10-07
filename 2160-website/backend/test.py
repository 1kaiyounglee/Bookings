from helper_modules import db_helper as db, util as ut

data = db.fetch_data(query="SELECT * FROM Users")
print(data)


# ut.update_user("kai", "asdasdasdasdasd", False)
