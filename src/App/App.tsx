import { useMemo } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { SnackbarProvider, useSnackbar } from "notistack";
import type { SnackbarKey } from "notistack";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { store } from "../redux/store";
import { getAppTheme } from "../constants/theme";
import router from "../routes/Routes";
import CartSync from "../modules/cart/components/CartSync";
import { ThemeModeProvider, useThemeMode } from "../context/ThemeModeContext";

function SnackbarCloseButton({ snackbarKey }: { snackbarKey: SnackbarKey }) {
  const { closeSnackbar } = useSnackbar();
  return (
    <IconButton
      onClick={() => closeSnackbar(snackbarKey)}
      size="small"
      aria-label="Close notification"
    >
      <CloseIcon fontSize="small" sx={{ color: "#fff" }} />
    </IconButton>
  );
}

const ThemedApp = () => {
  const { mode } = useThemeMode();
  const appTheme = useMemo(() => getAppTheme(mode), [mode]);

  return (
    <ThemeProvider theme={appTheme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        action={(snackbarKey) => <SnackbarCloseButton snackbarKey={snackbarKey} />}
      >
        <CartSync />
        <RouterProvider router={router} />
      </SnackbarProvider>
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
