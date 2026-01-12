import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeleconsultasDetallePage } from './teleconsultas-detalle.page';

describe('TeleconsultasDetallePage', () => {
  let component: TeleconsultasDetallePage;
  let fixture: ComponentFixture<TeleconsultasDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TeleconsultasDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
