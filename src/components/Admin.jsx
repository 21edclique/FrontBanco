import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Divider,
  Avatar,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Chip,
  colors,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  Save as SaveIcon,
  ColorLens as ColorLensIcon,
  Image as ImageIcon,
  MonetizationOn as MonetizationOnIcon,
  CreditCard as CreditCardIcon,
  AttachMoney as AttachMoneyIcon,
  AccountCircle as AccountCircleIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

// Custom Confirmation Dialog Component
const ConfirmationDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  severity = "warning"
}) => {
  const theme = useTheme();
  
  const getSeverityIcon = () => {
    switch(severity) {
      case 'error': return <ErrorIcon fontSize="large" />;
      case 'warning': return <WarningIcon fontSize="large" />;
      case 'info': return <InfoIcon fontSize="large" />;
      case 'success': return <CheckCircleIcon fontSize="large" />;
      default: return <InfoIcon fontSize="large" />;
    }
  };

  const getSeverityColor = () => {
    switch(severity) {
      case 'error': return theme.palette.error.main;
      case 'warning': return theme.palette.warning.main;
      case 'info': return theme.palette.info.main;
      case 'success': return theme.palette.success.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: getSeverityColor(),
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
      }}>
        {getSeverityIcon()}
        {title}
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="body1">{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'action.hover',
            }
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            onClose();
          }}
          variant="contained"
          sx={{
            backgroundColor: getSeverityColor(),
            color: 'white',
            '&:hover': {
              backgroundColor: getSeverityColor(),
              opacity: 0.9,
            }
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Datos por defecto
const DEFAULT_INSTITUTION = {
  name: "Mi Banco",
  slogan: "Tu mejor opción financiera",
  logo: "/img/encabezado.png",
  primaryColor: "#2e3673",
  secondaryColor: "#fbd800",
};

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
];

const DEFAULT_INVESTMENT_RATES = [
  {
    id: 1,
    termRange: "31 a 60 días",
    rates: [
      { amountRange: "$500 - $4,999.99", rate: 4.2 },
    ],
  },
];

const DEFAULT_ADDITIONAL_CHARGES = [
  {
    id: 1,
    name: "Seguro de desgravamen",
    type: "Seguro",
    rate: 1.0,
    isPercentage: true,
    applicableTo: "Todos",
  },
];

const Admin = () => {
  const theme = useTheme();
  
  // States for notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  
  // States for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: () => {},
    severity: 'warning',
  });

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Show confirmation dialog
  const showConfirmDialog = (title, message, onConfirm, severity = 'warning') => {
    setConfirmDialog({
      open: true,
      title,
      message,
      onConfirm,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Close confirmation dialog
  const handleCloseConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, open: false }));
  };

  // Cargar datos guardados o usar los por defecto
  const loadData = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (error) {
      console.error(`Error loading ${key}:`, error);
      return defaultValue;
    }
  };

  // Tabs state
  const [tabIndex, setTabIndex] = useState(0);

  // Institution information state
  const [institutionInfo, setInstitutionInfo] = useState(
    loadData("institutionInfo", DEFAULT_INSTITUTION)
  );

  // Credit products state
  const [creditProducts, setCreditProducts] = useState(
    loadData("creditProducts", DEFAULT_CREDIT_PRODUCTS)
  );

  // Investment products state
  const [investmentRates, setInvestmentRates] = useState(
    loadData("investmentRates", DEFAULT_INVESTMENT_RATES)
  );

  // Additional charges state
  const [additionalCharges, setAdditionalCharges] = useState(
    loadData("additionalCharges", DEFAULT_ADDITIONAL_CHARGES)
  );

  // Users state
  const [users, setUsers] = useState([]);

  // Form dialogs state
  const [openCreditDialog, setOpenCreditDialog] = useState(false);
  const [openChargeDialog, setOpenChargeDialog] = useState(false);
  const [openInvestmentDialog, setOpenInvestmentDialog] = useState(false);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentCharge, setCurrentCharge] = useState(null);
  const [currentInvestment, setCurrentInvestment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/usuarios");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      showSnackbar("Error al cargar usuarios", 'error');
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Guardar datos en localStorage
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Handle institution info change
  const handleInstitutionChange = (e) => {
    const { name, value } = e.target;
    const updatedInfo = {
      ...institutionInfo,
      [name]: value,
    };
    setInstitutionInfo(updatedInfo);
    saveData("institutionInfo", updatedInfo);
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoUrl = reader.result;
        setLogoPreview(logoUrl);
        const updatedInfo = {
          ...institutionInfo,
          logo: logoUrl,
        };
        setInstitutionInfo(updatedInfo);
        saveData("institutionInfo", updatedInfo);
      };
      reader.readAsDataURL(file);
    }
  };

  // Save institution info
  const saveInstitutionInfo = () => {
    saveData("institutionInfo", institutionInfo);
    showSnackbar("Información de la institución guardada con éxito", 'success');
  };

  // Logout function
  const handleLogout = () => {
    showConfirmDialog(
      "Cerrar sesión",
      "¿Estás seguro de que deseas cerrar tu sesión?",
      () => {
        window.location.href = "/login";
      },
      'warning'
    );
  };

  // User management functions
  const handleOpenUserDialog = (user = null) => {
    setIsEditing(!!user);
    setCurrentUser(
      user || {
        nombre: "",
        apellido: "",
        correo: "",
        password: "",
      }
    );
    setOpenUserDialog(true);
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({
      ...currentUser,
      [name]: value,
    });
  };

  const saveUser = async () => {
    try {
      const url = isEditing
        ? `http://localhost:5000/api/usuarios/${currentUser.idusuarios}`
        : "http://localhost:5000/api/usuarios";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al guardar usuario");
      }

      const result = await response.json();
      showSnackbar(result.message || "Usuario guardado con éxito", 'success');
      setOpenUserDialog(false);
      fetchUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showSnackbar(error.message || "Error al guardar usuario", 'error');
    }
  };

  const deleteUser = (idusuarios) => {
    showConfirmDialog(
      "Eliminar usuario",
      "¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.",
      async () => {
        try {
          const response = await fetch(
            `http://localhost:5000/api/usuarios/${idusuarios}`,
            {
              method: "DELETE",
            }
          );

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Error al eliminar usuario");
          }

          const result = await response.json();
          showSnackbar(result.message || "Usuario eliminado con éxito", 'success');
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          showSnackbar(error.message || "Error al eliminar usuario", 'error');
        }
      },
      'error'
    );
  };

  // Open credit product dialog
  const handleOpenCreditDialog = (product = null) => {
    setIsEditing(!!product);
    setCurrentProduct(
      product || {
        name: "",
        type: "Consumo",
        interestRate: 0,
        minAmount: 0,
        maxAmount: 0,
        minTerm: 0,
        maxTerm: 0,
      }
    );
    setOpenCreditDialog(true);
  };

  // Handle credit product form change
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({
      ...currentProduct,
      [name]:
        name === "interestRate" ||
        name === "minAmount" ||
        name === "maxAmount" ||
        name === "minTerm" ||
        name === "maxTerm"
          ? parseFloat(value)
          : value,
    });
  };

  // Save credit product
  const saveCreditProduct = () => {
    let updatedProducts;
    if (isEditing) {
      updatedProducts = creditProducts.map((p) =>
        p.id === currentProduct.id ? currentProduct : p
      );
    } else {
      updatedProducts = [
        ...creditProducts,
        { ...currentProduct, id: Date.now() },
      ];
    }

    setCreditProducts(updatedProducts);
    saveData("creditProducts", updatedProducts);
    setOpenCreditDialog(false);
    showSnackbar(
      `Producto ${isEditing ? 'actualizado' : 'creado'} correctamente`,
      'success'
    );
  };

  // Delete credit product
  const deleteCreditProduct = (id) => {
    showConfirmDialog(
      "Eliminar producto",
      "¿Estás seguro de que deseas eliminar este producto de crédito?",
      () => {
        const updatedProducts = creditProducts.filter((p) => p.id !== id);
        setCreditProducts(updatedProducts);
        saveData("creditProducts", updatedProducts);
        showSnackbar("Producto eliminado correctamente", 'success');
      },
      'warning'
    );
  };

  // Open additional charge dialog
  const handleOpenChargeDialog = (charge = null) => {
    setIsEditing(!!charge);
    setCurrentCharge(
      charge || {
        name: "",
        type: "Seguro",
        rate: 0,
        isPercentage: true,
        applicableTo: "Todos",
      }
    );
    setOpenChargeDialog(true);
  };

  // Handle additional charge form change
  const handleChargeChange = (e) => {
    const { name, value } = e.target;
    setCurrentCharge({
      ...currentCharge,
      [name]:
        name === "rate"
          ? parseFloat(value)
          : name === "isPercentage"
          ? value === "true"
          : value,
    });
  };

  // Save additional charge
  const saveAdditionalCharge = () => {
    let updatedCharges;
    if (isEditing) {
      updatedCharges = additionalCharges.map((c) =>
        c.id === currentCharge.id ? currentCharge : c
      );
    } else {
      updatedCharges = [
        ...additionalCharges,
        { ...currentCharge, id: Date.now() },
      ];
    }

    setAdditionalCharges(updatedCharges);
    saveData("additionalCharges", updatedCharges);
    setOpenChargeDialog(false);
    showSnackbar(
      `Cargo adicional ${isEditing ? 'actualizado' : 'creado'} correctamente`,
      'success'
    );
  };

  // Delete additional charge
  const deleteAdditionalCharge = (id) => {
    showConfirmDialog(
      "Eliminar cargo adicional",
      "¿Estás seguro de que deseas eliminar este cargo adicional?",
      () => {
        const updatedCharges = additionalCharges.filter((c) => c.id !== id);
        setAdditionalCharges(updatedCharges);
        saveData("additionalCharges", updatedCharges);
        showSnackbar("Cargo adicional eliminado correctamente", 'success');
      },
      'warning'
    );
  };

  // Open investment rate dialog
  const handleOpenInvestmentDialog = (investment = null) => {
    setIsEditing(!!investment);
    setCurrentInvestment(
      investment || {
        termRange: "",
        rates: [
          { amountRange: "$500 - $4,999.99", rate: 0 },
          { amountRange: "$5,000 - $9,999.99", rate: 0 },
          { amountRange: "$10,000 - $49,999.99", rate: 0 },
          { amountRange: "$50,000 - $99,999.99", rate: 0 },
          { amountRange: "$100,000 - $199,999.99", rate: 0 },
          { amountRange: "$200,000 - $499,999.99", rate: 0 },
          { amountRange: "$500,000 - $1,000,000.00", rate: 0 },
        ],
      }
    );
    setOpenInvestmentDialog(true);
  };

  // Handle investment rate form change
  const handleInvestmentChange = (e) => {
    const { name, value } = e.target;
    setCurrentInvestment({
      ...currentInvestment,
      [name]: name === "termRange" ? value : currentInvestment[name],
    });
  };

  // Handle investment rate change
  const handleRateChange = (index, rate) => {
    const updatedRates = [...currentInvestment.rates];
    updatedRates[index].rate = parseFloat(rate);
    setCurrentInvestment({
      ...currentInvestment,
      rates: updatedRates,
    });
  };

  // Save investment rate
  const saveInvestmentRate = () => {
    let updatedRates;
    if (isEditing) {
      updatedRates = investmentRates.map((i) =>
        i.id === currentInvestment.id ? currentInvestment : i
      );
    } else {
      updatedRates = [
        ...investmentRates,
        { ...currentInvestment, id: Date.now() },
      ];
    }

    setInvestmentRates(updatedRates);
    saveData("investmentRates", updatedRates);
    setOpenInvestmentDialog(false);
    showSnackbar(
      `Tasa de inversión ${isEditing ? 'actualizada' : 'creada'} correctamente`,
      'success'
    );
  };

  // Delete investment rate
  const deleteInvestmentRate = (id) => {
    showConfirmDialog(
      "Eliminar tasa de inversión",
      "¿Estás seguro de que deseas eliminar este rango de tasas de inversión?",
      () => {
        const updatedRates = investmentRates.filter((i) => i.id !== id);
        setInvestmentRates(updatedRates);
        saveData("investmentRates", updatedRates);
        showSnackbar("Tasa de inversión eliminada correctamente", 'success');
      },
      'warning'
    );
  };

  // Función para guardar todos los datos
  const saveAllData = () => {
    saveData("institutionInfo", institutionInfo);
    saveData("creditProducts", creditProducts);
    saveData("investmentRates", investmentRates);
    saveData("additionalCharges", additionalCharges);
    showSnackbar("Todos los datos han sido guardados correctamente", 'success');
  };

  // Styles
  const primaryButtonStyle = {
    backgroundColor: theme.palette.primary.main,
    color: "white",
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: 1,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  };

  const secondaryButtonStyle = {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: 1,
    '&:hover': {
      borderColor: theme.palette.primary.dark,
      backgroundColor: theme.palette.action.hover,
    }
  };

  const dialogStyle = {
    '& .MuiDialog-paper': {
      borderRadius: 2,
      minWidth: '500px',
    },
    '& .MuiDialogTitle-root': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      fontWeight: 'bold',
      padding: '16px 24px',
    },
    '& .MuiDialogContent-root': {
      padding: '20px 24px',
    },
    '& .MuiDialogActions-root': {
      padding: '16px 24px',
      borderTop: '1px solid #eee',
    },
  };

  const getProductTypeColor = (type) => {
    switch (type) {
      case 'Consumo': return colors.blue[500];
      case 'Hipotecario': return colors.green[500];
      case 'Educativo': return colors.purple[500];
      case 'Microcrédito': return colors.orange[500];
      default: return colors.grey[500];
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
   {/* Confirmation Dialog */}
      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={handleCloseConfirmDialog}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
      />

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          iconMapping={{
            success: <CheckCircleIcon fontSize="inherit" />,
            error: <ErrorIcon fontSize="inherit" />,
            warning: <WarningIcon fontSize="inherit" />,
            info: <InfoIcon fontSize="inherit" />,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>



      <Card elevation={3} sx={{ mb: 4 }}>
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            p: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              Panel de Administración
            </Typography>
            <Typography variant="subtitle1">
              Gestión completa de la plataforma
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<SaveIcon />}
              onClick={saveAllData}
              sx={{ mr: 2 }}
            >
              Guardar Todo
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: theme.palette.secondary.main,
              height: 4,
            },
          }}
        >
          <Tab 
            label="Información Institucional" 
            icon={<BusinessIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Productos de Crédito" 
            icon={<CreditCardIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Inversiones" 
            icon={<MonetizationOnIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Cargos Adicionales" 
            icon={<AttachMoneyIcon />} 
            iconPosition="start" 
          />
          <Tab 
            label="Usuarios" 
            icon={<PeopleIcon />} 
            iconPosition="start" 
          />
        </Tabs>
      </Card>

      {/* Tab Content */}
      <Box>
        {/* Institution Information Tab */}
        {tabIndex === 0 && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Card elevation={3}>
                <CardHeader 
                  title="Información de la Institución" 
                  titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
                  avatar={<BusinessIcon color="primary" />}
                />
                <Divider />
                <CardContent>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Nombre de la Institución"
                        name="name"
                        value={institutionInfo.name}
                        onChange={handleInstitutionChange}
                        margin="normal"
                        variant="outlined"
                      />
                      {/* <TextField
                        fullWidth
                        label="Eslogan"
                        name="slogan"
                        value={institutionInfo.slogan}
                        onChange={handleInstitutionChange}
                        margin="normal"
                        variant="outlined"
                      /> */}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Logo de la Institución
                        </Typography>
                        <Button
                          variant="outlined"
                          component="label"
                          startIcon={<ImageIcon />}
                          sx={{ mb: 1 }}
                        >
                          Seleccionar Logo
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </Button>
                        <Typography variant="caption" display="block" color="textSecondary">
                          Formatos soportados: JPG, PNG, SVG
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Color Primario
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ColorLensIcon sx={{ mr: 2 }} />
                        <TextField
                          fullWidth
                          name="primaryColor"
                          value={institutionInfo.primaryColor}
                          onChange={handleInstitutionChange}
                          type="color"
                          sx={{
                            '& input': {
                              height: '50px',
                              cursor: 'pointer',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Color Secundario
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ColorLensIcon sx={{ mr: 2 }} />
                        <TextField
                          fullWidth
                          name="secondaryColor"
                          value={institutionInfo.secondaryColor}
                          onChange={handleInstitutionChange}
                          type="color"
                          sx={{
                            '& input': {
                              height: '50px',
                              cursor: 'pointer',
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={saveInstitutionInfo}
                    startIcon={<SaveIcon />}
                  >
                    Guardar Cambios
                  </Button>
                </CardActions>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardHeader 
                  title="Vista Previa" 
                  titleTypographyProps={{ variant: 'h6' }}
                />
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      backgroundColor: institutionInfo.secondaryColor,
                      p: 3,
                      borderRadius: 1,
                      mb: 3,
                      minHeight: 150,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {logoPreview || institutionInfo.logo ? (
                      <img
                        src={logoPreview || institutionInfo.logo}
                        alt="Logo de la institución"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100px',
                          objectFit: 'contain',
                        }}
                      />
                    ) : (
                      <Typography color="textSecondary">
                        Vista previa del logo
                      </Typography>
                    )}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: institutionInfo.primaryColor,
                      fontWeight: 'bold',
                      mb: 1,
                    }}
                  >
                    {institutionInfo.name}
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    {institutionInfo.slogan}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Credit Products Tab */}
        {tabIndex === 1 && (
          <Card elevation={3}>
            <CardHeader
              title="Productos de Crédito"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              avatar={<CreditCardIcon color="primary" />}
              action={
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenCreditDialog()}
                >
                  Nuevo Producto
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell align="right">Tasa de Interés</TableCell>
                      <TableCell align="right">Monto</TableCell>
                      <TableCell align="right">Plazo</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {creditProducts.map((product) => (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Typography fontWeight="medium">
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.type} 
                            size="small"
                            sx={{ 
                              backgroundColor: getProductTypeColor(product.type),
                              color: 'white'
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {product.interestRate}%
                        </TableCell>
                        <TableCell align="right">
                          ${product.minAmount.toLocaleString()} - ${product.maxAmount.toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          {product.minTerm} - {product.maxTerm} meses
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleOpenCreditDialog(product)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteCreditProduct(product.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            {/* Credit Product Dialog */}
            <Dialog
              open={openCreditDialog}
              onClose={() => setOpenCreditDialog(false)}
              maxWidth="sm"
              fullWidth
              sx={dialogStyle}
            >
              <DialogTitle>
                {isEditing ? "Editar Producto" : "Nuevo Producto de Crédito"}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre del Producto"
                      name="name"
                      value={currentProduct?.name || ""}
                      onChange={handleProductChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Crédito</InputLabel>
                      <Select
                        name="type"
                        value={currentProduct?.type || "Consumo"}
                        onChange={handleProductChange}
                      >
                        <MenuItem value="Consumo">Consumo</MenuItem>
                        <MenuItem value="Hipotecario">Hipotecario</MenuItem>
                        <MenuItem value="Educativo">Educativo</MenuItem>
                        <MenuItem value="Microcrédito">Microcrédito</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Tasa de Interés (%)"
                      name="interestRate"
                      type="number"
                      value={currentProduct?.interestRate || 0}
                      onChange={handleProductChange}
                      InputProps={{
                        endAdornment: '%',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Mínimo ($)"
                      name="minAmount"
                      type="number"
                      value={currentProduct?.minAmount || 0}
                      onChange={handleProductChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Monto Máximo ($)"
                      name="maxAmount"
                      type="number"
                      value={currentProduct?.maxAmount || 0}
                      onChange={handleProductChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Plazo Mínimo (meses)"
                      name="minTerm"
                      type="number"
                      value={currentProduct?.minTerm || 0}
                      onChange={handleProductChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Plazo Máximo (meses)"
                      name="maxTerm"
                      type="number"
                      value={currentProduct?.maxTerm || 0}
                      onChange={handleProductChange}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setOpenCreditDialog(false)}
                  sx={secondaryButtonStyle}
                  variant="outlined"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveCreditProduct} 
                  sx={primaryButtonStyle}
                  variant="contained"
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        )}

        {/* Investment Products Tab */}
        {tabIndex === 2 && (
          <Card elevation={3}>
            <CardHeader
              title="Tasas de Inversión"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              avatar={<MonetizationOnIcon color="primary" />}
              action={
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenInvestmentDialog()}
                >
                  Nuevo Rango
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <Grid container spacing={3}>
                {investmentRates.map((item) => (
                  <Grid item xs={12} md={6} key={item.id}>
                    <Card elevation={2}>
                      <CardHeader
                        title={item.termRange}
                        titleTypographyProps={{ variant: 'subtitle1', fontWeight: 'bold' }}
                        action={
                          <Box>
                            <IconButton
                              onClick={() => handleOpenInvestmentDialog(item)}
                              color="primary"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => deleteInvestmentRate(item.id)}
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        }
                      />
                      <Divider />
                      <CardContent>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Rango de Monto</TableCell>
                                <TableCell align="right">Tasa (%)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.rates.map((rate, index) => (
                                <TableRow key={index}>
                                  <TableCell>{rate.amountRange}</TableCell>
                                  <TableCell align="right">{rate.rate}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>

            {/* Investment Rate Dialog */}
            <Dialog
              open={openInvestmentDialog}
              onClose={() => setOpenInvestmentDialog(false)}
              maxWidth="sm"
              fullWidth
              sx={dialogStyle}
            >
              <DialogTitle>
                {isEditing ? "Editar Rango de Plazo" : "Nuevo Rango de Plazo"}
              </DialogTitle>
              <DialogContent>
                <TextField
                  fullWidth
                  label="Rango de Plazo"
                  name="termRange"
                  value={currentInvestment?.termRange || ""}
                  onChange={handleInvestmentChange}
                  margin="normal"
                  placeholder="Ej: 31 a 60 días"
                />

                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  Tasas por Rango de Monto
                </Typography>

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Rango de Monto</TableCell>
                        <TableCell>Tasa (%)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentInvestment?.rates.map((rate, index) => (
                        <TableRow key={index}>
                          <TableCell>{rate.amountRange}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              value={rate.rate}
                              onChange={(e) =>
                                handleRateChange(index, e.target.value)
                              }
                              InputProps={{
                                endAdornment: '%',
                              }}
                              size="small"
                              fullWidth
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setOpenInvestmentDialog(false)}
                  sx={secondaryButtonStyle}
                  variant="outlined"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveInvestmentRate} 
                  sx={primaryButtonStyle}
                  variant="contained"
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        )}

        {/* Additional Charges Tab */}
        {tabIndex === 3 && (
          <Card elevation={3}>
            <CardHeader
              title="Cargos Adicionales"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              avatar={<AttachMoneyIcon color="primary" />}
              action={
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenChargeDialog()}
                >
                  Nuevo Cargo
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Aplicable a</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {additionalCharges.map((charge) => (
                      <TableRow key={charge.id} hover>
                        <TableCell>{charge.name}</TableCell>
                        <TableCell>
                          <Chip label={charge.type} size="small" />
                        </TableCell>
                        <TableCell>
                          {charge.rate}
                          {charge.isPercentage ? "%" : " USD"}
                        </TableCell>
                        <TableCell>{charge.applicableTo}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleOpenChargeDialog(charge)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteAdditionalCharge(charge.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            {/* Additional Charge Dialog */}
            <Dialog
              open={openChargeDialog}
              onClose={() => setOpenChargeDialog(false)}
              maxWidth="sm"
              fullWidth
              sx={dialogStyle}
            >
              <DialogTitle>
                {isEditing ? "Editar Cargo Adicional" : "Nuevo Cargo Adicional"}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nombre del Cargo"
                      name="name"
                      value={currentCharge?.name || ""}
                      onChange={handleChargeChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Cargo</InputLabel>
                      <Select
                        name="type"
                        value={currentCharge?.type || "Seguro"}
                        onChange={handleChargeChange}
                      >
                        <MenuItem value="Seguro">Seguro</MenuItem>
                        <MenuItem value="Donación">Donación</MenuItem>
                        <MenuItem value="Comisión">Comisión</MenuItem>
                        <MenuItem value="Otro">Otro</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Tipo de Valor</InputLabel>
                      <Select
                        name="isPercentage"
                        value={
                          currentCharge?.isPercentage === true ? "true" : "false"
                        }
                        onChange={handleChargeChange}
                      >
                        <MenuItem value="true">Porcentaje (%)</MenuItem>
                        <MenuItem value="false">Monto Fijo (USD)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Valor"
                      name="rate"
                      type="number"
                      value={currentCharge?.rate || 0}
                      onChange={handleChargeChange}
                      InputProps={{
                        endAdornment: currentCharge?.isPercentage ? '%' : 'USD',
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Aplicable a</InputLabel>
                      <Select
                        name="applicableTo"
                        value={currentCharge?.applicableTo || "Todos"}
                        onChange={handleChargeChange}
                      >
                        <MenuItem value="Todos">Todos los créditos</MenuItem>
                        <MenuItem value="Consumo">Consumo</MenuItem>
                        <MenuItem value="Hipotecario">Hipotecario</MenuItem>
                        <MenuItem value="Educativo">Educativo</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setOpenChargeDialog(false)}
                  sx={secondaryButtonStyle}
                  variant="outlined"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveAdditionalCharge} 
                  sx={primaryButtonStyle}
                  variant="contained"
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        )}

        {/* Users Tab */}
        {tabIndex === 4 && (
          <Card elevation={3}>
            <CardHeader
              title="Gestión de Usuarios"
              titleTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
              avatar={<PeopleIcon color="primary" />}
              action={
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenUserDialog()}
                >
                  Nuevo Usuario
                </Button>
              }
            />
            <Divider />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre</TableCell>
                      <TableCell>Apellido</TableCell>
                      <TableCell>Correo Electrónico</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.idusuarios} hover>
                        <TableCell>{user.nombre}</TableCell>
                        <TableCell>{user.apellido}</TableCell>
                        <TableCell>{user.correo}</TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => handleOpenUserDialog(user)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteUser(user.idusuarios)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>

            {/* User Dialog */}
            <Dialog
              open={openUserDialog}
              onClose={() => setOpenUserDialog(false)}
              maxWidth="sm"
              fullWidth
              sx={dialogStyle}
            >
              <DialogTitle>
                {isEditing ? "Editar Usuario" : "Nuevo Usuario"}
              </DialogTitle>
              <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nombre"
                      name="nombre"
                      value={currentUser?.nombre || ""}
                      onChange={handleUserChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Apellido"
                      name="apellido"
                      value={currentUser?.apellido || ""}
                      onChange={handleUserChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Correo Electrónico"
                      name="correo"
                      type="email"
                      value={currentUser?.correo || ""}
                      onChange={handleUserChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="password"
                      type="password"
                      value={currentUser?.password || ""}
                      onChange={handleUserChange}
                      helperText={
                        isEditing ? "Dejar en blanco para no cambiar" : ""
                      }
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button 
                  onClick={() => setOpenUserDialog(false)}
                  sx={secondaryButtonStyle}
                  variant="outlined"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={saveUser} 
                  sx={primaryButtonStyle}
                  variant="contained"
                >
                  Guardar
                </Button>
              </DialogActions>
            </Dialog>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default Admin;