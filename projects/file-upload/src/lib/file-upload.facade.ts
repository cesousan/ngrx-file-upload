import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

import * as fromStore from './store';
import { LoadedFile, UploadFileRequestPayload } from './file.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class FileUploadFacade {
  public uploadedFiles$: Observable<LoadedFile[]> = this.store.pipe(
    select(fromStore.selectAllFiles)
  );

  public lastUploadedFile$: Observable<LoadedFile> = this.uploadedFiles$.pipe(
    map(getMostRecent)
  );

  constructor(private store: Store<fromStore.FileUploadState>) {}

  dispatchUploadRequest({
    file,
    ownerId,
    destination
  }: UploadFileRequestPayload) {
    this.store.dispatch(
      new fromStore.UploadRequest({
        file,
        ownerId,
        destination
      })
    );
  }
}

const getMostRecent = (files: LoadedFile[]) =>
  files.sort(
    (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
  )[0];
