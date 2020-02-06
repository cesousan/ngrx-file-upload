import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { withLatestFrom, map, filter, tap, takeUntil } from 'rxjs/operators';

import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  HostListener,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { FileUploadFacade } from './file-upload.facade';
import { UploadFileRequestPayload } from './file.model';

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
  @Input() requieredFileTypes: string[];
  @Input() ownerId: Observable<string> = of(null);
  @Input() fileDestination: Observable<string> = of(null);

  @Output() uploadedFile: EventEmitter<{
    fileName: string;
    ownerId: string;
    destination: string;
  }> = new EventEmitter();

  public uploadForm: FormGroup;

  // public completed$: Observable<boolean>;
  // public progress$: Observable<number>;
  // public error$: Observable<string>;

  // public isInProgress$: Observable<boolean>;
  // public isReady$: Observable<boolean>;
  // public hasFailed$: Observable<boolean>;

  private destroy$ = new Subject<void>();
  private uploadRequested: BehaviorSubject<File> = new BehaviorSubject(null);

  constructor(private facade: FileUploadFacade) {}

  ngOnInit() {
    this.uploadForm = new FormGroup({
      file: new FormControl(null, [
        Validators.required,
        requiredTypes(this.requieredFileTypes),
      ]),
    });

    this.uploadRequested
      .asObservable()
      .pipe(
        filter(file => !!file),
        withLatestFrom(this.ownerId, this.fileDestination),
        map(
          ([file, ownerId, destination]): UploadFileRequestPayload => ({
            file,
            ownerId,
            destination,
          }),
        ),
        tap(reqPayload => {
          const { file, ...meta } = reqPayload;
          this.uploadedFile.emit({
            fileName: file.name,
            ...meta,
          });
        }),
        tap(reqPayload => this.facade.dispatchUploadRequest(reqPayload)),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.destroy$.next();
  }

  uploadFile(event: File[]) {
    this.uploadRequested.next(event[0]);
  }

  cancelAttachment(event: string) {}
}

function requiredTypes(fileTypes: Array<string>) {
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
