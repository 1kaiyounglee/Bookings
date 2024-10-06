from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base
from models import Base

class Users(Base):
    __tablename__ = 'Users'
    
    uid         = Column(Integer, primary_key=True, autoincrement=True)
    email       = Column(String, nullable=False)
    password    = Column(String, nullable=False)
    is_admin    = Column(Boolean, default=False)
