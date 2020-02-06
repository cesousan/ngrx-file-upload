import {
  ActionReducerMap,
  MemoizedSelector,
  createFeatureSelector,
  createReducer,
  on,
  Action,
} from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { UploadStatus, LoadedFile } from '../file.model';
import * as Actions from './upload-file.action';

export const FILE_UPLOAD_FEATURE_KEY = 'uploads';

export interface FileUploadState extends EntityState<LoadedFile> {
  status: UploadStatus;
  error: string | null;
  progress: number | null;
}

export function selectFileId(a: LoadedFile): string {
  return a.id;
}

export function sortByLastUpdated(a: LoadedFile, b: LoadedFile) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
}

export const adapter: EntityAdapter<LoadedFile> = createEntityAdapter<
  LoadedFile
>({
  selectId: selectFileId,
  sortComparer: sortByLastUpdated,
});

export const initialState: FileUploadState = adapter.getInitialState({
  status: UploadStatus.Ready,
  error: null,
  progress: null,
});

const uploadReducer = createReducer(
  initialState,
  on(Actions.uploadRequest, (state, payload) => ({
    ...state,
    status: UploadStatus.Requested,
    progress: null,
    error: null,
  })),
  on(Actions.uploadReset, Actions.uploadCancel, (state, payload) => ({
    ...state,
    status: UploadStatus.Ready,
    progress: null,
    error: null,
  })),
  on(Actions.uploadFailure, (state, { error }) => ({
    ...state,
    status: UploadStatus.Failed,
    error,
    progress: null,
  })),
  on(Actions.uploadStarted, (state, payload) => ({
    ...state,
    status: UploadStatus.Started,
    progress: 0,
  })),
  on(Actions.uploadProgress, (state, { progress }) => ({
    ...state,
    progress,
  })),
  on(Actions.uploadCompleted, (state, { file }) => {
    const completeState = {
      ...state,
      status: UploadStatus.Completed,
      progress: 100,
      error: null,
    };
    return !!file ? adapter.addOne(file, completeState) : completeState;
  }),
);

export function reducer(state: FileUploadState | undefined, action: Action) {
  return uploadReducer(state, action);
}

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const getError = (state: FileUploadState): string => state.error;

export const getUploadReady = (state: FileUploadState): boolean =>
  state.status === UploadStatus.Ready;

export const getProgress = (state: FileUploadState): number => state.progress;

export const getUploadStarted = (state: FileUploadState): boolean =>
  state.status === UploadStatus.Started;

export const getUploadRequested = (state: FileUploadState): boolean =>
  state.status === UploadStatus.Requested;

export const getUploadInProgress = (state: FileUploadState): boolean =>
  state.status === UploadStatus.Started && state.progress >= 0;

export const getUploadFailed = (state: FileUploadState): boolean =>
  state.status === UploadStatus.Failed;

export const getUploadCompleted = (state: FileUploadState): boolean =>
  state.status === UploadStatus.Completed;

export interface FileUploadFeatureState {
  files: FileUploadState;
}
export const reducers: ActionReducerMap<FileUploadFeatureState> = {
  files: reducer,
};

export const selectUploadFeatureState: MemoizedSelector<
  object,
  FileUploadFeatureState
> = createFeatureSelector<FileUploadFeatureState>(FILE_UPLOAD_FEATURE_KEY);
