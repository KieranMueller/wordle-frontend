import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWordleComponent } from './share-wordle.component';

describe('ShareWordleComponent', () => {
  let component: ShareWordleComponent;
  let fixture: ComponentFixture<ShareWordleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareWordleComponent]
    });
    fixture = TestBed.createComponent(ShareWordleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
