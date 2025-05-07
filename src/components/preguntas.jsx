import React, { useState } from 'react';
import '../styles/Preguntas.css'; // Asegúrate de crear este archivo CSS

export const Preguntas = () => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event) => {
    setExpanded(expanded === panel ? false : panel);
  };

  return (
    <div className="faq-container">
      <div className="faq-header">
        <div className="faq-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16z" fill="#4a6bff"/>
            <path d="M11 10.5V12h2v-1.5a1.5 1.5 0 10-3 0V12h2a2 2 0 012 2v1a2 2 0 01-2 2h-2a2 2 0 01-2-2v-1h2v1h2v-1a1 1 0 00-1-1h-1a2 2 0 01-2-2v-1.5a3.5 3.5 0 117 0V12h-2v-1.5a1.5 1.5 0 10-3 0zM12 17h.01v2H12v-2z" fill="#4a6bff"/>
          </svg>
        </div>
        <h2 className="faq-title">Preguntas Frecuentes</h2>
      </div>

      <div className="accordion-container">
        <div className={`accordion-item ${expanded === 'panel1' ? 'expanded' : ''}`}>
          <div className="accordion-header" onClick={handleChange('panel1')}>
            <h3 className="question-text">¿Para qué sirve el simulador?</h3>
            <div className="expand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#4a6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="accordion-content">
            <p>Un simulador de crédito se utiliza para estimar las cuotas mensuales y el costo total de un préstamo, así puedes evaluar diferentes opciones antes de tomar una decisión.</p>
          </div>
        </div>

        <div className={`accordion-item ${expanded === 'panel2' ? 'expanded' : ''}`}>
          <div className="accordion-header" onClick={handleChange('panel2')}>
            <h3 className="question-text">¿Los valores son los finales?</h3>
            <div className="expand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#4a6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="accordion-content">
            <p>No, estos son referenciales. Cuando ya lo solicites, te darán el valor final.</p>
          </div>
        </div>

        <div className={`accordion-item ${expanded === 'panel3' ? 'expanded' : ''}`}>
          <div className="accordion-header" onClick={handleChange('panel3')}>
            <h3 className="question-text">¿Puedo simular más de una vez?</h3>
            <div className="expand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 10l5 5 5-5" stroke="#4a6bff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="accordion-content">
            <p>Claro, el simulador está para que revises diferentes opciones de créditos y veas ahí si puedes pagar las cuotas mensuales.</p>
          </div>
        </div>
      </div>
    </div>
  );
};