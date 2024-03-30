import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
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
  giveUpMessage = 'give up';
  disableBtn = false;
  wordLengthSetting = 'random';
  attemptsSetting = '6';
  isFreePlay = true;

  /*
  - turn inputs into cool switches/dials
  - settings not working properly, they revert to default state when modal is closed then opened again
  */

  constructor(private settingsService: GameSettingsService, private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route.snapshot.params['uuidLink']) {
      this.isFreePlay = false;
    }
    this.initializeSettings();
  }

  initializeSettings() {
    if (localStorage.getItem('wordLengthSetting')) {
      let setting = JSON.parse(localStorage.getItem('wordLengthSetting')!);
      if (setting >= 4 && setting <= 9) {
        this.wordLengthSetting = setting;
      } else {
        this.wordLengthSetting = 'random';
      }
    }
    if (localStorage.getItem('attemptsSetting')) {
      let setting = JSON.parse(localStorage.getItem('attemptsSetting')!);
      if (setting >= 4 && setting <= 100) {
        this.attemptsSetting = setting;
      } else {
        this.attemptsSetting = 'random';
      }
    }
    this.settingsService.flashOff.subscribe((val) => (this.flashOff = val));
  }

  handleClose() {
    this.saveSettings();
    this.emitClose();
  }

  saveSettings() {
    localStorage.setItem(
      'wordLengthSetting',
      JSON.stringify(this.wordLengthSetting)
    );

    localStorage.setItem(
      'attemptsSetting',
      JSON.stringify(this.attemptsSetting)
    );

    this.settingsService.setFlashOff(this.flashOff);
  }

  emitClose() {
    this.closeModalEmitter.emit();
  }

  handleQuit(message: any) {
    this.disableBtn = true;
    this.giveUpMessage = 'are you sure?';
    setTimeout(() => {
      this.disableBtn = false;
      this.giveUpMessage = 'yes, give up';
    }, 1000);
    if (message.startsWith('y')) {
      this.closeModalEmitter.emit();
      this.quitEmitter.emit();
    }
  }
}
