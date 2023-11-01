import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileserverService {

  constructor() { }

  downloadFile(data: any,name='example.txt') {
    var fileLink = document.createElement('a');
    const blob = new Blob([data], { type: 'text/csv' });
    fileLink.href= window.URL.createObjectURL(blob);
    fileLink.setAttribute("download",name);
    fileLink.click();
  }
}
