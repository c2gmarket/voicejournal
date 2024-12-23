# AI-Assisted Personal Reflection & Goal Review App

This is a full-stack application that helps users record and review their personal reflections and goals, with AI assistance for transcription and insights.

## Project Structure

```
reflection-app/
├── backend/               # Django REST Framework backend
│   ├── core/             # Project settings and configuration
│   ├── users/            # User authentication and management
│   ├── goals/            # Goals management
│   ├── reflections/      # Reflections with audio recording
│   └── requirements.txt  # Python dependencies
└── frontend/             # React TypeScript frontend
    ├── src/
    │   ├── components/   # Reusable UI components
    │   ├── pages/        # Page components
    │   ├── store/        # Redux store and slices
    │   ├── services/     # API services
    │   └── types/        # TypeScript type definitions
    └── package.json      # Node.js dependencies
```

## Backend Setup

1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   export DJANGO_SECRET_KEY='your-secret-key'
   export DJANGO_DEBUG='True'
   export POSTGRES_DB='reflection_app'
   export POSTGRES_USER='postgres'
   export POSTGRES_PASSWORD='postgres'
   export POSTGRES_HOST='localhost'
   export POSTGRES_PORT='5432'
   ```

4. Run migrations:
   ```bash
   python manage.py migrate
   ```

5. Start the development server:
   ```bash
   python manage.py runserver
   ```

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/users/register/` - Register a new user
- POST `/api/users/login/` - Login and get JWT tokens
- POST `/api/users/token/refresh/` - Refresh JWT token

### Goals
- GET `/api/goals/` - List all goals
- POST `/api/goals/` - Create a new goal
- GET `/api/goals/{id}/` - Get goal details
- PUT `/api/goals/{id}/` - Update a goal
- DELETE `/api/goals/{id}/` - Delete a goal

### Reflections
- GET `/api/reflections/` - List all reflections
- POST `/api/reflections/` - Create a new reflection (with audio)
- GET `/api/reflections/{id}/` - Get reflection details
- PUT `/api/reflections/{id}/` - Update a reflection
- DELETE `/api/reflections/{id}/` - Delete a reflection

## Features

### MVP Features
1. User Authentication
   - Email-based registration and login
   - JWT token authentication

2. Goals Management
   - Create, read, update, delete goals
   - Track goal status and progress
   - Optional target dates and categories

3. Reflections
   - Record audio reflections
   - Automatic transcription (placeholder for MVP)
   - Basic AI insights (placeholder for MVP)

### Future Enhancements
1. Advanced AI Features
   - Implement proper audio transcription
   - Sentiment analysis
   - Topic extraction
   - Personalized insights

2. Goal Analytics
   - Progress tracking
   - Success rate analysis
   - Pattern recognition

3. Enhanced User Experience
   - Mobile-responsive design
   - Offline support
   - Rich text editing
   - File attachments