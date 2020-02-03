import { FileType } from './file-types';
import { BucketDestination } from './bucket';

export interface LoadedFile extends HasOwner {
  id: string;
  name: string;
  type: string;
  updatedAt: Date;
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
  encoding: string;
  mimetype: string;
  size: number;
  name: string;
  updatedAt: Date;
}
