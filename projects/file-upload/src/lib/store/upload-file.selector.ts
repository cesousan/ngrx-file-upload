import { createSelector } from '@ngrx/store';

import * as fromReducer from './upload-file.reducer';

export const selectTransferFileError = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getError
);

export const selectTransferFileReady = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getUploadReady
);

export const selectTransferFileProgress = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getProgress
);

// UPLOAD
export const selectUploadFileRequested = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getUploadRequested
);

export const selectUploadFileStarted = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getUploadStarted
);

export const selectUploadFileInProgress = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getUploadInProgress
);

export const selectUploadFileFailed = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getUploadFailed
);

export const selectUploadFileCompleted = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.getUploadCompleted
);

// FILES

export const selectFileEntities = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.selectEntities
);

export const selectAllFiles = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.selectAll
);

export const selectFileIds = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.selectIds
);

export const selectFilesCount = createSelector(
  fromReducer.selectUploadFeatureState,
  fromReducer.selectTotal
);

export const selectFileById = (fileId: string) =>
  createSelector(selectFileEntities, files => files[fileId]);

export const selectFileByOwnerId = (ownerId: string) => {
  return createSelector(selectAllFiles, files =>
    files.filter(file => !!file && file.ownerId === ownerId)
  );
};
