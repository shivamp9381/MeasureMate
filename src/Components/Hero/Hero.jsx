import React, { useEffect, useState, useRef } from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
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
        // Don't save to localStorage for this implementation
      };
      fileReader.readAsDataURL(file);
      
      // Simulate upload process
      handleUpload(file);
    }
  };

  const handleUpload = (file) => {
    // Reset states
    setIsUploading(true);
    
    // Simulate upload process with a timeout
    setTimeout(() => {
      setIsUploading(false);
      // Here you would typically send the file to your server
      console.log('File uploaded:', file.name);
    }, 2000);
  };

  const handleButtonClick = () => {
    // Trigger the hidden file input when the button is clicked
    fileInputRef.current.click();
  };

  // Reset handler if needed explicitly (not triggered on refresh, but could be called by a reset button)
  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
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
          
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept="image/*"
            className={styles.hiddenInput}
            key={selectedFile ? "fileInput-with-file" : "fileInput-empty"} // Force re-render on reset
          />
          
          {/* Visible upload button */}
          <button 
            className={`${styles.uploadButton} ${styles.scaleIn}`} 
            style={{ animationDelay: '1.2s' }}
            onClick={handleButtonClick}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className={styles.spinner}></div>
                Uploading...
              </>
            ) : (
              <>
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
              </>
            )}
          </button>
          
          {/* Display file name if selected */}
          {selectedFile && !isUploading && (
            <div className={styles.fileInfo}>
              <p className={styles.fileName}>
                <span className={styles.checkmark}>✓</span> {selectedFile.name}
              </p>
              <button 
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