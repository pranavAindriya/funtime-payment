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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import axios from "axios";

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

const CoinPurchaseScreen = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [coinPackages, setAllCoinPackages] = useState([]);
  const [paymentData, setPaymentData] = useState([]);

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

  const handlePayment = async () => {
    if (!selectedPackage) {
      alert("Please select a coin package");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Processing payment for package:", selectedPackage);
      alert("Payment successful!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCoinPackages = async () => {
    const response = await axios.get(
      "https://leodatingapp.aindriya.uk/api/users/getAllCoinPackages"
    );
    setAllCoinPackages(response?.data);
    console.log(response);
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
            Buy Coins for
            {paymentData?.userId}
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
          {coinPackages?.map((pkg, index) => (
            <Grid item xs={6} md={4} key={pkg._id}>
              <StyledCard
                selected={selectedPackage?._id === pkg._id}
                onClick={() => handlePackageSelect(pkg)}
              >
                <CardContent>
                  <Box sx={{ textAlign: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 1,
                      }}
                    >
                      <MonetizationOnIcon sx={{ color: "gold", mr: 0.5 }} />
                      <Typography variant="h6" component="span">
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
    </GradientBackground>
  );
};

export default CoinPurchaseScreen;
