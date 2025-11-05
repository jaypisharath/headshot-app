# Professional Headshot AI App

Generate professional headshots using AI. Upload your photo, select from three professional styles, and get an AI-enhanced headshot in seconds.

## Features

- 📤 **Easy Photo Upload**: Drag and drop or click to upload your photo
- 🎨 **Three Professional Styles**: 
  - Corporate Classic
  - Creative Professional
  - Executive Portrait
- 🤖 **AI-Powered**: Powered by Google's Imagen 3 API
- 🔄 **Side-by-Side Comparison**: Compare your original and generated headshot
- 📥 **Download**: Save your professional headshot instantly

## Tech Stack

### Frontend
- React
- Axios for API calls
- Modern CSS/styling framework

### Backend
- Express.js
- Multer for file uploads
- Google Imagen 3 API

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud API credentials

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd headshot-app
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables:
```bash
# In backend folder, copy .env.example to .env
cd backend
cp .env.example .env

# Edit .env and add your Google API key
# GOOGLE_API_KEY=your_api_key_here
PORT=5001
```

5. Start the development server:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser (frontend URL shown in terminal)

## Project Structure

```
headshot-app/
├── frontend/          # React application
├── backend/           # Express API server
├── spec.md           # Detailed project specification
└── README.md         # This file
```

## Milestones

### Milestone 1: UI Setup ✅
- Upload component
- Style selector
- Comparison view
- Basic styling

### Milestone 2: AI Integration ✅
- Google Generative AI SDK integration
- Image optimization and processing
- Real API image generation (placeholder for Imagen 3)
- Download functionality with base64 to blob conversion
- Retry logic with exponential backoff
- Error boundaries and timeout handling
- Image dimension validation

## Development

### API Setup

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the Imagen API
4. Generate an API key
5. Add the key to your backend `.env` file

### Scripts

Frontend:
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

Backend:
- `npm start` - Start Express server
- `npm dev` - Start with nodemon (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.

## Resources

- [Google Imagen API Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)

## Support

For issues or questions, please open an issue on GitHub or contact the development team.

