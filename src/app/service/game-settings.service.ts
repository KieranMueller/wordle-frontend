import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameSettingsService {
  gameBorderColor = new BehaviorSubject('')
}
