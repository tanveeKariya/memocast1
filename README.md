# Memocast.co - AI-Powered Voice Note-Taking App

A modern, feature-rich voice note-taking application with AI enhancement capabilities, built with React, Node.js, and MongoDB.

## 🚀 Features

### Core Features
- **Voice Recording**: Advanced voice-to-text with real-time transcription
- **AI Enhancement**: Transform notes for LinkedIn, Twitter, and Instagram
- **Multiple Identities**: Switch between different personalities/contexts
- **File Attachments**: Upload images and documents with text extraction
- **Smart Search**: Global search across all notes and content
- **Export Options**: Download notes as PDF, TXT, or DOCX

### Advanced Features
- **Animated UI**: Beautiful animations with Framer Motion
- **Dark Mode**: Complete theme customization
- **Responsive Design**: Perfect on all devices
- **Real-time Sync**: All data synced with MongoDB
- **Social Sharing**: Direct publishing to social platforms
- **OCR Support**: Extract text from images using Tesseract.js

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** authentication
- **Multer** for file uploads
- **OpenAI API** for content enhancement

### Additional Libraries
- **jsPDF** - PDF generation
- **docx** - Word document creation
- **Tesseract.js** - OCR text extraction
- **pdf-parse** - PDF text extraction
- **mammoth** - Word document parsing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- OpenAI API key (optional, for AI features)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd memocast
```

### 2. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/memocast

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# OpenAI API (optional)
OPENAI_API_KEY=your-openai-api-key

# Server Configuration
PORT=5000
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas cloud connection
```

### 5. Run the Application

**Start Backend Server:**
```bash
cd server
npm run dev
```

**Start Frontend (in a new terminal):**
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🎯 Usage Guide

### Getting Started
1. **Onboarding**: Experience the 4-slide animated introduction
2. **Demo Login**: Use the demo account to explore features
3. **Create Identity**: Set up your first personality/identity
4. **Add Notes**: Create notes with voice, text, or file uploads

### Key Features

#### Voice Recording
- Click the microphone icon to start recording
- Real-time transcription appears as you speak
- Stop recording to finalize the text

#### AI Enhancement
- Select notes to enhance for social media
- Choose platform (LinkedIn, Twitter, Instagram)
- Pick your identity for tone and style
- Edit the AI-generated content before publishing

#### File Management
- Upload images and documents
- Choose to extract text or save as attachment
- Automatic text extraction from PDFs and Word docs

#### Export Options
- Download notes in multiple formats
- PDF with proper formatting
- Plain text files
- Word documents with styling

### Settings & Customization
- **Dark Mode**: Toggle between light and dark themes
- **Theme Colors**: Choose from 6 color schemes
- **Identities**: Create and manage multiple personalities
- **Profile**: Edit your account information
- **Data Export**: Download all your data

## 🔧 Configuration

### OpenAI Integration
To enable AI enhancement features:
1. Get an API key from [OpenAI](https://platform.openai.com/)
2. Add it to your `.env` file
3. Restart the server

### File Upload Limits
Default limits in `server/routes/notes.js`:
- File size: 10MB per file
- Multiple files supported
- Supported formats: Images, PDFs, Word docs, text files

### Database Configuration
The app uses MongoDB with the following collections:
- `users` - User accounts and preferences
- `personalities` - User identities/personalities
- `folders` - Organization folders
- `notes` - Notes with content and attachments

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy the 'dist' folder to your hosting service
```

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar for process management
3. Configure reverse proxy (nginx recommended)
4. Set up SSL certificates

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-domain.com
OPENAI_API_KEY=your-openai-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/demo-login` - Demo account access
- `GET /api/auth/me` - Get current user

### Notes Endpoints
- `GET /api/notes` - Get user notes
- `POST /api/notes` - Create note with files
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/:id/enhance` - AI enhance note

### Personalities Endpoints
- `GET /api/personalities` - Get user personalities
- `POST /api/personalities` - Create personality
- `PUT /api/personalities/:id` - Update personality
- `DELETE /api/personalities/:id` - Delete personality

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify network connectivity

**File Upload Issues:**
- Check file size limits
- Ensure upload directory exists
- Verify file permissions

**AI Enhancement Not Working:**
- Verify OpenAI API key
- Check API quota and billing
- Ensure internet connectivity

**Voice Recording Issues:**
- Check browser permissions for microphone
- Ensure HTTPS in production
- Test with different browsers

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for AI enhancement capabilities
- Tesseract.js for OCR functionality
- Framer Motion for beautiful animations
- The React and Node.js communities

---

**Memocast.co** - Transform your thoughts into powerful content with AI ✨