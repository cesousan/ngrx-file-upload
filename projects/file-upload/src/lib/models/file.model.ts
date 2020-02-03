import { BucketDestination } from './bucket';

export interface LoadedFile extends HasOwner {
  id: string;
  name: string;
  type: string; // FileType;
  updatedAt: Date;
  size: number;
  src?: string;
  destination?: BucketDestination;
  description?: string;
}

export interface HasOwner {
  owned: boolean;
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
