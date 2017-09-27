import { TestBed, inject } from '@angular/core/testing';

import { ResetpasswordService } from './reset-password.service';

describe('ResetpasswordService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResetpasswordService]
    });
  });

  it('should be created', inject([ResetpasswordService], (service: ResetpasswordService) => {
    expect(service).toBeTruthy();
  }));
});
