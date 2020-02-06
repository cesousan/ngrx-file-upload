import { Actions, ofType, createEffect } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, takeUntil, map, catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

import { TransferFileService } from '../transfer-file.service';
import {
  UploadedFileResponse,
  LoadedFile,
  UploadFileRequestPayload,
} from '../file.model';
import * as fromActions from './upload-file.action';

@Injectable()
export class UploadFileEffect {
  constructor(
    private actions$: Actions,
    private uploadService: TransferFileService,
  ) {}

  uploadRequestEffect$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fromActions.UPLOAD_REQUEST),
      map(x => x),
      concatMap(({ file, destination, ownerId }: UploadFileRequestPayload) =>
        this.uploadService.uploadFile(file, destination).pipe(
          takeUntil(this.actions$.pipe(ofType(fromActions.UPLOAD_CANCEL))),
          map(this.getActionFromHttpEvent(ownerId, destination)),
          catchError(error => of(error)),
        ),
      ),
    ),
  );

  private getActionFromHttpEvent(ownerId: string, destination: string) {
    return (event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent: {
          return fromActions.uploadStarted();
        }
        case HttpEventType.DownloadProgress:
        case HttpEventType.UploadProgress: {
          return fromActions.uploadProgress({
            progress: Math.round((100 * event.loaded) / event.total),
          });
        }
        case HttpEventType.ResponseHeader:
        case HttpEventType.Response: {
          return event.status === 201
            ? fromActions.uploadCompleted({
                file: this.getFileInfo(
                  event as HttpResponse<UploadedFileResponse>,
                  ownerId,
                  destination,
                ),
              })
            : fromActions.uploadFailure({
                error: event.statusText,
              });
        }
        default: {
          return fromActions.uploadFailure({
            error: `Unknown Event : ${JSON.stringify(event)}`,
          });
        }
      }
    };
  }

  private getFileInfo(
    event: HttpResponse<UploadedFileResponse>,
    ownerId: string,
    destination: string,
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
      ownerId,
    };
  }
}
