from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120))
    picture = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    skills = db.relationship('Skill', backref='user', lazy=True, cascade='all, delete-orphan')

class Skill(db.Model):
    __tablename__ = 'skills'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    level = db.Column(db.Integer, nullable=False)  # Scale from 1-5
    category = db.Column(db.String(50), default='Other')  # e.g., Programming, Machine Learning, Cloud
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Validate skill level
    def __init__(self, **kwargs):
        super(Skill, self).__init__(**kwargs)
        if not 1 <= self.level <= 5:
            raise ValueError('Skill level must be between 1 and 5')

    # Default skills for new users
    @staticmethod
    def create_default_skills(user_id):
        default_skills = [
            {'name': 'Python', 'level': 5, 'category': 'Programming'},
            {'name': 'Machine Learning', 'level': 4, 'category': 'AI/ML'},
            {'name': 'Data Science', 'level': 3, 'category': 'Data'},
            {'name': 'AWS', 'level': 4, 'category': 'Cloud'},
            {'name': 'Deep Learning', 'level': 2, 'category': 'AI/ML'}
        ]
        
        skills = []
        for skill_data in default_skills:
            skill = Skill(user_id=user_id, **skill_data)
            skills.append(skill)
        
        return skills
