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
import { useIsLoggedIn } from "../../../../utils/authUtils";
import { useCurrentUser } from "../../../profile/hooks/useCurrentUser";

type RequestTopicFormProps = {
  handleClose: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  handleSubmitClose: () => void;
};

const defaultValues: RequestTopicFormValues = {
  domains: [],
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
  const { userId, userName, email: currentUserEmail } = useCurrentUser();
  const loggedIn = useIsLoggedIn();

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const onSubmit = async (data: RequestTopicFormValues) => {
    setLoading(true);
    try {
      // Backend only has one expert name/linkedin pair, so multiple experts are joined.
      const experts = data.suggestedExperts.filter(
        (expert) => expert.name || expert.linkedin,
      );
      const suggestedExpertName = experts
        .map((expert) => expert.name)
        .join("; ");
      const suggestedExpertLinkedin = experts
        .map((expert) => expert.linkedin)
        .join("; ");
      // Each entry is capped in fields.tsx, but check the joined length too (cap: 200/500).
      if (
        suggestedExpertName.length > 200 ||
        suggestedExpertLinkedin.length > 500
      ) {
        const message =
          "Suggested expert details are too long combined. Please shorten the names or LinkedIn entries, or remove one.";
        methods.setError("root", { message });
        enqueueSnackbar(message, { variant: "error" });
        return;
      }
      await RequestServer(API_ENDPOINTS.topicsRequest, "POST", {
        ...data,
        // Logged-in users don't see the email field; use their account email instead.
        email: loggedIn ? (currentUserEmail ?? data.email) : data.email,
        suggestedExpertName,
        suggestedExpertLinkedin,
        ...(loggedIn && userId ? { user_id: userId } : {}),
        ...(loggedIn && userName ? { user_name: userName } : {}),
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
