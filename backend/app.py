from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, get_jwt_identity, jwt_required
from flask_migrate import Migrate
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from datetime import timedelta
import os
from dotenv import load_dotenv
from models import db, User, Skill
from config import Config

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173"]}})
jwt = JWTManager(app)
db.init_app(app)
migrate = Migrate(app, db)

# Initialize database
with app.app_context():
    db.create_all()

# Auth routes
@app.route('/api/auth/google', methods=['POST'])
def google_auth():
    try:
        token = request.json.get('token')
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            os.getenv('GOOGLE_CLIENT_ID')
        )

        email = idinfo['email']
        name = idinfo.get('name', '')
        picture = idinfo.get('picture', '')

        # Find or create user
        user = User.query.filter_by(email=email).first()
        if not user:
            user = User(email=email, name=name, picture=picture)
            db.session.add(user)
            db.session.commit()

            # Create default skills for new users
            default_skills = Skill.create_default_skills(user.id)
            db.session.bulk_save_objects(default_skills)
            db.session.commit()

        # Create access token
        access_token = create_access_token(
            identity=user.id,
            expires_delta=timedelta(days=1)
        )

        return jsonify({
            'token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'picture': user.picture
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 400

# Skills routes
@app.route('/api/skills', methods=['GET'])
@jwt_required()
def get_skills():
    """Get user's skills with visual representation data"""
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    skills = Skill.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': skill.id,
        'name': skill.name,
        'level': skill.level,
        'category': skill.category,
        'visual': {
            'scale': 0.2 + (skill.level * 0.08),  # Match frontend scaling
            'emissiveIntensity': 0.2 * (skill.level / 3),  # Match frontend glow
            'rotationSpeed': 0.1 * (skill.level / 3),  # Match frontend rotation
            'floatIntensity': 0.002 * skill.level  # Match frontend floating
        }
    } for skill in skills])

@app.route('/api/skills', methods=['POST'])
@jwt_required()
def add_skill():
    """Add a new skill with validation"""
    user_id = get_jwt_identity()
    data = request.json

    # Validate skill level
    level = data.get('level', 1)
    if not isinstance(level, int) or not 1 <= level <= 5:
        return jsonify({'error': 'Skill level must be between 1 and 5'}), 400

    try:
        skill = Skill(
            user_id=user_id,
            name=data['name'],
            level=level,
            category=data.get('category', 'Other')
        )
        db.session.add(skill)
        db.session.commit()

        return jsonify({
            'id': skill.id,
            'name': skill.name,
            'level': skill.level,
            'category': skill.category,
            'visual': {
                'scale': 0.2 + (skill.level * 0.08),
                'emissiveIntensity': 0.2 * (skill.level / 3),
                'rotationSpeed': 0.1 * (skill.level / 3),
                'floatIntensity': 0.002 * skill.level
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/skills/<int:skill_id>', methods=['PUT'])
@jwt_required()
def update_skill(skill_id):
    """Update a skill with validation"""
    user_id = get_jwt_identity()
    skill = Skill.query.filter_by(id=skill_id, user_id=user_id).first()
    
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404

    data = request.json
    
    # Validate skill level if provided
    if 'level' in data:
        level = data['level']
        if not isinstance(level, int) or not 1 <= level <= 5:
            return jsonify({'error': 'Skill level must be between 1 and 5'}), 400

    try:
        skill.name = data.get('name', skill.name)
        skill.level = data.get('level', skill.level)
        skill.category = data.get('category', skill.category)
        db.session.commit()

        return jsonify({
            'id': skill.id,
            'name': skill.name,
            'level': skill.level,
            'category': skill.category,
            'visual': {
                'scale': 0.2 + (skill.level * 0.08),
                'emissiveIntensity': 0.2 * (skill.level / 3),
                'rotationSpeed': 0.1 * (skill.level / 3),
                'floatIntensity': 0.002 * skill.level
            }
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

@app.route('/api/skills/<int:skill_id>', methods=['DELETE'])
@jwt_required()
def delete_skill(skill_id):
    """Delete a skill"""
    user_id = get_jwt_identity()
    skill = Skill.query.filter_by(id=skill_id, user_id=user_id).first()
    
    if not skill:
        return jsonify({'error': 'Skill not found'}), 404

    try:
        db.session.delete(skill)
        db.session.commit()
        return jsonify({'message': 'Skill deleted successfully'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
