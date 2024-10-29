import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivepriceComponent } from './liveprice.component';

describe('LivepriceComponent', () => {
  let component: LivepriceComponent;
  let fixture: ComponentFixture<LivepriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivepriceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivepriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
