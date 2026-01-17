// hooks/use-toast.ts
import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

/**
 * Show a toast message anywhere
 * @param message - text to display
 * @param variant - type of toast (default: "default")
 * @param options - optional additional Sonner toast options
 */
export const toast = (
  message: string,
  variant: ToastVariant = "default",
  options: { duration?: number } = {}
) => {
  switch (variant) {
    case "success":
      sonnerToast.success(message, options);
      break;
    case "error":
      sonnerToast.error(message, options);
      break;
    case "warning":
      sonnerToast.warning(message, options);
      break;
    case "info":
      sonnerToast.info(message, options);
      break;
    default:
      sonnerToast(message, options);
  }
};
