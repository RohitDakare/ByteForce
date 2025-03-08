# Echelon 25 Backend

This is the backend server for Echelon 25, providing API endpoints for user authentication and skill management.

## Features

- Google OAuth authentication
- JWT-based session management
- RESTful API for skill management
- SQLAlchemy ORM with SQLite/PostgreSQL support
- CORS support for frontend integration
- Default skill presets matching the SkillCluster visualization

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` and add your configuration:
- `SECRET_KEY`: Flask secret key
- `JWT_SECRET_KEY`: JWT encryption key
- `DATABASE_URL`: Database connection URL
- `GOOGLE_CLIENT_ID`: Google OAuth client ID

4. Initialize the database:
```bash
flask db init
flask db migrate
flask db upgrade
```

5. Run the development server:
```bash
python app.py
```

## API Endpoints

### Authentication

#### Google OAuth Login
- **POST** `/api/auth/google`
- Body: `{ "token": "google-id-token" }`
- Returns: `{ "token": "jwt-token", "user": { ... } }`

### Skills Management

#### Get User Skills
- **GET** `/api/skills`
- Headers: `Authorization: Bearer <jwt-token>`
- Returns: List of user's skills with levels and categories

#### Add New Skill
- **POST** `/api/skills`
- Headers: `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "name": "Skill Name",
  "level": 3,
  "category": "Category"
}
```

#### Update Skill
- **PUT** `/api/skills/<skill_id>`
- Headers: `Authorization: Bearer <jwt-token>`
- Body:
```json
{
  "name": "Updated Name",
  "level": 4,
  "category": "Updated Category"
}
```

#### Delete Skill
- **DELETE** `/api/skills/<skill_id>`
- Headers: `Authorization: Bearer <jwt-token>`

## Default Skills

The backend automatically creates default skills for new users:
- Python (Level 5) - Programming
- Machine Learning (Level 4) - AI/ML
- Data Science (Level 3) - Data
- AWS (Level 4) - Cloud
- Deep Learning (Level 2) - AI/ML

These skills match the frontend SkillCluster visualization's initial state.

## Development

The backend is built with:
- Flask for the web framework
- Flask-JWT-Extended for authentication
- Flask-SQLAlchemy for database ORM
- Flask-CORS for CORS support

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

Errors are returned in JSON format:
```json
{
  "error": "Error message"
}
```
