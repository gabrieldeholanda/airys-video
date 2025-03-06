import Heading from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCallback, useEffect } from "react";
import { Toaster } from "sonner";
import { toast } from "sonner";
import { Separator } from "../../components/ui/separator";
import { Button } from "../../components/ui/button";
import useSWR from "swr";
import { FrigateConfig } from "@/types/frigateConfig";
import { del as delData } from "idb-keyval";
import { usePersistence } from "@/hooks/use-persistence";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "../../components/ui/select";
import { PLAYBACK_RATE_DEFAULT, WEEK_STARTS_ON } from "@/utils/const";
import { useTranslation } from "react-i18next";
import { availableLanguages, getLanguageName } from "@/i18n";

export default function UiSettingsView() {
  const { data: config } = useSWR<FrigateConfig>("config");
  const { t: translate, i18n: i18nInstance } = useTranslation(['views']);

  const clearStoredLayouts = useCallback(() => {
    if (!config) {
      return [];
    }

    Object.entries(config.camera_groups).forEach(async (value) => {
      await delData(`${value[0]}-draggable-layout`)
        .then(() => {
          toast.success(translate('settings.general.layouts.cleared', { group: value[0] }), {
            position: "top-center",
          });
        })
        .catch((error) => {
          toast.error(
            translate('settings.general.layouts.clearError', { error: error.response.data.message }),
            { position: "top-center" },
          );
        });
    });
  }, [config, translate]);

  const clearStreamingSettings = useCallback(async () => {
    if (!config) {
      return [];
    }

    await delData(`streaming-settings`)
      .then(() => {
        toast.success(translate('settings.general.streaming.cleared'), {
          position: "top-center",
        });
      })
      .catch((error) => {
        toast.error(
          translate('settings.general.streaming.clearError', { error: error.response.data.message }),
          { position: "top-center" },
        );
      });
  }, [config, translate]);

  useEffect(() => {
    document.title = translate('settings.general.title') + " - Airys";
  }, [translate]);

  // settings

  const [autoLive, setAutoLive] = usePersistence("autoLiveView", true);
  const [playbackRate, setPlaybackRate] = usePersistence("playbackRate", 1);
  const [weekStartsOn, setWeekStartsOn] = usePersistence("weekStartsOn", 0);
  const [alertVideos, setAlertVideos] = usePersistence("alertVideos", true);

  return (
    <>
      <div className="flex size-full flex-col md:flex-row">
        <Toaster position="top-center" closeButton={true} />
        <div className="scrollbar-container order-last mb-10 mt-2 flex h-full w-full flex-col overflow-y-auto rounded-lg border-[1px] border-secondary-foreground bg-background_alt p-2 md:order-none md:mb-0 md:mr-2 md:mt-0">
          <Heading as="h3" className="my-2">
            {translate('settings.general.title')}
          </Heading>

          <Separator className="my-2 flex bg-secondary" />

          <Heading as="h4" className="my-2">
            {translate('settings.general.language.title')}
          </Heading>

          <div className="mt-2 space-y-6">
            <div className="space-y-0.5">
              <div className="text-md">{translate('settings.general.language.interface')}</div>
              <div className="my-2 text-sm text-muted-foreground">
                <p>{translate('settings.general.language.description')}</p>
              </div>
            </div>
            <Select
              value={i18nInstance.language}
              onValueChange={(value) => i18nInstance.changeLanguage(value)}
            >
              <SelectTrigger className="w-48">
                {getLanguageName(i18nInstance.language as any)}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {availableLanguages.map((lang) => (
                    <SelectItem
                      key={lang}
                      className="cursor-pointer"
                      value={lang}
                    >
                      {getLanguageName(lang)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Separator className="my-2 flex bg-secondary" />

          <Heading as="h4" className="my-2">
            {translate('settings.general.liveDashboard.title')}
          </Heading>

          <div className="mt-2 space-y-6">
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-start gap-2">
                <Switch
                  id="auto-live"
                  checked={autoLive}
                  onCheckedChange={setAutoLive}
                />
                <Label className="cursor-pointer" htmlFor="auto-live">
                  {translate('settings.general.liveDashboard.autoLive')}
                </Label>
              </div>
              <div className="my-2 max-w-5xl text-sm text-muted-foreground">
                <p>
                  {translate('settings.general.liveDashboard.autoLiveDescription')}
                  <em>
                    {translate('settings.general.liveDashboard.autoLiveNote')}
                  </em>
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex flex-row items-center justify-start gap-2">
                <Switch
                  id="images-only"
                  checked={alertVideos}
                  onCheckedChange={setAlertVideos}
                />
                <Label className="cursor-pointer" htmlFor="images-only">
                  {translate('settings.general.liveDashboard.alertVideos')}
                </Label>
              </div>
              <div className="my-2 max-w-5xl text-sm text-muted-foreground">
                <p>{translate('settings.general.liveDashboard.alertVideosDescription')}</p>
              </div>
            </div>
          </div>

          <div className="my-3 flex w-full flex-col space-y-6">
            <div className="mt-2 space-y-3">
              <div className="space-y-0.5">
                <div className="text-md">{translate('settings.general.layouts.title')}</div>
                <div className="my-2 max-w-5xl text-sm text-muted-foreground">
                  <p>{translate('settings.general.layouts.description')}</p>
                </div>
              </div>
              <Button
                aria-label={translate('settings.general.layouts.clearButton')}
                onClick={clearStoredLayouts}
              >
                {translate('settings.general.layouts.clearButton')}
              </Button>
            </div>

            <div className="mt-2 space-y-3">
              <div className="space-y-0.5">
                <div className="text-md">{translate('settings.general.streaming.title')}</div>
                <div className="my-2 max-w-5xl text-sm text-muted-foreground">
                  <p>{translate('settings.general.streaming.description')}</p>
                </div>
              </div>
              <Button
                aria-label={translate('settings.general.streaming.clearButton')}
                onClick={clearStreamingSettings}
              >
                {translate('settings.general.streaming.clearButton')}
              </Button>
            </div>

            <Separator className="my-2 flex bg-secondary" />

            <Heading as="h4" className="my-2">
              {translate('settings.general.recordings.title')}
            </Heading>

            <div className="mt-2 space-y-6">
              <div className="space-y-0.5">
                <div className="text-md">{translate('settings.general.recordings.playbackRate')}</div>
                <div className="my-2 text-sm text-muted-foreground">
                  <p>{translate('settings.general.recordings.playbackRateDescription')}</p>
                </div>
              </div>
            </div>
            <Select
              value={playbackRate?.toString()}
              onValueChange={(value) => setPlaybackRate(parseFloat(value))}
            >
              <SelectTrigger className="w-20">
                {`${playbackRate}x`}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PLAYBACK_RATE_DEFAULT.map((rate) => (
                    <SelectItem
                      key={rate}
                      className="cursor-pointer"
                      value={rate.toString()}
                    >
                      {rate}x
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Separator className="my-2 flex bg-secondary" />

            <Heading as="h4" className="my-2">
              {translate('settings.general.calendar.title')}
            </Heading>

            <div className="mt-2 space-y-6">
              <div className="space-y-0.5">
                <div className="text-md">{translate('settings.general.calendar.firstWeekday')}</div>
                <div className="my-2 text-sm text-muted-foreground">
                  <p>{translate('settings.general.calendar.firstWeekdayDescription')}</p>
                </div>
              </div>
            </div>
            <Select
              value={weekStartsOn?.toString()}
              onValueChange={(value) => setWeekStartsOn(parseInt(value))}
            >
              <SelectTrigger className="w-32">
                {WEEK_STARTS_ON[weekStartsOn ?? 0]}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {WEEK_STARTS_ON.map((day, index) => (
                    <SelectItem
                      key={index}
                      className="cursor-pointer"
                      value={index.toString()}
                    >
                      {day}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Separator className="my-2 flex bg-secondary" />
          </div>
        </div>
      </div>
    </>
  );
}
