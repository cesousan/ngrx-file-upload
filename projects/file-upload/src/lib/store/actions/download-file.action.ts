import { Action } from '@ngrx/store';
import { BucketDestination } from '../../models';

export const DOWNLOAD_FILE_REQUEST = '[File Download] Download File Request';
export const DOWNLOAD_FILE_SUCCESS =
  '[File Download API] Download File Success';
export const DOWNLOAD_FILE_FAIL = '[File Download API] Download File Fail';
export const GET_FILE_REQUEST = '[File Download] Get File Request';
export const GET_FILE_SUCCESS = '[File Download API] Get File Success';
export const GET_FILE_FAIL = '[File Download API] Get File Fail';

export class DownloadRequest implements Action {
  readonly type = DOWNLOAD_FILE_REQUEST;
  constructor(
    public payload: { destination: BucketDestination; fileId: string }
  ) {}
}

export class DownloadSuccess implements Action {
  readonly type = DOWNLOAD_FILE_SUCCESS; // TODO: implement the download if needed
}

export class DownloadFailure implements Action {
  readonly type = DOWNLOAD_FILE_FAIL; // TODO: implement the download if needed
}

export class GetFileRequest implements Action {
  readonly type = GET_FILE_REQUEST;
  constructor(
    public payload: { destination: BucketDestination; fileId: string }
  ) {}
}

export class GetFileRequestSuccess implements Action {
  readonly type = GET_FILE_SUCCESS;
  constructor(public payload: { fileId: string; fileSrc: string }) {}
}

export class GetFileRequestFailure implements Action {
  readonly type = GET_FILE_FAIL;
  constructor(public payload: { error: any }) {}
}

export type DownloadActions =
  | GetFileRequest
  | GetFileRequestSuccess
  | GetFileRequestFailure;
