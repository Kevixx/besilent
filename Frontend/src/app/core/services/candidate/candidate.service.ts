import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { map, Observable } from 'rxjs';
import { CreateCandidateDto } from '../../../shared/dtos/create-candidacy-dto';
import { CandidateDto } from '../../../shared/dtos/candidacy-dto';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/candidate`;

  createCandidateProfile(dto: CreateCandidateDto): Observable<any> {
    return this.http.post(this.backendUrl, dto);
  }

  updateCandidateProfile(dto: CandidateDto): Observable<any> {
    return this.http.put(this.backendUrl, dto);
  }

  deleteCandidateProfile(): Observable<any> {
    return this.http.delete(this.backendUrl);
  }

  getMyCandidateProfile(): Observable<CandidateDto> {
    return this.http.get<CandidateDto>(this.backendUrl);
  }

  checkCandidacy(): Observable<boolean> {
    return this.http
      .get<{ isCandidate: boolean }>(`${this.backendUrl}/isCandidate`)
      .pipe(map((response) => response.isCandidate));
  }

  getAllCandidates(): Observable<CandidateDto[]> {
    return this.http.get<CandidateDto[]>(`${this.backendUrl}/all`);
  }
}
