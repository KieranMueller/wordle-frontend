import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendBaseUrl } from 'environment-variables';

@Injectable({
  providedIn: 'root',
})
export class WordleService {
  constructor(private http: HttpClient) {}

  deleteWordleByUuidLink(uuidLink: string) {
    return this.http.delete(`${backendBaseUrl}/free-wordle/${uuidLink}`);
  }
}
