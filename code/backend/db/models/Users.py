from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from models import Base

class Users(Base):
    __tablename__ = 'Users'
    
    email            = Column(String, primary_key=True, nullable=False)
    password         = Column(String, nullable=False)
    phone_number     = Column(String, nullable=False)
    first_name       = Column(String, nullable=False)
    last_name        = Column(String, nullable=False)
    is_admin         = Column(Boolean, default=False)
    
    # Relationships
    bookings         = relationship('Bookings', back_populates='user')
    orders           = relationship('Orders', back_populates='user')