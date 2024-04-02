import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
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
  @Input() randomBtnColor = ''
  randomBtnBorder: any;

  /*
  - turn inputs into cool switches/dials
  - settings not working properly, they revert to default state when modal is closed then opened again
  */

  constructor(private settingsService: GameSettingsService, private route: ActivatedRoute, private router: Router, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    this.settingsService.gameBorderColor.subscribe(color => this.randomBtnBorder = color)
    if (this.route.snapshot.params['uuidLink']) {
      this.isFreePlay = false;
    }
    this.initializeSettings();
  }

  test() {
    console.log(this.randomBtnBorder)
  }

  changeGameColors() {
    this.changeGameColorsEmitter.emit()
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
    this.saveAnyModeSettings();
    this.emitClose();
  }

  saveAnyModeSettings() {


    this.settingsService.setFlashOff(this.flashOff);
  }

  saveFreePlaySettings() {
    localStorage.setItem(
      'wordLengthSetting',
      JSON.stringify(this.wordLengthSetting)
    );

    localStorage.setItem(
      'attemptsSetting',
      JSON.stringify(this.attemptsSetting)
    );
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

  loadGame() {
    this.saveFreePlaySettings()
    location.reload()
  }
}
