import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { map, Observable } from 'rxjs';
import { CreateProfileDto } from '../../shared/dtos/create-profile-dto';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/candidate`;

  createProfile(dto: CreateProfileDto): Observable<any> {
    return this.http.post(this.backendUrl, dto);
  }

  getCandidateId(): Observable<boolean> {
    return this.http
      .get<{ isCandidate: boolean }>(`${this.backendUrl}/isCandidate`)
      .pipe(map((response) => response.isCandidate));
  }
}
