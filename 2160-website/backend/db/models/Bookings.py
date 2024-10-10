from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models import Base

class Bookings(Base):
    __tablename__ = 'Bookings'
    
    booking_id              = Column(Integer, primary_key=True, autoincrement=True)
    email                   = Column(String, ForeignKey('Users.email'), nullable=False)
    package_id              = Column(Integer, ForeignKey('Packages.package_id'), nullable=False)
    start_date              = Column(Date, nullable=False)
    end_date                = Column(Date, nullable=False)
    number_of_travellers    = Column(Integer, nullable=False)
    price                   = Column(Numeric(10, 2), nullable=False)
    status                  = Column(Enum('in-cart', 'pending', 'confirmed', 'cancelled', name='status_enum'), nullable=False)
    
    # Relationships
    user                    = relationship('Users', back_populates='bookings')
    package                 = relationship('Packages', back_populates='bookings')
    order_items             = relationship('OrderItems', back_populates='booking')