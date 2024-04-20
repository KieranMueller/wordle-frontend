import { Clipboard } from '@angular/cdk/clipboard'
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { frontendBaseUrl } from 'environment-variables';
import { ShareResultService } from 'src/app/service/share-result.service';

@Component({
  selector: 'app-win-modal',
  templateUrl: './win-modal.component.html',
  styleUrl: './win-modal.component.css',
})
export class WinModalComponent {
  @Input() attempts = 0;
  @Input() word = '';
  @Input() isFreePlay = true;
  @Output() closeModalEmitter = new EventEmitter();
  results = '';
  shareResults = false;
  copied = false;
  shareBtnText = 'share game!';

  constructor(
    private router: Router,
    public shareResultsService: ShareResultService,
    private clipboard: Clipboard
  ) {}

  newGame() {
    if (this.isFreePlay) location.reload();
    this.router.navigateByUrl('/play');
  }

  handleClose() {
    this.closeModalEmitter.emit();
  }

  closeFromOutside(event: any) {
    if (event.target.className === 'background') this.handleClose();
  }

  getResults() {
    this.shareResults = true;
    this.shareResultsService.getResultString();
    this.shareResultsService.result.subscribe({
      next: (res) => {
        this.results = res;
        setTimeout(() => {
          this.clipboard.copy(res);
        }, 300);
        this.copied = true;
        this.shareBtnText = 'copied!';
        setTimeout(() => {
          this.copied = false;
        }, 2000);
        this.shareTool();
      },
      error: (e) => {
        this.shareBtnText = 'error :(';
        setTimeout(() => {
          this.shareBtnText = 'share game!';
        }, 4000);
        this.shareTool();
      },
    });
  }

  shareTool() {
    const navigator = window.navigator;
    setTimeout(() => {
      let data = {
        title: 'share your victory! 🎉',
        text: this.results,
        url: `${frontendBaseUrl}`,
      };
      navigator.share(data);
    }, 800);
  }

  shareToX() {
    // don't share same word, just share url to play
    window.open(`https://twitter.com/intent/tweet`)
  }
}
