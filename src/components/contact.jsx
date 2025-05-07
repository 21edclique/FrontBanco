import { useState, useEffect } from "react";
import emailjs from "emailjs-com";
import React from "react";

const initialState = {
  name: "",
  email: "",
  message: "",
};

// Default colors in case localStorage is empty
const DEFAULT_COLORS = {
  primaryColor: "#2e3673",
  secondaryColor: "#fbd800",
};

export const Contact = (props) => {
  const [{ name, email, message }, setState] = useState(initialState);
  const [institutionColors, setInstitutionColors] = useState(DEFAULT_COLORS);

  // Load institution colors from localStorage on component mount
  useEffect(() => {
    try {
      const savedInfo = localStorage.getItem("institutionInfo");
      if (savedInfo) {
        const parsedInfo = JSON.parse(savedInfo);
        setInstitutionColors({
          primaryColor: parsedInfo.primaryColor || DEFAULT_COLORS.primaryColor,
          secondaryColor: parsedInfo.secondaryColor || DEFAULT_COLORS.secondaryColor,
        });
      }
    } catch (error) {
      console.error("Error loading institution info:", error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };
  
  const clearState = () => setState({ ...initialState });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name, email, message);
    
    /* replace below with your own Service ID, Template ID and Public Key from your EmailJS account */
    
    emailjs
      .sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", e.target, "YOUR_PUBLIC_KEY")
      .then(
        (result) => {
          console.log(result.text);
          clearState();
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  // Custom styles based on institution colors
  const customStyles = {
    header: {
      backgroundColor: institutionColors.primaryColor,
      color: "white",
      padding: "15px",
      borderRadius: "5px",
      marginBottom: "20px",
    },
    button: {
      backgroundColor: institutionColors.primaryColor,
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "5px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      hover: {
        backgroundColor: institutionColors.secondaryColor,
        color: institutionColors.primaryColor
      }
    },
    formHighlight: {
      borderColor: institutionColors.secondaryColor,
      boxShadow: `0 0 5px ${institutionColors.secondaryColor}`,
    },
    socialIcons: {
      color: institutionColors.primaryColor,
    },
    footer: {
      backgroundColor: institutionColors.primaryColor,
      color: "white",
      padding: "15px 0",
    },
    contactContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      flexWrap: "wrap",
      marginTop: "20px",
      gap: "15px"
    },
    contactItem: {
      backgroundColor: institutionColors.secondaryColor,
      padding: "20px",
      borderRadius: "8px",
      flex: "1",
      minWidth: "200px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transition: "transform 0.3s ease",
      hover: {
        transform: "translateY(-5px)"
      },
      textAlign: "center"
    },
    contactIcon: {
      fontSize: "4rem",
      marginTop: "30px",
      marginBottom: "10px",
      color: institutionColors.primaryColor
    },
    contactTitle: {
      color: institutionColors.primaryColor,
      fontWeight: "bold",
      fontSize: "2rem",
      marginBottom: "10px"
    },
    contactValue: {
      fontSize: "2rem"
    },
    mainContainer: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px"
    },
    sectionTitle: {
      color: institutionColors.primaryColor,
      textAlign: "center",
      marginBottom: "30px",
      fontSize: "2rem",
      fontWeight: "bold"
    }
  };

  return (
    <div>
      <div id="contact" style={{ backgroundColor: "#f9f9f9", padding: "60px 0" }}>
        <div style={customStyles.mainContainer}>
          <h2 style={customStyles.sectionTitle}>Contáctanos</h2>
          
         
          
          {/* Nueva sección de contactos horizontales */}
          <div style={customStyles.contactContainer}>
            <div 
              className="contact-item" 
              style={customStyles.contactItem}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={customStyles.contactIcon}>
                <i className="fa fa-map-marker"></i>
              </div>
              <h3 style={customStyles.contactTitle}>Dirección</h3>
              <p style={customStyles.contactValue}>
                {props.data ? props.data.address : "loading"}
              </p>
            </div>
            
            <div 
              className="contact-item"
              style={customStyles.contactItem}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={customStyles.contactIcon}>
                <i className="fa fa-phone"></i>
              </div>
              <h3 style={customStyles.contactTitle}>Teléfono</h3>
              <p style={customStyles.contactValue}>
                {props.data ? props.data.phone : "loading"}
              </p>
            </div>
            
            <div 
              className="contact-item"
              style={customStyles.contactItem}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={customStyles.contactIcon}>
                <i className="fa fa-envelope-o"></i>
              </div>
              <h3 style={customStyles.contactTitle}>Email</h3>
              <p style={customStyles.contactValue}>
                {props.data ? props.data.email : "loading"}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div id="footer" style={customStyles.footer}>
        <div className="container text-center">
          {/* Contenido del footer */}
        </div>
      </div>
    </div>
  );
};