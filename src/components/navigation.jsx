import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SmoothScroll from "smooth-scroll";
import "../styles/Navigation.css"; // Adjust the path as necessary

const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

// Default institution info that matches the Admin component
const DEFAULT_INSTITUTION = {
  name: 'Mi Banco',
  slogan: 'Tu mejor opción financiera',
  logo: '/img/encabezado.png',
  primaryColor: '#1a365d',
  secondaryColor: '#3182ce',
};

export const Navigation = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [institutionInfo, setInstitutionInfo] = useState(DEFAULT_INSTITUTION);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Load institution info from localStorage when component mounts
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem('institutionInfo');
      if (savedInfo) {
        setInstitutionInfo(JSON.parse(savedInfo));
      }
    } catch (error) {
      console.error("Error loading institution info:", error);
    }
  }, []);

  const handleNavigation = (e, section) => {
    e.preventDefault();
    const isOnSimuladores = location.pathname === "/simuladores";
    
    // Close mobile menu when navigating
    setIsMenuOpen(false);

    if (isOnSimuladores) {
      navigate("/");
      setTimeout(() => {
        scroll.animateScroll(document.querySelector(section));
      }, 300);
    } else {
      scroll.animateScroll(document.querySelector(section));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar-custom">
      <div className="navbar-container">
        <div className="navbar-brand-container">
          <a
            className="navbar-brand"
            href="#page-top"
            onClick={(e) => handleNavigation(e, "#page-top")}
          >
            <div className="brand-content">
            <img 
  src={institutionInfo.logo} 
  alt={`${institutionInfo.name} logo`} 
  style={{ width: '50px', height: '50px' }} 
/>

              <span className="brand-name">{institutionInfo.name}</span>
            </div>
          </a>
          
          <button
            className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
            <span className="toggle-bar"></span>
          </button>
        </div>

        <div className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
          <ul className="navbar-links">
           
            <li className="nav-item">
              <a
                href="#about"
                className="nav-link"
                onClick={(e) => handleNavigation(e, "#about")}
              >
                Nosotros
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#services"
                className="nav-link"
                onClick={(e) => handleNavigation(e, "#services")}
              >
                Servicios
              </a>
            </li>
       
            <li className="nav-item">
              <a
                href="#testimonials"
                className="nav-link"
                onClick={(e) => handleNavigation(e, "#testimonials")}
              >
                Testimonios
              </a>
            </li>
            <li className="nav-item">
              <a
                href="#contact"
                className="nav-link"
                onClick={(e) => handleNavigation(e, "#contact")}
              >
                Contacto
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-button simulator-button"
                style={{
                  background: institutionInfo.primaryColor,
                }}
                onClick={() => navigate("/simuladores")}
              >
                Simuladores
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-button admin-button"
                onClick={() => navigate("/login")}
              >
                Administrar
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};