import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { localBaseUrl, prodBaseUrl } from 'environment-variables';

@Component({
  selector: 'app-create-wordle-options-modal',
  templateUrl: './create-wordle-options-modal.component.html',
  styleUrls: ['./create-wordle-options-modal.component.css'],
})
export class CreateWordleOptionsModalComponent implements OnInit {
  @Output() closeEmitter = new EventEmitter<boolean>();
  @Input() word = '';
  request = {
    word: '',
    attempts: 6,
    timeLimit: 'none',
    greenTilesOnly: false,
  };
  gameLink = '';
  created = false;
  generateBtnText = 'generate link!';
  loading = false;

  /*
  - Have generate button turn into loading spinner while waiting for response
  - After creating word, wipe word from create-wordle component (it's still there when exit out of modal)
  */

  constructor(private http: HttpClient, private clipBoard: ClipboardService) {}

  ngOnInit() {
    this.created = false;
  }

  emitClose(createdWord: boolean) {
    this.closeEmitter.emit(createdWord);
  }

  create() {
    this.loading = true;
    this.request.word = this.word;
    this.http.post(`${prodBaseUrl}/free-wordle`, this.request).subscribe({
      next: (res) => this.handleSuccess(res),
      error: (e) => {
        if (e.status.toString().startsWith('4')) this.handleInvalidRequest(e);
        if (
          e.status.toString().startsWith('5') ||
          e.status.toString().startsWith('0')
        )
          this.handleFailedRequest(e);
      },
    });
  }

  handleSuccess(res: any) {
    this.loading = false;
    console.log(res);
    console.log(res.uuidLink);
    this.created = true;
    this.gameLink = `http://localhost:4200/play/${res.uuidLink}`;
    this.copy('copied!');
  }

  handleInvalidRequest(e: any) {
    console.log('invalid request');
    this.generateBtnText = 'oops...';
    this.loading = false;
    console.log(e);
  }

  handleFailedRequest(e: any) {
    console.log('internal server error');
    this.loading = false;
    this.generateBtnText = 'oops...';
    console.log(e);
  }

  copy(message: string) {
    this.clipBoard.copy(this.gameLink);
    this.generateBtnText = message;
  }
}
