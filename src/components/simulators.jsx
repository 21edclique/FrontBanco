import React, { useState } from "react";
import { Navigation } from "./navigation";
import { Header } from "./header";
import { Contact } from "./contact";
import { Credito } from "./credito";
import { Inversion } from "./inversion";
import { Preguntas } from "./preguntas";
import "../styles/Simulators.css"; 

export const Simulators = ({ data }) => {
  const [activeTab, setActiveTab] = useState("credit");

  return (
    <div className="simulators-page">
      <Navigation />
      <Header data={data.HeaderSim} />

      <div className="simulator-section">
        <div className="tabs-container">
          <div className="tabs-header">
            <h2 className="tabs-title"> Simuladores</h2>
            <p className="tabs-subtitle">Selecciona el tipo de simulador que necesitas</p>
          </div>
          
          <div className="tabs-navigation">
            <button
              className={`tab-button ${activeTab === "credit" ? "active" : ""}`}
              onClick={() => setActiveTab("credit")}
            >
              <div className="tab-icon credit-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 14H3V4H21V14ZM21 2H3C1.9 2 1 2.9 1 4V14C1 15.1 1.9 16 3 16H21C22.1 16 23 15.1 23 14V4C23 2.9 22.1 2 21 2ZM15 6H17V7H15V6ZM15 8H17V9H15V8ZM15 10H17V11H15V10ZM9 6H13V11H9V6ZM5 10H7V11H5V10ZM5 8H7V9H5V8ZM5 6H7V7H5V6ZM3 18H21V20H3V18Z" fill="currentColor"/>
                </svg>
              </div>
              <span>Créditos</span>
            </button>
            <button
              className={`tab-button ${activeTab === "investment" ? "active" : ""}`}
              onClick={() => setActiveTab("investment")}
            >
              <div className="tab-icon investment-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.5 18.49L9.5 12.48L13.5 16.48L22 6.92L20.59 5.51L13.5 13.48L9.5 9.48L2 16.99L3.5 18.49Z" fill="currentColor"/>
                </svg>
              </div>
              <span>Inversiones</span>
            </button>
          </div>

          <div className="tab-content-wrapper">
            <div className={`tab-content ${activeTab === "credit" ? "visible" : "hidden"}`}>
              <Credito />
            </div>
            <div className={`tab-content ${activeTab === "investment" ? "visible" : "hidden"}`}>
              <Inversion />
            </div>
          </div>
        </div>
      </div>
      
      <Preguntas />
      <Contact data={data.Contact} />
    </div>
  );
};