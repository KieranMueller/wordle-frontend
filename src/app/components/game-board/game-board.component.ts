import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  keyboard = {
    topRow: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    midRow: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    bottomRow: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  };
  currentGuessLength = 0;
  word = 'jasper';
  maxAttempts = 6;
  totalTiles = this.word.length * this.maxAttempts;
  lastGuess = '';
  currentAttempt = 0;
  charArr = Array(this.totalTiles).fill(null);
  correctArr = Array(this.totalTiles).fill(null);
  compareArr = Array(this.totalTiles).fill(null);
  keyMap = new Map<string, string>();
  // Try to refactor check tile logic, similar to checkKey? map of all indicies with value as color it should be?
  // Todo - word with 3 e's, in guess, 2 e's in right spot, 2 e's in wrong spot, only ONE in wrong spot should be orange
  // currently the 2 in wrong spot are both orange
  currentRow = 0;
  currentGuessStartIndex = 0;
  charCodeMap = new Map<number, string>();

  ngOnInit() {
    this.initializeCorrectArrs();
  }

  initializeCorrectArrs() {
    // fills correctArr with chars in word repeating [word = jasper] ('j', 'a', 's'...)
    for (
      let i = 0, j = 0;
      i < this.totalTiles;
      i++, j < this.word.length - 1 ? j++ : (j = 0)
    ) {
      this.correctArr[i] = this.word[j];
    }
  }

  /* Notes
  Board is initialized, charArr is initialized to array of width x height size, filled with 0's.
  Conditionally not rendering 0s in html
  board layout is only correct now based on hard coded css (grid columns)
  this type() method, finds first element that is 0, replaces with the typed character,
  until current guess length === word.length
  */
  type(value: any) {
    if (this.currentGuessLength < this.word.length) {
      this.charArr[this.charArr.indexOf(null)] = value;
      this.currentGuessLength++;
    }
  }

  /* Notes
  Handles enter key, button is only enabled if the current guess length == word length.
  */
  enter() {
    this.currentGuessLength = 0;
    let guess = '';
    for (
      let i = this.currentGuessStartIndex;
      i < this.currentGuessStartIndex + this.word.length;
      i++
    ) {
      guess += this.charArr[i];
    }
    // handle valid word verification, else dont move on
    this.validateGuess(guess);
    // if true
    this.lastGuess = guess;
    this.checkKeys();
    this.checkTiles();
    this.currentAttempt++;
    this.currentGuessStartIndex += this.word.length;
    if (this.currentAttempt === this.maxAttempts) {
      this.gameOver('lose');
      return;
    }
    this.currentRow++;
  }

  validateGuess(guess: string) {
    if (guess === this.word) {
      alert('Correct');
      this.gameOver('win');
      return;
    }
  }

  gameOver(status: string) {
    if (status === 'win') {
      alert('You Win');
    } else if (status === 'lose') {
      alert('lost');
      return;
    }
  }

  /* Notes
  backspace button, finds most recent typed char (which is the element before the first occurence of '0')
  and 'removes it' by setting it equal to 0, decrement current guess length
  */
  del() {
    this.charArr[this.charArr.indexOf(null) - 1] = null;
    this.currentGuessLength--;
  }

  /* Notes
  handles keyboard key highlighting based on keyMap<key, color>
  */
  checkKeys() {
    for (let i = 0; i < this.word.length; i++) {
      let char = this.lastGuess.charAt(i);
      if (char === this.word.charAt(i)) {
        this.keyMap.set(char, 'green');
      } else if (this.word.includes(char) && !this.keyMap.get(char)) {
        this.keyMap.set(char, 'orange');
      } else if (!this.keyMap.get(char)) {
        this.keyMap.set(char, 'grey');
      }
    }
  }

  /* Notes
  Each array is the size of the board (word.length * maxAttempts) or 'rows' * 'columns'
  word = jasper
  charArr is filled with null, as we type, we replace (from the beginning) null with the char we type
  ['j', 'a', 's', null, null, null, null, null, null, null]...
  correctArr is our entire game board in one 1D array
  ['j', 'a', 's', 'p', 'e', 'r', 'j', 'a', 's', 'p', 'e', 'r']...
  compareArr is initially full of null
  [null, null, null, null, null, null, null, null, null, null]...
  On enter, when a guess is successfully submitted. We loop over charArr and correctArr from the beginning
  index of the guess (the first column of the row) to the last index (the last column of the row). If the elements
  at that index are the same in each array, we have a correctly placed char, and we change the value in compareArr
  at that index. if (charArr[i] === correctArr[i]) compareArr[i] = 'green'

  Handles turning tiles green or orange when a new guess is entered.
  Each loop only runs the duration of the current line (from start of row, to end of row)
  First loop checks for chars in right place and turns green, the map helps the second loop
  see if all occurences of a single letter in a word have been guessed correctly, or not, to solve the issue
  of words with duplicate letters and coloring tiles appropriately.
  second loop handles chars that are in word but incorrect place.
  */
  checkTiles() {
    let limit = this.currentGuessStartIndex + this.word.length;
    const greenLettersMap = new Map<string, number>();

    for (let i = this.currentGuessStartIndex; i < limit; i++) {
      let char = this.charArr[i];
      if (char === this.correctArr[i]) {
        this.compareArr[i] = 'green';
        let greenCharCount = greenLettersMap.get(char);
        greenLettersMap.set(char, greenCharCount ? ++greenCharCount : 1);
      }
    }

    for (let i = this.currentGuessStartIndex; i < limit; i++) {
      let char = this.charArr[i];
      if (
        this.word.includes(char) &&
        this.compareArr[i] !== 'green' &&
        this.numOccurencesOfCharInWord(char) !== greenLettersMap.get(char)
      )
        this.compareArr[i] = 'orange';
    }
  }

  /* Notes
  used to help color tiles in checkTiles() method, takes a char and returns the number
  of occurences of the char in the word (char: a, word: adam -> 2)
  */
  numOccurencesOfCharInWord(char: string) {
    let count = 0;
    for (let letter of this.word) if (letter === char) count++;
    return count;
  }
}
