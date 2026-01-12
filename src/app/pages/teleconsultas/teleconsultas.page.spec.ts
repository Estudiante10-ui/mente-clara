import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeleconsultasPage } from './teleconsultas.page';

describe('TeleconsultasPage', () => {
  let component: TeleconsultasPage;
  let fixture: ComponentFixture<TeleconsultasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
