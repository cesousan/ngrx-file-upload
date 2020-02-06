import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';

import { Injectable } from '@angular/core';

import * as fromStore from './store';
import { LoadedFile, UploadFileRequestPayload } from './file.model';

@Injectable({ providedIn: 'root' })
export class FileUploadFacade {
  public uploadedFiles$: Observable<LoadedFile[]> = this.store.pipe(
    select(fromStore.selectAllFiles),
  );

  public lastUploadedFile$: Observable<LoadedFile> = this.uploadedFiles$.pipe(
    filter(files => !!files && Array.isArray(files)),
    map(files => files.sort(fromStore.sortByLastUpdated)[0]),
  );

  constructor(private store: Store<fromStore.FileUploadState>) {
    this.store.dispatch(fromStore.uploadReset());
  }

  dispatchUploadRequest({
    file,
    ownerId,
    destination,
  }: UploadFileRequestPayload) {
    this.store.dispatch(
      fromStore.uploadRequest({
        file,
        ownerId,
        destination,
      }),
    );
  }
}
