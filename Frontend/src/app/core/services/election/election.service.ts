import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { CreateElectionDto } from '../../../shared/dtos/create-election-dto';

@Injectable({
  providedIn: 'root',
})
export class ElectionService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/election`;

  createElection(dto: CreateElectionDto): Observable<any> {
    return this.http.post(this.backendUrl, dto);
  }
}
