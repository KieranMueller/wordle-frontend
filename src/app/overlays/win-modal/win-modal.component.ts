import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ShareResultService } from 'src/app/service/share-result.service';

@Component({
  selector: 'app-win-modal',
  templateUrl: './win-modal.component.html',
  styleUrl: './win-modal.component.css',
})
export class WinModalComponent implements OnInit {
  @Input() attempts = 0;
  @Input() word = '';
  @Input() isFreePlay = true;
  @Output() closeModalEmitter = new EventEmitter();
  results = ''

  constructor(
    private router: Router,
    public shareResultsService: ShareResultService
  ) {}

  ngOnInit() {
    this.results = this.shareResultsService.getResultString()
  }

  newGame() {
    if (this.isFreePlay) location.reload();
    this.router.navigateByUrl('/play');
  }

  handleClose() {
    this.closeModalEmitter.emit();
  }
}
