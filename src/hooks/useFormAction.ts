import { FormMessage, FormResult } from "@/types/globals";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function useFormAction(
  formAction: (_prevState: any, formData: FormData) => Promise<FormResult>
) {
  const initialState = { message: "", success: false };
  const [infoMessage, setInfoMessage] = useState<{
    variant: "error" | "success" | "";
    message: string;
  }>(() => ({
    variant: "",
    message: "",
  }));

  const [formState, action] = useFormState(formAction, initialState);

  const formMessage: FormMessage | string | undefined = formState?.message;

  useEffect(() => {
    if (formState.success) {
      if (typeof formState.message === "string") {
        setInfoMessage({
          variant: "success",
          message: formState.message,
        });
      }
    }

    if (!formState.success) {
      if (typeof formState.message === "string") {
        setInfoMessage({
          variant: "error",
          message: formState.message,
        });
      }
    }
  }, [formState]);

  return {
    infoMessage,
    setInfoMessage,
    formAction: action,
    formMessage,
    formState,
  };
}
