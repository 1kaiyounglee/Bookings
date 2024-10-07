Add new db table:
    1. Make a new model in backend/db/models (just copy an existing template)
    2. import model into backend/db/models/__init__.py
    3. run backend/db.initialise_db.py to add the table (add sample data if needed)

Modify db table (edit cols etc)
    1. Make the changes in the respective model (under backend/db/models)
    2. in setup_database() (in backend/db/initialise_db.py), add "Base.metadata.drop_all(engine, tables=[<table_name>.__table__])"
    before "Base.metadata.create_all(engine)". **WARNING** This will delete all the data inside said table so you might want to make a backup.
        2.1 Making the backup data:
