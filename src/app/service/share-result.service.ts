import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendBaseUrl } from 'environment-variables';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ShareResultService {
  tileMap: any;
  totalTiles = 0;
  wordLength = 0;
  gotItIn = '';
  request = {
    word: '',
    attempts: 6,
    timeLimit: 'none',
    greenTilesOnly: false,
  };

  constructor(private http: HttpClient) {}

  getResultString(): string {
    let result = `(${this.gotItIn})\n`;
    for (let i = 0; i < this.totalTiles; i++) {
      if (i > 0 && i % this.wordLength === 0) {
        result += '\n';
      }
      switch (this.tileMap.get(i)) {
        case undefined: {
          result += '⬛';
          break;
        }
        case 'orange': {
          result += '🟨';
          break;
        }
        case 'green': {
          result += '🟩';
          break;
        }
      }
    }
    result += `\n${this.createNewGameLink()}`
    return result;
  }

  createNewGameLink(): string {
    let link = ''
    this.http.post(`${backendBaseUrl}/free-wordle`, this.request).subscribe({
      next: (res) => {
        console.log(res)
        link = 'sup'
      },
      error: (e) => {
        console.log(e);
      },
    });
    return link;
  }
}
