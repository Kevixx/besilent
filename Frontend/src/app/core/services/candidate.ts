import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

// Define the shape of the data going to the backend
export interface CreateProfileDto {
  bio: string;
  partyId: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/candidate`;

  createProfile(dto: CreateProfileDto): Observable<any> {
    return this.http.post(this.backendUrl, dto);
  }
}
