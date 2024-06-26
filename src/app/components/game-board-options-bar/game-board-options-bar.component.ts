import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, map, take, timer } from 'rxjs';
import { GameSettingsService } from 'src/app/service/game-settings.service';

@Component({
  selector: 'app-game-board-options-bar',
  templateUrl: './game-board-options-bar.component.html',
  styleUrls: ['./game-board-options-bar.component.css'],
})
export class GameBoardOptionsBarComponent {
  @Output() emitToGameComponent = new EventEmitter();
  @Output() changeGameBoardColorsEmitter = new EventEmitter();
  @Output() quitEmitter = new EventEmitter();
  showSettings = false;
  @Input() timeLimit$ = new BehaviorSubject<null | number>(null);
  minutes = 0;
  seconds = 0;
  showHelpModal = false;
  gameUuid = '';
  @Input() randomBtnColor = '';
  hasWon = false;

  // show time remaining as mm:ss

  constructor(
    private route: ActivatedRoute,
    private gameService: GameSettingsService
  ) {}

  ngOnInit() {
    this.gameUuid = this.route.snapshot.url[1].path;
    this.gameService.hasWonRankedGame$.subscribe({
      next: (res) => {
        this.hasWon = res;
      },
    });
    this.timeLimit$.subscribe({
      next: (secs) => {
        this.startTimer(secs);
      },
    });
  }

  closeModal() {
    this.showHelpModal = false;
  }

  startTimer(ms: any) {
    if (!ms) return;
    let secs = ms / 1000;
    if (localStorage.getItem(`timeRemainingFor:${this.gameUuid}`)) {
      secs = JSON.parse(
        localStorage.getItem(`timeRemainingFor:${this.gameUuid}`)!
      );
    }
    const timer$ = timer(0, 1000)
      .pipe(
        take(secs),
        map((s) => secs - s)
      )
      .subscribe((secs) => {
        if (secs === 1 || this.hasWon) {
          timer$.unsubscribe();
          this.handleQuit();
        }
        this.formatTime(secs);
      });
  }

  formatTime(secs: any) {
    if (localStorage.getItem(`timeRemainingFor:${this.gameUuid}`) !== '0') {
      localStorage.setItem(
        `timeRemainingFor:${this.gameUuid}`,
        JSON.stringify(secs)
      );
      this.seconds = secs;
    } else {
      this.handleQuit();
    }
  }

  closeSettings() {
    this.showSettings = false;
    this.emitToGameComponent.emit();
  }

  handleQuit() {
    if (localStorage.getItem(`timeRemainingFor:${this.gameUuid}`)) {
      localStorage.setItem(
        `timeRemainingFor:${this.gameUuid}`,
        JSON.stringify(0)
      );
    }
    if (!this.hasWon) this.quitEmitter.emit();
  }
}
