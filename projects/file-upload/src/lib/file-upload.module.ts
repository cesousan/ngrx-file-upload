import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatProgressBarModule,
  MatButtonModule,
  MatIconModule,
  MatChipsModule,
} from '@angular/material';

// store
import * as fromStore from './store';

import { TransferFileService } from './services/transfer-file.service';
import { FileUploaderComponent } from './containers';
import { ProgressComponent, FileUploadComponent } from './components';

const MATERIAL_COMPONENTS = [
  MatProgressBarModule,
  MatButtonModule,
  MatIconModule,
  MatChipsModule,
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StoreModule.forFeature('transfers', fromStore.reducers),
    EffectsModule.forFeature(fromStore.effects),
    MATERIAL_COMPONENTS,
  ],
  providers: [TransferFileService],
  declarations: [FileUploaderComponent, FileUploadComponent, ProgressComponent],
  exports: [FileUploaderComponent, FileUploadComponent, ProgressComponent],
})
export class FileUploadModule {}
