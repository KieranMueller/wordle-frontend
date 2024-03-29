import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GameSettingsService } from 'src/app/service/game-settings.service';

@Component({
  selector: 'app-play-settings',
  templateUrl: './play-settings.component.html',
  styleUrls: ['./play-settings.component.css'],
})
export class PlaySettingsComponent implements OnInit {
  @Output() closeModalEmitter = new EventEmitter();
  @Output() changeGameColorsEmitter = new EventEmitter();
  @Output() quitEmitter = new EventEmitter();
  flashOff: any;
  soundOff: any;

  /*
  - turn inputs into cool switches/dials
  - settings not working properly, they revert to default state when modal is closed then opened again
  */

  constructor(private settingsService: GameSettingsService) {}

  ngOnInit() {
    this.settingsService.flashOff.subscribe((val) => (this.flashOff = val));
    this.settingsService.soundOff.subscribe((val) => (this.soundOff = val));
  }

  handleClose() {
    this.settingsService.setFlashOff(this.flashOff);
    this.settingsService.setSoundOff(this.soundOff);
    this.emitClose();
  }

  emitClose() {
    this.closeModalEmitter.emit();
  }

  handleQuit() {
    let result = confirm(
      'are you sure you want to quit? (make custom banner popup)'
    );
    if (result) {
      this.closeModalEmitter.emit()
      this.quitEmitter.emit();
    }
  }
}
