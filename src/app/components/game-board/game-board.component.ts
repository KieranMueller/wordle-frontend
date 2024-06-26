import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GameSettingsService } from 'src/app/service/game-settings.service';
import { wordsList } from './randomWordsList';
import { WordleService } from 'src/app/service/wordle.service';
import { backendBaseUrl } from 'environment-variables';
import { ShareResultService } from 'src/app/service/share-result.service';

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
  word = '';
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
  timeLimit = new BehaviorSubject<number | null>(null);
  timeLimitString = '';
  flashOff = false;
  canRefresh = false;
  win = false;
  lose = false;
  errorMessage = '';
  loading = false;
  exchangesBetweenRandomWordApiAndDictionaryApiCounter = 0;
  boardInitialized = false;
  hasInternetConnection = true;
  wordLengthPreference = 'random';
  attemptsPreference = 'random';
  isFreePlay = true;
  gameUuid = '';
  hasGameHistory = false;
  gameDisabled = false;

  /* TODO
  - Add area where users can submit requests for bugs etc. Or recomendations
  - Copy to clipboard still not working on mobile after generating custom word, setTimeout? Touch action manipulation, idk
  - Share game with share tool not capturing link and text when sending
  - Add ability to play the daily wordle
  - Implement scoring system, show on game over modal based on num guesses, correct guesses etc
  - Implement timer for free play mode
  - implement client default share tool sharing (ios), need backend hooked up in prod to test well
  - add option to share on social media
  - Ensure share game works in lose modal as well
  - fill up wordslist for manually setting word, set toggle?
  - add modern theme color scheme option?
  - Ensure I wipe timers from local storage after custom games end (can't figure out how)
  - Get CSS looking good!
  - Find a better random word API
  - Put time to live on local storage properties? Game state props etc remain if game is abandoned during play and not returned to
  */

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private settingsService: GameSettingsService,
    private wordleService: WordleService,
    private shareResultsService: ShareResultService
  ) {}

  ngOnInit() {
    console.log('get out of here you cheater!')
    this.loading = true;
    setTimeout(() => {
      this.boardInitialized = true;
    }, 1000);
    this.wipeExpiredLocalStorageTimers();
    this.handleAnyModeSettings();
    if (this.route.snapshot.params['uuidLink']) {
      this.isFreePlay = false;
      const uuid = this.route.snapshot.params['uuidLink'];
      this.gameUuid = uuid;
      if (JSON.parse(localStorage.getItem('gameHistory' + this.gameUuid)!)) {
        this.hasGameHistory = true;
      }
      this.getWordleFromDB(uuid);
    } else {
      this.handleFreePlaySettings();
      this.getRandomWordRequest();
    }
    this.initializeOccurencesOfCharInWordMap();
    this.initalizeBoardAndTileColor();
  }

  wipeExpiredLocalStorageTimers() {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      if (key?.startsWith('timeRemainingFor:')) {
        if (JSON.parse(localStorage.getItem(key)!) === 0) {
          localStorage.removeItem(key);
        }
      }
    }
  }

  getWordleFromDB(uuid: string) {
    this.http.get(`${backendBaseUrl}/free-wordle/${uuid}`).subscribe({
      next: (res) => {
        this.initalizeFieldsFromDBWordle(res);
      },
      error: (e) => {
        this.loading = false;
        if (e.status.toString().startsWith('4')) this.handleBadRequest(e);
        if (e.status.toString().startsWith('5')) this.handleFailedRequest(e);
        if (e.status.toString().startsWith('0')) this.handleNoInternet(e);
      },
    });
  }

  initalizeFieldsFromDBWordle(wordle: any) {
    console.log(wordle);
    this.word = wordle.word;
    this.maxAttempts = wordle.attempts;
    this.timeLimitString = wordle.timeLimit;
    this.startTimer(wordle.timeLimit);
    if (!this.hasGameHistory) {
      this.totalTiles = this.word.length * this.maxAttempts;
      this.charArr = Array(this.totalTiles).fill(null);
    } else {
      this.loadGameHistory();
    }
    this.loading = false;
  }

  loadGameHistory() {
    let histCharArr = JSON.parse(
      localStorage.getItem('charArr' + this.gameUuid)!
    );
    if (histCharArr) this.charArr = histCharArr;
    let histGuessList = JSON.parse(
      localStorage.getItem('guessList' + this.gameUuid)!
    );
    if (histGuessList) this.guessList = histGuessList;
    let histCurrentAttempt = JSON.parse(
      localStorage.getItem('currentAttempt' + this.gameUuid)!
    );
    if (histCurrentAttempt) this.currentAttempt = histCurrentAttempt;
    let histCurrentGuessStartIndex = JSON.parse(
      localStorage.getItem('currentGuessStartIndex' + this.gameUuid)!
    );
    if (histCurrentGuessStartIndex)
      this.currentGuessStartIndex = histCurrentGuessStartIndex;
    this.keyMap = new Map(
      JSON.parse(localStorage.getItem('keyMap' + this.gameUuid)!)
    );
    this.tileMap = new Map(
      JSON.parse(localStorage.getItem('tileMap' + this.gameUuid)!)
    );
  }

  handleBadRequest(error: any) {
    this.router.navigateByUrl('/not-found');
  }

  handleNoInternet(error: any) {
    this.loading = false;
    this.errorMessage = 'no internet connection...';
    setTimeout(() => {
      this.errorMessage = '';
    }, 1000);
  }

  handleFailedRequest(e: HttpErrorResponse | null) {
    this.loading = false;
    this.errorMessage = 'issues communicating with our servers...';
    setTimeout(() => {
      this.errorMessage = '';
    }, 1000);
  }

  getRandomWordRequest() {
    let length = Math.floor(Math.random() * 6) + 4;
    if (this.wordLengthPreference !== 'random')
      length = parseInt(this.wordLengthPreference);
    this.http
      .get(`https://random-word-api.herokuapp.com/word?length=${length}`)
      .subscribe({
        next: (res) => {
          this.ensureRandomWordExistsInDictionaryAPI(res.toString());
        },
        error: (e) => {
          this.manuallySetRandomWord();
        },
      });
  }

  ensureRandomWordExistsInDictionaryAPI(word: string) {
    this.exchangesBetweenRandomWordApiAndDictionaryApiCounter++;
    if (this.exchangesBetweenRandomWordApiAndDictionaryApiCounter > 6) {
      alert('something went wrong, server down');
      this.handleFailedRequest(null);
      return;
    }
    this.http
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .subscribe({
        next: (res) => {
          this.word = word;
          console.log(word)
          this.loading = false;
          this.initializeFreePlayFields();
        },
        error: (e) => {
          if (e.status.toString().startsWith('4')) this.getRandomWordRequest();
          if (e.status.toString().startsWith('5')) this.handleFailedRequest(e);
          if (e.status.toString().startsWith('0')) this.handleNoInternet(e);
        },
      });
  }

  manuallySetRandomWord() {
    this.errorMessage =
      'error fetching word, setting manually, guesses will NOT be checked';
    let length = Math.floor(Math.random() * 6) + 4;
    if (this.wordLengthPreference !== 'random')
      length = parseInt(this.wordLengthPreference);
    let arrToSelectFrom = wordsList[length];
    let randomIndex = Math.floor(Math.random() * arrToSelectFrom.length);
    this.word = arrToSelectFrom[randomIndex];
    this.loading = false;
    this.hasInternetConnection = false;
    this.initializeFreePlayFields();
  }

  initializeFreePlayFields() {
    this.maxAttempts = parseInt(this.attemptsPreference);
    this.totalTiles = this.word.length * this.maxAttempts;
    this.charArr = Array(this.totalTiles).fill(null);
  }

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
    this.settingsService.gameBorderColor.next(this.boardColor);
    colors.splice(colors.indexOf(this.boardColor), 1);
    colors.splice(colors.indexOf('green'), 1);
    colors.splice(colors.indexOf('orange'), 1);
    rando = Math.floor(Math.random() * colors.length);
    this.tileColor = colors[rando];
  }

  startTimer(timeLimit: string) {
    if (timeLimit === 'none') return;
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
    this.timeLimit.next(time);
  }

  @HostListener('window:keydown', ['$event.key'])
  onKeyDown($event: string) {
    if (this.gameDisabled) return;
    if (this.validChars.includes($event.toLocaleLowerCase()))
      this.type($event.toLocaleLowerCase());
    if ($event === 'Backspace') this.del();
    if ($event === 'Enter') this.enter();
  }

  type(value: string) {
    if (this.gameDisabled) return;
    if (this.charArr.indexOf(null) === -1) return;
    if (this.currentGuessLength < this.word.length) {
      this.charArr[this.charArr.indexOf(null)] = value;
      this.currentGuessLength++;
    }
  }

  del() {
    this.animateInvalidGuess = false;
    this.hasChangedInvalidGuess = true;
    if (this.currentGuessLength === 0 || this.isGameOver) return;
    this.charArr[this.charArr.indexOf(null) - 1] = null;
    if (this.charArr.indexOf(null) < 0)
      this.charArr[this.charArr.length - 1] = null;
    this.currentGuessLength--;
  }

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
      this.handleInvalidGuess('(already used this word)');
      return;
    }
    if (guess === this.word) {
      this.handleWin();
      return;
    }
    this.loading = true;
    if (this.hasInternetConnection) {
      this.http
        .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`)
        .subscribe({
          next: () => this.handleValidGuess(guess),
          error: (e) => {
            if (e.status.toString().startsWith('4')) this.handleInvalidGuess();
            if (e.status.toString().startsWith('5'))
              this.handleFailedRequest(e);
            if (e.status.toString().startsWith('0')) this.handleNoInternet(e);
          },
        });
    } else {
      this.handleValidGuess(guess);
    }
  }

  handleValidGuess(guess: string) {
    this.loading = false;
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
    this.setGameHistoryInRankedMode();
  }

  setGameHistoryInRankedMode() {
    if (this.isFreePlay) return;
    localStorage.setItem('gameHistory' + this.gameUuid, JSON.stringify(true));
    localStorage.setItem(
      'charArr' + this.gameUuid,
      JSON.stringify(this.charArr)
    );
    localStorage.setItem(
      'guessList' + this.gameUuid,
      JSON.stringify(this.guessList)
    );
    localStorage.setItem(
      'currentAttempt' + this.gameUuid,
      JSON.stringify(this.currentAttempt)
    );
    localStorage.setItem(
      'currentGuessStartIndex' + this.gameUuid,
      JSON.stringify(this.currentGuessStartIndex)
    );
  }

  handleInvalidGuess(message: string = '(not a word)') {
    this.loading = false;
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 1000);
    this.animateInvalidGuess = true;
    this.hasChangedInvalidGuess = false;
  }

  handleWin() {
    this.handleShareResults(true);
    this.handleKeyAndTileHighlight();
    this.isGameOver = true;
    this.gameDisabled = true;
    setTimeout(() => {
      this.win = true;
    }, 600);
    if (!this.isFreePlay) {
      this.wordleService.deleteWordleByUuidLink(this.gameUuid).subscribe();
      this.settingsService.hasWonRankedGame$.next(true);
    }
    this.clearGameHistoryFromLocalStorage();
  }

  handleLose() {
    this.handleShareResults();
    this.isGameOver = true;
    this.gameDisabled = true;
    setTimeout(() => {
      this.lose = true;
    }, 600);
    if (!this.isFreePlay)
      this.wordleService.deleteWordleByUuidLink(this.gameUuid).subscribe();
    this.clearGameHistoryFromLocalStorage();
  }

  clearGameHistoryFromLocalStorage() {
    localStorage.removeItem('charArr' + this.gameUuid);
    localStorage.removeItem('gameHistory' + this.gameUuid);
    localStorage.removeItem('guessList' + this.gameUuid);
    localStorage.removeItem('currentAttempt' + this.gameUuid);
    localStorage.removeItem('currentGuessStartIndex' + this.gameUuid);
    localStorage.removeItem('keyMap' + this.gameUuid);
    localStorage.removeItem('tileMap' + this.gameUuid);
  }

  handleShareResults(didWin: boolean = false) {
    this.shareResultsService.tileMap = this.tileMap;
    this.shareResultsService.totalTiles = this.totalTiles;
    this.shareResultsService.wordLength = this.word.length;
    this.shareResultsService.gotItIn =
      (didWin ? this.currentAttempt + 1 : this.currentAttempt) +
      '/' +
      this.maxAttempts;
    this.shareResultsService.request.word = this.word;
    this.shareResultsService.request.attempts = this.maxAttempts;
    this.shareResultsService.request.timeLimit = this.timeLimitString;
    this.shareResultsService.didWin = didWin;
  }

  handleKeyAndTileHighlight() {
    this.checkKeys();
    this.checkTiles();
  }

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
    localStorage.setItem(
      'keyMap' + this.gameUuid,
      JSON.stringify(Array.from(this.keyMap))
    );
  }

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
    localStorage.setItem(
      'tileMap' + this.gameUuid,
      JSON.stringify(Array.from(this.tileMap))
    );
  }

  handleAnyModeSettings() {
    if (localStorage.getItem('flashOff')) {
      this.flashOff = JSON.parse(localStorage.getItem('flashOff')!);
    }
  }

  handleFreePlaySettings() {
    if (localStorage.getItem('wordLengthSetting')) {
      this.wordLengthPreference = JSON.parse(
        localStorage.getItem('wordLengthSetting')!
      );
    } else {
      this.wordLengthPreference = 'random';
    }
    if (localStorage.getItem('attemptsSetting')) {
      this.attemptsPreference = JSON.parse(
        localStorage.getItem('attemptsSetting')!
      );
    } else {
      this.attemptsPreference = '6';
    }
  }

  hideGameOverModal() {
    this.lose = false;
    this.win = false;
    this.gameDisabled = true;
  }
}
