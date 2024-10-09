from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from decimal import Decimal
from datetime import datetime
from models import Base

class PackageImages(Base):
    __tablename__ = 'PackageImages'
    
    image_id        = Column(Integer, primary_key=True, autoincrement=True)
    package_id      = Column(Integer, ForeignKey('Packages.package_id'), nullable=False)
    image_path      = Column(String, nullable=False)
    
    # Relationships
    package         = relationship('Packages', back_populates='images')