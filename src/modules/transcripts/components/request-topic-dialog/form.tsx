import { useContext, useEffect, useMemo } from "react";
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
import { isLoggedIn } from "../../../../utils/authUtils";
import { useCurrentUser } from "../../../profile/hooks/useCurrentUser";

type RequestTopicFormProps = {
  handleClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  handleSubmitClose: () => void;
};

const defaultValues: RequestTopicFormValues = {
  domain: [],
  topic: "",
  email: "",
  remark: "",
  suggestedExperts: [],
};

export default function RequestTopicForm({
  handleClose,
  onDirtyChange,
  handleSubmitClose,
}: RequestTopicFormProps) {
  const methods = useForm<RequestTopicFormValues>({ defaultValues });
  const { isDirty } = methods.formState;
  const { mode } = useThemeMode();
  const defaultTheme = useMemo(
    () => createTheme(getDefaultFormTheme(mode)),
    [mode],
  );
  const { setLoading } = useContext(LoadingContext);
  const { enqueueSnackbar } = useSnackbar();
  const { userId, email: currentUserEmail } = useCurrentUser();
  const loggedIn = isLoggedIn();

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: RequestTopicFormValues) => {
    setLoading(true);
    try {
      // Backend's topic_requests table only has one domain string column
      // and one suggestedExpertName/suggestedExpertLinkedin pair, so
      // multiple selections are joined before submission.
      const experts = data.suggestedExperts.filter(
        (expert) => expert.name || expert.linkedin,
      );
      await RequestServer(API_ENDPOINTS.topicsRequest, "POST", {
        ...data,
        // Logged-in users don't see the email field at all - use their
        // account email instead of whatever's left in the form default.
        email: loggedIn ? (currentUserEmail ?? data.email) : data.email,
        domain: data.domain.join(", "),
        suggestedExpertName: experts.map((expert) => expert.name).join("; "),
        suggestedExpertLinkedin: experts
          .map((expert) => expert.linkedin)
          .join("; "),
        ...(loggedIn && userId ? { user_id: userId } : {}),
      });
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
          <Fields handleClose={handleClose} showEmail={!loggedIn} />
        </form>
      </ThemeProvider>
    </FormProvider>
  );
}
