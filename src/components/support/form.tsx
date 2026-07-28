import { useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDefaultFormTheme } from "../../common/defaultFormTheme";
import { useThemeMode } from "../../context/ThemeModeContext";
import Loading from "../loading/Loading";
import Fields from "./fields";
import type { SupportFormValues } from "./types";
import { API_ENDPOINTS } from "../../constants/apiEndpoints";
import { RequestServer } from "../../utils/services";

type SupportFormProps = {
  handleSubmitClose: () => void;
};

const defaultValues: SupportFormValues = {
  name: "",
  email: "",
  message: "",
};

export default function SupportForm({ handleSubmitClose }: SupportFormProps) {
  const methods = useForm<SupportFormValues>({ defaultValues });
  const { mode } = useThemeMode();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(mode)),
    [mode],
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: SupportFormValues) => {
    setIsSubmitting(true);
    try {
      await RequestServer(API_ENDPOINTS.support, "POST", data);
      methods.reset();
      handleSubmitClose();
    } catch (error) {
      methods.setError("root", {
        message: (error as Error).message || "Something went wrong. Please try again.",
      });
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
