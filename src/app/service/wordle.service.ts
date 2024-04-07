import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { prodBaseUrl } from 'environment-variables'

@Injectable({
  providedIn: 'root'
})
export class WordleService {

  constructor(private http: HttpClient) { }

  deleteWordleByUuidLink(uuidLink: string) {
    return this.http.delete(`${prodBaseUrl}/free-wordle/${uuidLink}`)
  }
}
