import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Model } from '../app.model';
import { AppService } from '../app.service';
import { Environment } from '../environment';
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  public modalConfig = Environment;
  public arquivoBase64: string | null = null;
  public options: any = [];
  public form!: FormGroup;
  public aspectRatio: number = 1;
  public extensions = this.modalConfig.Extensions;
  public ext = this.extensions.map(m => m.ext);
  public img = this.extensions.filter(m => m.type === 'img');
  public doc = this.extensions.filter(m => m.type === 'doc');
  public base64Image: string;
  constructor(
    private service: AppService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Model
  ) {
    this.options = this.data;
    this.base64Image = this.options[0].arquivo;
    if (this.options[0].state === 'inclusao' || this.options[0].state === 'edit' ) {
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
    console.log('extensions==>', this.ext);
    console.log('imagens', this.img);
    console.log('doc==>', this.doc);
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
      // Exibe os dados do formulário se for válido
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

}
