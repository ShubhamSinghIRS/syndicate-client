import { useContext, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getDefaultFormTheme } from "../../../../common/defaultFormTheme";
import { useThemeMode } from "../../../../context/ThemeModeContext";
import { LoadingContext } from "../../../../components/loading/context";
import Fields from "./fields";
import type { RequestTopicFormValues } from "./types";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";
import { RequestServer } from "../../../../utils/services";

type RequestTopicFormProps = {
  handleClose: () => void;
  handleFormChange: () => void;
  handleSubmitClose: () => void;
};

const defaultValues: RequestTopicFormValues = {
  domain: "",
  topic: "",
  email: "",
  remark: "",
  suggestedExpertName: "",
  suggestedExpertLinkedin: "",
};

export default function RequestTopicForm({
  handleClose,
  handleFormChange,
  handleSubmitClose,
}: RequestTopicFormProps) {
  const methods = useForm<RequestTopicFormValues>({ defaultValues });
  const { mode } = useThemeMode();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(mode)),
    [mode],
  );
  const { setLoading } = useContext(LoadingContext);
  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = async (data: RequestTopicFormValues) => {
    setLoading(true);
    try {
      await RequestServer(API_ENDPOINTS.topicsRequest, "POST", data);
      enqueueSnackbar("Your topic request has been submitted.", {
        variant: "success",
      });
      handleSubmitClose();
    } catch (error) {
      const message =
        (error as Error).message || "Something went wrong. Please try again.";
      methods.setError("root", { message });
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <ThemeProvider theme={defaultTheme}>
        <form onSubmit={methods.handleSubmit(onSubmit)} noValidate>
          {methods.formState.errors.root && (
            <p className="mb-2 text-sm text-red-600 dark:text-red-400">
              {methods.formState.errors.root.message}
            </p>
          )}
          <Fields
            handleClose={handleClose}
            handleFormChange={handleFormChange}
          />
        </form>
      </ThemeProvider>
    </FormProvider>
  );
}
