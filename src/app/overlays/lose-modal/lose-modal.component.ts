import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lose-modal',
  templateUrl: './lose-modal.component.html',
  styleUrl: './lose-modal.component.css'
})
export class LoseModalComponent {
  @Input() attempts = 0
  @Input() word = ''

  newGame() {
    location.reload()
  }
}
