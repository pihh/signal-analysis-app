import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudFinderPage } from './stud-finder.page';

describe('StudFinderPage', () => {
  let component: StudFinderPage;
  let fixture: ComponentFixture<StudFinderPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StudFinderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
