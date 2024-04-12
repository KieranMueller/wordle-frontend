import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { backendBaseUrl, frontendBaseUrl } from 'environment-variables';
import { BehaviorSubject } from 'rxjs';

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
  result = new BehaviorSubject<string>('');
  didWin = false;

  constructor(private http: HttpClient) {}

  getResultString() {
    let result = `(${this.gotItIn})\n`;
    for (let i = 0; i < this.totalTiles; i++) {
      if (i > 0 && i % this.wordLength === 0) {
        result += '\n';
      }
      switch (this.tileMap.get(i)) {
        case undefined: {
          result += '⬜';
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
    this.createNewGameLink();
    this.result.next(result);
  }

  createNewGameLink() {
    if (!this.request.timeLimit) this.request.timeLimit = 'none';
    this.http.post(`${backendBaseUrl}/free-wordle`, this.request).subscribe({
      next: (res: any) => {
        this.result.next(
          `${this.result.getValue()}\n\nI ${this.didWin ? 'GOT IT' : 'lost'} in ${
            this.gotItIn
          } attempts playing Wordle By Kieran, try your luck with this word using the link below!\n\n${frontendBaseUrl}/play/${
            res.uuidLink
          }`
        );
      },
      error: () => {
        this.result.next(`${this.result.getValue()}\nerror creating shareable link :(`)
      },
    });
  }
}
