from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from decimal import Decimal
from datetime import datetime
from models import Base

class Locations(Base):
    __tablename__ = 'Locations'
    
    location_id     = Column(Integer, primary_key=True, autoincrement=True)
    country         = Column(String, nullable=False)
    city            = Column(String, nullable=False)
    image_path      = Column(String, nullable=True)
    
    # Relationships
    packages        = relationship('Packages', back_populates='location')