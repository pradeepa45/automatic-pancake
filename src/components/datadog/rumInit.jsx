import { datadogRum } from '@datadog/browser-rum';
import { reactPlugin } from '@datadog/browser-rum-react';

datadogRum.init({
  applicationId: '94a06c3e-ade2-498e-b2b1-c169bd0a2cd1',
  clientToken: 'pub0a855eecfde636165bf0ee1d2e6012f9',
  site: 'datadoghq.com',
  service: 'react-node-demo',
  env: 'prod',				// e.g. 'prod', 'staging-1', 'dev'
  version: '1.0.0',	// e.g. '1.0.0'
  sessionSampleRate: 100,			// capture 100% of sessions
  sessionReplaySampleRate: 20,	// capture 20% of sessions with replay
  trackResources: true,			// Enable Resource tracking
  trackUserInteractions: true,	// Enable Action tracking
  trackLongTasks: true,			// Enable Long Tasks tracking
  plugins: [reactPlugin({ router: false })],
});