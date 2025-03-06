import { Button } from "../ui/button";
import { FaCog } from "react-icons/fa";
import { isMobile } from "react-device-detect";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { LogSettingsType, LogSeverity } from "@/types/log";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { DropdownMenuSeparator } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import FilterSwitch from "./FilterSwitch";
import { useTranslation } from "react-i18next";

type LogSettingsButtonProps = {
  selectedLabels?: LogSeverity[];
  updateLabelFilter: (labels: LogSeverity[] | undefined) => void;
  logSettings?: LogSettingsType;
  setLogSettings: (logSettings: LogSettingsType) => void;
};
export function LogSettingsButton({
  selectedLabels,
  updateLabelFilter,
  logSettings,
  setLogSettings,
}: LogSettingsButtonProps) {
  const { t: translate } = useTranslation(['ui']);
  const trigger = (
    <Button
      size="sm"
      className="flex items-center gap-2"
      aria-label={translate('filter.log_settings.title')}
    >
      <FaCog className="text-secondary-foreground" />
      <div className="hidden text-primary md:block">{translate('filter.log_settings.title')}</div>
    </Button>
  );
  const content = (
    <div className={cn("my-3 space-y-3 py-3 md:mt-0 md:py-0")}>
      <div className="space-y-4">
        <div className="space-y-0.5">
          <div className="text-md">{translate('filter.log_settings.filter.title')}</div>
          <div className="space-y-1 text-xs text-muted-foreground">
            {translate('filter.log_settings.filter.description')}
          </div>
        </div>
        <GeneralFilterContent
          selectedLabels={selectedLabels}
          updateLabelFilter={updateLabelFilter}
        />
      </div>
      <DropdownMenuSeparator />
      <div className="space-y-4">
        <div className="space-y-0.5">
          <div className="text-md">{translate('filter.log_settings.loading.title')}</div>
          <div className="mt-2.5 flex flex-col gap-2.5">
            <div className="space-y-1 text-xs text-muted-foreground">
              {translate('filter.log_settings.loading.description')}
            </div>
            <FilterSwitch
              label={translate('filter.log_settings.loading.disableStreaming')}
              isChecked={logSettings?.disableStreaming ?? false}
              onCheckedChange={(isChecked) => {
                setLogSettings({
                  disableStreaming: isChecked,
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="mx-1 max-h-[75dvh] overflow-hidden p-3">
          {content}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent>{content}</PopoverContent>
    </Popover>
  );
}

type GeneralFilterContentProps = {
  selectedLabels: LogSeverity[] | undefined;
  updateLabelFilter: (labels: LogSeverity[] | undefined) => void;
};
export function GeneralFilterContent({
  selectedLabels,
  updateLabelFilter,
}: GeneralFilterContentProps) {
  const { t: translate } = useTranslation(['ui']);

  return (
    <>
      <div className="scrollbar-container h-auto overflow-y-auto overflow-x-hidden">
        <div className="mb-5 flex items-center justify-between">
          <Label
            className="mx-2 cursor-pointer text-primary"
            htmlFor="allLabels"
          >
            {translate('filter.log_settings.filter.all_logs')}
          </Label>
          <Switch
            className="ml-1"
            id="allLabels"
            checked={selectedLabels == undefined}
            onCheckedChange={(isChecked) => {
              if (isChecked) {
                updateLabelFilter(undefined);
              }
            }}
          />
        </div>
        <div className="my-2.5 flex flex-col gap-2.5">
          {["debug", "info", "warning", "error"].map((item) => (
            <div className="flex items-center justify-between" key={item}>
              <Label
                className="mx-2 w-full cursor-pointer capitalize text-primary"
                htmlFor={item}
              >
                {translate(`filter.log_settings.filter.severity.${item}`)}
              </Label>
              <Switch
                key={item}
                className="ml-1"
                id={item}
                checked={selectedLabels?.includes(item as LogSeverity) ?? false}
                onCheckedChange={(isChecked) => {
                  if (isChecked) {
                    const updatedLabels = selectedLabels
                      ? [...selectedLabels]
                      : [];

                    updatedLabels.push(item as LogSeverity);
                    updateLabelFilter(updatedLabels);
                  } else {
                    const updatedLabels = selectedLabels
                      ? [...selectedLabels]
                      : [];

                    // can not deselect the last item
                    if (updatedLabels.length > 1) {
                      updatedLabels.splice(
                        updatedLabels.indexOf(item as LogSeverity),
                        1,
                      );
                      updateLabelFilter(updatedLabels);
                    }
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
