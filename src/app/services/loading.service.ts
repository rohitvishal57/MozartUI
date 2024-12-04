import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
 
  private loadingCount = 0;  // Track the number of active API calls
  private isLoadingSubject = new BehaviorSubject<boolean>(false);  // Global loading state
 
  // Observable to watch the loading state
  public isLoading$ = this.isLoadingSubject.asObservable();
 
  // Method to show the loader for a request
  show(): void {
    this.loadingCount++;
    this.isLoadingSubject.next(true);  // Set the global loading state to true
  }
 
  // Method to hide the loader for a request
  hide(): void {
    if (this.loadingCount > 0) {
      this.loadingCount--;
    }
    if (this.loadingCount === 0) {
      this.isLoadingSubject.next(false);  // Set the global loading state to false
    }
  }
}