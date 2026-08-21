import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { CreatePartyDto } from '../../shared/dtos/create-party-dto';

@Injectable({
  providedIn: 'root',
})
export class PartyService {
  private http = inject(HttpClient);
  private backendUrl = `${environment.apiUrl}/party`;

  createParty(dto: CreatePartyDto): Observable<any> {
    return this.http.post(this.backendUrl, dto);
  }
}
