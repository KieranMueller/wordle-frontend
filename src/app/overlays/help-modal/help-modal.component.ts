import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.css'],
})
export class HelpModalComponent {
  @Output() emitter = new EventEmitter<boolean>();
  modalClosed = false;
  emitClose() {
    this.modalClosed = true;
    this.emitter.emit(this.modalClosed);
  }
}
