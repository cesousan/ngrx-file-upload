import { createAction, props } from '@ngrx/store';
import { LoadedFile, UploadFileRequestPayload } from '../file.model';

export const UPLOAD_REQUEST = '[File Upload Form] Request';
export const UPLOAD_CANCEL = '[File Upload Form] Cancel';
export const UPLOAD_RESET = '[File Upload Form] Reset';
export const UPLOAD_STARTED = '[File Upload API] Started';
export const UPLOAD_PROGRESS = '[File Upload API] Progress';
export const UPLOAD_FAILURE = '[File Upload API] Failure';
export const UPLOAD_COMPLETED = '[File Upload API] Success';

export const uploadRequest = createAction(
  UPLOAD_REQUEST,
  props<UploadFileRequestPayload>(),
);
export const uploadCancel = createAction(UPLOAD_CANCEL);
export const uploadReset = createAction(UPLOAD_RESET);
export const uploadStarted = createAction(UPLOAD_STARTED);
export const uploadProgress = createAction(
  UPLOAD_PROGRESS,
  props<{ progress: number }>(),
);
export const uploadFailure = createAction(
  UPLOAD_FAILURE,
  props<{ error: any }>(),
);
export const uploadCompleted = createAction(
  UPLOAD_COMPLETED,
  props<{ file: LoadedFile }>(),
);
