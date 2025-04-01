import React, { useEffect, useRef } from 'react';
import styles from './Banner.module.css';

const Banner = () => {
  const bannerRef = useRef(null);
  
  useEffect(() => {
    // Add animation class once component is mounted
    const animateElements = () => {
      const banner = bannerRef.current;
      if (banner) {
        banner.classList.add(styles.animate);
      }
    };
    
    // Observe elements for viewport visibility
    const observeElements = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.2 });
      
      const elements = bannerRef.current.querySelectorAll(`.${styles.animatedElement}`);
      elements.forEach(el => observer.observe(el));
    };
    
    // Small timeout to ensure DOM is ready
    setTimeout(() => {
      animateElements();
      observeElements();
    }, 100);
  }, []);
  
  return (
    <div className={styles.banner} ref={bannerRef}>
      <div className={styles.contentContainer}>
        <div className={`${styles.textSection} ${styles.animatedElement}`}>
          <h1 className={styles.headline}>
            <span className={styles.mainHeadline}>The Most Realistic</span>
            <span className={styles.subHeadline}>Virtual Shopping Experience Ever.</span>
            <div className={styles.underline}></div>
          </h1>
          
          <p className={`${styles.description} ${styles.animatedElement}`}>
            the new face of online shopping is finally here! Shoppers
            can now create their realistic 3D avatar and try on clothes
            before buying online via our <span className={styles.highlight}>virtual fitting room</span>!
          </p>
          
          <div className={`${styles.featuresRow} ${styles.animatedElement}`}>
            <div className={`${styles.featureItem} ${styles.fadeInItem}`}>
              <div className={styles.featureIcon}>AR</div>
            </div>
            <div className={`${styles.featureItem} ${styles.fadeInItem}`} style={{ animationDelay: '0.2s' }}>
              <div className={styles.featureIcon}>VR</div>
            </div>
            <div className={`${styles.featureItem} ${styles.fadeInItem}`} style={{ animationDelay: '0.4s' }}>
              <div className={styles.featureIcon}>3D</div>
            </div>
            <div className={`${styles.featureItem} ${styles.fadeInItem}`} style={{ animationDelay: '0.6s' }}>
              <div className={styles.webIcon}>Web</div>
            </div>
          </div>
          
          <button className={`${styles.tryButton} ${styles.animatedElement}`}>
            Try Now
            <span className={styles.arrow}>→</span>
          </button>
        </div>
        
        <div className={`${styles.imageSection} ${styles.animatedElement}`}>
          <div className={styles.imageContainer}>
            <img 
              src="https://i.ibb.co/3ypLb6J6/image.png" 
              alt="Virtual fitting room interface showing 3D avatar in a green dress" 
              className={styles.bannerImage} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;