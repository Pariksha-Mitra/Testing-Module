"use client"
import { Snackbar, Alert } from "@mui/material";
import { useState, createContext, useContext, ReactNode } from "react";

interface ToastContextProps {
  showToast: (
    message: string | null,
    severity: "success" | "error" | "warning" | "info"
  ) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>("");
  const [severity, setSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("info");

  const showToast = (
    msg: string | null,
    sev: "success" | "error" | "warning" | "info"
  ) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
