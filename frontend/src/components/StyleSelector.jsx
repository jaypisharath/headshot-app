function StyleSelector({ selectedStyle, onStyleSelect }) {
  const styles = [
    {
      id: 'corporate',
      name: 'Corporate Classic',
      description: 'Traditional business headshot with formal attire and neutral background',
      icon: '👔',
    },
    {
      id: 'creative',
      name: 'Creative Professional',
      description: 'Modern, vibrant headshot with creative background',
      icon: '🎨',
    },
    {
      id: 'executive',
      name: 'Executive Portrait',
      description: 'Premium, high-end executive headshot with sophisticated styling',
      icon: '💼',
    },
  ];

  return (
    <div className="style-selector-container">
      <h3>Choose Your Style</h3>
      <div className="style-grid">
        {styles.map((style) => (
          <div
            key={style.id}
            className={`style-card ${selectedStyle === style.id ? 'selected' : ''}`}
            onClick={() => onStyleSelect(style.id)}
          >
            <div className="style-icon">{style.icon}</div>
            <h4>{style.name}</h4>
            <p>{style.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StyleSelector;

