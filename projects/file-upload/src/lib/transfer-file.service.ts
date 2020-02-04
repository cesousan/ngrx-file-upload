import { Observable } from 'rxjs';

import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';

export interface TransferFileConfig {
  host: string;
  port: number;
  endpoint: string;
  ssl: boolean;
}

export const TransferFileConfigService = new InjectionToken<TransferFileConfig>(
  'FileUploadConfig'
);

export const TransferFileDefaultConfig: TransferFileConfig = {
  host: '127.0.0.1',
  port: 3000,
  endpoint: 'files',
  ssl: false
};

@Injectable()
export class TransferFileService {
  private API_UPLOAD_BASE_URL = this.getEndpointUrl(this.config);

  constructor(
    @Inject(TransferFileConfigService) private config: TransferFileConfig,
    private http: HttpClient
  ) {}

  public uploadFile(
    file: File,
    destination: string
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

  public getFileUrl(fileName: string, fileCategory: string) {
    return `${this.API_UPLOAD_BASE_URL}/stream/${fileCategory}/${fileName}`;
  }

  public getFile(fileName: string, fileCategory: string) {
    return this.http.get(this.getFileUrl(fileName, fileCategory));
  }

  public getFileInfo(fileName: string) {
    const url = `${this.API_UPLOAD_BASE_URL}/metadata/${fileName}`;
    return this.http.get(url);
  }

  private getEndpointUrl({ host, port, endpoint, ssl }: TransferFileConfig) {
    return `${ssl ? 'https' : 'http'}://${host}:${port}${
      endpoint ? `/${endpoint}` : ''
    }`;
  }
}
