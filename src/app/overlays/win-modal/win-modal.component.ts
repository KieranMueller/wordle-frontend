import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-win-modal',
  templateUrl: './win-modal.component.html',
  styleUrl: './win-modal.component.css'
})
export class WinModalComponent {
  @Input() attempts = 0
  @Input() word = ''
}
