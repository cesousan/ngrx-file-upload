import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of } from 'rxjs';
import { concatMap, takeUntil, map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

import { TransferFileService } from '../transfer-file.service';
import {
  UploadedFileResponse,
  LoadedFile,
  UploadFileRequestPayload
} from '../file.model';
import * as fromActions from './upload-file.action';

@Injectable({
  providedIn: 'root'
})
export class UploadFileEffect {
  constructor(
    private actions$: Actions<fromActions.UploadActions>,
    private uploadService: TransferFileService
  ) {}

  @Effect()
  uploadRequestEffect$: Observable<Action> = this.actions$.pipe(
    ofType<fromActions.UploadRequest>(fromActions.UPLOAD_REQUEST),
    // map(({ payload }) => this.setFileOwnership(payload)),
    concatMap(({ payload }) =>
      this.uploadService.uploadFile(payload.file, payload.destination).pipe(
        takeUntil(this.actions$.pipe(ofType(fromActions.UPLOAD_CANCEL))),
        map(this.getActionFromHttpEvent(payload.ownerId, payload.destination)),
        catchError(error => of(error))
      )
    )
  );

  private getActionFromHttpEvent(ownerId: string, destination: string) {
    return (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent: {
          return new fromActions.UploadStarted();
        }
        case HttpEventType.DownloadProgress:
        case HttpEventType.UploadProgress: {
          return new fromActions.UploadProgress({
            progress: Math.round((100 * event.loaded) / event.total)
          });
        }
        case HttpEventType.ResponseHeader:
        case HttpEventType.Response: {
          return event.status === 201
            ? new fromActions.UploadCompleted({
                file: this.getFileInfo(
                  event as HttpResponse<UploadedFileResponse>,
                  ownerId,
                  destination
                )
              })
            : new fromActions.UploadFailure({
                error: event.statusText
              });
        }
        default: {
          return new fromActions.UploadFailure({
            error: `Unknown Event : ${JSON.stringify(event)}`
          });
        }
      }
    };
  }

  private getFileInfo(
    event: HttpResponse<UploadedFileResponse>,
    ownerId: string,
    destination: string
  ): LoadedFile {
    if (!event.body) {
      return;
    }
    const { name, id, mimetype: type, size, updatedAt } = event.body;
    const parsedSize = Number.parseInt(size, 10);
    return {
      id,
      name,
      type,
      size: parsedSize,
      description: null,
      src: this.uploadService.getFileUrl(id, destination),
      destination,
      updatedAt: new Date(updatedAt),
      ownerId
    };
  }
}
