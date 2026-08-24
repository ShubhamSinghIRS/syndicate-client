import type { EnqueueSnackbar } from "notistack";

export {};

declare global {
  interface Window {
    enqueueSnackbar?: EnqueueSnackbar;
  }
}
