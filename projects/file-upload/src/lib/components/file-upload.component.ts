import { Subject } from 'rxjs';

import {
  Component,
  OnDestroy,
  Input,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'lib-file-upload',
  template: `
    <ng-container *ngIf="iconOrZone === 'icon'; else zone">
      <button mat-mini-fab (click)="fileInput.click()">
        <mat-icon>attachment</mat-icon>
      </button>
    </ng-container>
    <ng-template #zone>
      <div
        (click)="fileInput.click()"
        class="dropzone"
        [class.uploadfilecontainer]="border"
      >
        <ng-content></ng-content>
      </div>
    </ng-template>
    <input
      #fileInput
      multiple="multiple"
      type="file"
      [ngStyle]="{ display: 'none' }"
    />
  `,
  styles: [
    `
      .dropzone {
        &:hover {
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.7);
        }
      }

      .uploadfilecontainer {
        min-height: 25px;
        min-width: 25px;
        margin: 20px auto;
        border: 2px dashed #1c8adb;
        border-radius: 10px;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileUploadComponent,
      multi: true,
    },
  ],
})
export class FileUploadComponent implements OnDestroy, ControlValueAccessor {
  @Input() progress: number;
  @Input() iconOrZone: 'icon' | 'zone' = 'zone';
  @Input() border = true;

  @Output() fileUploaded: EventEmitter<File[]> = new EventEmitter();
  @Output() attachmentCanceled: EventEmitter<string> = new EventEmitter();

  @ViewChild('fileInput', { static: true }) fileInput: ElementRef<
    HTMLInputElement
  >;

  onChange: () => any;

  public files: File[] = [];

  private destroy$: Subject<void> = new Subject();

  constructor(private host: ElementRef<HTMLElement>) {}

  @HostListener('window.beforeunload')
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  @HostListener('change', ['$event.target.files'])
  @HostListener('drop', ['$event.target.files'])
  emitFiles(event: FileList) {
    let files: File[] = [];
    if (event && event.length > 0) {
      for (let i = 0; i < event.length; i++) {
        files = [...files, event.item(i)];
      }
    }
    this.files = files;
    this.fileUploaded.emit(this.files);
  }

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  preventDragDropDefault(event) {
    event.preventDefault();
  }

  writeValue(value: null) {
    this.host.nativeElement.nodeValue = '';
    this.files = null;
  }

  registerOnChange(fn: () => any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any) {}

  cancelAttachment(name?): void {
    this.files = null;
    if (name) {
      this.attachmentCanceled.emit(name);
    }
    this.fileInput.nativeElement.value = '';
  }
}
