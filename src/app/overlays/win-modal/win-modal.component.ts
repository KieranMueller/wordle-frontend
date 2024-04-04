import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-win-modal',
  templateUrl: './win-modal.component.html',
  styleUrl: './win-modal.component.css',
})
export class WinModalComponent {
  @Input() attempts = 0;
  @Input() word = '';
  @Input() isFreePlay = true;

  constructor(private router: Router) {}

  newGame() {
    if (this.isFreePlay) location.reload();
    this.router.navigateByUrl('/play');
  }
}
