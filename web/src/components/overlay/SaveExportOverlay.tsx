import { LuVideo, LuX } from "react-icons/lu";
import { Button } from "../ui/button";
import { FaCompactDisc } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type SaveExportOverlayProps = {
  className: string;
  show: boolean;
  onPreview: () => void;
  onSave: () => void;
  onCancel: () => void;
};
export default function SaveExportOverlay({
  className,
  show,
  onPreview,
  onSave,
  onCancel,
}: SaveExportOverlayProps) {
  const { t } = useTranslation("ui", { keyPrefix: "overlay.save_export" });

  return (
    <div className={className}>
      <div
        className={cn(
          "pointer-events-auto flex items-center justify-center gap-2 rounded-lg px-2",
          show ? "duration-500 animate-in slide-in-from-top" : "invisible",
          "mx-auto mt-5 text-center",
        )}
      >
        <Button
          className="flex items-center gap-1 text-primary"
          aria-label={t("button.cancel")}
          size="sm"
          onClick={onCancel}
        >
          <LuX />
          {t("button.cancel")}
        </Button>
        <Button
          className="flex items-center gap-1"
          aria-label={t("button.preview")}
          size="sm"
          onClick={onPreview}
        >
          <LuVideo />
          {t("button.preview")}
        </Button>
        <Button
          className="flex items-center gap-1"
          aria-label={t("button.save")}
          variant="select"
          size="sm"
          onClick={onSave}
        >
          <FaCompactDisc />
          {t("button.save")}
        </Button>
      </div>
    </div>
  );
}
