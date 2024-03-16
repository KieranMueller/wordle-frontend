import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinLoseModalComponent } from './win-lose-modal.component';

describe('WinLoseModalComponent', () => {
  let component: WinLoseModalComponent;
  let fixture: ComponentFixture<WinLoseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WinLoseModalComponent]
    });
    fixture = TestBed.createComponent(WinLoseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
