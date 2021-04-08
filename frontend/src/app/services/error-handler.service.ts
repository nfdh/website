import { ErrorHandler, Injectable } from '@angular/core';
import { MonitoringService } from './monitoring.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService extends ErrorHandler {

  constructor(private monitoringService: MonitoringService) {
    super();
}

  handleError(error: Error) {
      this.monitoringService.logException(error);
      console.log(error);
  }
}
