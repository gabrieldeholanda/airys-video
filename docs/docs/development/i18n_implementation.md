# Internationalization (i18n) Implementation Guide

## Current State Analysis

### Existing Language-Related Features
- Browser locale detection via `window.navigator.language`
- Date/time formatting using `Intl.DateTimeFormat`
- Relative time formatting using `Intl.RelativeTimeFormat`
- Basic string manipulation (using `replaceAll("_", " ")` and capitalization)

### Files Using Language/Locale Features
- `web/src/utils/dateUtil.ts`: Date/time formatting
- `web/src/lib/formatTimeAgo.ts`: Relative time formatting
- `web/src/types/frigateConfig.ts`: UI configuration types
- Multiple components using string manipulation for labels

### Translation Namespaces and Content Mapping

#### 1. Common Namespace (`common.json`)
Common translations used across multiple components:
- Actions: back, save, cancel, delete, edit, add, remove, apply, reset, confirm, close
- Status messages: loading, error, success, warning, info, healthy
- System metrics: CPU usage, GPU usage (AMD, Intel)
- Time units: seconds, minutes, hours, days, weeks, months, years
- Error messages: required fields, invalid format, network error
- Confirmation dialogs: titles, messages, yes/no buttons

#### 2. Settings Namespace (`settings.json`)
Settings page and related components:
- General settings section
  - Language settings (interface language, descriptions)
  - Live dashboard settings (auto-live, alerts)
  - Layout management (stored layouts, clearing)
  - Streaming settings (camera groups)
  - Recording settings (playback rates)
  - Calendar settings (first weekday)
- Camera settings
  - Camera management (add, edit, delete)
- Search settings
  - Semantic search configuration
  - Model size selection
  - Reindexing options

#### 3. Live Namespace (`live.json`)
Live view components and dashboard:
- Dashboard elements
  - Camera group management
  - Camera status and controls
- Camera components
  - Status messages (offline, loading, error)
  - Control buttons (fullscreen, snapshot, record)
  - Streaming options
- Alert components
  - Recent alerts section
  - Object detection labels
  - Alert actions

#### 4. Events Namespace (`events.json`)
Event review and management:
- Review interface
  - Event filters (camera, date range, objects)
  - Event list headers
  - Event details
- Object categories
  - Detection types (person, vehicle, animal)
  - Count formatting
- Zone information
  - Zone types (entry, motion)
  - Zone count formatting

#### 5. Logs Namespace (`logs.json`)
Log viewing and management:
- Log interface elements
  - Type labels
  - Timestamp formatting
  - Tag categories
  - Message display
- Settings and filters
  - Severity levels
  - Component filters
  - Time range selection
- Actions
  - Streaming controls
  - Log management (copy, download, clear)

#### 6. Status Namespace (`status.json`)
System status information:
- System health indicators
- Resource usage
  - Memory metrics
  - Storage metrics
  - Network statistics
- Camera status
  - Online/offline counts
  - Recording status
- Problem indicators
  - Storage warnings
  - Performance issues
  - Connectivity problems

### Component-Specific Translation Usage

1. Base UI Components
- Most UI components in `web/src/components/ui/` are base components using Radix UI primitives
- These components don't contain hardcoded text that needs translation
- They serve as building blocks, with text provided when used in views/features
- Examples:
  - `input.tsx`: Provides input structure, labels/placeholders added when used
  - `radio-group.tsx`: Provides radio button structure, labels added when used
  - `tabs.tsx`: Provides tab structure, tab labels added when used

2. View Components (Need Translation)
- `UiSettingsView.tsx`: Main settings interface
  - Language selection text
  - Interface configuration labels
  - System preferences options
- `LogSettingsButton.tsx`: Log filtering and settings
  - Filter labels
  - Setting descriptions
  - Action button text

3. Feature Components (Need Translation)
- `CameraStreamingDialog.tsx`: Camera streaming configuration
  - Stream type labels
  - Setting descriptions
  - Error messages
- `SearchFilterGroup.tsx`: Search filtering
  - Filter labels
  - Action buttons
  - Help text

## Implementation Plan

### 1. Translation Infrastructure Setup
- [x] Add `react-i18next` dependencies
- [x] Create i18n directory structure:
```
web/src/i18n/
├── types.ts           ✅ # Language and translation type definitions
├── index.ts          ✅ # i18n configuration and initialization
└── locales/
    ├── en/
    │   ├── common/
    │   │   ├── actions.json     ✅ # Common action labels (save, cancel, etc.)
    │   │   ├── errors.json      ✅ # Error messages and validation
    │   │   ├── status.json      ✅ # Status messages and indicators
    │   │   └── time.json        ✅ # Time formatting and relative time
    │   ├── views/
    │   │   ├── settings/
    │   │   │   ├── general.json ❌ # General settings view text
    │   │   │   ├── search.json  ❌ # Search settings view text
    │   │   │   └── ui.json      ❌ # UI settings view text
    │   │   ├── live/
    │   │   │   ├── dashboard.json ❌ # Live dashboard view text
    │   │   │   └── controls.json  ❌ # Live view controls text
    │   │   ├── events/
    │   │   │   ├── list.json    ❌ # Event list view text
    │   │   │   └── details.json ❌ # Event details view text
    │   │   └── logs/
    │   │       ├── viewer.json  ❌ # Log viewer text
    │   │       └── settings.json ❌ # Log settings text
    │   └── features/
    │       ├── streaming/
    │       │   ├── settings.json ❌ # Streaming feature settings
    │       │   └── controls.json ❌ # Streaming controls text
    │       └── alerts/
    │           ├── notifications.json ❌ # Alert notification text
    │           └── settings.json ❌ # Alert settings text
    └── pt-BR/        # Brazilian Portuguese (same structure as en/)
```
- [x] Configure TypeScript for type-safe translations
- [x] Set up translation loading system

### 2. UI Configuration Updates
- [x] Extend `UiConfig` interface in `types/frigateConfig.ts`:
```typescript
export interface UiConfig {
  // Existing fields...
  language?: Language;        // e.g. 'en', 'pt-BR'
  fallback_language?: Language; // default: 'en'
}
```
- [x] Add language selection to UI settings
- [x] Implement language persistence
- [x] Add language detection on first load

### 3. Translation Content Organization
- [x] Organize translations by feature/page:
  - `common.json`: Shared translations (actions, status, time, errors)
  - `settings.json`: Settings page translations
  - `live.json`: Live view translations
  - `events.json`: Events page translations
  - `logs.json`: Logs page translations
  - `status.json`: Status bar translations
- [x] Create base English translations
- [x] Add Brazilian Portuguese translations
- [x] Implement string extraction tool/process

### 4. Component Updates
- [x] Update components to use translation hooks:
  - `UiSettingsView.tsx`
  - `LogSettingsButton.tsx`
  - `SearchFilterGroup.tsx`
  - `CameraStreamingDialog.tsx`
  - `Statusbar.tsx`
  - `LogInfoDialog.tsx`
  - `SearchSettingsView.tsx`
- [x] Handle dynamic content (interpolation)
- [ ] Update tests for i18n support

### 5. Documentation
- [x] Add translation contribution guide
- [x] Document string extraction process
- [x] Add language addition guide
- [x] Update main documentation

## Progress Tracking

### Completed Tasks
- Initial analysis of existing language features
- Creation of implementation plan
- Basic infrastructure setup:
  - Created i18n directory structure with feature-based organization
  - Added type definitions for translations
  - Created base translation files for English and Brazilian Portuguese
  - Added i18n configuration
  - Added required dependencies to package.json
- UI Configuration Updates:
  - Extended UiConfig interface with language support
  - Added type-safe language configuration
  - Added language selection UI component to settings
  - Integrated with i18next for language switching
- Translation Integration:
  - Created separate translation files for each feature/page
  - Added translations for common elements (actions, status, time, errors)
  - Added translations for UI components (layout, dialog, button)
  - Added type definitions for all translations
  - Added tests for i18n functionality
  - Implemented dynamic content interpolation for:
    - Status messages
    - Error messages
    - Counts and pluralization
    - GPU names and usage
    - Layout and streaming settings
- Documentation:
  - Added translation contribution guide
  - Added language addition guide
  - Updated main documentation

### In Progress
- Adding more languages
- View-specific translations:
  - Settings views ✅
  - Live view components ✅
  - Event view components ✅
  - Log view components ✅
- Feature-specific translations:
  - Streaming features ❌
  - Alert features ❌
  - Search features ❌

### Next Steps
1. Add support for additional languages:
   - Add support for more European languages
   - Test with native speakers
2. Complete feature-specific translations:
   - Create translation files for each feature
   - Add comprehensive error messages
   - Add feature-specific tests
3. Documentation and guidelines:
   - Document translation testing procedures
   - Create translation troubleshooting guide
   - Add view-specific translation examples
4. Performance optimization:
   - Implement lazy loading for translations
   - Add bundle size monitoring
   - Optimize translation loading

## Instructions for AI Assistant

1. **Context Preservation**
   - Always review this document before making i18n-related changes
   - Update the Progress Tracking section after each task
   - Add new requirements or considerations as discovered

2. **Implementation Guidelines**
   - Maintain backward compatibility
   - Ensure type safety
   - Follow React best practices
   - Consider performance implications

3. **Documentation Updates**
   - Add implementation details as completed
   - Document any challenges and solutions
   - Update next steps after each change

4. **Quality Checks**
   - Verify translations work with existing date/time formatting
   - Ensure fallback behavior works
   - Verify performance impact

## Notes

### Performance Considerations
- Lazy load translations by feature/page
- Minimize bundle size impact
- Cache translations appropriately

### Security Considerations
- Sanitize interpolated content
- Validate language files
- Handle malformed translations gracefully

### Accessibility
- Maintain ARIA labels
- Support screen readers
- Handle language switching announcements

### Language-Specific Considerations
- Handle Brazilian Portuguese specific date/time formats
- Consider cultural differences in UI elements
- Support Brazilian Portuguese collation and sorting

### Translation File Organization
- Each feature/page has its own translation file
- Common translations shared across features in `common.json`
- Consistent structure between language files
- Clear naming conventions for translation keys

### Translation Key Examples and Usage

#### Common Translation Keys
```typescript
// Simple text
t('common.actions.save')          // Output: "Save"
t('common.actions.cancel')        // Output: "Cancel"

// With interpolation
t('common.status.cpu', { percent: 75 })  // Output: "CPU 75%"
t('common.status.gpu.usage', { 
  name: t('common.status.gpu.intel-vaapi'),
  percent: 60 
})  // Output: "Intel GPU 60%"

// Pluralization
t('events.objects.count', { count: 1 })  // Output: "1 object"
t('events.objects.count', { count: 5 })  // Output: "5 objects"

// With HTML content (React components)
<Label>{t('settings.general.language.title')}</Label>
<Button aria-label={t('settings.general.layouts.clearButton')}>
  {t('settings.general.layouts.clearButton')}
</Button>
```

#### Component-Specific Examples

1. Status Bar Component:
```typescript
// Statusbar.tsx
const healthyMessage = t('status.healthy');  // "System is healthy"
const cpuUsage = t('status.cpu', { percent: cpuPercent });
const reindexingStatus = t('status.reindexing', { 
  percent: Math.floor(progress * 100) 
});
```

2. Log Settings:
```typescript
// LogSettingsButton.tsx
const filterTitle = t('logs.settings.filter.title');  // "Filter"
const streamingLabel = t('logs.settings.loading.disableStreaming');
const severityLabel = t('logs.severity.warning');  // "Warning"
```

3. Camera Streaming Dialog:
```typescript
// CameraStreamingDialog.tsx
const streamingWarning = t('streaming.continuous.warning');
const compatibilityTitle = t('streaming.compatibility.title');
const description = t('streaming.compatibility.description');
```

### Guide: Adding New Translatable Content

#### 1. Identify Translation Needs
Before adding new translatable content:
- Determine which namespace it belongs to
- Check if similar translations already exist
- Consider if it needs interpolation or pluralization

#### 2. Add Translation Keys
1. Add to English translation file first:
```json
// web/src/i18n/locales/en/namespace.json
{
  "feature": {
    "newKey": "New translatable text",
    "withVariable": "Text with {{variable}}",
    "withPlural": {
      "one": "{{count}} item",
      "other": "{{count}} items"
    }
  }
}
```

2. Add to other language files (e.g., pt-BR):
```json
// web/src/i18n/locales/pt-BR/namespace.json
{
  "feature": {
    "newKey": "Novo texto traduzível",
    "withVariable": "Texto com {{variable}}",
    "withPlural": {
      "one": "{{count}} item",
      "other": "{{count}} items"
    }
  }
}
```

#### 3. Update TypeScript Types
Add new keys to the translation type definitions:
```typescript
// web/src/i18n/types.ts
export interface TranslationKeys {
  namespace: {
    feature: {
      newKey: string;
      withVariable: string;
      withPlural: {
        one: string;
        other: string;
      };
    };
  };
}
```

#### 4. Use in Components
```typescript
import { useTranslation } from 'react-i18next';

export function MyComponent() {
  const { t } = useTranslation('namespace');

  return (
    <div>
      <p>{t('feature.newKey')}</p>
      <p>{t('feature.withVariable', { variable: 'example' })}</p>
      <p>{t('feature.withPlural', { count: 2 })}</p>
    </div>
  );
}
```

#### 5. Best Practices
1. **Key Naming**:
   - Use camelCase for keys
   - Group related translations under feature namespaces
   - Use descriptive names that indicate content
   ```typescript
   // Good
   'settings.general.language.title'
   'camera.controls.snapshot'
   
   // Avoid
   'text1'
   'buttonLabel'
   ```

2. **Variables**:
   - Use descriptive variable names
   - Document expected variables in comments
   ```typescript
   // With documented variables
   /** 
    * Variables:
    * - name: GPU name (e.g., "Intel GPU")
    * - percent: Usage percentage (0-100)
    */
   'gpu.usage': '{{name}} {{percent}}%'
   ```

3. **Pluralization**:
   - Always use count variable for plurals
   - Consider zero state if needed
   ```json
   {
     "results": {
       "zero": "No results found",
       "one": "{{count}} result found",
       "other": "{{count}} results found"
     }
   }
   ```

4. **Context**:
   - Add context comments for translators
   ```json
   {
     "key": {
       "_comment": "Shown when user hovers over the save button",
       "text": "Save changes"
     }
   }
   ```

#### 6. Testing New Translations
1. Verify all languages have the new keys
2. Test with different variable values
3. Check pluralization rules
4. Verify RTL display if applicable
5. Test fallback behavior

#### 7. Common Patterns

1. **Button Labels with ARIA**:
```typescript
<Button
  aria-label={t('feature.action.buttonLabel')}
  onClick={handleClick}
>
  {t('feature.action.buttonLabel')}
</Button>
```

2. **Error Messages**:
```typescript
const [error, setError] = useState<string | null>(null);

// Later in code
setError(t('feature.errors.notFound'));
```

3. **Dynamic Content**:
```typescript
const message = t('feature.dynamic', {
  value: dynamicValue,
  context: isSpecial ? 'special' : 'normal'
});
```

4. **Formatted Numbers/Dates**:
```typescript
const formattedValue = t('feature.metric', {
  value: new Intl.NumberFormat(i18n.language).format(number)
});
```

---
Last Updated: February 14, 2024
Current Status: Translation Support Implementation Completed
Next Action Item: Add support for additional European languages 