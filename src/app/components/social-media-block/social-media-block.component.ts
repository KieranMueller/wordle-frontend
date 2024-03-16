import { Component } from '@angular/core';

@Component({
  selector: 'app-social-media-block',
  templateUrl: './social-media-block.component.html',
  styleUrls: ['./social-media-block.component.css'],
})
export class SocialMediaBlockComponent {
  route(name: string) {
    switch (name) {
      case 'instagram':
        window.open('https://www.instagram.com/kieran.mueller/');
        break;
      case 'youtube':
        window.open('https://www.youtube.com/@KieranMueller');
        break;
      case 'github':
        window.open('https://github.com/KieranMueller');
        break;
    }
  }
}
