import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-play-settings',
  templateUrl: './play-settings.component.html',
  styleUrls: ['./play-settings.component.css'],
})
export class PlaySettingsComponent {
  @Output() emitter = new EventEmitter();

  emitClose() {
    this.emitter.emit();
  }
}
