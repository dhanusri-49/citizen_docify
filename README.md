# Docify - Citizen Documentation Assistant

Docify is a web application that helps citizens navigate government documentation processes through AI-powered document analysis and simplification.

## Features

- **Document Upload**: Upload government forms (PDF/Image) for AI analysis
- **AI-Powered Analysis**: Uses Google Gemini to analyze documents and extract key information
- **Multilingual Support**: Translate document summaries to multiple languages
- **Eligibility Checker**: Check eligibility for various government schemes and documents
- **User Profiles**: Manage personal information and document history

## Technology Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Google Generative AI (Gemini)
- JWT for authentication
- Multer for file uploads

### Frontend
- React with Vite
- TailwindCSS for styling
- React Router for navigation
- Axios for API communication

## Setup Instructions

1. Clone the repository
2. Install backend dependencies: `cd backend && npm install`
3. Install frontend dependencies: `cd frontend && npm install`
4. Set up environment variables in `.env` files
5. Start the backend server: `cd backend && npm start`
6. Start the frontend: `cd frontend && npm run dev`

## Security

- All sensitive information (API keys, database credentials) should be stored in `.env` files
- `.env` files are excluded from the repository through `.gitignore`
- User passwords are hashed using bcrypt
- JWT tokens are used for authentication

## Contributing

Feel free to fork the repository and submit pull requests for improvements.