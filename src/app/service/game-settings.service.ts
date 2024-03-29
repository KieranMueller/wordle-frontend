import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  flashOff = new BehaviorSubject<boolean>(false);
  soundOff = new BehaviorSubject<boolean>(false);

  setFlashOff(val: boolean) {
    this.flashOff.next(val);
  }

  setSoundOff(val: boolean) {
    this.soundOff.next(val);
  }
}
