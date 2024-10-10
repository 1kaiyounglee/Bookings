from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from decimal import Decimal
from datetime import datetime
from models import Base

class Categories(Base):
    __tablename__ = 'Categories'
    
    category_id     = Column(Integer, primary_key=True, autoincrement=True)
    name            = Column(String, nullable=False)
    image_path      = Column(String, nullable=True)

    # Relationships
    package_categories = relationship('PackageCategory', back_populates='category')