import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  flashOff = new BehaviorSubject<boolean>(false);
  gameBorderColor = new BehaviorSubject('')

  setFlashOff(val: boolean) {
    this.flashOff.next(val);
  }
}
