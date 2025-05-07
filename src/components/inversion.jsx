// src/components/inversion.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, TextField, FormControl, RadioGroup, FormControlLabel, Radio, Box, Divider, Grid, Button, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

const DEFAULT_INVESTMENT_RATES = [
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

// Función auxiliar para obtener la tasa de interés según el plazo y monto
const getInterestRate = (term, amount, investmentRates) => {
  const termInDays = term;
  
  let termRangeIndex = -1;
  
  for (let i = 0; i < investmentRates.length; i++) {
    const rangeStr = investmentRates[i].termRange;
    const matches = rangeStr.match(/(\d+) a (\d+)/);
    
    if (matches && matches.length >= 3) {
      const minDays = parseInt(matches[1], 10);
      const maxDays = parseInt(matches[2], 10);
      
      if (termInDays >= minDays && termInDays <= maxDays) {
        termRangeIndex = i;
        break;
      }
    }
  }
  
  if (termRangeIndex === -1) return null;
  
  const rates = investmentRates[termRangeIndex].rates;
  
  for (let i = 0; i < rates.length; i++) {
    const rangeStr = rates[i].amountRange;
    const matches = rangeStr.match(/\$([0-9,]+(?:\.[0-9]+)?) - \$([0-9,]+(?:\.[0-9]+)?)/);
    
    if (matches && matches.length >= 3) {
      const minAmount = parseFloat(matches[1].replace(/,/g, ''));
      const maxAmount = parseFloat(matches[2].replace(/,/g, ''));
      
      if (amount >= minAmount && amount <= maxAmount) {
        return rates[i].rate;
      }
    }
  }
  
  return null;
};

// Función para calcular la inversión
const calcularInversión = (plazo, monto, investmentRates) => {
  const tasaAnual = getInterestRate(plazo, monto, investmentRates);
  
  if (tasaAnual === null) {
    return null;
  }
  
  const interes = monto * (tasaAnual / 100) * (plazo / 360);
  const valorFuturo = monto + interes;
  
  return {
    plazo,
    monto,
    tasa: tasaAnual,
    interes: interes.toFixed(2),
    valorFuturo: valorFuturo.toFixed(2)
  };
};

export const Inversion = () => {
  const [selectedValues, setSelectedValues] = useState({
    capital: '',
    term: '',
    termType: 'days',
  });
  
  const [calculedValues, setCalculedValues] = useState({
    plazo: 0,
    monto: 0,
    tasa: 0,
    interes: 0,
    valorFuturo: 0
  });
  
  const [error, setError] = useState('');
  const [termError, setTermError] = useState('');
  const [openInterestRates, setOpenInterestRates] = useState(false);
  const [investmentRates, setInvestmentRates] = useState([]);
  const [institutionInfo, setInstitutionInfo] = useState(null);
  
  useEffect(() => {
    try {
      const savedRates = localStorage.getItem('investmentRates');
      if (savedRates) {
        setInvestmentRates(JSON.parse(savedRates));
      } else {
        setInvestmentRates(DEFAULT_INVESTMENT_RATES);
      }
      
      const savedInfo = localStorage.getItem('institutionInfo');
      if (savedInfo) {
        setInstitutionInfo(JSON.parse(savedInfo));
      }
    } catch (error) {
      console.error('Error loading investment rates:', error);
      setInvestmentRates(DEFAULT_INVESTMENT_RATES);
    }
  }, []);

  const isSimularDisabled = !selectedValues.capital || !selectedValues.term || error || termError;

  const handleCapitalChange = (e) => {
    let value = e.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      const numericValue = parseFloat(value);
      if (numericValue < 500 && numericValue > 0) {
        setError('El valor mínimo es 500.00');
      } else if (numericValue > 1000000) {
        setError('El valor máximo es 1,000,000.00');
      } else {
        setError('');
      }
      setSelectedValues((prevState) => ({
        ...prevState,
        capital: value === '' ? '' : value,
      }));
    }
    setCalculedValues({
      plazo: 0,
      monto: 0,
      tasa: 0,
      interes: 0,
      valorFuturo: 0
    });
  };

  const handleTermChange = (e) => {
    let value = e.target.value;
    if (/^\d*$/.test(value)) {
      const numericValue = parseInt(value, 10);
      if (selectedValues.termType === 'days') {
        if (numericValue < 31 && numericValue > 0) {
          setTermError('El plazo mínimo es de 31 días.');
        } else if (numericValue > 720) {
          setTermError('El plazo máximo es de 720 días.');
        } else {
          setTermError('');
        }
      } else {
        if (numericValue < 1 && numericValue > 0) {
          setTermError('El plazo mínimo es de 1 mes.');
        } else if (numericValue > 24) {
          setTermError('El plazo máximo es de 24 meses.');
        } else {
          setTermError('');
        }
      }
      setSelectedValues((prevState) => ({
        ...prevState,
        term: value === '' ? '' : value,
      }));
    }
    setCalculedValues({
      plazo: 0,
      monto: 0,
      tasa: 0,
      interes: 0,
      valorFuturo: 0
    });
  };

  const handleTermTypeChange = (e) => {
    setSelectedValues((prevState) => ({
      ...prevState,
      termType: e.target.value,
      term: '',
    }));
    setTermError('');
  };

  const handleOpenInterestRates = () => {
    setOpenInterestRates(true);
  };

  const handleCloseInterestRates = () => {
    setOpenInterestRates(false);
  };

  const simularInversion = () => {
    let plazo = parseInt(selectedValues.term);
    if (selectedValues.termType === 'months') {
      plazo = plazo * 30;
    }
    const monto = parseFloat(selectedValues.capital);
    const resultado = calcularInversión(plazo, monto, investmentRates);
    
    if (resultado === null) {
      setError('El plazo o monto ingresado no está dentro de los rangos permitidos');
      setCalculedValues({
        plazo: 0,
        monto: 0,
        tasa: 0,
        interes: 0,
        valorFuturo: 0
      });
    } else {
      setError('');
      setCalculedValues(resultado);
    }
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom>
          Invierte con nosotros
        </Typography>
        <Divider sx={{ my: 2, minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px' }} />
        <Typography variant="h4" gutterBottom sx={{ my: 2 }}>
          Ingresa los siguientes datos para empezar la simulación
        </Typography>
        <Divider sx={{ my: 2, minWidth: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)', border: '1px' }} />
      </Container>
      <Grid container spacing={1} maxWidth={'md'} sx={{ margin: '0 auto', alignItems: 'center' }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6" style={{ fontWeight: 800, fontSize: 14 }}>
                ¿Cuánto dinero deseas invertir?
              </Typography>
              <TextField
                variant="outlined"
                placeholder="Min. $500.00"
                fullWidth
                value={selectedValues.capital}
                onChange={handleCapitalChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 16 } }}
                error={!!error}
                helperText={error}
                FormHelperTextProps={{
                  style: { fontSize: '1.2rem', color: 'red' },
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography variant="h6" style={{ fontWeight: 800, fontSize: 14 }}>
                ¿Cuánto tiempo deseas tener en plazo tu inversión?
              </Typography>
              <RadioGroup
                row
                value={selectedValues.termType}
                onChange={handleTermTypeChange}
                sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}
              >
                <FormControlLabel
                  value="days"
                  control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                  label="Días"
                  sx={{ '.MuiFormControlLabel-label': { fontSize: '1.5rem' } }}
                />
                <FormControlLabel
                  value="months"
                  control={<Radio sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }} />}
                  label="Meses"
                  sx={{ '.MuiFormControlLabel-label': { fontSize: '1.5rem' } }}
                />
              </RadioGroup>
              <TextField
                variant="outlined"
                placeholder={`Min. ${selectedValues.termType === 'days' ? '31 días' : '1 mes'}`}
                fullWidth
                value={selectedValues.term}
                onChange={handleTermChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 16 } }}
                error={!!termError}
                helperText={termError}
                FormHelperTextProps={{
                  style: { fontSize: '1.2rem', color: 'red' },
                }}
              />
            </FormControl>
            <Typography 
              style={{ fontSize: 14, fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontStyle: 'italic' }} 
              sx={{ mt: 1 }}
              onClick={handleOpenInterestRates}
            >
              Nuestras tasas de interés*
            </Typography>
            <Button 
              onClick={simularInversion}
              variant="contained" 
              fullWidth 
              sx={{ mt: 3 }} 
              style={{ 
                fontSize: 16, 
                backgroundColor: isSimularDisabled ? '#e5e5e5' : (institutionInfo?.primaryColor || '#2e3673') 
              }}
              disabled={isSimularDisabled}
            >
              Simular
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: 'center', backgroundColor: '#f6f6f6', borderRadius: '5%' }}>
          <Typography style={{ fontSize: 20 }}>
            En <strong>{!isSimularDisabled ? (selectedValues.termType === 'days' ? calculedValues.plazo : Math.round(calculedValues.plazo / 30)) : '0'} {selectedValues.termType === 'days' ? 'días' : 'meses'}</strong> | Tasa <strong>{!isSimularDisabled ? calculedValues.tasa : '0'}%</strong>
          </Typography>
          <Typography variant="h2" style={{ fontWeight: 700, fontSize: 40, margin: '8px 0' }}>
            Ganas: <strong>${!isSimularDisabled ? calculedValues.interes : '0'}</strong>
          </Typography>
          <Typography style={{ fontSize: 25 }}>
            Recibes al final: <strong>${!isSimularDisabled ? calculedValues.valorFuturo : '0'}</strong>
          </Typography>
        </Grid>
      </Grid>

      <Dialog open={openInterestRates} onClose={handleCloseInterestRates} maxWidth="md" fullWidth sx={{ textAlign: 'center' }}>
        <DialogTitle>
          <div style={{ textAlign: 'center', backgroundColor: institutionInfo?.secondaryColor || '#fbd800' }}>
            <img src={institutionInfo?.logo || './img/encabezado.png'} alt="Encabezado" style={{ width: '10%' }} />
          </div>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h3" gutterBottom>
            Tasas de interés
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontSize: '1.4rem', fontWeight: 'bold', width: '130px', textAlign: 'center', backgroundColor: institutionInfo?.secondaryColor || '#fbd800' }}>Plazo</TableCell>
                  {investmentRates.length > 0 && investmentRates[0].rates.map((rate, index) => (
                    <TableCell key={index} sx={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'center', backgroundColor: '#dededf' }}>{rate.amountRange}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {investmentRates.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ fontSize: '1.3rem', fontWeight: 'bold', width: '130px', textAlign: 'center', backgroundColor: '#dededf' }}>{item.termRange}</TableCell>
                    {item.rates.map((rate, subIndex) => (
                      <TableCell key={subIndex} sx={{ fontSize: '1.5rem', textAlign: 'center' }}>{rate.rate}%</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </div>
  );
};