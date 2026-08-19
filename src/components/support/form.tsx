import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDefaultFormTheme } from "../../common/defaultFormTheme";
import { useThemeMode } from "../../context/ThemeModeContext";
import { useCurrentUser } from "../../modules/profile/hooks/useCurrentUser";
import Loading from "../loading/Loading";
import Fields from "./fields";
import type { SupportFormValues } from "./types";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";

type SupportFormProps = {
  onSent: () => void;
  onDirtyChange: (isDirty: boolean) => void;
};

export default function SupportForm({ onSent, onDirtyChange }: SupportFormProps) {
  const { userName, email } = useCurrentUser();
  const defaultValues: SupportFormValues = {
    name: userName ?? "",
    email: email ?? "",
    message: "",
  };
  const methods = useForm<SupportFormValues>({ defaultValues });
  const { isDirty } = methods.formState;
  const { mode } = useThemeMode();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(mode)),
    [mode],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: SupportFormValues) => {
    setIsSubmitting(true);
    try {
      await RequestServer(API_ENDPOINTS.support, "POST", data);
      methods.reset();
      enqueueSnackbar("Your message has been sent.", { variant: "success" });
      onSent();
    } catch (error) {
      const message =
        (error as Error).message || "Something went wrong. Please try again.";
      methods.setError("root", { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <ThemeProvider theme={defaultTheme}>
        <div className="relative">
          <Loading loading={isSubmitting} />
          <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
            {methods.formState.errors.root && (
              <p className="mb-2 text-sm text-red-600 dark:text-red-400">
                {methods.formState.errors.root.message}
              </p>
            )}
            <Fields />
          </form>
        </div>
      </ThemeProvider>
    </FormProvider>
  );
}
