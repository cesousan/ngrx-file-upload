import {
  ActionReducerMap,
  MemoizedSelector,
  createFeatureSelector
} from '@ngrx/store';
import * as fromFileTransfer from './transfer-file.reducer';

export interface FileTransferState {
  files: fromFileTransfer.FileTransferState;
}

export const reducers: ActionReducerMap<FileTransferState> = {
  files: fromFileTransfer.reducer
};

export const selectTransferFeatureState: MemoizedSelector<
  object,
  FileTransferState
> = createFeatureSelector<FileTransferState>('transfers');

export * from './transfer-file.reducer';
