import { useState } from 'react';
import axios from 'axios';
import './App.css';

// Import components
import ImageUpload from './components/ImageUpload';
import StyleSelector from './components/StyleSelector';
import ComparisonView from './components/ComparisonView';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE_URL = 'http://localhost:5001/api';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleImageSelect = (file, preview) => {
    setSelectedImage(file);
    setPreviewUrl(preview);
    setGeneratedImage(null);
    setError(null);
    setSuccess(null);
  };

  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
    setGeneratedImage(null);
    setError(null);
    setSuccess(null);
  };

  const handleGenerate = async (retryCount = 0) => {
    if (!selectedImage) {
      setError('Please upload an image first.');
      return;
    }

    if (!selectedStyle) {
      setError('Please select a style.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('style', selectedStyle);

      // Set timeout to 60 seconds
      const response = await axios.post(
        `${API_BASE_URL}/generate`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds timeout
        }
      );

      if (response.data.success) {
        // Parse base64 image data from API response
        const generatedImageBase64 = response.data.generatedImage;
        
        if (generatedImageBase64) {
          setGeneratedImage(generatedImageBase64);
          setSuccess(
            `Headshot generated successfully! (Processing time: ${response.data.processingTime}s)`
          );
        } else {
          setError('No image data received from server.');
        }
      } else {
        setError(response.data.error || 'Failed to generate headshot.');
      }
    } catch (err) {
      console.error('Generation error:', err);
      
      // Handle timeout
      if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The image generation is taking longer than expected. Please try again.');
        return;
      }

      // Handle network errors with retry logic
      if ((!err.response || err.response.status >= 500) && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`Retrying in ${delay}ms... (Attempt ${retryCount + 1}/3)`);
        
        setTimeout(() => {
          handleGenerate(retryCount + 1);
        }, delay);
        return;
      }

      // User-friendly error messages
      let errorMessage = 'Failed to generate headshot. ';
      
      if (err.response) {
        const status = err.response.status;
        if (status === 429) {
          errorMessage += 'Too many requests. Please try again later.';
        } else if (status === 503) {
          errorMessage += 'API service is unavailable. Please check your API configuration.';
        } else if (err.response.data?.error) {
          errorMessage = err.response.data.error;
        } else {
          errorMessage += `Server error (${status}). Please try again.`;
        }
      } else if (err.message.includes('Network Error')) {
        errorMessage += 'Cannot connect to server. Please make sure the backend is running.';
      } else {
        errorMessage += err.message || 'An unexpected error occurred.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Professional Headshot AI</h1>
        <p>Transform your photos into professional headshots in seconds</p>
      </header>

      <main>
        <ImageUpload onImageSelect={handleImageSelect} />

        <StyleSelector
          selectedStyle={selectedStyle}
          onStyleSelect={handleStyleSelect}
        />

        {error && (
          <div className="error-message">
            {error}
            {!loading && selectedImage && selectedStyle && (
              <button
                className="retry-button"
                onClick={() => handleGenerate(0)}
              >
                🔄 Retry
              </button>
            )}
          </div>
        )}
        {success && <div className="success-message">{success}</div>}

        {loading ? (
          <LoadingSpinner message="Generating your professional headshot..." />
        ) : (
          <div className="generate-button-container">
            <button
              className="generate-button"
              onClick={handleGenerate}
              disabled={!selectedImage || !selectedStyle || loading}
            >
              Generate Headshot
            </button>
          </div>
        )}

        <ComparisonView
          originalImage={previewUrl}
          generatedImage={generatedImage}
          style={selectedStyle}
        />
      </main>
    </div>
  );
}

export default App;
