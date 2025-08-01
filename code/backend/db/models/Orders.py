from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from decimal import Decimal
from datetime import datetime
from models import Base

class Orders(Base):
    __tablename__ = 'Orders'
    
    order_id        = Column(Integer, primary_key=True, autoincrement=True)
    email           = Column(String, ForeignKey('Users.email'), nullable=False)
    total_price     = Column(Numeric(10, 2), nullable=False)
    order_date      = Column(Date, default=datetime.utcnow, nullable=False)
    payment_date    = Column(Date, nullable=True)
    payment_status  = Column(Enum('pending', 'paid', name='payment_status_enum'), default='pending', nullable=False)

    # Relationships
    user            = relationship('Users', back_populates='orders')
    order_items     = relationship('OrderItems', back_populates='order')