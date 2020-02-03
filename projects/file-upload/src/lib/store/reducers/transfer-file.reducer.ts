import * as fromActions from '../actions';
import {
  UploadStatus,
  LoadedFile,
  TransferStatus,
  TransferBaseState,
  DownloadStatus
} from '../../models';

export interface FileTransferState {
  status: TransferStatus;
  error: string | null;
  progress: number | null;
  files: { [fileId: string]: LoadedFile };
}

export const initialState: FileTransferState = {
  status: TransferBaseState.Ready,
  error: null,
  progress: null,
  files: {}
};

export function reducer(
  state = initialState,
  action: fromActions.UploadActions | fromActions.DownloadActions
): FileTransferState {
  switch (action.type) {
    // UPLOADS
    case fromActions.UPLOAD_REQUEST: {
      return {
        ...state,
        status: UploadStatus.Requested,
        progress: null,
        error: null
      };
    }
    case fromActions.UPLOAD_CANCEL: {
      return {
        ...state,
        status: TransferBaseState.Ready,
        progress: null,
        error: null
      };
    }
    case fromActions.UPLOAD_RESET: {
      return {
        ...state,
        status: TransferBaseState.Ready,
        progress: null,
        error: null
      };
    }
    case fromActions.UPLOAD_FAILURE: {
      return {
        ...state,
        status: UploadStatus.Failed,
        error: action.payload.error,
        progress: null
      };
    }
    case fromActions.UPLOAD_STARTED: {
      return {
        ...state,
        status: UploadStatus.Started,
        progress: 0
      };
    }
    case fromActions.UPLOAD_PROGRESS: {
      return {
        ...state,
        progress: action.payload.progress
      };
    }
    case fromActions.UPLOAD_COMPLETED: {
      const newEntry =
        !!action.payload.file && !!action.payload.file.id
          ? { [action.payload.file.id]: action.payload.file }
          : {};
      return {
        ...state,
        status: UploadStatus.Completed,
        progress: 100,
        error: null,
        files: {
          ...state.files,
          ...newEntry
        }
      };
    }
    // DOWNLOADS
    case fromActions.GET_FILE_REQUEST: {
      return {
        ...state,
        status: DownloadStatus.Requested,
        progress: null,
        error: null
      };
    }
    case fromActions.GET_FILE_SUCCESS: {
      const updatedEntry: LoadedFile = {
        ...state.files[action.payload.fileId],
        src: action.payload.fileSrc
      };
      return {
        ...state,
        status: DownloadStatus.Completed,
        progress: 100,
        error: null,
        files: {
          ...state.files,
          [action.payload.fileId]: updatedEntry
        }
      };
    }
    case fromActions.GET_FILE_FAIL: {
      return {
        ...state,
        status: DownloadStatus.Failed,
        error: action.payload.error,
        progress: null
      };
    }
    default: {
      return state;
    }
  }
}

export const getError = (state: FileTransferState): string => state.error;

export const getTransferReady = (state: FileTransferState): boolean =>
  state.status === TransferBaseState.Ready;

export const getProgress = (state: FileTransferState): number => state.progress;

export const getUploadStarted = (state: FileTransferState): boolean =>
  state.status === UploadStatus.Started;

export const getUploadRequested = (state: FileTransferState): boolean =>
  state.status === UploadStatus.Requested;

export const getUploadInProgress = (state: FileTransferState): boolean =>
  state.status === UploadStatus.Started && state.progress >= 0;

export const getUploadFailed = (state: FileTransferState): boolean =>
  state.status === UploadStatus.Failed;

export const getUploadCompleted = (state: FileTransferState): boolean =>
  state.status === UploadStatus.Completed;

export const getDownloadStarted = (state: FileTransferState): boolean =>
  state.status === DownloadStatus.Started;

export const getDownloadRequested = (state: FileTransferState): boolean =>
  state.status === DownloadStatus.Requested;

export const getDownloadInProgress = (state: FileTransferState): boolean =>
  state.status === DownloadStatus.Started && state.progress >= 0;

export const getDownloadFailed = (state: FileTransferState): boolean =>
  state.status === DownloadStatus.Failed;

export const getDownloadCompleted = (state: FileTransferState): boolean =>
  state.status === DownloadStatus.Completed;

export const getFileEntities = (state: FileTransferState) => state.files;

export const getFiles = (state: FileTransferState) => {
  const entities = getFileEntities(state);
  return Object.keys(entities).map(fileId => entities[fileId]);
};
