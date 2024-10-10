from sqlalchemy import Column, Integer, String, Numeric, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from models import Base

class Packages(Base):
    __tablename__ = 'Packages'
    
    package_id          = Column(Integer, primary_key=True, autoincrement=True)
    location_id         = Column(Integer, ForeignKey('Locations.location_id'), nullable=False)
    description         = Column(String, nullable=False)
    duration            = Column(Integer, nullable=False)
    price               = Column(Numeric(10, 2), nullable=False)
    
    # Relationships
    bookings            = relationship('Bookings', back_populates='package')
    images              = relationship('PackageImages', back_populates='package')
    package_categories  = relationship('PackageCategory', back_populates='package')
    location            = relationship('Locations', back_populates='packages')