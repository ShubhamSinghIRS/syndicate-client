import { useMemo } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { store } from "../redux/store";
import { getAppTheme } from "../constants/theme";
import router from "../routes/Routes";
import CartSync from "../modules/cart/components/CartSync";
import { ThemeModeProvider, useThemeMode } from "../context/ThemeModeContext";

const ThemedApp = () => {
  const { mode } = useThemeMode();
  const appTheme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={appTheme}>
      <CartSync />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeModeProvider>
        <ThemedApp />
      </ThemeModeProvider>
    </Provider>
  );
};

export default App;
