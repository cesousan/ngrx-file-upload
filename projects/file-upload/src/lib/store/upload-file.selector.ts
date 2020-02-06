import { createSelector } from '@ngrx/store';

import * as fromReducer from './upload-file.reducer';

export const selectUploadFileState = createSelector(
  fromReducer.selectUploadFeatureState,
  state => state.files,
);

export const selectUploadFileError = createSelector(
  selectUploadFileState,
  fromReducer.getError,
);

export const selectUploadFileReady = createSelector(
  selectUploadFileState,
  fromReducer.getUploadReady,
);

export const selectUploadFileProgress = createSelector(
  selectUploadFileState,
  fromReducer.getProgress,
);

// UPLOAD
export const selectUploadFileRequested = createSelector(
  selectUploadFileState,
  fromReducer.getUploadRequested,
);

export const selectUploadFileStarted = createSelector(
  selectUploadFileState,
  fromReducer.getUploadStarted,
);

export const selectUploadFileInProgress = createSelector(
  selectUploadFileState,
  fromReducer.getUploadInProgress,
);

export const selectUploadFileFailed = createSelector(
  selectUploadFileState,
  fromReducer.getUploadFailed,
);

export const selectUploadFileCompleted = createSelector(
  selectUploadFileState,
  fromReducer.getUploadCompleted,
);

// FILES

export const selectFileEntities = createSelector(
  selectUploadFileState,
  fromReducer.selectEntities,
);

export const selectAllFiles = createSelector(
  selectUploadFileState,
  fromReducer.selectAll,
);

export const selectFileIds = createSelector(
  selectUploadFileState,
  fromReducer.selectIds,
);

export const selectFilesCount = createSelector(
  selectUploadFileState,
  fromReducer.selectTotal,
);

export const selectFileById = (fileId: string) =>
  createSelector(selectFileEntities, files => files[fileId]);

export const selectFileByOwnerId = (ownerId: string) => {
  return createSelector(selectAllFiles, files =>
    files.filter(file => !!file && file.ownerId === ownerId),
  );
};
