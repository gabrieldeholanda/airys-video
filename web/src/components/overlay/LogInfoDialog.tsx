import { LogLine } from "@/types/log";
import { isDesktop } from "react-device-detect";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { LogChip } from "../indicators/Chip";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

type LogInfoDialogProps = {
  logLine?: LogLine;
  setLogLine: (log: LogLine | undefined) => void;
};
export default function LogInfoDialog({
  logLine,
  setLogLine,
}: LogInfoDialogProps) {
  const { t } = useTranslation();
  const Overlay = isDesktop ? Sheet : Drawer;
  const Content = isDesktop ? SheetContent : DrawerContent;
  const Header = isDesktop ? SheetHeader : DrawerHeader;
  const Title = isDesktop ? SheetTitle : DrawerTitle;
  const Description = isDesktop ? SheetDescription : DrawerDescription;

  const helpfulLinks = useHelpfulLinks(logLine?.content);

  return (
    <Overlay
      open={logLine != undefined}
      onOpenChange={(open) => {
        if (!open) {
          setLogLine(undefined);
        }
      }}
    >
      <Content
        className={isDesktop ? "" : "max-h-[75dvh] overflow-hidden p-2 pb-4"}
      >
        <Header className="sr-only">
          <Title>Log Details</Title>
          <Description>Log details</Description>
        </Header>
        {logLine && (
          <div className="flex size-full flex-col gap-5">
            <div className="flex w-min flex-col gap-1.5">
              <div className="text-sm text-primary/40">{t("logs.type")}</div>
              <LogChip severity={logLine.severity} />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-sm text-primary/40">{t("logs.timestamp")}</div>
              <div className="text-sm">{logLine.dateStamp}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-sm text-primary/40">{t("logs.tag")}</div>
              <div className="text-sm">{logLine.section}</div>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="text-sm text-primary/40">{t("logs.message")}</div>
              <div className="text-sm">
                {logLine.content.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </div>
            </div>
            {helpfulLinks.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <div className="text-sm text-primary/40">{t("logs.helpfulLinks")}</div>
                {helpfulLinks.map((tip, index) => (
                  <Link key={index} to={tip.link} target="_blank" rel="noopener noreferrer">
                    <div className="text-sm text-selected hover:underline">
                      {tip.text}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </Content>
    </Overlay>
  );
}

function useHelpfulLinks(content: string | undefined) {
  return useMemo(() => {
    if (!content) {
      return [];
    }

    const links = [];

    if (/Could not clear [\d.]* currently [\d.]*/.exec(content)) {
      links.push({
        link: "https://chat.airys.com.br/hc/help/pt_BR/",
        text: "Frigate Automatic Storage Cleanup",
      });
    }

    if (/Did not detect hwaccel/.exec(content)) {
      links.push({
        link: "https://chat.airys.com.br/hc/help/pt_BR/",
        text: "Setup Hardware Acceleration",
      });
    }

    if (
      content.includes(
        "/usr/lib/x86_64-linux-gnu/dri/iHD_drv_video.so init failed",
      ) ||
      content.includes(
        "/usr/lib/x86_64-linux-gnu/dri/i965_drv_video.so init failed",
      ) ||
      content.includes(
        "/usr/lib/x86_64-linux-gnu/dri/i965_drv_video.so init failed",
      ) ||
      content.includes("No VA display found for device /dev/dri/renderD128")
    ) {
      links.push({
        link: "https://chat.airys.com.br/hc/help/pt_BR/",
        text: "Verify Hardware Acceleration Setup",
      });
    }

    if (content.includes("No EdgeTPU was detected")) {
      links.push({
        link: "https://chat.airys.com.br/hc/help/pt_BR/",
        text: "Troubleshoot Coral",
      });
    }

    if (content.includes("The current SHM size of")) {
      links.push({
        link: "https://chat.airys.com.br/hc/help/pt_BR/",
        text: "Calculate Correct SHM Size",
      });
    }

    return links;
  }, [content]);
}
