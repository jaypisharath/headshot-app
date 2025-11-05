function LoadingSpinner({ message }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <p className="loading-message">{message || 'Processing...'}</p>
    </div>
  );
}

export default LoadingSpinner;

