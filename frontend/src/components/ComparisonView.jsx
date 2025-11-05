function ComparisonView({ originalImage, generatedImage, style }) {
  const handleDownload = () => {
    if (!generatedImage) return;

    try {
      // Convert base64 to blob
      const base64Data = generatedImage.replace(/^data:image\/\w+;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      
      // Determine MIME type from base64 string
      const mimeMatch = generatedImage.match(/data:image\/(\w+);base64/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'png';
      const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
      
      const blob = new Blob([byteArray], { type: `image/${mimeType}` });
      const blobUrl = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `headshot-${style}-${Date.now()}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download image. Please try again.');
    }
  };

  if (!originalImage && !generatedImage) {
    return null;
  }

  return (
    <div className="comparison-view-container">
      <h3>Comparison View</h3>
      <div className="comparison-grid">
        <div className="comparison-image-container">
          <h4>Original</h4>
          {originalImage ? (
            <img src={originalImage} alt="Original" className="comparison-image" />
          ) : (
            <div className="placeholder">No original image</div>
          )}
        </div>

        <div className="comparison-image-container">
          <h4>Generated</h4>
          {generatedImage ? (
            <img src={generatedImage} alt="Generated" className="comparison-image" />
          ) : (
            <div className="placeholder">No generated image</div>
          )}
        </div>
      </div>

      {generatedImage && (
        <div className="download-container">
          <button className="download-button" onClick={handleDownload}>
            📥 Download Generated Headshot
          </button>
        </div>
      )}
    </div>
  );
}

export default ComparisonView;

