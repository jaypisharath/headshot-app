# Headshot App - Style Prompts

This document contains the prompts used for generating professional headshots in three distinct styles.

## 1. Corporate Classic

**Prompt:**
```
Transform this photo into a polished profile shot maintaining the exact facial features and identity. Subject framed chest-up with headroom, eyes looking directly at camera while body angles slightly away. White t-shirt with black leather jacket, open smile. Neutral studio background. High-angle perspective with soft, diffused lighting creating gentle catchlights. 85mm lens aesthetic with shallow depth of field - sharp focus on eyes, soft bokeh background. Natural skin texture with visible hair detail. Bright, airy feel. Make subject look great and accurate to their original appearance.
```

## 2. Creative Professional

**Prompt:**
```
Transform this photo into a close-up portrait with shallow depth of field creating soft bokeh background. Warm, natural lighting highlighting subject’s features. Casual attire and genuine, engaging smile. Subject fills more of the frame. Background hints at creative workspace or outdoor setting with beautiful blur. Preserve natural skin texture and authentic features. Modern, approachable creative professional aesthetic. Make subject look great and accurate to their original appearance.
```

## 3. Executive Portrait

**Prompt:**
```
Transform this photo into a dramatic black and white portrait in editorial style. Preserve subject’s authentic features and character. Apply these specifications: monochromatic treatment with rich grayscale tones, deep charcoal or black background with subtle gradation, dramatic side lighting creating strong shadows and highlights on face (Rembrandt or split lighting), preserve all natural skin texture and detail - no smoothing, sharp focus capturing fine details in eyes and facial features, relaxed and contemplative expression - not smiling, casual professional attire (dark textured jacket, no tie), hand gesture near chest or face for dynamic composition, high contrast with deep blacks and bright highlights, cinematic film grain for texture. Maintain editorial photography aesthetic - artistic but professional. Make subject look great and accurate to their original appearance.
```

## Usage

These prompts are designed to be used with Google's Imagen 3 API for image-to-image generation. When implementing the API integration:

1. Map user-selected style to the corresponding prompt above
2. Include the prompt along with the uploaded image
3. Ensure the prompt is passed to the image generation endpoint

## Prompt Engineering Notes

- **Specificity**: Each prompt includes specific visual elements (background, lighting, style)
- **Quality Indicators**: All prompts include "high quality" or "professional" quality descriptors
- **Use Case Context**: Prompts mention the intended use (LinkedIn, portfolios, magazines)
- **Technical Terms**: Uses photography terminology (bokeh, depth of field, high contrast)
- **Consistency**: Maintains professional tone across all styles

## Style Selection Mapping

In the application code, map style IDs to these prompts:
- `corporate` → Corporate Classic prompt
- `creative` → Creative Professional prompt  
- `executive` → Executive Portrait prompt
