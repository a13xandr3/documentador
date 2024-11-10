import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
//import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-pdf-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  @Input() public base64!: any;

  public aspectRatio: number = 1;

  constructor() {
  }

  ngOnInit(): void { 
  }

  public document(b64: any): any {
      const blob = this.convertBase64ToBlob(b64);
      return URL.createObjectURL(blob);
  }
  /**
  * Convert BASE64 to BLOB
  * @param base64Image Pass Base64 image data to convert into the BLOB
  */
  public convertBase64ToBlob(base64Image: any) {

    if ( base64Image.length > 0 ) {

      const arquivo: string = base64Image;
  
      // Split into two parts
      const parts = arquivo.split(';base64,');
  
      // Hold the content type
      const imageType = parts[0].split(':')[1];
  
      // Decode Base64 string
      //console.log(parts[0]);
      //console.log(parts[1]);
  
      const cleanBase64String: string = parts[1].replace(/[^A-Za-z0-9+/=]/g, '');
  
      const decodedData = window.atob(cleanBase64String);
      
      // Create UNIT8ARRAY of size same as row data length
      const uInt8Array = new Uint8Array(decodedData.length);
      
      // Insert all character code into uInt8Array
      for (let i = 0; i < decodedData.length; ++i) {
        uInt8Array[i] = decodedData.charCodeAt(i);
      }
  
      // Return BLOB image after conversion
      const x = new Blob([uInt8Array], { type: imageType });
      return x;

    } else {
      return new Blob([], { type: 'application/pdf' });
    }
     
  }
  
}
