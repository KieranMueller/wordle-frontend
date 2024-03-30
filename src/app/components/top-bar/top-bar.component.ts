import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class TopBarComponent {
  @Input() color = 'red';
  hideHome = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    if (this.route.snapshot.url[0].path === 'home') {
      this.hideHome = true;
    }
  }

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
