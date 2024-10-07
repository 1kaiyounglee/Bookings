from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from models import Base

class Users(Base):
    __tablename__ = 'Users'
    
    email       = Column(String, primary_key=True, nullable=False)
    password    = Column(String, nullable=False)
    is_admin    = Column(Boolean, default=False)
