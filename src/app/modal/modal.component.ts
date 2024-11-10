import { Component, ErrorHandler, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Model } from '../app.model';
import { AppService } from '../app.service';
import { Environment } from '../environment';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  public modalConfig = Environment;
  public arquivoBase64: string | null = null;
  public _arquivoBase64: string | null = null;
  public xpto: any;
  public options: any = [];
  public arr: Model[] = [];
  public form!: FormGroup;

  public extensions = this.modalConfig.Extensions;
  public ext = this.extensions.map(m => m.ext);
  public img = this.extensions.filter(m => m.type === 'img');
  public doc = this.extensions.filter(m => m.type === 'doc');
  
  public base64 = '';
  //parentValue: string = 'Olá do componente pai!';

  constructor(
    private service: AppService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: Model
  ) {
    
    this.options = this.data;

    this.arr = [{
      _id: this.options[0]._id,
      titulo: this.options[0].titulo,
      descricao: this.options[0].descricao,
      categoria: this.options[0].categoria,
      tipo: this.options[0].tipo,
      detalhe: this.options[0].detalhe.replace(/\n/g, '<br />'),
      valor: this.options[0].valor,
      arquivo: '',
      state: this.options[0].state,
      extensao: this.options[0].extensao 
     }];
     
    if (this.options[0].state === 'inclusao' || this.options[0].state === 'edit' ) {
      this.form = this.fb.group({
        _id: [this.options[0]._id],
        titulo: [this.options[0].titulo, [Validators.required, Validators.minLength(3)]],
        descricao: [this.options[0].descricao, [Validators.required, Validators.minLength(3)]],
        categoria: [this.options[0].categoria, [Validators.required, Validators.minLength(3)]],
        tipo: [this.options[0].tipo, [Validators.required, Validators.minLength(3)]],
        detalhe: [this.options[0].detalhe, [Validators.required, Validators.minLength(3)]],
        valor: [this.options[0].valor],
        extensao: [this.options[0].extensao],
        arquivo: [],
        arquivo2: ['']
      });
    }
  }
  ngOnInit() {
    if ( this.options[0].state === 'viewImage') {
      //chama serviço passando o id do item para recuperar o base64
      const resp = this.service.getArquivoBase64(this.options[0]._id).subscribe({
        next: (response: any) => {
          this.arr[0].extensao == 'application/pdf' ? this.base64 = response.arquivo : this.xpto = response.arquivo;
        },
        error: (error: ErrorHandler) => {
          console.log(error.handleError);
        }
      });
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
    this.service.notifyDataUpdated();
  }
  //evento ao efetuar gravação
  onSubmit() {
    if (this.form.valid) {
      // Exibe os dados do formulário se for válido
      this.form.controls['arquivo'].patchValue(this.arquivoBase64);
      if ( this.options[0].state === 'inclusao') {
        this.addItem(this.form.value);
      } else {
        //quando não fora escolhido imagem ou arquivo
        if ( this.form.controls['arquivo'].value === null ) {
          this.form.controls['arquivo'].patchValue(this.options[0].arquivo);
        }
        debugger;
        this.ModifyItem(this.form.value);
      }
    } else {
      console.log('Formulário inválido');
    }
  }
  //ao selecionar o arquivo no formulário converte em base64
  public async handleFileInput(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.arquivoBase64 = await this.convertToBase64(input.files[0]);
      this.form.controls['extensao'].patchValue(input.files[0].type);
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
  //Adiciona item ao DB
  private addItem(body: Model): void {
    let _body = { titulo: body.titulo, 
                  descricao: body.descricao, 
                  categoria: body.categoria, 
                  tipo: body.tipo, 
                  detalhe: body.detalhe, 
                  valor: body.valor, 
                  arquivo: body.arquivo,
                  extensao: body.extensao };
    this.service.postItem(_body).subscribe({
      next: (response: any) => {
        this.dialogRef.close();
        this.service.notifyDataUpdated();
      },
      error: (err) => console.error(err)
    });
  }
  //Modifica item no DB
  private ModifyItem(body: Model): void {
    let _body = {titulo: body.titulo, 
                 descricao: body.descricao, 
                 categoria: body.categoria, 
                 tipo: body.tipo, 
                 detalhe: body.detalhe, 
                 valor: body.valor, 
                 extensao: body.extensao,
                 arquivo: body.arquivo };
    this.service.updateItem(body._id, _body).subscribe({
      next: () => {
        this.dialogRef.close();
        this.service.notifyDataUpdated();
      },
      error: (err) => console.log(err)
    })
  }


  public getArquivoBase64(id: string): void {
    this.service.getArquivoBase64(id).subscribe({
      next: (response: any) => {
        this._arquivoBase64 = response.arquivoBase64;
        console.log('_arquivoBase64', this._arquivoBase64);
      },
      error: (err: ErrorHandler) => {
        console.log(err.handleError);
      }
    })
  }
}
