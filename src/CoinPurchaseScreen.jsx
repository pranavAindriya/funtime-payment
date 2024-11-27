import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
  Grid,
  Button,
  Container,
  Paper,
  styled,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogContent,
  DialogActions,
  CircularProgress,
  Zoom,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import CloseIcon from "@mui/icons-material/Close";
import coinPackage from "./assets/coinPackage.svg";
import Coin from "./assets/coin.svg";
import axios from "axios";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "20px",
    padding: theme.spacing(2),
    maxWidth: "400px",
    width: "90%",
  },
}));

const DialogIconWrapper = styled(Box)(({ theme, severity }) => ({
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "0 auto",
  marginBottom: theme.spacing(2),
  background: (() => {
    switch (severity) {
      case "success":
        return "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)";
      case "error":
        return "linear-gradient(135deg, #f44336 0%, #e31b0c 100%)";
      case "warning":
        return "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)";
      default:
        return "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)";
    }
  })(),
  "& svg": {
    fontSize: 40,
    color: "white",
  },
}));

const StyledCard = styled(Card)(({ theme, selected }) => ({
  position: "relative",
  cursor: "pointer",
  transition: "transform 0.2s ease-in-out",
  borderRadius: "30px",
  background: selected
    ? "linear-gradient(90deg, #EC008C 0%, #FC6767 100%)"
    : "#fff",
  color: selected ? "#fff" : "inherit",
  "&:hover": {
    transform: "scale(1.02)",
  },
  border: selected ? `1px solid white` : "none",
}));

const BottomBar = styled(Paper)(({ theme }) => ({
  position: "fixed",
  bottom: 20,
  left: 0,
  right: 0,
  padding: theme.spacing(2),
  backgroundColor: "transparent",
  zIndex: 1000,
}));

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  background: "linear-gradient(180deg, #bbdefb 0%, #e3f2fd 100%)",
  backgroundImage: "url(https://i.postimg.cc/tJQhQ09w/image.png)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  paddingBottom: "100px",
});

const LoadingOverlay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 2000,
});

const CoinPurchaseScreen = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinPackages, setAllCoinPackages] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

  const [dialog, setDialog] = useState({
    open: false,
    message: "",
    severity: "success",
    title: "",
  });

  useEffect(() => {
    window.addEventListener("message", handleFlutterMessage);
    return () => window.removeEventListener("message", handleFlutterMessage);
  }, []);

  const handleFlutterMessage = (event) => {
    const data = event?.data;
    setPaymentData(data);
  };

  const handlePackageSelect = (selectedPkg) => {
    setSelectedPackage(selectedPkg);
  };

  const handleDialogClose = () => {
    setDialog((prev) => ({ ...prev, open: false }));
  };

  const showMessage = (message, severity = "success", title = "") => {
    const titles = {
      success: "Success!",
      error: "Oops!",
      warning: "Attention",
      info: "Information",
    };

    setDialog({
      open: true,
      message,
      severity,
      title: title || titles[severity],
    });
  };

  const getDialogIcon = (severity) => {
    switch (severity) {
      case "success":
        return <CheckCircleIcon />;
      case "error":
        return <ErrorIcon />;
      case "warning":
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const handlePayment = async () => {
    if (!selectedPackage) {
      showMessage(
        "Please select a coin package to proceed with the purchase.",
        "warning"
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "https://leodatingapp.aindriya.uk/api/users/buyCoinPackage",
        {
          userId: paymentData?.userId,
          packageId: selectedPackage._id,
        }
      );

      if (response.status === 200) {
        showMessage(
          "Your coin purchase was successful! The coins have been added to your account.",
          "success"
        );
      } else {
        showMessage(
          "We couldn't process your payment at this time. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Payment failed:", error);
      showMessage(
        error.response?.data?.message ||
          "Something went wrong while processing your payment. Please try again later.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCoinPackages = async () => {
    try {
      const response = await axios.get(
        "https://leodatingapp.aindriya.uk/api/users/getAllCoinPackages"
      );
      setAllCoinPackages(response?.data);
    } catch (error) {
      showMessage(
        "We couldn't load the coin packages. Please refresh the page to try again.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchAllCoinPackages();
  }, []);

  return (
    <GradientBackground>
      <Container maxWidth="md" sx={{ p: 0 }}>
        <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
          <IconButton aria-label="back" color="inherit">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontSize={22} sx={{ ml: 1 }}>
            Buy Coins
          </Typography>
        </Box>

        <Box
          sx={{
            mb: 1,
            backgroundColor: "grey",
            height: "1px",
          }}
        />

        <Grid container spacing={2} sx={{ p: 2 }}>
          {coinPackages?.map((pkg) => (
            <Grid item xs={6} md={4} key={pkg._id}>
              <StyledCard
                selected={selectedPackage?._id === pkg._id}
                onClick={() => handlePackageSelect(pkg)}
              >
                <CardContent>
                  <Box sx={{ textAlign: "center" }}>
                    <img src={coinPackage} />
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.6,
                        mb: 1,
                        width: "120px",
                        marginInline: "auto",
                        my: 0.8,
                        background:
                          selectedPackage?._id === pkg._id
                            ? "#fff"
                            : "linear-gradient(90deg, #EC008C 0%, #FC6767 100%)",
                        color:
                          selectedPackage?._id === pkg._id ? "black" : "white",
                        borderRadius: "10px",
                        boxShadow: "1px 1px 2px 0px rgba(70, 75, 216, 0.28)",
                      }}
                    >
                      <img
                        src={Coin}
                        style={{
                          width: "25px",
                          display: "block",
                        }}
                      />
                      <Typography variant="h6" component="span" mt={"2px"}>
                        {pkg.coin}
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      ₹{pkg.rateInInr} only
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        textDecoration: "line-through",
                        opacity: 0.7,
                      }}
                    >
                      ₹{pkg.text}
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <BottomBar elevation={0}>
        <Container maxWidth="md">
          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={handlePayment}
            disabled={!selectedPackage || loading}
            sx={{
              borderRadius: "10px",
            }}
          >
            {loading ? "Processing..." : "Recharge"}
          </Button>
        </Container>
      </BottomBar>

      <StyledDialog
        open={dialog.open}
        onClose={handleDialogClose}
        TransitionComponent={Zoom}
        keepMounted
      >
        <DialogContent sx={{ textAlign: "center", py: 3 }}>
          <IconButton
            sx={{ position: "absolute", right: 8, top: 8 }}
            onClick={handleDialogClose}
          >
            <CloseIcon />
          </IconButton>

          <DialogIconWrapper severity={dialog.severity}>
            {getDialogIcon(dialog.severity)}
          </DialogIconWrapper>

          <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
            {dialog.title}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {dialog.message}
          </Typography>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={handleDialogClose}
            variant="contained"
            sx={{
              borderRadius: "10px",
              minWidth: "120px",
              background: (() => {
                switch (dialog.severity) {
                  case "success":
                    return "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)";
                  case "error":
                    return "linear-gradient(135deg, #f44336 0%, #e31b0c 100%)";
                  case "warning":
                    return "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)";
                  default:
                    return "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)";
                }
              })(),
            }}
          >
            {dialog.severity === "success" ? "Close" : "OK"}
          </Button>
        </DialogActions>
      </StyledDialog>

      {loading && (
        <LoadingOverlay>
          <CircularProgress sx={{ color: "white" }} />
        </LoadingOverlay>
      )}
    </GradientBackground>
  );
};

export default CoinPurchaseScreen;
