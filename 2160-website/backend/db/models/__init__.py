from sqlalchemy.ext.declarative import declarative_base

# Create a global base class that will be shared across all models
Base = declarative_base()

# Import all model classes so they are registered with Base
from .Users import Users
