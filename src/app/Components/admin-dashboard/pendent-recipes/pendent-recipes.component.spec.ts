import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendentRecipesComponent } from './pendent-recipes.component';

describe('PendentRecipesComponent', () => {
  let component: PendentRecipesComponent;
  let fixture: ComponentFixture<PendentRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendentRecipesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendentRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
