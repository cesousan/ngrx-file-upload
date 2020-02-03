import { Action } from '@ngrx/store';
import { BucketDestination } from '../../models';
import { LoadedFile } from '../../models/file.model';

export const UPLOAD_REQUEST = '[File Upload Form] Request';
export const UPLOAD_CANCEL = '[File Upload Form] Cancel';
export const UPLOAD_RESET = '[File Upload Form] Reset';
export const UPLOAD_STARTED = '[File Upload API] Started';
export const UPLOAD_PROGRESS = '[File Upload API] Progress';
export const UPLOAD_FAILURE = '[File Upload API] Failure';
export const UPLOAD_COMPLETED = '[File Upload API] Success';

export class UploadRequest implements Action {
  readonly type = UPLOAD_REQUEST;
  constructor(
    public payload: {
      file: File;
      destination: BucketDestination;
      ownerId: string;
    }
  ) {}
}

export class UploadCancel implements Action {
  readonly type = UPLOAD_CANCEL;
}

export class UploadReset implements Action {
  readonly type = UPLOAD_RESET;
}

export class UploadStarted implements Action {
  readonly type = UPLOAD_STARTED;
}

export class UploadProgress implements Action {
  readonly type = UPLOAD_PROGRESS;
  constructor(public payload: { progress: number }) {}
}

export class UploadFailure implements Action {
  readonly type = UPLOAD_FAILURE;
  constructor(public payload: { error: string }) {}
}

export class UploadCompleted implements Action {
  readonly type = UPLOAD_COMPLETED;
  constructor(public payload: { file: LoadedFile }) {}
}

export type UploadActions =
  | UploadRequest
  | UploadCancel
  | UploadReset
  | UploadStarted
  | UploadProgress
  | UploadFailure
  | UploadCompleted;
