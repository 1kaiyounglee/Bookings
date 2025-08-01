from sqlalchemy.ext.declarative import declarative_base

# Create a global base class that will be shared across all models
Base = declarative_base()

# Import all model classes so they are registered with Base
from .Users import Users
from .Packages import Packages
from .Bookings import Bookings
from .Orders import Orders
from .OrderItems import OrderItems
from .Locations import Locations
from .Categories import Categories
from .PackageCategory import PackageCategory
from .PackageImages import PackageImages
