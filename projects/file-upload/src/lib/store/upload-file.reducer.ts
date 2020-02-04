import * as fromActions from './upload-file.action';
import { UploadStatus, LoadedFile } from '../models';
import { MemoizedSelector, createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

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
  return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
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

export const selectUploadFeatureState: MemoizedSelector<
  object,
  FileUploadState
> = createFeatureSelector<FileUploadState>(FILE_UPLOAD_FEATURE_KEY);

export function reducer(
  state = initialState,
  action: fromActions.UploadActions,
): FileUploadState {
  switch (action.type) {
    case fromActions.UPLOAD_REQUEST: {
      return {
        ...state,
        status: UploadStatus.Requested,
        progress: null,
        error: null,
      };
    }
    case fromActions.UPLOAD_CANCEL: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null,
      };
    }
    case fromActions.UPLOAD_RESET: {
      return {
        ...state,
        status: UploadStatus.Ready,
        progress: null,
        error: null,
      };
    }
    case fromActions.UPLOAD_FAILURE: {
      return {
        ...state,
        status: UploadStatus.Failed,
        error: action.payload.error,
        progress: null,
      };
    }
    case fromActions.UPLOAD_STARTED: {
      return {
        ...state,
        status: UploadStatus.Started,
        progress: 0,
      };
    }
    case fromActions.UPLOAD_PROGRESS: {
      return {
        ...state,
        progress: action.payload.progress,
      };
    }
    case fromActions.UPLOAD_COMPLETED: {
      return adapter.addOne(action.payload.file, {
        ...state,
        status: UploadStatus.Completed,
        progress: 100,
        error: null,
      });
    }
    default: {
      return state;
    }
  }
}

export const {
  selectIds: selectFileIds,
  selectEntities: selectFileEntities,
  selectAll: selectAllFiles,
  selectTotal: selectFilesTotal,
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
