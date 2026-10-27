import { Ionicons } from "@react-native-vector-icons/ionicons";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useAppTheme } from "@/utils/useTheme";

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  hideToast: () => void;
}

interface ActiveToast extends Required<ToastOptions> {
  id: number;
}

const ToastContext = createContext<ToastContextValue | null>(null);
let globalShowToast: ((options: ToastOptions) => void) | null = null;

export function showGlobalToast(options: ToastOptions) {
  globalShowToast?.(options);
}

const iconByType = {
  success: "checkmark-circle",
  error: "alert-circle",
  info: "information-circle",
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const [toast, setToast] = useState<ActiveToast | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextIdRef = useRef(0);

  const hideToast = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    ({ message, type = "info", duration = 2500 }: ToastOptions) => {
      if (!message.trim()) {
        throw new Error("Toast message must not be empty.");
      }

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      const id = ++nextIdRef.current;
      setToast({ id, message, type, duration });
      timeoutRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
        timeoutRef.current = null;
      }, duration);
    },
    [],
  );

  useEffect(() => {
    globalShowToast = showToast;
    return () => {
      if (globalShowToast === showToast) globalShowToast = null;
    };
  }, [showToast]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  const backgroundColor =
    toast?.type === "error"
      ? theme.colors.error
      : toast?.type === "success"
        ? theme.colors.primaryDark
        : theme.colors.textPrimary;

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast ? (
        <View style={styles.overlay}>
          <Pressable
            accessibilityLiveRegion="polite"
            accessibilityRole="alert"
            onPress={hideToast}
            style={[styles.toast, { backgroundColor }]}
          >
            <Ionicons
              color={theme.colors.onPrimary}
              name={iconByType[toast.type]}
              size={20}
            />
            <Text style={styles.message}>{toast.message}</Text>
          </Pressable>
        </View>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider.");
  }
  return context;
}

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    overlay: {
      alignItems: "center",
      bottom: 0,
      justifyContent: "flex-end",
      left: 0,
      paddingBottom: theme.spacing.xl,
      paddingHorizontal: theme.spacing.md,
      pointerEvents: "box-none",
      position: "absolute",
      right: 0,
      zIndex: 1000,
    },
    toast: {
      alignItems: "center",
      borderRadius: theme.radius.round,
      flexDirection: "row",
      gap: theme.spacing.sm,
      maxWidth: 560,
      minHeight: 48,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.sm,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.22)",
      width: "100%",
    },
    message: {
      color: theme.colors.onPrimary,
      flexShrink: 1,
      fontSize: theme.typography.bodySmall,
      fontWeight: theme.typography.weight.medium,
    },
  });
