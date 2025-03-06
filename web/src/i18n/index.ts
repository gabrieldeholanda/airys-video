import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguageDirection } from '../utils/rtlUtil';
import LanguageDetector from 'i18next-browser-languagedetector';
import { Language } from './types';

// Import common translations
import enActions from './locales/en/common/actions.json';
import enStatus from './locales/en/common/status.json';
import enTime from './locales/en/common/time.json';
import enErrors from './locales/en/common/errors.json';
import enLabels from './locales/en/common/labels.json';

// Import UI component translations
import enLayout from './locales/en/components/ui/layout.json';
import enDialog from './locales/en/components/ui/dialog.json';
import enButton from './locales/en/components/ui/button.json';
import enGeneralMenu from './locales/en/components/menu/general.json';
import enAccountMenu from './locales/en/components/menu/account.json';
import enLiveMenu from './locales/en/components/menu/live.json';
import enSearchMenu from './locales/en/components/menu/search.json';
import enSearchFilter from './locales/en/components/filter/search.json';
import enSearchActions from './locales/en/components/filter/search_actions.json';
import enCalendarFilter from './locales/en/components/filter/calendar.json';
import enCameraGroupFilter from './locales/en/components/filter/camera_group.json';
import enCamerasFilter from './locales/en/components/filter/cameras.json';
import enFilterSwitch from './locales/en/components/filter/switch.json';
import enLogSettings from './locales/en/components/filter/log_settings.json';
import enReviewFilter from './locales/en/components/filter/review.json';
import enReviewActions from './locales/en/components/review/actions.json';
import enSearchDetail from './locales/en/components/overlay/search_detail.json';
import enReviewDetail from './locales/en/components/overlay/review_detail.json';
import enLifecycle from './locales/en/components/overlay/lifecycle.json';
import enFrigatePlus from './locales/en/components/overlay/frigate_plus.json';
import enZoneMask from './locales/en/components/filter/zone_mask.json';
import enPlatformDialog from './locales/en/components/overlay/platform_dialog.json';
import enRestartDialog from './locales/en/components/overlay/restart_dialog.json';
import enSearchFilterDialog from './locales/en/components/overlay/search_filter.json';
import enTextEntry from './locales/en/components/overlay/text_entry.json';
import enUploadImage from './locales/en/components/overlay/upload_image.json';
import enAnnotationSettings from './locales/en/components/overlay/annotation_settings.json';
import enCameraInfo from './locales/en/components/overlay/camera_info.json';
import enDebugDrawing from './locales/en/components/overlay/debug_drawing.json';
import enExport from './locales/en/components/overlay/export.json';
import enGpuInfo from './locales/en/components/overlay/gpu_info.json';
import enMobileCamera from './locales/en/components/overlay/mobile_camera.json';
import enMobileReviewSettings from './locales/en/components/overlay/mobile_review_settings.json';
import enMobileTimeline from './locales/en/components/overlay/mobile_timeline.json';
import enReviewActivityCalendar from './locales/en/components/overlay/review_activity_calendar.json';
import enSaveExport from './locales/en/components/overlay/save_export.json';
import enTimelineData from './locales/en/components/overlay/timeline_data.json';

// Import view translations
import enSettingsGeneral from './locales/en/views/settings/general.json';
import enSettingsCamera from './locales/en/views/settings/camera.json';
import enSettingsSearch from './locales/en/views/settings/search.json';
import enSettingsMasksZones from './locales/en/views/settings/masks_zones.json';
import enSettingsZoneEdit from './locales/en/views/settings/zone_edit.json';
import enSettingsAuthentication from './locales/en/views/settings/authentication.json';
import enSettingsNotifications from './locales/en/views/settings/notifications.json';
import enSettingsObjectSettings from './locales/en/views/settings/object_settings.json';
import enSettingsMotionMask from './locales/en/views/settings/motion_mask.json';
import enSettingsObjectMask from './locales/en/views/settings/object_mask.json';
import enSettingsMotionTuner from './locales/en/views/settings/motion_tuner.json';
import enLiveDashboard from './locales/en/views/live/dashboard.json';
import enLiveCamera from './locales/en/views/live/camera.json';
import enLiveGrid from './locales/en/views/live/grid.json';
import enLiveBirdseye from './locales/en/views/live/birdseye.json';
import enLive from './locales/en/views/live.json';
import enExplore from './locales/en/views/explore.json';
import enEventsList from './locales/en/views/events/list.json';
import enLogsList from './locales/en/views/logs/list.json';
import enSystemMetrics from './locales/en/views/system/metrics.json';

// Import feature translations
import enNavigation from './locales/en/navigation.json';
import enSettings from './locales/en/settings.json';
import enCameras from './locales/en/cameras.json';
import enEvents from './locales/en/events.json';

// Import auth translations
import enAuth from './locales/en/auth.json';

// Import Brazilian Portuguese translations
import ptBRActions from './locales/pt-BR/common/actions.json';
import ptBRStatus from './locales/pt-BR/common/status.json';
import ptBRTime from './locales/pt-BR/common/time.json';
import ptBRErrors from './locales/pt-BR/common/errors.json';
import ptBRLabels from './locales/pt-BR/common/labels.json';

// Import Brazilian Portuguese UI component translations
import ptBRLayout from './locales/pt-BR/components/ui/layout.json';
import ptBRDialog from './locales/pt-BR/components/ui/dialog.json';
import ptBRButton from './locales/pt-BR/components/ui/button.json';
import ptBRGeneralMenu from './locales/pt-BR/components/menu/general.json';
import ptBRAccountMenu from './locales/pt-BR/components/menu/account.json';
import ptBRLiveMenu from './locales/pt-BR/components/menu/live.json';
import ptBRSearchMenu from './locales/pt-BR/components/menu/search.json';
import ptBRSearchFilter from './locales/pt-BR/components/filter/search.json';
import ptBRSearchActions from './locales/pt-BR/components/filter/search_actions.json';
import ptBRCalendarFilter from './locales/pt-BR/components/filter/calendar.json';
import ptBRCameraGroupFilter from './locales/pt-BR/components/filter/camera_group.json';
import ptBRCamerasFilter from './locales/pt-BR/components/filter/cameras.json';
import ptBRFilterSwitch from './locales/pt-BR/components/filter/switch.json';
import ptBRLogSettings from './locales/pt-BR/components/filter/log_settings.json';
import ptBRReviewFilter from './locales/pt-BR/components/filter/review.json';
import ptBRReviewActions from './locales/pt-BR/components/review/actions.json';
import ptBRSearchDetail from './locales/pt-BR/components/overlay/search_detail.json';
import ptBRReviewDetail from './locales/pt-BR/components/overlay/review_detail.json';
import ptBRLifecycle from './locales/pt-BR/components/overlay/lifecycle.json';
import ptBRFrigatePlus from './locales/pt-BR/components/overlay/frigate_plus.json';
import ptBRZoneMask from './locales/pt-BR/components/filter/zone_mask.json';
import ptBRPlatformDialog from './locales/pt-BR/components/overlay/platform_dialog.json';
import ptBRRestartDialog from './locales/pt-BR/components/overlay/restart_dialog.json';
import ptBRSearchFilterDialog from './locales/pt-BR/components/overlay/search_filter.json';
import ptBRTextEntry from './locales/pt-BR/components/overlay/text_entry.json';
import ptBRUploadImage from './locales/pt-BR/components/overlay/upload_image.json';
import ptBRAnnotationSettings from './locales/pt-BR/components/overlay/annotation_settings.json';
import ptBRCameraInfo from './locales/pt-BR/components/overlay/camera_info.json';
import ptBRDebugDrawing from './locales/pt-BR/components/overlay/debug_drawing.json';
import ptBRExport from './locales/pt-BR/components/overlay/export.json';
import ptBRGpuInfo from './locales/pt-BR/components/overlay/gpu_info.json';
import ptBRMobileCamera from './locales/pt-BR/components/overlay/mobile_camera.json';
import ptBRMobileReviewSettings from './locales/pt-BR/components/overlay/mobile_review_settings.json';
import ptBRMobileTimeline from './locales/pt-BR/components/overlay/mobile_timeline.json';
import ptBRReviewActivityCalendar from './locales/pt-BR/components/overlay/review_activity_calendar.json';
import ptBRSaveExport from './locales/pt-BR/components/overlay/save_export.json';
import ptBRTimelineData from './locales/pt-BR/components/overlay/timeline_data.json';

// Import Brazilian Portuguese view translations
import ptBRSettingsGeneral from './locales/pt-BR/views/settings/general.json';
import ptBRSettingsCamera from './locales/pt-BR/views/settings/camera.json';
import ptBRSettingsSearch from './locales/pt-BR/views/settings/search.json';
import ptBRSettingsMasksZones from './locales/pt-BR/views/settings/masks_zones.json';
import ptBRSettingsZoneEdit from './locales/pt-BR/views/settings/zone_edit.json';
import ptBRSettingsAuthentication from './locales/pt-BR/views/settings/authentication.json';
import ptBRSettingsNotifications from './locales/pt-BR/views/settings/notifications.json';
import ptBRSettingsObjectSettings from './locales/pt-BR/views/settings/object_settings.json';
import ptBRSettingsMotionMask from './locales/pt-BR/views/settings/motion_mask.json';
import ptBRSettingsObjectMask from './locales/pt-BR/views/settings/object_mask.json';
import ptBRSettingsMotionTuner from './locales/pt-BR/views/settings/motion_tuner.json';
import ptBRLiveDashboard from './locales/pt-BR/views/live/dashboard.json';
import ptBRLiveCamera from './locales/pt-BR/views/live/camera.json';
import ptBRLiveGrid from './locales/pt-BR/views/live/grid.json';
import ptBRLiveBirdseye from './locales/pt-BR/views/live/birdseye.json';
import ptBRLive from './locales/pt-BR/views/live.json';
import ptBRExplore from './locales/pt-BR/views/explore.json';
import ptBREventsList from './locales/pt-BR/views/events/list.json';
import ptBRLogsList from './locales/pt-BR/views/logs/list.json';
import ptBRSystemMetrics from './locales/pt-BR/views/system/metrics.json';

// Import Brazilian Portuguese feature translations
import ptBRNavigation from './locales/pt-BR/navigation.json';
import ptBRSettings from './locales/pt-BR/settings.json';
import ptBRCameras from './locales/pt-BR/cameras.json';
import ptBREvents from './locales/pt-BR/events.json';

// Import auth translations
import ptBRAuth from './locales/pt-BR/auth.json';

const resources = {
  en: {
    common: {
      ...enActions,
      ...enStatus,
      ...enTime,
      ...enErrors,
      ...enLabels
    },
    auth: enAuth,
    ui: {
      layout: enLayout,
      dialog: enDialog,
      button: enButton,
      menu: {
        general: enGeneralMenu,
        account: enAccountMenu,
        live: enLiveMenu,
        search: enSearchMenu
      },
      filter: {
        search: enSearchFilter,
        search_actions: enSearchActions,
        calendar: enCalendarFilter,
        camera_group: enCameraGroupFilter,
        cameras: enCamerasFilter,
        switch: enFilterSwitch,
        log_settings: enLogSettings,
        review: enReviewFilter,
        zone_mask: enZoneMask
      },
      review: {
        actions: enReviewActions
      },
      overlay: {
        search_detail: enSearchDetail,
        review_detail: enReviewDetail,
        lifecycle: enLifecycle,
        frigate_plus: enFrigatePlus,
        platform_dialog: enPlatformDialog,
        restart_dialog: enRestartDialog,
        search_filter: enSearchFilterDialog,
        text_entry: enTextEntry,
        upload_image: enUploadImage,
        annotation_settings: enAnnotationSettings,
        camera_info: enCameraInfo,
        debug_drawing: enDebugDrawing,
        export: enExport,
        gpu_info: enGpuInfo,
        mobile_camera: enMobileCamera,
        mobile_review_settings: enMobileReviewSettings,
        mobile_timeline: enMobileTimeline,
        review_activity_calendar: enReviewActivityCalendar,
        save_export: enSaveExport,
        timeline_data: enTimelineData
      }
    },
    navigation: enNavigation,
    views: {
      settings: {
        general: enSettingsGeneral,
        camera: enSettingsCamera,
        search: enSettingsSearch,
        masks_zones: enSettingsMasksZones,
        zone_edit: enSettingsZoneEdit,
        authentication: enSettingsAuthentication,
        notifications: enSettingsNotifications,
        object_settings: enSettingsObjectSettings,
        motion_mask: enSettingsMotionMask,
        object_mask: enSettingsObjectMask,
        motion_tuner: enSettingsMotionTuner
      },
      live: {
        dashboard: enLiveDashboard,
        camera: enLiveCamera,
        grid: enLiveGrid,
        birdseye: enLiveBirdseye,
        ...enLive
      },
      explore: enExplore,
      events: {
        list: enEventsList
      },
      logs: {
        list: enLogsList
      },
      system: {
        metrics: enSystemMetrics
      }
    },
    settings: enSettings,
    cameras: enCameras,
    events: enEvents
  },
  'pt-BR': {
    common: {
      ...ptBRActions,
      ...ptBRStatus,
      ...ptBRTime,
      ...ptBRErrors,
      ...ptBRLabels
    },
    auth: ptBRAuth,
    ui: {
      layout: ptBRLayout,
      dialog: ptBRDialog,
      button: ptBRButton,
      menu: {
        general: ptBRGeneralMenu,
        account: ptBRAccountMenu,
        live: ptBRLiveMenu,
        search: ptBRSearchMenu
      },
      filter: {
        search: ptBRSearchFilter,
        search_actions: ptBRSearchActions,
        calendar: ptBRCalendarFilter,
        camera_group: ptBRCameraGroupFilter,
        cameras: ptBRCamerasFilter,
        switch: ptBRFilterSwitch,
        log_settings: ptBRLogSettings,
        review: ptBRReviewFilter,
        zone_mask: ptBRZoneMask
      },
      review: {
        actions: ptBRReviewActions
      },
      overlay: {
        search_detail: ptBRSearchDetail,
        review_detail: ptBRReviewDetail,
        lifecycle: ptBRLifecycle,
        frigate_plus: ptBRFrigatePlus,
        platform_dialog: ptBRPlatformDialog,
        restart_dialog: ptBRRestartDialog,
        search_filter: ptBRSearchFilterDialog,
        text_entry: ptBRTextEntry,
        upload_image: ptBRUploadImage,
        annotation_settings: ptBRAnnotationSettings,
        camera_info: ptBRCameraInfo,
        debug_drawing: ptBRDebugDrawing,
        export: ptBRExport,
        gpu_info: ptBRGpuInfo,
        mobile_camera: ptBRMobileCamera,
        mobile_review_settings: ptBRMobileReviewSettings,
        mobile_timeline: ptBRMobileTimeline,
        review_activity_calendar: ptBRReviewActivityCalendar,
        save_export: ptBRSaveExport,
        timeline_data: ptBRTimelineData
      }
    },
    navigation: ptBRNavigation,
    views: {
      settings: {
        general: ptBRSettingsGeneral,
        camera: ptBRSettingsCamera,
        search: ptBRSettingsSearch,
        masks_zones: ptBRSettingsMasksZones,
        zone_edit: ptBRSettingsZoneEdit,
        authentication: ptBRSettingsAuthentication,
        notifications: ptBRSettingsNotifications,
        object_settings: ptBRSettingsObjectSettings,
        motion_mask: ptBRSettingsMotionMask,
        object_mask: ptBRSettingsObjectMask,
        motion_tuner: ptBRSettingsMotionTuner
      },
      live: {
        dashboard: ptBRLiveDashboard,
        camera: ptBRLiveCamera,
        grid: ptBRLiveGrid,
        birdseye: ptBRLiveBirdseye,
        ...ptBRLive
      },
      explore: ptBRExplore,
      events: {
        list: ptBREventsList
      },
      logs: {
        list: ptBRLogsList
      },
      system: {
        metrics: ptBRSystemMetrics
      }
    },
    settings: ptBRSettings,
    cameras: ptBRCameras,
    events: ptBREvents
  }
} as const;

export const defaultNS = 'common';
export const fallbackLng = 'pt-BR';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR',
    fallbackLng,
    ns: ['common', 'ui', 'views', 'navigation', 'settings', 'cameras', 'events', 'auth'],
    defaultNS,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Update document direction when language changes
i18n.on('languageChanged', (lng) => {
  const dir = getLanguageDirection(lng);
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export const availableLanguages: Language[] = ['en', 'pt-BR'];

export const getLanguageName = (code: Language): string => {
  switch (code) {
    case 'en':
      return 'English';
    case 'pt-BR':
      return 'Português (Brasil)';
    default:
      return code;
  }
};

export default i18n; 