import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

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
  word = ''; // must be between 4-9 chars inclusive
  maxAttempts = 0;
  totalTiles = 0;
  lastGuess = '';
  guessList: string[] = [];
  currentAttempt = 0;
  charArr: any;
  keyMap = new Map<string, string>();
  tileMap = new Map<number, string>();
  occurencesOfCharInWordMap = new Map<string, number>();
  currentGuessStartIndex = 0;
  isGameOver = false;
  animateInvalidGuess = false;
  hasChangedInvalidGuess = true;
  boardColor = '';
  tileColor = '';
  validChars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  /* TODO
  - Have UI keyboard buttons look like they are being clicked when using personal keyboard
  - Add a how to play button/modal for first timers + instructions (How the game works, what colors mean etc.)
  - Remove the possibility of simply refreshing page to restart game and guesses
  - Add sound effects
  - Randomize color of keyboard
  - Allow user to randomize colors of page by button, without reloading page or game, anytime
  - Add ability to play the daily wordle
  - Add loading spinner while API checks word
  - Implement scoring system, show on game over modal based on num guesses, correct guesses etc
  - Implement timer for timed mode
  - Add ability for unlimited guesses? Have game board scroll if so?
  - Add bad internet connection modal
  - Add option to turn off blinking active tile
  - Add win/lose end game modal!
  - Create bad request modal (couldn't retrieve wordle with uuid, add option to play with random word)
  */

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route.snapshot.params['uuidLink']) {
      const uuid = this.route.snapshot.params['uuidLink'];
      this.getWordleFromDB(uuid);
    } else this.initializeFields();
    this.initializeOccurencesOfCharInWordMap();
    this.initalizeBoardAndTileColor();
  }

  getWordleFromDB(uuid: string) {
    this.http.get(`http://localhost:8080/free-wordle/${uuid}`).subscribe({
      next: (res) => {
        this.initalizeFieldsFromDBWordle(res);
      },
      error: (e) => {
        if (e.status.toString().startsWith('4')) this.handleBadRequest(e);
        if (
          e.status.toString().startsWith('5') ||
          e.status.toString().startsWith('0')
        )
          this.handleFailedRequest(e);
      },
    });
  }

  initalizeFieldsFromDBWordle(wordle: any) {
    console.log(wordle);
    this.word = wordle.word;
    this.maxAttempts = wordle.attempts;
    this.startTimer(wordle.timeLimit);
    this.totalTiles = this.word.length * this.maxAttempts;
    this.charArr = Array(this.totalTiles).fill(null);
  }

  handleBadRequest(error: any) {
    console.log(error);
  }

  initializeFields() {
    // refactor logic for all of this, local storage??
    if (localStorage.getItem('word')) {
      this.word = localStorage.getItem('word')!;
    } else {
      this.word = 'indigo';
    }
    if (localStorage.getItem('maxAttempts')) {
      this.maxAttempts = JSON.parse(localStorage.getItem('maxAttempts')!);
    } else this.maxAttempts = 6;
    this.totalTiles = this.word.length * this.maxAttempts;
    this.charArr = Array(this.totalTiles).fill(null);
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

  initalizeBoardAndTileColor() {
    let colors = ['red', 'green', 'yellow', 'orange', 'blue'];
    let rando = Math.floor(Math.random() * colors.length);
    this.boardColor = colors[rando];
    colors.splice(colors.indexOf(this.boardColor), 1);
    colors.splice(colors.indexOf('green'), 1);
    colors.splice(colors.indexOf('orange'), 1);
    rando = Math.floor(Math.random() * colors.length);
    this.tileColor = colors[rando];
  }

  startTimer(timeLimit: string) {
    if (timeLimit === 'none') return;
    console.log(timeLimit);
    let time = 1000 * 60 * 60;
    switch (timeLimit) {
      case '30s': {
        time = 1000 * 30;
        break;
      }
      case '1m': {
        time = 1000 * 60;
        break;
      }
      case '2m': {
        time = 1000 * 60 * 2;
        break;
      }
      case '5m': {
        time = 1000 * 60 * 5;
        break;
      }
      case '10m': {
        time = 1000 * 60 * 10;
        break;
      }
    }
  }

  @HostListener('window:keydown', ['$event.key'])
  onKeyDown($event: string) {
    if (this.validChars.includes($event.toLocaleLowerCase()))
      this.type($event.toLocaleLowerCase());
    if ($event === 'Backspace') this.del();
    if ($event === 'Enter') this.enter();
  }

  /* Notes
  Board is initialized, charArr is initialized to array of width x height size, filled with 0's.
  Conditionally not rendering 0s in html
  board layout is only correct now based on hard coded css (grid columns)
  this type() method, finds first element that is 0, replaces with the typed character,
  until current guess length === word.length
  */
  type(value: string) {
    if (this.charArr.indexOf(null) === -1) return;
    if (this.currentGuessLength < this.word.length) {
      this.charArr[this.charArr.indexOf(null)] = value;
      this.currentGuessLength++;
    }
  }

  /* Notes
  backspace button, finds most recent typed char (which is the element before the first occurence of '0')
  and 'removes it' by setting it equal to 0, decrement current guess length
  */
  del() {
    this.animateInvalidGuess = false;
    this.hasChangedInvalidGuess = true;
    if (this.currentGuessLength === 0 || this.isGameOver) return;
    this.charArr[this.charArr.indexOf(null) - 1] = null;
    if (this.charArr.indexOf(null) < 0)
      this.charArr[this.charArr.length - 1] = null;
    this.currentGuessLength--;
  }

  /* Notes
  Handles enter key, button is only enabled if the current guess length == word length.
  */
  enter() {
    if (
      this.currentGuessLength !== this.word.length ||
      !this.hasChangedInvalidGuess ||
      this.isGameOver
    )
      return;
    let guess = '';
    for (
      let i = this.currentGuessStartIndex;
      i < this.currentGuessStartIndex + this.word.length;
      i++
    ) {
      guess += this.charArr[i];
    }
    if (this.guessList.includes(guess)) {
      this.handleInvalidGuess();
      return;
    }
    if (guess === this.word) {
      this.handleWin();
      return;
    }
    this.validateGuess(guess).subscribe({
      next: () => this.handleValidGuess(guess),
      error: (e) => {
        if (e.status.toString().startsWith('4')) this.handleInvalidGuess();
        if (
          e.status.toString().startsWith('5') ||
          e.status.toString().startsWith('0')
        )
          this.handleFailedRequest(e);
      },
    });
  }

  validateGuess(guess: string): Observable<any> {
    return this.http.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`
    );
  }

  handleValidGuess(guess: string) {
    this.lastGuess = guess;
    this.guessList.push(this.lastGuess);
    this.handleKeyAndTileHighlight();
    this.currentAttempt++;
    if (this.currentAttempt === this.maxAttempts) {
      this.handleLose();
      return;
    }
    this.currentGuessLength = 0;
    this.currentGuessStartIndex += this.word.length;
  }

  handleInvalidGuess() {
    this.animateInvalidGuess = true;
    this.hasChangedInvalidGuess = false;
  }

  handleFailedRequest(e: HttpErrorResponse) {
    console.log(e);
    console.log(
      'Experiencing internet connection issues.\nMessage is: ' + e.message
    );
  }

  handleWin() {
    this.handleKeyAndTileHighlight();
    this.isGameOver = true;
    alert('You Win');
  }

  handleLose() {
    this.isGameOver = true;
    alert('You Lose');
  }

  handleKeyAndTileHighlight() {
    this.checkKeys();
    this.checkTiles();
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
        (occurencesOfCharInLastGuessMap.get(char)! <
          this.occurencesOfCharInWordMap.get(char)! ||
          !occurencesOfCharInLastGuessMap.get(char))
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
}
