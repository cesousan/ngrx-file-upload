import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgModule, ModuleWithProviders } from '@angular/core';
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

import {
  TransferFileService,
  TransferFileConfig,
  TransferFileDefaultConfig,
  TransferFileConfigService,
} from './transfer-file.service';

import { FileUploaderComponent } from './file-uploader.component';
import { FileUploadComponent } from './file-upload.component';
import { ProgressComponent } from './progress.component';
import { FileUploadFacade } from './file-upload.facade';

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
    StoreModule.forFeature(
      fromStore.FILE_UPLOAD_FEATURE_KEY,
      fromStore.reducers,
    ),
    EffectsModule.forFeature([fromStore.UploadFileEffect]),
    MATERIAL_COMPONENTS,
  ],
  declarations: [FileUploaderComponent, FileUploadComponent, ProgressComponent],
  exports: [FileUploaderComponent, FileUploadComponent, ProgressComponent], // TODO: try to restrict exports to bare minimum
})
export class FileUploadModule {
  static forRoot(
    config: Partial<TransferFileConfig> = {},
  ): ModuleWithProviders<FileUploadModule> {
    const transferFileConfig =
      !!config && typeof config === 'object'
        ? {
            ...TransferFileDefaultConfig,
            ...config,
          }
        : TransferFileDefaultConfig;
    return {
      ngModule: FileUploadModule,
      providers: [
        TransferFileService,
        FileUploadFacade,
        {
          provide: TransferFileConfigService,
          useValue: transferFileConfig,
        },
      ],
    };
  }
}
