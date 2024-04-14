import { Component } from '@angular/core';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent {


  share() {
    const navigator = window.navigator;
    let data = {
      title: 'sup',
      text: 'hello, play at the link below!',
      url: 'https://wordle.kieranmueller.com'
    }
    navigator.share(data).catch(e => console.log(e))
  }
}
