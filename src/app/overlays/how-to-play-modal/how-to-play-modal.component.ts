import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-how-to-play-modal',
  templateUrl: './how-to-play-modal.component.html',
  styleUrl: './how-to-play-modal.component.css',
})
export class HowToPlayModalComponent {
  @Output() emitter = new EventEmitter()

  closeModal() {
    this.emitter.emit()
  }

  navigateToPortfolio() {
    window.open('https://kieran-mueller.netlify.app/')
  }

  closeFromOutside(event: any) {
    if (event.target.className === 'background') this.closeModal()
  }
}
