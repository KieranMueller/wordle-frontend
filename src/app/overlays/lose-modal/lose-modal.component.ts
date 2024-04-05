import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lose-modal',
  templateUrl: './lose-modal.component.html',
  styleUrl: './lose-modal.component.css',
})
export class LoseModalComponent {
  @Input() attempts = 0;
  @Input() word = '';
  @Input() isFreePlay = true;

  constructor(private router: Router) {}

  newGame() {
    if (this.isFreePlay) location.reload();
    this.router.navigateByUrl('/play');
  }
}
