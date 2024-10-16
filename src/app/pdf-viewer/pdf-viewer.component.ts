import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';


@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  @Input() base64Pdf!: string; // Base64 do PDF recebido como input

  @ViewChild('pdfCanvas') pdfCanvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngOnInit(): void {

    debugger
    
    if (this.base64Pdf) {
      const binaryData = this.base64ToBinary(this.base64Pdf);
      this.loadPdf(binaryData); // Carrega o PDF
    }
  }

  // Converte base64 para binário (ArrayBuffer)
  base64ToBinary(base64: string): Uint8Array {
    debugger
    const raw = window.atob(base64);
    const uint8Array = new Uint8Array(new ArrayBuffer(raw.length));
    for (let i = 0; i < raw.length; i++) {
      uint8Array[i] = raw.charCodeAt(i);
    }
    return uint8Array;
  }

  // Método para carregar e renderizar o PDF no canvas
  async loadPdf(data: Uint8Array): Promise<void> {
    const pdfDoc: PDFDocumentProxy = await getDocument({ data }).promise;
    const page = await pdfDoc.getPage(1); // Carrega a primeira página do PDF

    const scale = 1.5;
    const viewport = page.getViewport({ scale });

    // Configura o canvas
    const canvas = this.pdfCanvas.nativeElement;
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };

    // Renderiza a página no canvas
    page.render(renderContext);

  }

}
