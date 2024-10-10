from sqlalchemy import Column, Integer, String, Numeric, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
from models import Base

class OrderItems(Base):
    __tablename__ = 'OrderItems'
    
    order_id        = Column(Integer, ForeignKey('Orders.order_id'), primary_key=True, nullable=False)
    booking_id      = Column(Integer, ForeignKey('Bookings.booking_id'), primary_key=True, nullable=False)
    
    # Relationships
    order           = relationship('Orders', back_populates='order_items')
    booking         = relationship('Bookings', back_populates='order_items')
