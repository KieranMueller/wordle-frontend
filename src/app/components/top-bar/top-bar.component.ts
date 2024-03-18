import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  @Input() color = 'red';

  getColor() {
    return {
      red: this.color == 'red',
      yellow: this.color == 'yellow',
      orange: this.color == 'orange',
      green: this.color == 'green',
      blue: this.color == 'blue',
    };
  }
}
