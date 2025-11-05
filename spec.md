# Professional Headshot AI App - Specification

## Project Overview

A web application that generates professional headshots using AI. Users can upload their photos, select from three professional style options, and receive AI-enhanced professional headshots. The app features a side-by-side comparison view to compare the original photo with the generated headshot.

## Requirements

### Functional Requirements

1. **Photo Upload**
   - Users can upload a photo from their device
   - Support for common image formats (JPEG, PNG, WebP)
   - Image validation (max file size, dimensions, file type)
   - Preview of uploaded image before processing

2. **Style Selection**
   - Three professional style options:
     - **Corporate Classic**: Traditional business headshot with formal attire, neutral background
     - **Creative Professional**: Modern, vibrant headshot with creative background
     - **Executive Portrait**: Premium, high-end executive headshot with sophisticated styling
   - Clear visual representation of each style option

3. **AI Image Generation**
   - Integration with Google's Imagen 3 (nano banana) API for image-to-image generation
   - Style-specific prompts sent to API
   - Processing status indicator during generation
   - Error handling for API failures

4. **Comparison View**
   - Side-by-side display of original and generated headshot
   - Equal-sized images for easy comparison
   - Download functionality for generated headshots
   - Optional slider overlay for before/after comparison

### Non-Functional Requirements

1. **Performance**
   - Image processing should complete within 10-30 seconds
   - Responsive design for desktop and mobile devices
   - Optimized image handling and upload

2. **User Experience**
   - Intuitive, clean interface
   - Loading states and progress indicators
   - Clear error messages
   - Smooth transitions between states

3. **Security**
   - API key stored securely on backend
   - File size and type validation
   - No data persistence (images processed and discarded)

## Tech Stack

### Frontend
- **React**: UI framework
- **React Router**: Navigation (if needed)
- **Axios**: HTTP client for API calls
- **Tailwind CSS** or **Styled Components**: Styling
- **File Upload Library**: For image upload handling

### Backend
- **Express.js**: REST API server
- **Multer**: File upload handling
- **Node.js**: Runtime environment
- **Dotenv**: Environment variable management
- **Google AI SDK** or **Axios**: Google Imagen API client

### AI/ML
- **Google Imagen 3 (nano banana)**: Image-to-image generation API
- API Documentation: https://ai.google.dev/gemini-api/docs/image-generation

### Development Tools
- **npm** or **yarn**: Package management
- **Git**: Version control
- **ESLint**: Code linting
- **Prettier**: Code formatting

## Project Structure

```
headshot-app/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ImageUpload.jsx
│   │   │   ├── StyleSelector.jsx
│   │   │   ├── ComparisonView.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── App.jsx
│   │   ├── index.js
│   │   └── styles/
│   ├── package.json
│   └── README.md
├── backend/
│   ├── routes/
│   │   └── upload.js
│   ├── services/
│   │   └── imagenApi.js
│   ├── middleware/
│   │   └── upload.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── spec.md
└── README.md
```

## Milestones

### Milestone 1: UI Setup and Basic Functionality

**Goal**: Create the user interface with upload, style selection, and comparison view capabilities.

**Tasks**:

1. **Frontend Setup**
   - Initialize React application with Vite or Create React App
   - Install dependencies (axios, styling libraries)
   - Set up basic project structure

2. **UI Components**
   - Create ImageUpload component with drag-and-drop functionality
   - Build StyleSelector component with three style cards
   - Develop ComparisonView component for side-by-side display
   - Add LoadingSpinner component for processing states
   - Implement basic styling and responsive design

3. **Backend Setup**
   - Initialize Express server
   - Set up file upload middleware (Multer)
   - Create basic upload route endpoint
   - Configure CORS for frontend communication

4. **Integration**
   - Connect frontend to backend upload endpoint
   - Implement image preview functionality
   - Add basic error handling and validation

**Success Criteria**:
- Users can upload photos
- All three style options are visible and selectable
- Comparison view displays (with mock data)
- UI is responsive and visually appealing
- No console errors or breaking issues

**Estimated Time**: 3-5 days

### Milestone 2: Google Imagen API Integration

**Goal**: Integrate with Google's Imagen 3 API to generate professional headshots.

**Tasks**:

1. **API Setup**
   - Obtain Google Cloud API credentials
   - Install Google AI SDK
   - Configure environment variables
   - Set up API authentication

2. **Backend Implementation**
   - Create Imagen API service module
   - Define style-specific prompts for each headshot type
   - Implement image-to-image generation endpoint
   - Add error handling for API failures
   - Configure proper response formatting

3. **Prompt Engineering**
   - **Corporate Classic**: "Professional corporate headshot with formal business attire, neutral gray or blue background, professional lighting"
   - **Creative Professional**: "Modern creative headshot with contemporary styling, vibrant yet tasteful background, creative lighting"
   - **Executive Portrait**: "Premium executive headshot with sophisticated styling, elegant background, studio-quality lighting"

4. **Frontend Integration**
   - Connect to generation endpoint
   - Implement loading states during API calls
   - Display generated headshot in comparison view
   - Add download functionality
   - Implement retry logic for failed requests

5. **Testing & Optimization**
   - Test all three style generations
   - Optimize image sizes and quality
   - Add error boundaries and fallback UI
   - Performance testing and optimization

**Success Criteria**:
- All three style options generate professional headshots
- Generated images match selected style
- API calls complete successfully within expected time
- Error handling works properly
- Users can download generated headshots

**Estimated Time**: 3-5 days

**API Reference**:
- Imagen API Documentation: https://ai.google.dev/gemini-api/docs/image-generation
- Focus on image-to-image generation endpoint
- Use "nano banana" model variant for faster processing

## User Flow

1. User lands on home page
2. User clicks "Upload Photo" or drags image into upload area
3. System validates and displays preview
4. User selects one of three professional styles
5. User clicks "Generate Headshot"
6. System shows loading spinner with progress indication
7. Backend sends image and style to Google Imagen API
8. API processes and returns generated headshot
9. System displays side-by-side comparison view
10. User can download generated headshot or try another style

## API Design

### Upload and Generate Endpoint

**POST** `/api/generate`

**Request**:
- Content-Type: multipart/form-data
- Body:
  - `image`: File (required)
  - `style`: String (required, one of: "corporate", "creative", "executive")

**Response (Success)**:
```json
{
  "success": true,
  "generatedImage": "base64_encoded_image",
  "style": "corporate",
  "processingTime": 15.2
}
```

**Response (Error)**:
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Security Considerations

1. **API Key Protection**
   - Store Google API key in backend environment variables only
   - Never expose API key to frontend
   - Use .env file with .gitignore

2. **File Validation**
   - Validate file type (images only)
   - Enforce maximum file size (e.g., 10MB)
   - Sanitize file names
   - Scan for malicious content

3. **Rate Limiting**
   - Implement rate limiting to prevent abuse
   - Consider token-based authentication for production

4. **Data Privacy**
   - Do not store uploaded images permanently
   - Process and delete images after generation
   - Inform users of data handling practices

## Future Enhancements

- User accounts and history
- Multiple style combinations
- Custom prompt input
- Batch processing (multiple images)
- Background removal/replacement
- Real-time preview adjustments
- Integration with professional photo services
- Mobile app versions
- Social sharing capabilities

## Testing Strategy

1. **Unit Tests**: Component logic, utility functions
2. **Integration Tests**: API endpoints, file upload
3. **E2E Tests**: Complete user flow
4. **Performance Tests**: API response times, file size limits
5. **Security Tests**: API key exposure, file validation

## Deployment

### Frontend
- Deploy to Vercel, Netlify, or GitHub Pages
- Configure environment variables for API endpoint

### Backend
- Deploy to Heroku, Railway, or AWS
- Set up environment variables for API keys
- Configure proper CORS settings
- Set up monitoring and logging

## Conclusion

This specification outlines a complete professional headshot AI application leveraging Google's Imagen 3 API. The two-milestone approach ensures a working UI first, followed by AI integration, making the project manageable and deliverable.

