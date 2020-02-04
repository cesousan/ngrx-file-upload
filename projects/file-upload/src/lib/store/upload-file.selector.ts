import { createSelector } from '@ngrx/store';

import * as fromReducer from '../reducers';

export const selectTransferFileState = createSelector(
  fromReducer.selectTransferFeatureState,
  (state: fromReducer.FileTransferState) => state.files,
);

// UPLOAD/DOWNLOAD
export const selectTransferFileError = createSelector(
  selectTransferFileState,
  fromReducer.getError,
);

export const selectTransferFileReady = createSelector(
  selectTransferFileState,
  fromReducer.getTransferReady,
);

export const selectTransferFileProgress = createSelector(
  selectTransferFileState,
  fromReducer.getProgress,
);

// UPLOAD
export const selectUploadFileRequested = createSelector(
  selectTransferFileState,
  fromReducer.getUploadRequested,
);

export const selectUploadFileStarted = createSelector(
  selectTransferFileState,
  fromReducer.getUploadStarted,
);

export const selectUploadFileInProgress = createSelector(
  selectTransferFileState,
  fromReducer.getUploadInProgress,
);

export const selectUploadFileFailed = createSelector(
  selectTransferFileState,
  fromReducer.getUploadFailed,
);

export const selectUploadFileCompleted = createSelector(
  selectTransferFileState,
  fromReducer.getUploadCompleted,
);

// DOWNLOAD
export const selectDownloadFileRequested = createSelector(
  selectTransferFileState,
  fromReducer.getDownloadRequested,
);

export const selectDownloadFileStarted = createSelector(
  selectTransferFileState,
  fromReducer.getDownloadStarted,
);

export const selectDownloadFileInProgress = createSelector(
  selectTransferFileState,
  fromReducer.getDownloadInProgress,
);

export const selectDownloadFileFailed = createSelector(
  selectTransferFileState,
  fromReducer.getDownloadFailed,
);

export const selectDownloadFileCompleted = createSelector(
  selectTransferFileState,
  fromReducer.getDownloadCompleted,
);

// FILES

export const selectFileEntities = createSelector(
  selectTransferFileState,
  fromReducer.getFileEntities,
);

export const selectFiles = createSelector(
  selectTransferFileState,
  fromReducer.getFiles,
);

export const selectFileById = (fileId: string) =>
  createSelector(selectFileEntities, files => files[fileId]);

export const selectFilesByOwnerId = (ownerId: string) =>
  createSelector(selectFiles, files =>
    files.filter(file => !!file.owned && file.ownerId === ownerId),
  );

export const selectUnOwnedFiles = createSelector(selectFiles, files =>
  files.filter(file => !file.owned),
);
