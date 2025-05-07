// src/components/credito.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Button,
  Box,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { calcularAmortizacion } from "../funciones/amortizacion";

// Datos por defecto en caso de que no existan en localStorage
const DEFAULT_CREDIT_PRODUCTS = [
  {
    id: 1,
    name: "Preciso",
    type: "Consumo",
    interestRate: 15.6,
    minAmount: 300,
    maxAmount: 40000,
    minTerm: 3,
    maxTerm: 22,
  },
  {
    id: 2,
    name: "Línea abierta",
    type: "Consumo",
    interestRate: 13,
    minAmount: 500,
    maxAmount: 50000,
    minTerm: 3,
    maxTerm: 24,
  },
  {
    id: 3,
    name: "Hipotecario vivienda",
    type: "Hipotecario",
    interestRate: 10.75,
    minAmount: 10000,
    maxAmount: 300000,
    minTerm: 12,
    maxTerm: 300,
  },
  {
    id: 4,
    name: "Vivienda de interés público",
    type: "Hipotecario",
    interestRate: 4.87,
    minAmount: 10000,
    maxAmount: 90000,
    minTerm: 12,
    maxTerm: 300,
  },
  {
    id: 5,
    name: "Vivienda de interés social",
    type: "Hipotecario",
    interestRate: 4.87,
    minAmount: 10000,
    maxAmount: 90000,
    minTerm: 12,
    maxTerm: 300,
  },
  {
    id: 6,
    name: "Educación superior",
    type: "Educativo",
    interestRate: 9,
    minAmount: 1000,
    maxAmount: 30000,
    minTerm: 6,
    maxTerm: 72,
  },
];

// Cargos adicionales por defecto
const DEFAULT_ADDITIONAL_CHARGES = [
  {
    id: 1,
    name: "Seguro de desgravamen",
    type: "Seguro",
    rate: 1.0,
    isPercentage: true,
    applicableTo: "Todos",
  },
  {
    id: 2,
    name: "Donación Cruz Roja",
    type: "Donación",
    rate: 2,
    isPercentage: false,
    applicableTo: "Consumo",
  },
  {
    id: 3,
    name: "Seguro contra incendios",
    type: "Seguro",
    rate: 0.5,
    isPercentage: true,
    applicableTo: "Hipotecario",
  },
];

export const Credito = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [creditProducts, setCreditProducts] = useState([]);
  const [additionalCharges, setAdditionalCharges] = useState([]);
  const [institutionInfo, setInstitutionInfo] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedValues, setSelectedValues] = useState({
    method: "f",
    product: "",
    months: 3,
    interestRate: 0,
    capital: "",
    totalInterest: 0,
    insurance: 0,
  });

  const [simulacionRealizada, setSimulacionRealizada] = useState(false);
  const [tablaAmortizacion, setTablaAmortizacion] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos guardados en localStorage
  useEffect(() => {
    try {
      // Cargar productos de crédito
      const savedProducts = localStorage.getItem("creditProducts");
      const products = savedProducts
        ? JSON.parse(savedProducts)
        : DEFAULT_CREDIT_PRODUCTS;
      setCreditProducts(products);

      // Cargar cargos adicionales
      const savedCharges = localStorage.getItem("additionalCharges");
      const charges = savedCharges
        ? JSON.parse(savedCharges)
        : DEFAULT_ADDITIONAL_CHARGES;
      setAdditionalCharges(charges);

      // Cargar información de la institución
      const savedInstitutionInfo = localStorage.getItem("institutionInfo");
      if (savedInstitutionInfo) {
        setInstitutionInfo(JSON.parse(savedInstitutionInfo));
      }

      // Seleccionar el primer producto por defecto
      if (products.length > 0) {
        const firstProduct = products[0];
        setSelectedProduct(firstProduct);
        setSelectedValues((prev) => ({
          ...prev,
          product: firstProduct.name,
          interestRate: firstProduct.interestRate,
          months: firstProduct.minTerm,
        }));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    }
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Validación para deshabilitar el botón de simulación
  const isSimularDisabled = !selectedValues.capital || error;

  // Función para manejar cambios en los campos de entrada
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Si cambia el producto, actualizar los valores relacionados
    if (name === "interestRate") {
      const product = creditProducts.find(
        (p) => p.interestRate === parseFloat(value)
      );
      if (product) {
        setSelectedProduct(product);
        setSelectedValues((prev) => ({
          ...prev,
          product: product.name,
          interestRate: product.interestRate,
          // Reiniciar el plazo al mínimo del producto seleccionado
          months: product.minTerm,
        }));

        // Validar el monto ingresado con los límites del nuevo producto
        if (selectedValues.capital) {
          validateCapital(selectedValues.capital, product);
        }
      }
    } else {
      setSelectedValues((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setSimulacionRealizada(false);
  };

  // Validar el capital según los límites del producto seleccionado
  const validateCapital = (value, product = selectedProduct) => {
    if (!product) return;

    const numericValue = parseFloat(value);

    if (numericValue < product.minAmount && numericValue > 0) {
      setError(`El valor mínimo es ${product.minAmount}`);
    } else if (numericValue > product.maxAmount) {
      setError(`El valor máximo es ${product.maxAmount}`);
    } else {
      setError("");
    }
  };

  // Función para generar y descargar el PDF directamente desde el frontend
  // Función para generar y descargar el PDF directamente desde el frontend
  
  const handleDownload = () => {
    setIsLoading(true);
    
    try {
      // Crear nuevo documento PDF en orientación vertical
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm'
      });
  
      // Configuración de márgenes y posiciones
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginTop = 20;
      let currentY = marginTop;
  
      // Añadir logo de la institución si existe (centrado)
      if (institutionInfo?.logo) {
        const img = new Image();
        img.src = institutionInfo.logo;
        const imgWidth = 35;
        const imgHeight = 35;
        const centerX = (pageWidth - imgWidth) / 2;
        doc.addImage(img, 'PNG', centerX, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 10;
      }
  
      // Título principal (centrado)
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text("Tabla de Amortización", pageWidth / 2, currentY, { align: "center" });
      currentY += 15;
  
      // Subtítulo con método (centrado)
      doc.setFontSize(16);
      doc.text(`Método: ${selectedValues.method === "f" ? "Francés" : "Alemán"}`, pageWidth / 2, currentY, { align: "center" });
      currentY += 10;
  
      // Información del crédito (centrada)
      doc.setFontSize(12);
      
      const creditInfo = [
        `Producto: ${selectedValues.product}`,
        `Plazo: ${selectedValues.months} meses`,
        `Capital: $${parseFloat(selectedValues.capital).toFixed(2)}`,
        `Tasa interés: ${selectedValues.interestRate}%`,
        `Total interés: $${parseFloat(selectedValues.totalInterest).toFixed(2)}`,
        `Total seguro: $${parseFloat(selectedValues.insurance).toFixed(2)}`
      ];
  
      // Centrar información del crédito
      creditInfo.forEach((info, index) => {
        doc.text(info, pageWidth / 2, currentY + (index * 7), { align: "center" });
      });
  
      currentY += (creditInfo.length * 7) + 10;
  
      // Preparar datos para la tabla
      const headers = [
        { title: "Número de Cuota", dataKey: "mes" },
        { title: "Capital", dataKey: "capital" },
        { title: "Interés", dataKey: "interes" },
        { title: "Seguro desgravamen", dataKey: "tasaSeguro" },
        { title: "Cuota", dataKey: "cuota" },
        { title: "Saldo", dataKey: "saldo" }
      ];
  
      const tableData = tablaAmortizacion.map(row => ({
        mes: row.mes.toString(),
        capital: `$${parseFloat(row.capital).toFixed(2)}`,
        interes: `$${parseFloat(row.interes).toFixed(2)}`,
        tasaSeguro: `$${parseFloat(row.tasaSeguro).toFixed(2)}`,
        cuota: `$${(parseFloat(row.capital) + parseFloat(row.interes) + parseFloat(row.tasaSeguro)).toFixed(2)}`,
        saldo: `$${parseFloat(row.saldo).toFixed(2)}`
      }));
  
      // Calcular ancho total de la tabla
      const columnWidths = [35, 25, 25, 25, 25, 30];
      const tableWidth = columnWidths.reduce((a, b) => a + b, 0);
      const tableMargin = (pageWidth - tableWidth) / 2;
  
      // Generar tabla perfectamente centrada
      autoTable(doc, {
        startY: currentY,
        head: [headers.map(header => header.title)],
        body: tableData.map(row => headers.map(header => row[header.dataKey])),
        margin: { left: tableMargin, right: tableMargin },
        tableWidth: tableWidth,
        headStyles: {
          fillColor: institutionInfo?.secondaryColor || [251, 216, 0],
          textColor: [0, 0, 0],
          fontSize: 10,
          fontStyle: 'bold',
          halign: 'center',
          cellPadding: 3
        },
        bodyStyles: {
          fontSize: 9,
          halign: 'center',
          cellPadding: 3
        },
        alternateRowStyles: {
          fillColor: [222, 222, 223]
        },
        columnStyles: columnWidths.reduce((styles, width, index) => {
          styles[index] = { cellWidth: width };
          return styles;
        }, {}),
        styles: {
          lineColor: [0, 0, 0],
          lineWidth: 0.2,
          valign: 'middle'
        },
        didDrawPage: (data) => {
          // Asegurar que la tabla permanezca centrada incluso con múltiples páginas
          if (data.pageCount > 1) {
            doc.setPage(data.pageNumber);
            autoTable(doc, {
              startY: 20, // Posición fija para páginas adicionales
              head: [headers.map(header => header.title)],
              body: data.table.body,
              margin: { left: tableMargin, right: tableMargin },
              tableWidth: tableWidth,
              // ... (mantener mismos estilos)
            });
          }
        }
      });
  
      // Guardar el PDF
      doc.save(`Amortización_${selectedValues.product.replace(/\s+/g, '_')}.pdf`);
  
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el PDF. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validación de entrada para el campo de capital
  const handleCapitalChange = (e) => {
    let value = e.target.value;

    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      setSelectedValues((prev) => ({
        ...prev,
        capital: value === "" ? "" : value,
      }));

      if (value !== "") {
        validateCapital(value);
      } else {
        setError("");
      }

      setSimulacionRealizada(false);
    }
  };

  // Obtener el cargo de seguro de desgravamen
  const getInsuranceRate = () => {
    if (!additionalCharges || additionalCharges.length === 0) return 0.01;

    const insurance = additionalCharges.find(
      (charge) =>
        charge.name === "Seguro de desgravamen" &&
        (charge.applicableTo === "Todos" ||
          charge.applicableTo === selectedProduct?.type)
    );

    return insurance
      ? insurance.isPercentage
        ? insurance.rate / 100
        : insurance.rate
      : 0.01;
  };

  // Función para realizar la simulación
  const handleSimulate = () => {
    if (error || !selectedValues.capital || !selectedProduct) return;

    const { method, interestRate, capital, months } = selectedValues;
    const insuranceRate = getInsuranceRate();
    const totalInsurance = parseFloat(capital) * insuranceRate;

    const [tabla, totalInterest] = calcularAmortizacion(
      method,
      interestRate / 100,
      parseFloat(capital),
      months,
      totalInsurance
    );

    setTablaAmortizacion(tabla);
    setSelectedValues((prev) => ({
      ...prev,
      insurance: totalInsurance.toFixed(2),
      totalInterest,
    }));
    setSimulacionRealizada(true);
  };

  const columns = [
    { id: "mes", label: "Número de cuota", width: "50px" },
    { id: "capital", label: "Capital", width: "150px" },
    { id: "interes", label: "Interés", width: "150px" },
    { id: "tasaSeguro", label: "Seguro desgravamen", width: "150px" },
    { id: "cuota", label: "Cuota", width: "150px" },
    { id: "saldo", label: "Saldo", width: "150px" },
  ];

  const rows = tablaAmortizacion;

  // Generar opciones de plazo basadas en el producto seleccionado
  const getTermOptions = () => {
    if (!selectedProduct) return [];

    const options = [];
    for (let i = selectedProduct.minTerm; i <= selectedProduct.maxTerm; i++) {
      options.push(i);
    }
    return options;
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          ¿Qué crédito necesitas?
        </Typography>
        <FormControl style={{ minWidth: 300 }}>
          <Select
            name="interestRate"
            value={selectedValues.interestRate}
            onChange={handleChange}
            sx={{ fontSize: "medium" }}
          >
            {creditProducts.map((product) => (
              <MenuItem
                key={product.id}
                sx={{ fontSize: "medium" }}
                value={product.interestRate}
              >
                {product.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Typography variant="h4" gutterBottom sx={{ my: 2 }}>
          Ingresa los siguientes datos para empezar la simulación
        </Typography>
      </Container>

      <Container maxWidth="md" sx={{ mt: 3, textAlign: "left" }}>
        <Divider
          sx={{
            my: 2,
            minWidth: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            border: "1px",
          }}
        />

        <Grid container spacing={9}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <Typography
                variant="h6"
                style={{ fontWeight: 800, fontSize: 14 }}
              >
                ¿Cuánto dinero necesitas que te prestemos?
              </Typography>
              <TextField
                variant="outlined"
                placeholder={
                  selectedProduct
                    ? `Min. $${selectedProduct.minAmount.toFixed(2)}`
                    : "Min. $0.00"
                }
                fullWidth
                value={selectedValues.capital}
                onChange={handleCapitalChange}
                inputProps={{ style: { fontSize: 16 } }}
                InputLabelProps={{ style: { fontSize: 16 } }}
                error={!!error}
                helperText={error}
                FormHelperTextProps={{
                  style: { fontSize: "1.2rem", color: "red" },
                }}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <Typography
                variant="h6"
                style={{ fontWeight: 800, fontSize: 14 }}
              >
                ¿En cuánto tiempo quieres pagarlo?
              </Typography>
              <Select
                name="months"
                value={selectedValues.months}
                onChange={handleChange}
                sx={{ fontSize: "medium" }}
              >
                {getTermOptions().map((month) => (
                  <MenuItem
                    key={month}
                    sx={{ fontSize: "medium" }}
                    value={month}
                  >
                    {month} meses
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <Typography
                variant="h6"
                style={{ fontWeight: 800, fontSize: 14 }}
              >
                ¿Cómo quieres pagar tus intereses?
              </Typography>
              <Select
                name="method"
                value={selectedValues.method}
                onChange={handleChange}
                sx={{ fontSize: "medium" }}
              >
                <MenuItem sx={{ fontSize: "medium" }} value="f">
                  Método Francés (Cuotas fijas)
                </MenuItem>
                <MenuItem sx={{ fontSize: "medium" }} value="a">
                  Método Alemán (Cuotas variables)
                </MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
              style={{
                fontSize: 16,
                backgroundColor: isSimularDisabled
                  ? "#e5e5e5"
                  : institutionInfo?.primaryColor || "#2e3673",
              }}
              onClick={handleSimulate}
              disabled={isSimularDisabled}
            >
              Simular
            </Button>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                textAlign: "center",
                backgroundColor: "#f9f9f9",
                p: 2,
                borderRadius: 1,
              }}
            >
              <Typography variant="h4">Tus pagos mensuales serán</Typography>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "2.5rem",
                }}
              >
                <Grid>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    $
                    {simulacionRealizada
                      ? parseFloat(rows[0].capital).toFixed(2)
                      : 0}
                  </Typography>
                  <Typography variant="h6">Capital</Typography>
                </Grid>
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  +
                </Typography>
                <Grid>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    $
                    {simulacionRealizada
                      ? parseFloat(rows[0].interes).toFixed(2)
                      : 0}
                  </Typography>
                  <Typography variant="h6">Interés</Typography>
                </Grid>
                <Typography variant="h5" style={{ fontWeight: 600 }}>
                  +
                </Typography>
                <Grid>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    $
                    {simulacionRealizada
                      ? parseFloat(rows[0].tasaSeguro).toFixed(2)
                      : 0}
                  </Typography>
                  <Typography variant="h6">Seguro</Typography>
                </Grid>
              </div>

              <Typography
                variant="h2"
                sx={{
                  mt: 2,
                  color: institutionInfo?.primaryColor || "primary.main",
                }}
              >
                $
                {simulacionRealizada
                  ? (
                      parseFloat(rows[0].capital) +
                      parseFloat(rows[0].interes) +
                      parseFloat(rows[0].tasaSeguro)
                    ).toFixed(2)
                  : "0.00"}
              </Typography>

              <Typography variant="h6" sx={{ mt: 2 }}>
                Durante{" "}
                <span style={{ fontWeight: 800 }}>
                  {simulacionRealizada
                    ? `${selectedValues.months} meses (${(
                        selectedValues.months / 12
                      ).toPrecision(2)} años)`
                    : "0 meses"}
                </span>
              </Typography>
              <Typography variant="h6">
                Con una tasa de interés referencial{" "}
                <span style={{ fontWeight: 800 }}>
                  {simulacionRealizada ? selectedValues.interestRate : 0}%
                </span>
              </Typography>

              <Divider
                sx={{
                  my: 2,
                  minWidth: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.2)",
                  border: "1px",
                }}
              />

              <Button
                variant="outlined"
                fullWidth
                onClick={handleOpen}
                sx={{ my: 2 }}
                style={{
                  fontSize: 16,
                  color: "#fff",
                  backgroundColor: institutionInfo?.primaryColor || "#333",
                  display: simulacionRealizada ? "inline-block" : "none",
                }}
              >
                Ver tabla de amortización
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="x">
          <DialogTitle>
            <div
              style={{
                textAlign: "center",
              }}
            >
              <img
                src={institutionInfo?.logo || "./img/encabezado.png"}
                alt="Encabezado"
                style={{
                  width: "150px", // Tamaño estándar fijo
                  maxWidth: "100%", // Responsivo
                  height: "auto", // Mantiene proporciones
                }}
              />
            </div>
          </DialogTitle>

          <DialogContent
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              minHeight: "55vh",
            }}
          >
            <Typography variant="h3">Tabla de Amortización</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              Método: {selectedValues.method == "f" ? "Francés" : "Alemán"}
            </Typography>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                textAlign: "left",
                width: "45%",
                marginLeft: "10%",
              }}
            >
              <Typography style={{ fontSize: "1.8rem" }}>
                <strong>Producto:</strong> {selectedValues.product}
              </Typography>
              <Typography style={{ fontSize: "1.8rem" }}>
                <strong>Plazo (meses):</strong> {selectedValues.months}
              </Typography>
              <Typography style={{ fontSize: "1.8rem" }}>
                <strong>Tasa de interés nominal:</strong>{" "}
                {selectedValues.interestRate}%
              </Typography>
              <Typography style={{ fontSize: "1.8rem" }}>
                <strong>Capital:</strong> ${selectedValues.capital}
              </Typography>
              <Typography style={{ fontSize: "1.8rem" }}>
                <strong>Total de interés:</strong> $
                {selectedValues.totalInterest}
              </Typography>
              <Typography style={{ fontSize: "1.8rem" }}>
                <strong>Total seguro de desgravamen:</strong> $
                {selectedValues.insurance}
              </Typography>
            </div>

            <TableContainer component={Paper} sx={{ maxHeight: "60vh" }}>
              <Table stickyHeader aria-label="Amortización">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          fontSize: "1.6rem",
                          textAlign: "center",
                          fontWeight: "800",
                          border: "1px solid black",
                          backgroundColor:
                            institutionInfo?.secondaryColor || "#fbd800",
                          width: column.width || "auto",
                          position: "sticky",
                          top: 0,
                          zIndex: 1,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        backgroundColor:
                          index % 2 === 0 ? "#dededf" : "#FAFAFA",
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          sx={{
                            fontSize: "1.6rem",
                            textAlign: "center",
                            border: "1px solid black",
                            width: column.width || "auto",
                          }}
                        >
                          {row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Button
              sx={{
                m: 2,
                fontSize: 16,
                backgroundColor: institutionInfo?.primaryColor || "#2e3673",
                color: "white",
                width: "250px",
              }}
              onClick={handleDownload}
              disabled={isLoading}
            >
              {isLoading ? "Generando PDF..." : "Descargar tabla"}
            </Button>
            {isLoading && (
              <div className="modal">
                <div className="modal-content">
                  <p>⏳Generando PDF, por favor espera...</p>
                </div>
              </div>
            )}
            <style>
              {`
                /* Estilos básicos para el modal */
                .modal {
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background: rgba(0, 0, 0, 0.5);
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  z-index: 1000;
                }
                .modal-content {
                  background: white;
                  padding: 20px;
                  border-radius: 8px;
                  text-align: center;
                }
              `}
            </style>
          </DialogContent>
        </Dialog>
      </Container>
    </div>
  );
};