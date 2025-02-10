import { useEffect } from "react";

interface ExtendedHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
  msRequestFullscreen?: () => Promise<void> | void;
}

interface ExtendedDocument extends Document {
  webkitExitFullscreen?: () => Promise<void> | void;
  msExitFullscreen?: () => Promise<void> | void;
  webkitFullscreenElement?: Element | null;
  msFullscreenElement?: Element | null;
}

export interface UseFullscreenAndAntiCheatProtectionProps {
  isSubmitted: boolean;
  incrementCheatCount: () => void;
  submitTest: () => void;
  showToast?: (
    message: string,
    severity: "success" | "error" | "warning" | "info"
  ) => void;
}

/**
 * Requests fullscreen on the given element, using standard or vendor‑prefixed methods.
 */
const requestFullscreen = (element: ExtendedHTMLElement) => {
  if (element.requestFullscreen) {
    return element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    return element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    return element.msRequestFullscreen();
  }
};

/**
 * Exits fullscreen mode, using standard or vendor‑prefixed methods.
 */
const exitFullscreen = (doc: ExtendedDocument) => {
  if (doc.exitFullscreen) {
    return doc.exitFullscreen();
  } else if (doc.webkitExitFullscreen) {
    return doc.webkitExitFullscreen();
  } else if (doc.msExitFullscreen) {
    return doc.msExitFullscreen();
  }
};

const useAntiCheatProtection = ({
  isSubmitted,
  incrementCheatCount,
  submitTest,
  showToast,
}: UseFullscreenAndAntiCheatProtectionProps) => {
  // Request fullscreen on mount if the test hasn't been submitted
  useEffect(() => {
    if (isSubmitted) return;

    const docEl = document.documentElement as ExtendedHTMLElement;
    requestFullscreen(docEl)?.catch((err: unknown) => {
      console.warn("Failed to enter fullscreen", err);
    });

    return () => {
      const extendedDoc = document as ExtendedDocument;
      const fullscreenActive =
        document.fullscreenElement ||
        extendedDoc.webkitFullscreenElement ||
        extendedDoc.msFullscreenElement;
      if (fullscreenActive) {
        exitFullscreen(extendedDoc)?.catch((err: unknown) => {
          console.warn("Failed to exit fullscreen", err);
        });
      }
    };
  }, [isSubmitted]);

  // Detect visibility changes and blur events (e.g., switching tabs or losing focus)
  useEffect(() => {
    if (isSubmitted) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        incrementCheatCount();
        showToast?.("Please do not switch tabs during the test.", "warning");
      }
    };

    const handleBlur = () => {
      incrementCheatCount();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
    };
  }, [isSubmitted, incrementCheatCount, showToast]);

  // Prevent context menu, text selection, and copy events
  useEffect(() => {
    if (isSubmitted) return;

    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleSelectStart = (e: Event) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("copy", handleCopy);
    };
  }, [isSubmitted]);

  // Listen for fullscreen changes: if the user exits fullscreen, auto-submit the test,
  // increment the cheat count, and show a toast warning about malpractice.
  useEffect(() => {
    if (isSubmitted) return;

    const handleFullscreenChange = () => {
      const extendedDoc = document as ExtendedDocument;
      const fullscreenActive =
        document.fullscreenElement ||
        extendedDoc.webkitFullscreenElement ||
        extendedDoc.msFullscreenElement;

      if (!fullscreenActive) {
        showToast?.("Test auto‑submitted due to malpractice.", "error");
        submitTest();
        incrementCheatCount();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isSubmitted, submitTest, incrementCheatCount, showToast]);

  // Disable key combinations (Escape, F5) and show a toast warning
  useEffect(() => {
    if (isSubmitted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F5" || e.key === "Escape") {
        showToast?.(
          "Please do not press Escape or F5. Do not reload the page during the test.",
          "warning"
        );
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Use capture phase so this handler fires before others
    window.addEventListener("keydown", handleKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isSubmitted, showToast]);

  // Prevent page reload using beforeunload and warn the user
  useEffect(() => {
    if (isSubmitted) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      showToast?.("Reloading is disabled during the test.", "warning");
      e.preventDefault();
      // The assignment to returnValue is deprecated but required for some browsers.
      // sonarlint-disable-next-line typescript:S1874
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isSubmitted, showToast]);
};

export default useAntiCheatProtection;
