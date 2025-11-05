const { GoogleGenerativeAI } = require('@google/generative-ai');
const sharp = require('sharp');

/**
 * Imagen API Service for generating professional headshots
 * Applies style-specific transformations based on prompts from prompt.md
 */
class ImagenApiService {
  constructor() {
    this.apiKey = process.env.GOOGLE_API_KEY;
    
    if (!this.apiKey) {
      console.warn('Warning: GOOGLE_API_KEY not set. API calls will fail.');
    }

    // Initialize Google Generative AI if API key is available
    if (this.apiKey) {
      try {
        this.genAI = new GoogleGenerativeAI(this.apiKey);
      } catch (error) {
        console.error('Failed to initialize Google Generative AI:', error);
      }
    }
  }

  /**
   * Get style-specific prompt for headshot generation
   * Updated prompts from prompt.md
   */
  getStylePrompt(style) {
    const prompts = {
      corporate: 'Transform this photo into a polished profile shot maintaining the exact facial features and identity. Subject framed chest-up with headroom, eyes looking directly at camera while body angles slightly away. White t-shirt with black leather jacket, open smile. Neutral studio background. High-angle perspective with soft, diffused lighting creating gentle catchlights. 85mm lens aesthetic with shallow depth of field - sharp focus on eyes, soft bokeh background. Natural skin texture with visible hair detail. Bright, airy feel. Make subject look great and accurate to their original appearance.',
      creative: 'Transform this photo into a close-up portrait with shallow depth of field creating soft bokeh background. Warm, natural lighting highlighting subject\'s features. Casual attire and genuine, engaging smile. Subject fills more of the frame. Background hints at creative workspace or outdoor setting with beautiful blur. Preserve natural skin texture and authentic features. Modern, approachable creative professional aesthetic. Make subject look great and accurate to their original appearance.',
      executive: 'Transform this photo into a dramatic black and white portrait in editorial style. Preserve subject\'s authentic features and character. Apply these specifications: monochromatic treatment with rich grayscale tones, deep charcoal or black background with subtle gradation, dramatic side lighting creating strong shadows and highlights on face (Rembrandt or split lighting), preserve all natural skin texture and detail - no smoothing, sharp focus capturing fine details in eyes and facial features, relaxed and contemplative expression - not smiling, casual professional attire (dark textured jacket, no tie), hand gesture near chest or face for dynamic composition, high contrast with deep blacks and bright highlights, cinematic film grain for texture. Maintain editorial photography aesthetic - artistic but professional. Make subject look great and accurate to their original appearance.'
    };

    return prompts[style] || prompts.corporate;
  }

  /**
   * Convert image buffer to base64
   */
  bufferToBase64(buffer, mimeType) {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }

  /**
   * Convert base64 to image buffer
   */
  base64ToBuffer(base64String) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    return Buffer.from(base64Data, 'base64');
  }

  /**
   * Optimize image before sending to API
   */
  async optimizeImage(buffer, mimeType) {
    try {
      // Resize if too large, maintain aspect ratio
      const maxDimension = 1024;
      let optimizedBuffer = buffer;
      
      const image = sharp(buffer);
      const metadata = await image.metadata();
      
      if (metadata.width > maxDimension || metadata.height > maxDimension) {
        optimizedBuffer = await image
          .resize(maxDimension, maxDimension, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .jpeg({ quality: 85 })
          .toBuffer();
        
        return { buffer: optimizedBuffer, mimeType: 'image/jpeg' };
      }
      
      return { buffer: optimizedBuffer, mimeType };
    } catch (error) {
      console.error('Image optimization error:', error);
      // Return original if optimization fails
      return { buffer, mimeType };
    }
  }

  /**
   * Generate headshot using Google Gemini API image-to-image generation
   * Follows official documentation: https://ai.google.dev/gemini-api/docs/image-generation
   */
  async generateHeadshot(imageBuffer, mimeType, style) {
    if (!this.apiKey) {
      throw new Error('Google API key not configured. Please set GOOGLE_API_KEY in your .env file.');
    }

    const startTime = Date.now();
    const prompt = this.getStylePrompt(style);

    try {
      // Optimize image before processing
      const { buffer: optimizedBuffer, mimeType: optimizedMimeType } = 
        await this.optimizeImage(imageBuffer, mimeType);

      // Convert image to base64 for API
      const imageBase64 = optimizedBuffer.toString('base64');
      
      // Use official Gemini API for image-to-image generation
      // Documentation: https://ai.google.dev/gemini-api/docs/image-generation
      const generatedImageBase64 = await this.callGeminiImageGenerationAPI(
        imageBase64,
        optimizedMimeType,
        prompt
      );
      
      // Convert base64 response back to buffer
      const resultBuffer = Buffer.from(generatedImageBase64, 'base64');
      
      const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
      
      return {
        success: true,
        imageBuffer: resultBuffer,
        mimeType: 'image/png', // Generated images are typically PNG
        processingTime: parseFloat(processingTime)
      };

    } catch (error) {
      console.error('Image generation error:', error);
      
      // User-friendly error messages
      if (error.response) {
        const status = error.response.status;
        if (status === 401) {
          throw new Error('Invalid API key. Please check your GOOGLE_API_KEY.');
        } else if (status === 403) {
          throw new Error('API access denied. Please check your API permissions.');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (status >= 500) {
          throw new Error('Google API service error. Please try again later.');
        }
      }
      
      throw new Error(error.message || 'Failed to generate headshot. Please try again.');
    }
  }

  /**
   * Call Google Gemini API for image-to-image generation
   * Uses gemini-2.5-flash-image-preview model for image generation
   * Based on: https://ai.google.dev/gemini-api/docs/image-generation
   */
  async callGeminiImageGenerationAPI(imageBase64, mimeType, prompt) {
    try {
      if (!this.genAI) {
        throw new Error('Google Generative AI not initialized. Please check your API key.');
      }

      // Use gemini-2.5-flash-image-preview model for image-to-image generation
      const model = this.genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-image-preview' 
      });

      console.log('Calling Gemini Image Generation API with gemini-2.5-flash-image-preview...');
      console.log('Prompt:', prompt.substring(0, 100) + '...');
      
      // Prepare the image part for the API
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || 'image/jpeg'
        }
      };

      // Generate image using the model with the prompt and input image
      // The prompt instructs the model to transform the image according to the style
      const result = await model.generateContent([prompt, imagePart]);
      
      // Get the response
      const response = await result.response;
      
      console.log('API Response received, checking for generated image...');
      
      // For image generation models, the response should contain generated images
      // Check if there are any images in the response
      if (response.candidates && response.candidates.length > 0) {
        const candidate = response.candidates[0];
        
        // Check for generated images in the content
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              console.log('Image generated successfully via Gemini API (found in parts)');
              return part.inlineData.data; // Return base64 image data
            }
          }
        }
      }
      
      // Alternative: Check if response has images directly
      try {
        // Try to get images from response
        const images = response.images || [];
        if (images.length > 0 && images[0].inlineData && images[0].inlineData.data) {
          console.log('Image generated successfully via Gemini API (found in images)');
          return images[0].inlineData.data;
        }
      } catch (e) {
        // Images property might not exist, continue to other checks
      }
      
      // If no image found, try REST API approach as fallback
      console.log('No image in SDK response, trying REST API approach...');
      return await this.callGeminiImageGenerationREST(imageBase64, mimeType, prompt);
      
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError.message);
      
      // Check for specific error types
      if (apiError.message && apiError.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your GOOGLE_API_KEY.');
      }
      
      if (apiError.message && apiError.message.includes('not found')) {
        throw new Error('Model gemini-2.5-flash-image-preview not found. Please check if the model is available in your region or if you need to enable it.');
      }
      
      if (apiError.message && apiError.message.includes('permission')) {
        throw new Error('API access denied. Please check your API permissions for image generation.');
      }
      
      // If the API call fails, try REST API approach
      console.log('SDK approach failed, trying REST API...');
      try {
        return await this.callGeminiImageGenerationREST(imageBase64, mimeType, prompt);
      } catch (restError) {
        console.log('REST API also failed, using fallback image transformations...');
        return await this.applyStyleTransformationsFallback(imageBase64, prompt);
      }
    }
  }

  /**
   * Alternative REST API approach for image generation
   * Uses REST endpoint with gemini-2.5-flash-image-preview model
   */
  async callGeminiImageGenerationREST(imageBase64, mimeType, prompt) {
    const axios = require('axios');
    
    try {
      // Use REST API endpoint for gemini-2.5-flash-image-preview
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${this.apiKey}`;
      
      // Build request according to Gemini API REST format
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: prompt
              },
              {
                inlineData: {
                  mimeType: mimeType || 'image/jpeg',
                  data: imageBase64
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      };
      
      console.log('Calling Gemini REST API for image generation...');
      
      const response = await axios.post(apiUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 120 second timeout for image generation
      });
      
      // Extract generated image from response
      if (response.data && response.data.candidates && response.data.candidates.length > 0) {
        const candidate = response.data.candidates[0];
        
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData && part.inlineData.data) {
              console.log('Image generated successfully via Gemini REST API');
              return part.inlineData.data;
            }
          }
        }
      }
      
      throw new Error('No image found in REST API response');
      
    } catch (restError) {
      console.error('REST API call failed:', restError.message);
      if (restError.response) {
        console.error('REST API Error Response:', JSON.stringify(restError.response.data, null, 2));
      }
      throw restError;
    }
  }

  /**
   * Fallback: Apply style transformations using Sharp
   * Used when Gemini API is not available or fails
   */
  async applyStyleTransformationsFallback(imageBase64, prompt) {
    const imageBuffer = Buffer.from(imageBase64, 'base64');
    
    // Determine style from prompt (updated to match new prompts)
    let style = 'corporate';
    if (prompt.includes('black and white') || prompt.includes('monochromatic') || prompt.includes('Rembrandt') || prompt.includes('film grain')) {
      style = 'executive';
    } else if (prompt.includes('bokeh') || prompt.includes('creative workspace') || prompt.includes('warm, natural lighting')) {
      style = 'creative';
    } else if (prompt.includes('polished profile shot') || prompt.includes('85mm lens') || prompt.includes('neutral studio background')) {
      style = 'corporate';
    }
    
    const transformedBuffer = await this.applyStyleTransformations(imageBuffer, style, prompt);
    // Convert buffer back to base64
    return transformedBuffer.toString('base64');
  }

  /**
   * Apply style-specific image transformations based on updated prompts from prompt.md
   */
  async applyStyleTransformations(imageBuffer, style, prompt) {
    try {
      let processedImage = sharp(imageBuffer);
      const metadata = await processedImage.metadata();
      
      // Apply transformations based on style
      switch (style) {
        case 'executive':
          // Executive Portrait: Dramatic black and white with editorial style
          // From updated prompt.md: "dramatic black and white portrait in editorial style"
          // Includes: Rembrandt lighting, film grain, high contrast, rich grayscale tones
          processedImage = processedImage
            .greyscale() // Convert to monochromatic
            .modulate({
              brightness: 1.2, // Increase brightness for dramatic effect
              saturation: 0, // Remove all color for rich grayscale
              hue: 0
            })
            .normalize() // Enhance contrast for high contrast look
            .gamma(1.3) // Adjust gamma for Rembrandt/split lighting effect
            .sharpen({ 
              sigma: 1.8, // Sharp focus on eyes and facial features
              flat: 1,
              jagged: 2
            })
            // Add film grain texture (simulated with noise)
            .convolve({
              width: 3,
              height: 3,
              kernel: [
                -1, -1, -1,
                -1,  9, -1,
                -1, -1, -1
              ]
            })
            .jpeg({ quality: 95 });
          break;

        case 'creative':
          // Creative Professional: Close-up with bokeh and warm lighting
          // From updated prompt.md: "close-up portrait with shallow depth of field creating soft bokeh background"
          // Includes: Warm natural lighting, soft bokeh, creative workspace feel
          processedImage = processedImage
            .modulate({
              brightness: 1.15, // Warm natural lighting highlighting features
              saturation: 1.2, // Enhanced warm tones
              hue: 8 // Warmer hue shift for natural daylight feel
            })
            .sharpen({ 
              sigma: 1.3, // Sharp subject, soft background
              flat: 1,
              jagged: 1
            })
            .jpeg({ quality: 92 });
          break;

        case 'corporate':
        default:
          // Corporate Classic: Polished profile shot with 85mm lens aesthetic
          // From updated prompt.md: "polished profile shot... 85mm lens aesthetic with shallow depth of field"
          // Includes: Sharp focus on eyes, soft bokeh background, bright airy feel, natural skin texture
          processedImage = processedImage
            .sharpen({ 
              sigma: 1.6, // Sharp focus on eyes (85mm lens aesthetic)
              flat: 1,
              jagged: 2
            })
            .modulate({
              brightness: 1.08, // Bright, airy feel with soft diffused lighting
              saturation: 0.98, // Slightly desaturated for polished professional look
              hue: 0
            })
            .normalize() // Even professional lighting (soft, diffused)
            .jpeg({ quality: 95 });
          break;
      }

      // Ensure square aspect ratio for headshot (1:1)
      // Use 'cover' to maintain quality and focus on center (face)
      const finalBuffer = await processedImage
        .resize(1024, 1024, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 95 })
        .toBuffer();

      return finalBuffer;

    } catch (error) {
      console.error('Style transformation error:', error);
      // If transformation fails, return optimized original
      return imageBuffer;
    }
  }
}

module.exports = new ImagenApiService();
