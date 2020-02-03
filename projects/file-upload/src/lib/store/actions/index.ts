import { UploadActions } from './upload-file.action';
import { DownloadActions } from './download-file.action';

export * from './upload-file.action';
export * from './download-file.action';

export type FileTransferActions = UploadActions | DownloadActions;
