import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySettingsComponent } from './play-settings.component';

describe('PlaySettingsComponent', () => {
  let component: PlaySettingsComponent;
  let fixture: ComponentFixture<PlaySettingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlaySettingsComponent]
    });
    fixture = TestBed.createComponent(PlaySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
