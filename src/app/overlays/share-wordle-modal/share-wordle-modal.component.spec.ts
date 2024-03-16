import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWordleModalComponent } from './share-wordle-modal.component';

describe('ShareWordleModalComponent', () => {
  let component: ShareWordleModalComponent;
  let fixture: ComponentFixture<ShareWordleModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareWordleModalComponent]
    });
    fixture = TestBed.createComponent(ShareWordleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
