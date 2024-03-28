import { HttpClient } from '@angular/common/http';
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
  showHelpModal = false;
  showCreateWordleOptionsModal = false;
  isNotWord = false;
  validatingWord = false;
  errorMessage = '';

  /*
  - Wipe page when coming back after closing create worlde options modal
  */

  constructor(private http: HttpClient) {}

  closeModal(createdWord: boolean) {
    if (createdWord) this.wipePage();
    this.showHelpModal = false;
    this.showCreateWordleOptionsModal = false;
  }

  wipePage() {
    this.word = '';
    this.charArr = Array(4).fill(null);
  }

  @HostListener('window:keydown', ['$event.key'])
  onKeyDown($event: string) {
    if (this.validChars.includes($event.toLocaleLowerCase()))
      this.type($event.toLocaleLowerCase());
    else if ($event === 'Backspace') this.del();
    else if ($event === 'Enter') this.handleEnter();
    else return;
  }

  type(key: string) {
    if (this.showCreateWordleOptionsModal || this.showHelpModal) return;
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
    if (this.showCreateWordleOptionsModal || this.showHelpModal) return;
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

  handleEnter() {
    if (this.word.length >= 4) this.validateWord();
  }

  validateWord() {
    this.validatingWord = true;
    this.http
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`)
      .subscribe({
        next: () => {
          this.validatingWord = false;
          this.showCreateWordleOptionsModal = true;
        },
        error: (e) => {
          if (e.status.toString().startsWith('4')) this.showNotWordMessage(e);
          if (e.status.toString().startsWith('5')) this.handleFailedRequest(e);
          if (e.status.toString().startsWith('0'))
            this.handleNoInternetConnection(e);
        },
      });
  }

  showNotWordMessage(e: any) {
    console.log(e);
    this.validatingWord = false;
    this.isNotWord = true;
    setTimeout(() => {
      this.isNotWord = false;
    }, 1000);
  }

  handleFailedRequest(e: any) {
    this.validatingWord = false;
    console.log('unable to communicate with dictionary API to check word');
    this.errorMessage =
      'unable to communicate with dictionary API to check word, please try again later';
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
    console.log(e);
  }

  handleNoInternetConnection(e: any) {
    this.validatingWord = false;
    console.log('no internet connection');
    this.errorMessage = 'no internet connection!';
    setTimeout(() => {
      this.errorMessage = '';
    }, 4000);
    console.log(e);
  }
}
