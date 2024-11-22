import { Injectable } from '@angular/core';
import { configURL } from 'src/assets/config';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config: any;

  loadConfig(){
    return this.config = configURL;
  }
  get timeout(): number {
    return this.config?.timeout;
  }
}
