export type TransferStatus = TransferBaseState | UploadStatus | DownloadStatus;

export enum TransferBaseState {
  Ready = 'Ready'
}

export enum DownloadStatus {
  Requested = 'Download Requested',
  Started = 'Download Started',
  Failed = 'Download Failed',
  Completed = 'Download Completed'
}

export enum UploadStatus {
  Requested = 'Upload Requested',
  Started = 'Upload Started',
  Failed = 'Upload Failed',
  Completed = 'Upload Completed'
}
