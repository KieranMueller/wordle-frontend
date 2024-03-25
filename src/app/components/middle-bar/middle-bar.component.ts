import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-middle-bar',
  templateUrl: './middle-bar.component.html',
  styleUrls: ['./middle-bar.component.css'],
})
export class MiddleBarComponent {
  constructor(private router: Router) {}
}
