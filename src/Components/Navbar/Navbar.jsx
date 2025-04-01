import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function goHome() {
    window.location.href = '/';
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navContainer">
        <div className="logoContainer">
          <img
            onClick={goHome}
            src="https://i.ibb.co/9HPXrQ7X/Whats-App-Image-2025-04-01-at-20-10-06.jpg"
            alt="3DLOOK"
            className="logo"
          />
        </div>

        <div className="navLinks">
          <a href="/login" className="navLink loginBtn">
            Login
          </a>
          <a href="/tryon" className="navLink tryOnBtn">
            3D TryOn
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
