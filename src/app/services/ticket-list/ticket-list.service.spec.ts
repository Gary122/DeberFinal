import { TestBed } from '@angular/core/testing';

import { TicketListService } from './ticket-list.service';

describe('TicketListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TicketListService = TestBed.get(TicketListService);
    expect(service).toBeTruthy();
  });
});
