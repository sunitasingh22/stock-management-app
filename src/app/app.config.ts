import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { PortfolioService } from './portfolio/portfolio.service';
import { provideHttpClient } from '@angular/common/http';
import { LivepriceService } from './portfolio/liveprice.service';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), PortfolioService, LivepriceService, provideHttpClient()]
};
