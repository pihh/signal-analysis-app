import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PluginTestingPage } from './plugin-testing.page';

describe('PluginTestingPage', () => {
  let component: PluginTestingPage;
  let fixture: ComponentFixture<PluginTestingPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PluginTestingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
