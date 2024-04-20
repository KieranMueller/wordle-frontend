import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { backendBaseUrl, frontendBaseUrl } from 'environment-variables';

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
  };
  gameLink = '';
  created = false;
  generateBtnText = 'generate link!';
  loading = false;

  constructor(private http: HttpClient, private clipBoard: ClipboardService) {}

  ngOnInit() {
    this.created = false;
  }

  emitClose(createdWord: boolean) {
    this.closeEmitter.emit(createdWord);
  }

  closeFromOutside(event: any, createdWord: boolean) {
    if (event.target.className === 'container1') this.emitClose(createdWord);
  }

  create() {
    this.loading = true;
    this.request.word = this.word;
    this.http.post(`${backendBaseUrl}/free-wordle`, this.request).subscribe({
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
    this.created = true;
    this.gameLink = `${frontendBaseUrl}/play/${res.uuidLink}`;
    this.copy('copied!');
  }

  handleInvalidRequest(e: any) {
    this.generateBtnText = 'oops...';
    this.loading = false;
  }

  handleFailedRequest(e: any) {
    this.loading = false;
    this.generateBtnText = 'oops...';
  }

  copy(message: string) {
    setTimeout(() => {
      this.clipBoard.copy(this.gameLink);
    }, 300);
    this.generateBtnText = message;
  }
}
