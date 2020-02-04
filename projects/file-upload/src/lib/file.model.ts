export interface LoadedFile {
  id: string;
  name: string;
  type: string; // FileType;
  updatedAt: Date;
  size: number;
  src?: string;
  destination?: string;
  description?: string;
  ownerId?: string;
}

export interface UploadedFileResponse {
  id: string;
  name: string;
  encoding: string;
  mimetype: string;
  size: string;
  updatedAt: Date;
  fileSrc?: string;
}

export interface UploadFileRequestPayload {
  file: File;
  destination: string;
  ownerId: string;
}

export enum UploadStatus {
  Ready = 'Ready',
  Requested = 'Upload Requested',
  Started = 'Upload Started',
  Failed = 'Upload Failed',
  Completed = 'Upload Completed'
}
