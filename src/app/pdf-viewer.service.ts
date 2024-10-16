import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
@Injectable({
  providedIn: 'root'
})
export class PdfViewerService {

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';
  }
  
}