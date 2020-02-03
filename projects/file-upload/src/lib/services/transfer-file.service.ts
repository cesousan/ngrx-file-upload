import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

import { BucketDestination } from '../models';

@Injectable()
export class TransferFileService {
  private API_UPLOAD_BASE_URL = 'http://localhost:3010/files';

  constructor(private http: HttpClient) {}

  public uploadFile(
    file: File,
    destination: BucketDestination
  ): Observable<HttpEvent<{}>> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    const options = {
      reportProgress: true,
      observe: 'events'
    };

    const req = new HttpRequest(
      'POST',
      `${this.API_UPLOAD_BASE_URL}/upload/${destination}`,
      formData,
      options
    );
    return this.http.request(req);
  }

  public getFileUrl(fileName: string, fileCategory: BucketDestination) {
    return `${this.API_UPLOAD_BASE_URL}/stream/${fileCategory}/${fileName}`;
  }

  public getFile(fileName: string, fileCategory: BucketDestination) {
    return this.http.get(this.getFileUrl(fileName, fileCategory));
  }

  public getFileInfo(fileName: string) {
    const url = `${this.API_UPLOAD_BASE_URL}/metadata/${fileName}`;
    return this.http.get(url);
  }
}
