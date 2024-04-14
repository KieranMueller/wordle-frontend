import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
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
    private clipboard: ClipboardService,
  ) {}

  newGame() {
    if (this.isFreePlay) location.reload();
    this.router.navigateByUrl('/play');
  }

  handleClose() {
    this.closeModalEmitter.emit();
  }

  getResults() {
    this.shareResults = true;
    this.shareResultsService.getResultString();
    this.shareResultsService.result.subscribe({
      next: (res) => {
        this.results = res;
        this.clipboard.copy(res);
        this.copied = true;
        this.shareBtnText = 'copied!';
        setTimeout(() => {
          this.shareBtnText = 'share game!';
          this.copied = false;
        }, 5000);
      },
      error: (e) => {
        this.shareBtnText = 'error :(';
        setTimeout(() => {
          this.shareBtnText = 'share game!';
        }, 4000);
      },
    });
  }
}
