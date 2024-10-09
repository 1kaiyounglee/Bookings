from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from decimal import Decimal
from datetime import datetime
from models import Base

class PackageCategory(Base):
    __tablename__ = 'PackageCategory'
    
    package_id      = Column(Integer, ForeignKey('Packages.package_id'), primary_key=True)
    category_id     = Column(Integer, ForeignKey('Categories.category_id'), primary_key=True)
    
    # Relationships
    package         = relationship('Packages', back_populates='package_categories')
    category        = relationship('Categories', back_populates='package_categories')