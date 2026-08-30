import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { CreateProfileDto } from '../../../shared/dtos/create-profile-dto';
import { ProfileDto } from '../../../shared/dtos/profile-dto';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/candidate`;

  createCandidateProfile(dto: CreateProfileDto): Observable<any> {
    return this.http.post(this.backendUrl, dto);
  }

  getMyCandidateProfile(): Observable<ProfileDto> {
    return this.http.get<ProfileDto>(this.backendUrl);
  }

  checkCandidacy(): Observable<boolean> {
    return this.http
      .get<{ isCandidate: boolean }>(`${this.backendUrl}/isCandidate`)
      .pipe(map((response) => response.isCandidate));
  }

  getAllCandidates(): Observable<ProfileDto[]> {
    return this.http.get<ProfileDto[]>(`${this.backendUrl}/all`);
  }
}
