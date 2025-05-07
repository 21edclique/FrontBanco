// src/funciones/inversiones.js

// Carga los datos guardados de inversiones
const loadInvestmentRates = () => {
    try {
      const saved = localStorage.getItem('investmentRates');
      if (saved) {
        return JSON.parse(saved);
      }
      // Si no hay datos guardados, usa los valores por defecto
      return [
        { 
          id: 1, 
          termRange: '31 a 60 días', 
          rates: [
            { amountRange: '$500 - $4,999.99', rate: 4.20 },
            { amountRange: '$5,000 - $9,999.99', rate: 4.80 },
            { amountRange: '$10,000 - $49,999.99', rate: 6.50 },
            { amountRange: '$50,000 - $99,999.99', rate: 6.60 },
            { amountRange: '$100,000 - $199,999.99', rate: 6.70 },
            { amountRange: '$200,000 - $499,999.99', rate: 6.85 },
            { amountRange: '$500,000 - $1,000,000.00', rate: 6.90 },
          ]
        },
        { 
          id: 2, 
          termRange: '61 a 90 días', 
          rates: [
            { amountRange: '$500 - $4,999.99', rate: 4.30 },
            { amountRange: '$5,000 - $9,999.99', rate: 4.90 },
            { amountRange: '$10,000 - $49,999.99', rate: 6.60 },
            { amountRange: '$50,000 - $99,999.99', rate: 6.70 },
            { amountRange: '$100,000 - $199,999.99', rate: 6.80 },
            { amountRange: '$200,000 - $499,999.99', rate: 6.90 },
            { amountRange: '$500,000 - $1,000,000.00', rate: 7.00 },
          ]
        },
      ];
    } catch (error) {
      console.error('Error loading investment rates:', error);
      return [];
    }
  };
  
  // Obtiene la tasa de interés para un plazo y monto específicos
  const getInterestRate = (plazo, monto) => {
    const investmentRates = loadInvestmentRates();
    
    // Busca el rango de plazo adecuado
    let rangoIndex = -1;
    
    for (let i = 0; i < investmentRates.length; i++) {
      const rangeStr = investmentRates[i].termRange;
      const matches = rangeStr.match(/(\d+) a (\d+)/);
      
      if (matches && matches.length >= 3) {
        const minDays = parseInt(matches[1], 10);
        const maxDays = parseInt(matches[2], 10);
        
        if (plazo >= minDays && plazo <= maxDays) {
          rangoIndex = i;
          break;
        }
      }
    }
    
    // Si no encontramos un rango adecuado y tenemos datos, usamos la tasa del rango más cercano
    if (rangoIndex === -1 && investmentRates.length > 0) {
      // Ordenamos los rangos por días
      const rangesByDays = investmentRates.map(item => {
        const matches = item.termRange.match(/(\d+) a (\d+)/);
        if (matches && matches.length >= 3) {
          const minDays = parseInt(matches[1], 10);
          const maxDays = parseInt(matches[2], 10);
          return { item, avgDays: (minDays + maxDays) / 2 };
        }
        return { item, avgDays: 0 };
      }).sort((a, b) => a.avgDays - b.avgDays);
      
      // Encontramos el más cercano
      let closestDiff = Infinity;
      rangesByDays.forEach((range, index) => {
        const diff = Math.abs(range.avgDays - plazo);
        if (diff < closestDiff) {
          closestDiff = diff;
          rangoIndex = index;
        }
      });
      
      if (rangoIndex !== -1) {
        rangoIndex = investmentRates.findIndex(item => item.id === rangesByDays[rangoIndex].item.id);
      }
    }
    
    // Si aún no encontramos un rango, retornamos 0
    if (rangoIndex === -1 || !investmentRates[rangoIndex].rates) return 0;
    
    // Busca el rango de monto adecuado
    const rates = investmentRates[rangoIndex].rates;
    
    for (let i = 0; i < rates.length; i++) {
      const rangeStr = rates[i].amountRange;
      const matches = rangeStr.match(/\$([0-9,]+(?:\.[0-9]+)?) - \$([0-9,]+(?:\.[0-9]+)?)/);
      
      if (matches && matches.length >= 3) {
        const minAmount = parseFloat(matches[1].replace(/,/g, ''));
        const maxAmount = parseFloat(matches[2].replace(/,/g, ''));
        
        if (monto >= minAmount && monto <= maxAmount) {
          return rates[i].rate;
        }
      }
    }
    
    // Si no encontramos un rango de monto adecuado, pero hay rangos definidos
    if (rates.length > 0) {
      // Si el monto es menor que el mínimo del primer rango, usa la tasa del primer rango
      const firstRangeStr = rates[0].amountRange;
      const firstMatches = firstRangeStr.match(/\$([0-9,]+(?:\.[0-9]+)?) - \$([0-9,]+(?:\.[0-9]+)?)/);
      if (firstMatches && firstMatches.length >= 3) {
        const minAmount = parseFloat(firstMatches[1].replace(/,/g, ''));
        if (monto < minAmount) {
          return rates[0].rate;
        }
      }
      
      // Si el monto es mayor que el máximo del último rango, usa la tasa del último rango
      const lastRangeStr = rates[rates.length - 1].amountRange;
      const lastMatches = lastRangeStr.match(/\$([0-9,]+(?:\.[0-9]+)?) - \$([0-9,]+(?:\.[0-9]+)?)/);
      if (lastMatches && lastMatches.length >= 3) {
        const maxAmount = parseFloat(lastMatches[2].replace(/,/g, ''));
        if (monto > maxAmount) {
          return rates[rates.length - 1].rate;
        }
      }
    }
    
    return 0;
  };
  
  // Calcula la inversión con los parámetros proporcionados
  export const calcularInversión = (plazo, monto) => {
    // Obtiene la tasa anual según el plazo y monto
    const tasaAnual = getInterestRate(plazo, monto);
    
    // Calcula el interés: Monto * tasa anual * (plazo / 360)
    const interes = monto * (tasaAnual / 100) * (plazo / 360);
    
    // Valor futuro: Monto + Interés
    const valorFuturo = monto + interes;
    
    return {
      plazo,
      monto,
      tasa: tasaAnual,
      interes: interes.toFixed(2),
      valorFuturo: valorFuturo.toFixed(2)
    };
  };