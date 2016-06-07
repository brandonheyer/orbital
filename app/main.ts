import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './components/app';
import { HTTP_PROVIDERS } from '@angular/http';

bootstrap( AppComponent, [ HTTP_PROVIDERS ] );
