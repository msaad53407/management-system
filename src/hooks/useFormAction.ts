import { FormMessage, FormResult } from "@/types/globals";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function useFormAction(
  formAction: (_prevState: any, formData: FormData) => Promise<FormResult>
) {
  const initialState = { message: "", success: false, data: null };
  const [infoMessage, setInfoMessage] = useState<{
    variant: "error" | "success" | "";
    message: string;
  }>(() => ({
    variant: "",
    message: "",
  }));

  const [formState, action] = useFormState(formAction, initialState);

  const formMessage: FormMessage | string | undefined = formState?.message;

  const router = useRouter();

  useEffect(() => {
    if (formState.success) {
      if (typeof formState.message === "string") {
        setInfoMessage({
          variant: "success",
          message: formState.message,
        });
      }
      router.refresh();
    }

    if (!formState.success) {
      if (typeof formState.message === "string") {
        setInfoMessage({
          variant: "error",
          message: formState.message,
        });
      }
    }
  }, [formState, router]);

  return {
    infoMessage,
    setInfoMessage,
    formAction: action,
    formMessage,
    formState,
  };
}
