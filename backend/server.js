const express = require('express');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const imagenApi = require('./services/imagenApi');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Request timeout middleware (60 seconds)
app.use((req, res, next) => {
  req.setTimeout(60000, () => {
    res.status(408).json({
      success: false,
      error: 'Request timeout. Please try again with a smaller image or try again later.'
    });
  });
  next();
});

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.'));
    }
  },
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Headshot App API is running' });
});

// Upload endpoint (placeholder for now - will be enhanced in Milestone 2)
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file uploaded' 
      });
    }

    // For Milestone 1, just return a mock response
    res.json({
      success: true,
      message: 'Image uploaded successfully (Milestone 1 - mock response)',
      filename: req.file.originalname,
      size: req.file.size,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error during upload',
    });
  }
});

// Generate endpoint with Imagen API integration
app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file uploaded' 
      });
    }

    const { style } = req.body;
    
    if (!style) {
      return res.status(400).json({ 
        success: false, 
        error: 'Style selection is required' 
      });
    }

    // Validate style
    const validStyles = ['corporate', 'creative', 'executive'];
    if (!validStyles.includes(style)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid style. Must be one of: corporate, creative, executive' 
      });
    }

    // Validate image dimensions (optional but recommended)
    try {
      const sharp = require('sharp');
      const metadata = await sharp(req.file.buffer).metadata();
      const minDimension = 100;
      const maxDimension = 4096;
      
      if (metadata.width < minDimension || metadata.height < minDimension) {
        return res.status(400).json({
          success: false,
          error: `Image dimensions too small. Minimum size is ${minDimension}x${minDimension} pixels.`
        });
      }
      
      if (metadata.width > maxDimension || metadata.height > maxDimension) {
        return res.status(400).json({
          success: false,
          error: `Image dimensions too large. Maximum size is ${maxDimension}x${maxDimension} pixels.`
        });
      }
    } catch (dimensionError) {
      // If dimension check fails, continue with processing
      console.warn('Dimension validation skipped:', dimensionError.message);
    }

    // Call Imagen API service
    const result = await imagenApi.generateHeadshot(
      req.file.buffer,
      req.file.mimetype,
      style
    );

    // Convert image buffer to base64 for frontend
    const generatedImageBase64 = imagenApi.bufferToBase64(
      result.imageBuffer,
      result.mimeType
    );

    res.json({
      success: true,
      message: 'Headshot generated successfully',
      style: style,
      generatedImage: generatedImageBase64,
      processingTime: result.processingTime,
    });
  } catch (error) {
    console.error('Generation error:', error);
    
    // Handle specific error types
    let statusCode = 500;
    let errorMessage = error.message || 'Server error during generation';
    
    if (error.message.includes('API key')) {
      statusCode = 503; // Service Unavailable
    } else if (error.message.includes('Rate limit')) {
      statusCode = 429;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

