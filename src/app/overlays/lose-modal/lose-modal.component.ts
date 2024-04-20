import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { frontendBaseUrl } from 'environment-variables';
import { ClipboardService } from 'ngx-clipboard';
import { ShareResultService } from 'src/app/service/share-result.service';

@Component({
  selector: 'app-lose-modal',
  templateUrl: './lose-modal.component.html',
  styleUrl: './lose-modal.component.css',
})
export class LoseModalComponent {
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
    private clipboard: ClipboardService
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
          this.shareBtnText = 'share game!';
          this.copied = false;
        }, 5000);
        this.shareTool();
      },
      error: (e) => {
        this.shareBtnText = 'error :(';
        setTimeout(() => {
          this.shareBtnText = 'share game!';
        }, 4000);
      },
    });
  }

  shareTool() {
    const navigator = window.navigator;
    setTimeout(() => {
      let data = {
        title: 'share with a friend!',
        text: this.results,
        url: `${frontendBaseUrl}`,
      };
      navigator.share(data).catch((e) => {});
    }, 300);
  }
}
