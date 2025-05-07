import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Services.css"; // Adjust the path as necessary

export const Services = (props) => {
  const navigate = useNavigate();
  return (
    <div id="services" className="text-center">
      <div className="container">
        <div className="section-title">
          <h2>Nuestros servicios</h2>
          <p>
            ¿Necesitas un crédito? ¡Utiliza nuestros simuladores !
          </p>
          <div>
            <a className="btn" style={{
                background: 'white', color: '#2e3673', padding: '6px 16px 6px 16px', borderRadius: '6px', fontSize: '20px'
                }}
                onClick={() => navigate("/simuladores")}>
                Iniciar el simulador
              </a>
          </div>
        </div>
        <div className="row">
          {props.data
            ? props.data.map((d, i) => (
                <div key={`${d.name}-${i}`} className="col-md-4">
                  {" "}
                  <i className={d.icon}></i>
                  <div className="service-desc">
                    <h3>{d.name}</h3>
                    <p>{d.text}</p>
                  </div>
                </div>
              ))
            : "loading"}
        </div>
      </div>
    </div>
  );
};
