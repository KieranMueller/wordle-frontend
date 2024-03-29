import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  // show time remaining as mm:ss

  ngOnInit() {
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
    if (localStorage.getItem('timeRemaining')) {
      secs = JSON.parse(localStorage.getItem('timeRemaining')!);
    }
    timer(0, 1000)
      .pipe(
        take(secs),
        map((s) => secs - s)
      )
      .subscribe((secs) => {
        if (secs === 1) this.handleTimeRanout();
        this.formatTime(secs);
      });
  }

  formatTime(secs: any) {
    localStorage.setItem('timeRemaining', JSON.stringify(secs));
    this.seconds = secs;
  }

  closeSettings() {
    this.showSettings = false;
    this.emitToGameComponent.emit();
  }

  handleTimeRanout() {
    console.log('timeout!');
  }

  handleQuit() {
    this.quitEmitter.emit();
  }
}
