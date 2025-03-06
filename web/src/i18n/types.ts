export type Language = 'en' | 'pt-BR';

export type TextDirection = 'ltr' | 'rtl';

export interface LanguageConfig {
  code: Language;
  name: string;
  direction: TextDirection;
}

export interface CommonTranslations {
  actions: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    remove: string;
    apply: string;
    reset: string;
    confirm: string;
    close: string;
    back: string;
  };
  status: {
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    healthy: string;
    cpu: string;
    gpu: {
      'amd-vaapi': string;
      'intel-vaapi': string;
      'intel-qsv': string;
      usage: string;
    };
  };
  time: {
    units: {
      second: string;
      seconds: string;
      minute: string;
      minutes: string;
      hour: string;
      hours: string;
      day: string;
      days: string;
      week: string;
      weeks: string;
      month: string;
      months: string;
      year: string;
      years: string;
    };
    relative: {
      just_now: string;
      seconds_ago: string;
      seconds_ago_plural: string;
      minutes_ago: string;
      minutes_ago_plural: string;
      hours_ago: string;
      hours_ago_plural: string;
      days_ago: string;
      days_ago_plural: string;
      weeks_ago: string;
      weeks_ago_plural: string;
      months_ago: string;
      months_ago_plural: string;
      years_ago: string;
      years_ago_plural: string;
    };
  };
  errors: {
    required_field: string;
    invalid_format: string;
    network_error: string;
    unknown_error: string;
    validation: {
      required: string;
      min_length: string;
      max_length: string;
      pattern: string;
      email: string;
      url: string;
      number: string;
      integer: string;
      positive: string;
      negative: string;
      date: string;
    };
  };
}

export interface UiTranslations {
  layout: {
    sidebar: {
      toggle: string;
      collapse: string;
      expand: string;
    };
    header: {
      menu: string;
      notifications: string;
      profile: string;
      settings: string;
    };
    main: {
      skip_to_content: string;
      loading: string;
    };
    footer: {
      version: string;
      copyright: string;
    };
  };
  dialog: {
    close: string;
    confirm: {
      title: string;
      message: string;
      yes: string;
      no: string;
    };
    delete: {
      title: string;
      message: string;
      yes: string;
      no: string;
    };
    error: {
      title: string;
      message: string;
      retry: string;
      close: string;
    };
    success: {
      title: string;
      message: string;
      close: string;
    };
  };
  button: {
    aria: {
      loading: string;
      disabled: string;
      toggle: string;
    };
    states: {
      loading: string;
      processing: string;
      saving: string;
      deleting: string;
      uploading: string;
    };
    actions: {
      refresh: string;
      upload: string;
      download: string;
      search: string;
      filter: string;
      clear: string;
      more: string;
      less: string;
      next: string;
      previous: string;
      first: string;
      last: string;
    };
  };
}

export interface TranslationKeys {
  common: CommonTranslations;
  ui: UiTranslations;
  navigation: {
    live: string;
    events: string;
    explore: string;
    exports: string;
    system: string;
    settings: string;
    config: string;
    logs: string;
    faces: string;
  };
  settings: {
    general: {
      title: string;
      language: {
        title: string;
        interface: string;
        description: string;
      };
      liveDashboard: {
        title: string;
        autoLive: string;
        autoLiveDescription: string;
        autoLiveNote: string;
        alertVideos: string;
        alertVideosDescription: string;
      };
      layouts: {
        title: string;
        description: string;
        clearButton: string;
        cleared: string;
        clearError: string;
      };
      streaming: {
        title: string;
        description: string;
        clearButton: string;
        cleared: string;
        clearError: string;
      };
      recordings: {
        title: string;
        playbackRate: string;
        playbackRateDescription: string;
      };
      calendar: {
        title: string;
        firstWeekday: string;
        firstWeekdayDescription: string;
      };
    };
    cameras: {
      title: string;
      addCamera: string;
      editCamera: string;
      deleteCamera: string;
    };
  };
  cameras: {
    status: {
      online: string;
      offline: string;
      disabled: string;
    };
    actions: {
      snapshot: string;
      record: string;
      restart: string;
    };
  };
  events: {
    noEvents: string;
    timeRange: string;
    filtered: string;
    detected: string;
  };
  status: {
    reindexing: string;
  };
} 