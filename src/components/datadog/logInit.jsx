import { datadogLogs } from '@datadog/browser-logs';

datadogLogs.init({
  clientToken: 'pub0a855eecfde636165bf0ee1d2e6012f9',
  site: 'datadoghq.com',
  service: 'react-node-demo',
  env: 'prod',
  forwardErrorsToLogs: true,       // send console errors as logs
  sessionSampleRate: 100
});

export const DLogger = datadogLogs.logger;