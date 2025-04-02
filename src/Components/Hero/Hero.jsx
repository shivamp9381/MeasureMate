import React, { useEffect, useState, useRef } from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [measurements, setMeasurements] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Effect to handle component mount and clean localStorage on refresh
  useEffect(() => {
    // Clear any cached data
    localStorage.removeItem('heroImagePreview');
    
    // Reset file input if it exists
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Set loaded state after component mounts to trigger animations
    setIsLoaded(true);
    
    // Clean up function that runs when component unmounts or page refreshes
    return () => {
      // Clean up any resources on unmount/refresh
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create a preview URL for the selected image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const result = fileReader.result;
        setPreviewUrl(result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!selectedFile) {
      setError("Please select an image file");
      return;
    }
    if (!height || !weight) {
      setError("Please enter your height and weight");
      return;
    }
    
    // Reset states
    setIsUploading(true);
    setError(null);
    setMeasurements(null);
    
    try {
      // Create form data
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('height', parseFloat(height));
      formData.append('weight', parseFloat(weight));
      
      // Send to API
      const response = await fetch('http://localhost:5000/measurements', {
        method: 'POST',
        body: formData,
      });
      
      // Handle response
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process image');
      }
      
      // Set measurements data
      setMeasurements(data);
      console.log('Measurements:', data);
      
    } catch (err) {
      setError(err.message);
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input when the button is clicked
    fileInputRef.current.click();
  };

  // Reset handler 
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setHeight('');
    setWeight('');
    setMeasurements(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.container}>
        <div className={`${styles.content} ${isLoaded ? styles.animate : ''}`}>
          <h1 className={styles.heading}>
            <span className={styles.animateText}>AI-powered</span><br />
            <span className={styles.animateText} style={{ animationDelay: '0.2s' }}>body</span><br />
            <span className={styles.animateText} style={{ animationDelay: '0.4s' }}>measuring for</span><br />
            <span className={styles.animateText} style={{ animationDelay: '0.6s' }}>an effortless,</span><br />
            <span className={styles.animateText} style={{ animationDelay: '0.8s' }}>accurate fit.</span>
          </h1>
          <p className={`${styles.subheading} ${styles.fadeIn}`} style={{ animationDelay: '1s' }}>
            3D Precision. Anytime. Anywhere.
          </p>
          
          <form onSubmit={handleUpload} className={styles.uploadForm}>
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*"
              className={styles.hiddenInput}
              key={selectedFile ? "fileInput-with-file" : "fileInput-empty"}
            />
            
            {/* Visible upload button */}
            <button 
              type="button"
              className={`${styles.uploadButton} ${styles.scaleIn}`} 
              style={{ animationDelay: '1.2s' }}
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`${styles.uploadIcon} ${styles.bounce}`}
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              Upload Your Image Here
            </button>
            
            {/* Display file name if selected */}
            {selectedFile && (
              <div className={styles.fileInfo}>
                <p className={styles.fileName}>
                  <span className={styles.checkmark}>✓</span> {selectedFile.name}
                </p>
                <button 
                  type="button"
                  className={styles.resetButton} 
                  onClick={handleReset} 
                  aria-label="Reset upload"
                  title="Reset upload"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}
            
            {/* Height and weight inputs */}
            {selectedFile && (
              <div className={styles.measurementInputs}>
                <div className={styles.inputGroup}>
                  <label htmlFor="height">Height (cm):</label>
                  <input
                    type="number"
                    id="height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    min="100"
                    max="220"
                    required
                    className={styles.inputField}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="weight">Weight (kg):</label>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    min="30"
                    max="200"
                    required
                    className={styles.inputField}
                  />
                </div>
                
                <button 
                  type="submit"
                  className={styles.processButton}
                  disabled={isUploading || !height || !weight}
                >
                  {isUploading ? (
                    <>
                      <div className={styles.spinner}></div>
                      Processing...
                    </>
                  ) : (
                    'Get Measurements'
                  )}
                </button>
              </div>
            )}
            
            {/* Error display */}
            {error && (
              <div className={styles.errorMessage}>
                <p>{error}</p>
              </div>
            )}
            
            {/* Results display */}
            {measurements && (
              <div className={styles.resultsContainer}>
                <h3>Your Measurements</h3>
                <div className={styles.measurementResults}>
                  <div className={styles.measurementItem}>
                    <span>Chest:</span> {measurements.measurements.chest} inches
                  </div>
                  <div className={styles.measurementItem}>
                    <span>Waist:</span> {measurements.measurements.waist} inches
                  </div>
                  <div className={styles.measurementItem}>
                    <span>Hip:</span> {measurements.measurements.hip} inches
                  </div>
                  <div className={styles.measurementItem}>
                    <span>Shoulder:</span> {measurements.measurements.shoulder} inches
                  </div>
                  <div className={styles.measurementItem}>
                    <span>Inseam:</span> {measurements.measurements.inseam} inches
                  </div>
                </div>
                
                <div className={styles.sizeRecommendations}>
                  <h4>Size Recommendations</h4>
                  <div className={styles.sizeItem}>
                    <span>Shirt Size:</span> {measurements.size_recommendations.shirt}
                  </div>
                  <div className={styles.sizeItem}>
                    <span>Pants Size:</span> {measurements.size_recommendations.pants}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
        
        <div className={`${styles.imageContainer} ${isLoaded ? styles.slideIn : ''}`}>
          <div className={styles.imageWrapper}>
            {/* Show preview if available, otherwise show the default image */}
            <img 
              src={previewUrl || "https://i.ibb.co/Dgg62zHX/image.png"}
              alt={previewUrl ? "Uploaded image preview" : "Colorful layered design"} 
              className={styles.heroImage}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
