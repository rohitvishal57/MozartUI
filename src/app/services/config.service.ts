import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public config: any;

  constructor(private http: HttpClient) {}

  loadConfig() {
    return  this.config = environment;
  }
  get timeout(): number {
    return this.config?.timeout;
  }
}
