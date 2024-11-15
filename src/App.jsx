import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import CoinPurchaseScreen from "./CoinPurchaseScreen";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CoinPurchaseScreen />
    </ThemeProvider>
  );
}

export default App;
