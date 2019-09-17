import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LotteryInfoComponent } from './lottery-info.component';

describe('LotteryInfoComponent', () => {
  let component: LotteryInfoComponent;
  let fixture: ComponentFixture<LotteryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LotteryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LotteryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
