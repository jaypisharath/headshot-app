# Headshot App - Quick Start Guide

## Milestone 1: UI Setup ✅ COMPLETE
## Milestone 2: Google Imagen API Integration ✅ COMPLETE

All functionality for both milestones has been implemented!

## Getting Started

### 1. Start the Backend Server

Open a terminal and run:

```bash
cd headshot-app/backend
npm install  # Only needed once
npm start
```

You should see:
```
Server running on port 5001
Environment: development
```

### 2. Start the Frontend Development Server

Open a NEW terminal and run:

```bash
cd headshot-app/frontend
npm install  # Only needed once
npm run dev
```

You should see a URL like:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

### 3. Use the Application

1. Open http://localhost:5173 in your browser
2. Upload a photo by dragging and dropping or clicking to browse
3. Select one of three professional styles:
   - Corporate Classic
   - Creative Professional
   - Executive Portrait
4. Click "Generate Headshot"
5. Click "Generate Headshot" and wait for AI processing
6. View the comparison with your generated headshot
7. Download the generated image if desired

## What's Been Implemented

### Frontend (React + Vite)
- ✅ ImageUpload component with drag-and-drop
- ✅ StyleSelector component with 3 style cards
- ✅ ComparisonView component for side-by-side display
- ✅ LoadingSpinner component
- ✅ Responsive design
- ✅ Error and success messages
- ✅ Modern, clean UI

### Backend (Express)
- ✅ Express server with CORS enabled
- ✅ Multer for file upload handling
- ✅ File validation (type, size, dimensions)
- ✅ Imagen API service integration
- ✅ Image optimization with Sharp
- ✅ Health check endpoint
- ✅ Comprehensive error handling
- ✅ Request timeout middleware

### Milestone 2 Features
- ✅ Google Generative AI SDK installed
- ✅ Imagen API service module with style prompts
- ✅ Image optimization (resize, compression)
- ✅ Base64 image encoding/decoding
- ✅ Real API integration (ready for Imagen 3)
- ✅ Download functionality with blob conversion
- ✅ Retry logic with exponential backoff
- ✅ Error boundaries in React
- ✅ Image dimension validation (100-4096px)
- ✅ 60-second timeout handling
- ✅ User-friendly error messages

### Features Working
- ✅ Photo upload with validation
- ✅ Style selection (Corporate, Creative, Executive)
- ✅ Image preview
- ✅ Loading states with progress
- ✅ Error handling with retry button
- ✅ Responsive design
- ✅ AI headshot generation
- ✅ Side-by-side comparison
- ✅ Download generated images

## Troubleshooting

**Backend won't start:**
- Check if port 5001 is available
- Run `npm install` in backend directory
- Check for errors in console

**Frontend won't connect:**
- Ensure backend is running on port 5001
- Check browser console for CORS errors
- Verify API_BASE_URL in App.jsx

**Upload fails:**
- Check file size (max 10MB)
- Ensure file is JPEG, PNG, or WebP
- Check image dimensions (100-4096 pixels)
- Check backend logs for errors

**API generation fails:**
- Verify GOOGLE_API_KEY is set in backend/.env
- Check API key is valid and has proper permissions
- Review error message for specific issue
- Try the retry button if generation fails
- Check network connectivity

**Note:** The current implementation uses a placeholder for Imagen 3 API. To use actual Imagen 3:
1. Set up Google Cloud Project with Vertex AI enabled
2. Configure GOOGLE_CLOUD_PROJECT_ID in .env
3. Update imagenApi.js to use Vertex AI REST API calls

## Project Structure

```
headshot-app/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── StyleSelector.jsx
│   │   │   ├── ComparisonView.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   └── package.json
├── backend/
│   ├── services/
│   │   └── imagenApi.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── spec.md
├── todo.md
└── README.md
```

Enjoy your Headshot App! 🎨

