import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';

import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FileType, BucketDestination } from '../models';
import * as fromStore from '../store';

@Component({
  selector: 'lib-file-uploader',
  template: `
    <form class="container" [formGroup]="uploadForm">
      <lib-file-upload
        formControlName="file"
        (fileUploaded)="uploadFile($event)"
      >
        <div class="content-wrapper">
          <ng-content></ng-content>
        </div>
      </lib-file-upload>
    </form>
  `,
  styles: [
    `
      .container {
        width: fit-content;
        height: fit-content;
      }

      .content-wrapper {
        margin: 5px;
        padding: 5px;
      }
    `,
  ],
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  @Input() requieredFileTypes: FileType[];
  @Input() ownerId: string; // use observable and make it reactive.
  @Input() fileDestination: BucketDestination;

  public completed$: Observable<boolean>;
  public progress$: Observable<number>;
  public error$: Observable<string>;

  public isInProgress$: Observable<boolean>;
  public isReady$: Observable<boolean>;
  public hasFailed$: Observable<boolean>;

  public uploadForm: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private store$: Store<fromStore.FileTransferState>) {}

  ngOnInit() {
    this.uploadForm = new FormGroup({
      file: new FormControl(null, [
        Validators.required,
        requiredTypes(this.requieredFileTypes),
      ]),
    });
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.destroy$.next();
  }

  uploadFile(event: File[]) {
    this.store$.dispatch(
      new fromStore.UploadRequest({
        file: event[0],
        ownerId: this.ownerId,
        destination: this.fileDestination,
      }),
    );
  }

  cancelAttachment(event: string) {}
}

function requiredTypes(fileTypes: Array<FileType>) {
  return (control: FormControl) => {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.')[1].toLowerCase();
      if (!fileTypes.map(x => x.toLowerCase().includes(extension))) {
        return {
          requiredFileType: true,
        };
      }
      return null;
    }
    return null;
  };
}
