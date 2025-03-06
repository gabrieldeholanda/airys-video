import Heading from "@/components/ui/heading";
import { FrigateConfig, SearchModelSize } from "@/types/frigateConfig";
import useSWR from "swr";
import axios from "axios";
import ActivityIndicator from "@/components/indicators/activity-indicator";
import { useCallback, useContext, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { LuExternalLink } from "react-icons/lu";
import { StatusBarMessagesContext } from "@/context/statusbar-provider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

type SearchSettingsViewProps = {};

type SearchSettings = {
  enabled: boolean;
  reindex: boolean;
  model_size?: SearchModelSize;
};

export default function SearchSettingsView({}: SearchSettingsViewProps) {
  const { t: translate } = useTranslation(['views']);
  const { data: config, mutate: updateConfig } =
    useSWR<FrigateConfig>("config");
  const [changedValue, setChangedValue] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { addMessage, removeMessage } = useContext(StatusBarMessagesContext)!;

  const [searchSettings, setSearchSettings] = useState<SearchSettings>({
    enabled: false,
    reindex: false,
    model_size: undefined,
  });

  const [origSearchSettings, setOrigSearchSettings] = useState<SearchSettings>({
    enabled: false,
    reindex: false,
    model_size: undefined,
  });

  useEffect(() => {
    if (config) {
      if (searchSettings?.enabled == undefined) {
        setSearchSettings({
          enabled: config.semantic_search.enabled,
          reindex: config.semantic_search.reindex,
          model_size: config.semantic_search.model_size,
        });
      }

      setOrigSearchSettings({
        enabled: config.semantic_search.enabled,
        reindex: config.semantic_search.reindex,
        model_size: config.semantic_search.model_size,
      });
    }
    // we know that these deps are correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  const handleSearchConfigChange = (newConfig: Partial<SearchSettings>) => {
    setSearchSettings((prevConfig) => ({ ...prevConfig, ...newConfig }));
    setChangedValue(true);
  };

  const saveToConfig = useCallback(async () => {
    setIsLoading(true);

    axios
      .put(
        `config/set?semantic_search.enabled=${searchSettings.enabled ? "True" : "False"}&semantic_search.reindex=${searchSettings.reindex ? "True" : "False"}&semantic_search.model_size=${searchSettings.model_size}`,
        {
          requires_restart: 0,
        },
      )
      .then((res) => {
        if (res.status === 200) {
          toast.success(translate('settings.search.messages.saved'), {
            position: "top-center",
          });
          setChangedValue(false);
          updateConfig();
        } else {
          toast.error(
            translate('settings.search.messages.saveError', { error: res.statusText }),
            { position: "top-center" },
          );
        }
      })
      .catch((error) => {
        toast.error(
          translate('settings.search.messages.saveError', {
            error: error.response.data.message,
          }),
          { position: "top-center" },
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [
    updateConfig,
    searchSettings.enabled,
    searchSettings.reindex,
    searchSettings.model_size,
    translate,
  ]);

  const onCancel = useCallback(() => {
    setSearchSettings(origSearchSettings);
    setChangedValue(false);
    removeMessage("search_settings", "search_settings");
  }, [origSearchSettings, removeMessage]);

  useEffect(() => {
    if (changedValue) {
      addMessage(
        "search_settings",
        `Unsaved Explore settings changes`,
        undefined,
        "search_settings",
      );
    } else {
      removeMessage("search_settings", "search_settings");
    }
    // we know that these deps are correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changedValue]);

  useEffect(() => {
    document.title = translate('settings.search.title') + " - Airys";
  }, [translate]);

  if (!config) {
    return <ActivityIndicator />;
  }

  return (
    <div className="flex size-full flex-col md:flex-row">
      <Toaster position="top-center" closeButton={true} />
      <div className="scrollbar-container order-last mb-10 mt-2 flex h-full w-full flex-col overflow-y-auto rounded-lg border-[1px] border-secondary-foreground bg-background_alt p-2 md:order-none md:mb-0 md:mr-2 md:mt-0">
        <Heading as="h3" className="my-2">
          {translate('settings.search.title')}
        </Heading>
        <Separator className="my-2 flex bg-secondary" />
        <Heading as="h4" className="my-2">
          {translate('settings.search.semantic.title')}
        </Heading>
        <div className="max-w-6xl">
          <div className="mb-5 mt-2 flex max-w-5xl flex-col gap-2 text-sm text-primary-variant">
            <p>
              {translate('settings.search.semantic.description')}
            </p>
            <div className="flex items-center text-primary">
              <Link
                to="https://chat.airys.com.br/hc/help/pt_BR/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline"
              >
                {translate('settings.search.semantic.readDocs')}{" "}
                <LuExternalLink className="ml-2 inline-flex size-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-lg flex-col space-y-6">
          <div className="flex flex-row items-center">
            <Switch
              id="enabled"
              className="mr-3"
              checked={searchSettings.enabled}
              onCheckedChange={(checked) => {
                handleSearchConfigChange({ enabled: checked });
              }}
            />
            <div className="space-y-0.5">
              <Label htmlFor="enabled">{translate('settings.search.semantic.enabled.title')}</Label>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row items-center">
              <Switch
                id="reindex"
                className="mr-3"
                checked={searchSettings.reindex}
                onCheckedChange={(checked) => {
                  handleSearchConfigChange({ reindex: checked });
                }}
              />
              <div className="space-y-0.5">
                <Label htmlFor="reindex">{translate('settings.search.semantic.reindex.title')}</Label>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {translate('settings.search.semantic.reindex.description')}
            </div>
          </div>
          <div className="mt-2 flex flex-col space-y-6">
            <div className="space-y-0.5">
              <div className="text-md">{translate('settings.search.semantic.model.title')}</div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  {translate('settings.search.semantic.model.description')}
                </p>
                <ul className="list-disc pl-5 text-sm">
                  <li>
                    {translate('settings.search.semantic.model.small.description')}
                  </li>
                  <li>
                    {translate('settings.search.semantic.model.large.description')}
                  </li>
                </ul>
              </div>
            </div>
            <Select
              value={searchSettings.model_size}
              onValueChange={(value) =>
                handleSearchConfigChange({
                  model_size: value as SearchModelSize,
                })
              }
            >
              <SelectTrigger className="w-20">
                {searchSettings.model_size}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {["small", "large"].map((size) => (
                    <SelectItem
                      key={size}
                      className="cursor-pointer"
                      value={size}
                    >
                      {translate(`settings.search.semantic.model.${size}.title`)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator className="my-2 flex bg-secondary" />

        <div className="flex w-full flex-row items-center gap-2 pt-2 md:w-[25%]">
          <Button className="flex flex-1" aria-label="Reset" onClick={onCancel}>
            {translate('settings.search.actions.reset')}
          </Button>
          <Button
            variant="select"
            disabled={!changedValue || isLoading}
            className="flex flex-1"
            aria-label="Save"
            onClick={saveToConfig}
          >
            {isLoading ? (
              <div className="flex flex-row items-center gap-2">
                <ActivityIndicator />
                <span>{translate('settings.search.actions.saving')}</span>
              </div>
            ) : (
              translate('settings.search.actions.save')
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
