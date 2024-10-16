import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';

import { Model } from '../app.model';
import { AppService } from '../app.service';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public arquivoBase64: string | null = null;
  public options: any = [];
  public form!: FormGroup;
  public aspectRatio: number = 1;
  base64Image: string = '';
  
  constructor(
    private service: AppService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Model,
    private sanitizer: DomSanitizer,
    private cdref: ChangeDetectorRef
  ) {
    this.options = this.data;
    this.base64Image = this.options[0].arquivo;
    if (this.options[0].state === 'inclusao' || this.options[0].state === 'edit' ) {
      
      //console.log(this.options[0]);

      this.form = this.fb.group({
        _id: [this.options[0]._id],
        titulo: [this.options[0].titulo, [Validators.required, Validators.minLength(3)]],
        descricao: [this.options[0].descricao, [Validators.required, Validators.minLength(3)]],
        categoria: [this.options[0].categoria, [Validators.required, Validators.minLength(3)]],
        tipo: [this.options[0].tipo, [Validators.required, Validators.minLength(3)]],
        detalhe: [this.options[0].detalhe, [Validators.required, Validators.minLength(3)]],
        valor: [this.options[0].valor],
        arquivo: [],
        arquivo2: ['']
      });
    }
  }
  
  ngOnInit() {
    this.cdref.detectChanges();
    if ( this.options[0].state === 'viewImage') {
      this.loadImage(this.base64Image);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
    this.service.notifyDataUpdated();
  }

  //evento ao efetuar gravação
  onSubmit() {
    if (this.form.valid) {
      //console.log(this.form.value);  // Exibe os dados do formulário se for válido
      this.form.controls['arquivo'].patchValue(this.arquivoBase64);
      if ( this.options[0].state === 'inclusao') {
        this.addItem(this.form.value);
      } else {
        //quando não fora escolhido imagem ou arquivo
        if ( this.form.controls['arquivo'].value === null ) {
          this.form.controls['arquivo'].patchValue(this.options[0].arquivo);
        }
        this.ModifyItem(this.form.value);
      }
    } else {
      console.log('Formulário inválido');
    }
  }

  //Adiciona item ao DB
  private addItem(body: Model): void {
    let _body = { titulo: body.titulo, descricao: body.descricao, categoria: body.categoria, tipo: body.tipo, detalhe: body.detalhe, valor: body.valor, arquivo: body.arquivo };
    this.service.postItem(_body).subscribe({
      next: (response: any) => {
        console.log(response);
        this.dialogRef.close();
        this.service.notifyDataUpdated();
      },
      error: (err) => console.error(err)
    });
  }

  //Modifica item no DB
  private ModifyItem(body: Model): void {
    let _body = {titulo: body.titulo, descricao: body.descricao, categoria: body.categoria, tipo: body.tipo, detalhe: body.detalhe, valor: body.valor, arquivo: body.arquivo };
    this.service.updateItem(body._id, _body).subscribe({
      next: () => {
        this.dialogRef.close();
        this.service.notifyDataUpdated();
      },
      error: (err) => console.log(err)
    })
  }
  //processa e carrega imagem
  private loadImage(base64: string): void {
    const img = new Image();
    img.src = base64;
    // Quando a imagem estiver carregada, calculamos o aspect ratio
    img.onload = () => {
      const width = img.width;
      const height = img.height;
      this.aspectRatio = width / height;
      //console.log(`Aspect Ratio: ${this.aspectRatio}`);
    };
  }

  //ao selecionar o arquivo no formulário converte em base64
  public async handleFileInput(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoBase64 = await this.convertToBase64(input.files[0]);
    }
  }
  private convertToBase64(file: File): Promise<string | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  }

public document(b64: any): any {
  const blob = this.convertBase64ToBlob(b64);
  return URL.createObjectURL(blob);
}

  /**
  * Convert BASE64 to BLOB
  * @param base64Image Pass Base64 image data to convert into the BLOB
  */
  public convertBase64ToBlob(base64Image: string) {
    // Split into two parts
    const parts = base64Image.split(';base64,');
    // Hold the content type
    const imageType = parts[0].split(':')[1];
    // Decode Base64 string
    const decodedData = window.atob(parts[1]);
    // Create UNIT8ARRAY of size same as row data length
    const uInt8Array = new Uint8Array(decodedData.length);
    // Insert all character code into uInt8Array

    for (let i = 0; i < decodedData.length; ++i) {
      uInt8Array[i] = decodedData.charCodeAt(i);
    }
    // Return BLOB image after conversion
    const x = new Blob([uInt8Array], { type: imageType });
    
    return x
  }

/*
  public base64toBlob(base64Data: any, contentType: any) {
    debugger
    contentType = contentType || '';
    var sliceSize = 1024;
    var byteCharacters = atob(base64Data);
    var bytesLength = byteCharacters.length;
    var slicesCount = Math.ceil(bytesLength / sliceSize);
    var byteArrays = new Array(slicesCount);

    for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
        var begin = sliceIndex * sliceSize;
        var end = Math.min(begin + sliceSize, bytesLength);

        var bytes = new Array(end - begin);
        for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
            bytes[i] = byteCharacters[offset].charCodeAt(0);
        }
        byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new Blob(byteArrays, { type: contentType });
}
  public xpto(b64: any) {

    //const byteCharacters = atob(b64);

    //let blob = new Blob([pdfBuffer], {type: 'application/pdf'});
    //let blobURL = URL.createObjectURL(blob);
    //window.open(blobURL);
  }
*/
  /*
  public _base64ToFile(base64: any): void {
    const imageName = 'file.pdf';
    const imageBlob = this.dataURItoBlob(base64);
    const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
  }
  public dataURItoBlob(dataURI: any): any {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/pdf' });    
    return blob;
  }
  public base64ToFile(b64: any) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(b64);
  }

  */
  
}
