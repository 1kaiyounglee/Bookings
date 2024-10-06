import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Fetch the database URL from the environment variables, or use a default
DATABASE_URL = 'sqlite:///holidaybookingsystem.db'

# Create the engine
engine = create_engine(DATABASE_URL)

# Create a sessionmaker factory that binds to the engine
Session = sessionmaker(bind=engine)
