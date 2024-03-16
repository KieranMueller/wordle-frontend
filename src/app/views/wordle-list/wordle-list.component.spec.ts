import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordleListComponent } from './wordle-list.component';

describe('WordleListComponent', () => {
  let component: WordleListComponent;
  let fixture: ComponentFixture<WordleListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WordleListComponent]
    });
    fixture = TestBed.createComponent(WordleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
