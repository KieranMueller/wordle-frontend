import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-create-wordle',
  templateUrl: './create-wordle.component.html',
  styleUrls: ['./create-wordle.component.css'],
})
export class CreateWordleComponent {
  keyboard = {
    topRow: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    midRow: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    bottomRow: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  };
  word = '';
  charArr = Array(4).fill(null);
  validChars = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
  ];

  /*
  - Have keys turn green as you type your word
  - Create array of random placeletter wordles
  - Word must be dictionary word
  - Animate enter button when ready, get rid of enter button? Just have submit btn pop up?
  - Have transition time applied to letters typed in boxes
  - Add keyboard ability
  */

  test() {
    console.log(this.charArr.indexOf(null));
    console.log('word: ' + this.word + ': ' + this.word.length);
  }

  @HostListener('window:keydown', ['$event.key'])
  onKeyDown($event: string) {
    console.log($event);
    if (this.validChars.includes($event.toLocaleLowerCase()))
      this.type($event.toLocaleLowerCase());
    else if ($event === 'Backspace') this.del();
    else return;
  }

  type(key: string) {
    if (this.charArr.length >= 10) return;
    if (this.charArr.indexOf(null) > 2 && this.charArr.length < 9) {
      this.charArr[this.charArr.indexOf(null)] = key;
      this.word += key;
      this.charArr.push(null);
    } else if (this.charArr.indexOf(null) !== -1) {
      this.charArr.splice(this.charArr.indexOf(null), 1, key);
      this.word += key;
    }
  }

  del() {
    if (!this.charArr[0]) return;
    this.word = this.word.substring(0, this.word.length - 1);
    let i = this.charArr.length - 1;
    while (!this.validChars.includes(this.charArr[i])) i--;
    if (this.charArr.length >= 5) {
      this.charArr.pop();
      this.charArr[i] = null;
    } else {
      this.charArr[i] = null;
    }
  }
}
