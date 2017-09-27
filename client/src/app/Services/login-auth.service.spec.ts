import { TestBed, inject } from '@angular/core/testing';

import { LoginAuthService } from './login-auth.service';

describe('LoginAuthServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoginAuthService]
    });
  });

  it('should be created', inject([LoginAuthService], (service: LoginAuthService) => {
    expect(service).toBeTruthy();
  }));
});
