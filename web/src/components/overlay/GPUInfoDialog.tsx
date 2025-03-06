import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import ActivityIndicator from "../indicators/activity-indicator";
import { GpuInfo, Nvinfo, Vainfo } from "@/types/stats";
import { Button } from "../ui/button";
import copy from "copy-to-clipboard";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

type GPUInfoDialogProps = {
  showGpuInfo: boolean;
  gpuType: GpuInfo;
  setShowGpuInfo: (show: boolean) => void;
};
export default function GPUInfoDialog({
  showGpuInfo,
  gpuType,
  setShowGpuInfo,
}: GPUInfoDialogProps) {
  const { t } = useTranslation("ui", { keyPrefix: "overlay.gpu_info" });
  const { data: vainfo } = useSWR<Vainfo>(
    showGpuInfo && gpuType == "vainfo" ? "vainfo" : null,
  );
  const { data: nvinfo } = useSWR<Nvinfo>(
    showGpuInfo && gpuType == "nvinfo" ? "nvinfo" : null,
  );

  const onCopyInfo = async () => {
    copy(
      JSON.stringify(gpuType == "vainfo" ? vainfo : nvinfo)
        .replace(/\\t/g, "\t")
        .replace(/\\n/g, "\n"),
    );
    toast.success(t("success.copy"));
  };

  if (gpuType == "vainfo") {
    return (
      <Dialog open={showGpuInfo} onOpenChange={setShowGpuInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title.vainfo")}</DialogTitle>
          </DialogHeader>
          {vainfo ? (
            <div className="scrollbar-container mb-2 max-h-96 overflow-y-scroll whitespace-pre-line">
              <div>{t("return_code")} {vainfo.return_code}</div>
              <br />
              <div>{t(vainfo.return_code == 0 ? "process.output" : "process.error")}:</div>
              <br />
              <div>
                {vainfo.return_code == 0 ? vainfo.stdout : vainfo.stderr}
              </div>
            </div>
          ) : (
            <ActivityIndicator />
          )}
          <DialogFooter>
            <Button
              aria-label={t("button.close")}
              onClick={() => setShowGpuInfo(false)}
            >
              {t("button.close")}
            </Button>
            <Button
              aria-label={t("button.copy")}
              variant="select"
              onClick={() => onCopyInfo()}
            >
              {t("button.copy")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <Dialog open={showGpuInfo} onOpenChange={setShowGpuInfo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("title.nvidia")}</DialogTitle>
          </DialogHeader>
          {nvinfo ? (
            <div className="scrollbar-container mb-2 max-h-96 overflow-y-scroll whitespace-pre-line">
              <div>{t("nvidia.name")} {nvinfo["0"].name}</div>
              <br />
              <div>{t("nvidia.driver")} {nvinfo["0"].driver}</div>
              <br />
              <div>{t("nvidia.cuda")} {nvinfo["0"].cuda_compute}</div>
              <br />
              <div>{t("nvidia.vbios")} {nvinfo["0"].vbios}</div>
            </div>
          ) : (
            <ActivityIndicator />
          )}
          <DialogFooter>
            <Button
              aria-label={t("button.close")}
              onClick={() => setShowGpuInfo(false)}
            >
              {t("button.close")}
            </Button>
            <Button
              aria-label={t("button.copy")}
              variant="select"
              onClick={() => onCopyInfo()}
            >
              {t("button.copy")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
}
