import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { firstValueFrom } from 'rxjs'; // <-- Import this
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

    provideTranslateService({
      lang: 'en',
    }),

    provideTranslateHttpLoader({
      prefix: './assets/i18n/',
      suffix: '.json',
    }),

    // Block Angular from rendering until translations are ready
    provideAppInitializer(() => {
      const translate = inject(TranslateService);

      // firstValueFrom converts the Observable into a Promise that Angular waits for
      return firstValueFrom(translate.use('en'));
    }),
  ],
};
