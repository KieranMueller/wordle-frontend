import { Component } from '@angular/core';

@Component({
  selector: 'app-game-board-options-bar',
  templateUrl: './game-board-options-bar.component.html',
  styleUrls: ['./game-board-options-bar.component.css'],
})
export class GameBoardOptionsBarComponent {
  showSettings = false;

  closeSettings() {
    this.showSettings = false;
  }
}
