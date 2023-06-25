import { TestBed } from '@angular/core/testing';

import { ToastifyService } from './toastify.service';

describe('ToastifyService', () => {
  let service: ToastifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
