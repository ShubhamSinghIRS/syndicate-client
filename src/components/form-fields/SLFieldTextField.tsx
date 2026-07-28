import * as React from "react";
import { Controller } from "react-hook-form";
import type {
  FieldValues,
  FormState,
  UseControllerProps,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";

import { callAll } from "./util";
import { Grid, TextField } from "@mui/material";
import type { GridProps, TextFieldProps } from "@mui/material";

export interface HookTextFieldProps<
  T extends FieldValues = FieldValues,
> extends UseControllerProps<T> {
  textFieldProps?: TextFieldProps & {
    readonly notifyText?: string;
  };
  formState: FormState<T>;
  gridProps?: GridProps;
  setValue?: UseFormSetValue<T>;
  trigger?: UseFormTrigger<T>;
  forceError?: boolean;
  config?: {
    trimWhitespaceOnBlur?: boolean;
    triggerErrorOnBlur?: boolean;
  };
}

export const HookTextField = <T extends FieldValues>({
  gridProps,
  ...props
}: HookTextFieldProps<T>): React.ReactElement => {
  if (gridProps) {
    return (
      <Grid item {...gridProps}>
        <Component {...props} />
      </Grid>
    );
  }

  return <Component {...props} />;
};

const Component = <T extends FieldValues>({
  textFieldProps = {},
  setValue,
  trigger,
  config = {},
  formState: { errors: _e },
  forceError = false,
  ...restC
}: HookTextFieldProps<T>) => {
  const {
    onChange,
    onBlur,
    notifyText,
    name: _,
    inputProps,
    ...rest
  } = textFieldProps;

  const { trimWhitespaceOnBlur = false, triggerErrorOnBlur = false } = config;

  const onChangeRef = React.useRef(onChange);
  const onBlurRef = React.useRef(onBlur);
  onChangeRef.current = onChange;
  onBlurRef.current = onBlur;

  const { error } = restC.control?.getFieldState(restC.name) ?? {};

  return (
    <Controller
      {...restC}
      render={({
        field: { onChange: onChangeI, value = "", onBlur: onBlurI, ref, name },
      }) => (
        <TextField
          error={!!error || forceError}
          helperText={error?.message}
          inputRef={ref}
          value={value ?? ""}
          {...rest}
          onBlur={callAll(onBlurI, onBlurRef.current, async () => {
            if (trimWhitespaceOnBlur) {
              const trimmedValue =
                typeof value === "string" ? value.trim() : undefined;
              setValue?.(name, trimmedValue as any);
            }

            if (triggerErrorOnBlur) {
              try {
                await trigger?.(name);
              } catch (error) {
                console.error("Failed to validate field on blur:", error);
              }
            }
          })}
          onChange={callAll(onChangeI, onChangeRef.current)}
        />
      )}
    />
  );
};
