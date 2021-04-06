import { Injectable } from '@angular/core';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  appInsights: ApplicationInsights | null;

  constructor() { 
    if(environment.appInsights === null) {
      this.appInsights = null;
    }
    else {
      this.appInsights = new ApplicationInsights({
        config: {
          instrumentationKey: environment.appInsights.instrumentationKey,
          enableAutoRouteTracking: true
        }
      });
      this.appInsights.loadAppInsights();
    }
  }

  logEvent(name: string, properties?: { [key: string]: any }) {
    if(this.appInsights === null) return;
    this.appInsights.trackEvent({ name: name}, properties);
  }

  logMetric(name: string, average: number, properties?: { [key: string]: any }) {
    if(this.appInsights === null) return;
    this.appInsights.trackMetric({ name: name, average: average }, properties);
  }

  logException(exception: Error, severityLevel?: number) {
    if(this.appInsights === null) return;
    this.appInsights.trackException({ exception: exception, severityLevel: severityLevel });
  }

  logTrace(message: string, properties?: { [key: string]: any }) {
    if(this.appInsights === null) return;
    this.appInsights.trackTrace({ message: message}, properties);
  }
}
