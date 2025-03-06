import { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ActivityIndicator from "@/components/indicators/activity-indicator";
import { baseUrl } from "@/api/baseUrl";
import { useTranslation } from "react-i18next";

type RestartDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
};

export default function RestartDialog({
  isOpen,
  onClose,
  onRestart,
}: RestartDialogProps) {
  const { t } = useTranslation("components/overlay/restart_dialog");
  const [restartDialogOpen, setRestartDialogOpen] = useState(isOpen);
  const [restartingSheetOpen, setRestartingSheetOpen] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    setRestartDialogOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (restartingSheetOpen) {
      countdownInterval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
    }

    return () => {
      clearInterval(countdownInterval);
    };
  }, [restartingSheetOpen]);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = baseUrl;
    }
  }, [countdown]);

  const handleRestart = () => {
    setRestartingSheetOpen(true);
    onRestart();
  };

  const handleForceReload = () => {
    window.location.href = baseUrl;
  };

  return (
    <>
      <AlertDialog
        open={restartDialogOpen}
        onOpenChange={() => {
          setRestartDialogOpen(false);
          onClose();
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dialog.title")}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("dialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestart}>
              {t("dialog.restart")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet
        open={restartingSheetOpen}
        onOpenChange={() => setRestartingSheetOpen(false)}
      >
        <SheetContent side="top" onInteractOutside={(e) => e.preventDefault()}>
          <div className="flex flex-col items-center">
            <ActivityIndicator />
            <SheetHeader className="mt-5 text-center">
              <SheetTitle className="text-center">
                {t("sheet.title")}
              </SheetTitle>
              <SheetDescription className="text-center">
                <div>{t("sheet.description", { seconds: countdown })}</div>
              </SheetDescription>
            </SheetHeader>
            <Button
              size="lg"
              className="mt-5"
              aria-label={t("sheet.forceReload")}
              onClick={handleForceReload}
            >
              {t("sheet.forceReload")}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
