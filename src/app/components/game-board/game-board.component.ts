import { Component } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent {
  currentGuessLength = 0;
  word = 'cradle';
  width = this.word.length;
  height = 6;
  charArr = Array(this.width * this.height).fill(0);
  usedChars: Array<string> = [];
  currentRow = 0;

  type(value: any) {
    for (let i = 0; i < this.charArr.length; i++) {
      if (!this.charArr[i] && this.currentGuessLength < this.word.length) {
        this.charArr[i] = value;
        this.currentGuessLength++;
        break;
      }
    }
  }

  enter() {
    this.currentGuessLength = 0;
    let startIndex = this.currentRow * this.word.length;
    let guess = '';
    for (let i = startIndex; i < startIndex + this.word.length; i++) {
      guess += this.charArr[i];
    }
    console.log(guess);
    // handle valid word verification, else dont move on
    this.usedChars.push(...guess);
    console.log(this.usedChars);
    this.currentRow++;
  }

  del() {}
}
