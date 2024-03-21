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
  word = 'teethe';
  maxAttempts = 6;
  totalTiles = this.word.length * this.maxAttempts;
  lastGuess = '';
  currentAttempt = 0;
  charArr = Array(this.totalTiles).fill(null);
  keyMap = new Map<string, string>();
  tileMap = new Map<number, string>();
  occurencesOfCharInWordMap = new Map<string, number>();
  // Try to refactor check tile logic, similar to checkKey? map of all indicies with value as color it should be?
  // Todo - word with 3 e's, in guess, 2 e's in right spot, 2 e's in wrong spot, only ONE in wrong spot should be orange
  // currently the 2 in wrong spot are both orange
  currentGuessStartIndex = 0;

  ngOnInit() {
    this.initializeOccurencesOfCharInWordMap();
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
  Handles turning tiles the correct color after each guess. OnInit, we initialize occurencesOfCharInWordMap to track
  how many times a character appears in the word. This is important for setting the duplicate char tiles orange
  example -> word has 3 e's, we guess 4, 2 in right spot should be green, the first e in wrong spot should be orange
  and the last e in the wrong spot should be grey/nothing. We create numOccurencesOfCharInLastGuessMap to update
  the char count from the last guess as we loop, this variable is used in the conditional for the loop responsible for
  setting tiles orange. We do not enter the loop to set the fourth 'e' in our example orange since this map.get('e') is not
  less than occurencesOfCharInWordMap.get('e'). They are equal, therefore we do NOT want to enter the conditional to set the
  tile orange
  */
  checkTiles() {
    let occurencesOfCharInLastGuessMap = new Map<string, number>();
    let span = this.currentGuessStartIndex + this.word.length;

    for (
      let i = this.currentGuessStartIndex, j = 0;
      i < span;
      i++, j < this.word.length - 1 ? j++ : (j = 0)
    ) {
      let correctChar = this.word.charAt(j);
      if (this.charArr[i] === correctChar) {
        let count = occurencesOfCharInLastGuessMap.get(correctChar);
        occurencesOfCharInLastGuessMap.set(correctChar, count ? ++count : 1);
        this.tileMap.set(i, 'green');
      }
    }

    for (let i = this.currentGuessStartIndex; i < span; i++) {
      let char = this.charArr[i];
      if (
        this.word.includes(char) &&
        !this.tileMap.get(i) &&
        occurencesOfCharInLastGuessMap.get(char)! <
          this.occurencesOfCharInWordMap.get(char)!
      ) {
        this.tileMap.set(i, 'orange');
        occurencesOfCharInLastGuessMap.set(
          char,
          occurencesOfCharInLastGuessMap.get(char)!
            ? occurencesOfCharInLastGuessMap.get(char)! + 1
            : 1
        );
      }
    }
  }

  /* Notes
  used to help color tiles in checkTiles() method, takes a char and returns the number
  of occurences of the char in the word (char: a, word: adam -> 2)
  */
  initializeOccurencesOfCharInWordMap() {
    for (let char of this.word) {
      let count = this.occurencesOfCharInWordMap.get(char);
      this.occurencesOfCharInWordMap.set(char, count ? ++count : 1);
    }
  }
}
