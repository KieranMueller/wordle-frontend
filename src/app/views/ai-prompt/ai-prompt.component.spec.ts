import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiPromptComponent } from './ai-prompt.component';

describe('AiPromptComponent', () => {
  let component: AiPromptComponent;
  let fixture: ComponentFixture<AiPromptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AiPromptComponent]
    });
    fixture = TestBed.createComponent(AiPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
