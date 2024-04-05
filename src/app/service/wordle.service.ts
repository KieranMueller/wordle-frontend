import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordleService {

  constructor(private http: HttpClient) { }

  deleteWordleByUuidLink(uuidLink: string) {
    return this.http.delete(`http://localhost:8080/free-wordle/${uuidLink}`)
  }
}
