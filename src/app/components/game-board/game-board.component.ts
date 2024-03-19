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
  maxAttempts = 6;
  attemptCount = 0;
  charArr = Array(this.width * this.maxAttempts).fill(0);
  usedChars: Array<string> = [];
  currentRow = 0;

  // Board is initialized, charArr is initialized to array of width x height size, filled with 0's.
  // Conditionally not rendering 0s in html
  // this type() method, finds first element that is 0, replaces with the typed character, 
  // until current guess length === word.length
  type(value: any) {
    if (this.currentGuessLength < this.word.length) {
      this.charArr[this.charArr.indexOf(0)] = value;
      this.currentGuessLength++;
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
    this.checkGuess(guess)
    //
    this.attemptCount++;
    this.usedChars.push(...guess);
    console.log(this.usedChars);
    this.currentRow++;
  }

  checkGuess(guess: string) {
    if (guess === this.word) {
      alert('Correct')
      this.gameOver('win')
      return;
    }
  }

  handleCharHighlight() {

  }

  gameOver(status: string) {
    if (status === 'win') {
      alert('You Win')
    }
  }

  del() {}

  checkChar(char: string, index: number) {
    console.log(char + ": " + index)
    return {
      'right-spot': char == 'a'
    }
  }
}
