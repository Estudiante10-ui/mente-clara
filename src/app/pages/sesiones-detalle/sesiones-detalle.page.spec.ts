import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SesionesDetallePage } from './sesiones-detalle.page';

describe('SesionesDetallePage', () => {
  let component: SesionesDetallePage;
  let fixture: ComponentFixture<SesionesDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionesDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
