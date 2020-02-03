import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { provideMockActions } from '@ngrx/effects/testing';

import { TestBed } from '@angular/core/testing';

import { TransferFileEffect } from './transfer-file.effect';
import { FileUploadService } from '../../services';

const fileUploadServiceMock = {
  localUploadFile: () => null
};

describe('TransferFileEffect', () => {
  let effects: TransferFileEffect;
  let actions: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TransferFileEffect,
        provideMockActions(() => actions),
        {
          provide: FileUploadService,
          useValue: fileUploadServiceMock
        }
      ]
    })
      .compileComponents()
      .then(() => {
        effects = TestBed.get(TransferFileEffect);
        actions = TestBed.get(Actions);
      });
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
