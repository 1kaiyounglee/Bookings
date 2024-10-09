from sqlalchemy import Column, Integer, String, Boolean, Numeric, Date, Datetime
from sqlalchemy.ext.declarative import declarative_base
from decimal import Decimal
from datetime import datetime
from models import Base

class Orders(Base):
    __tablename__ = 'Orders'
    
    order_id        = Column(String, primary_key=True, nullable=False)
    email           = Column(String, nullable=False)
    total_price     = Column(Numeric(10,2), nullable=False)
    order_date      = Column(Date, nullable=False)
    payment_date    = Column(Date, nullable=False)
    payment_status  = Column(Boolean, default=False)
