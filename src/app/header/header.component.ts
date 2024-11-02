import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ModalComponent } from '../modal/modal.component';
import { AppService } from '../app.service';
import { Model } from '../app.model';
import { Environment } from '../environment';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  public modalConfig = Environment;
  public width = this.modalConfig.Modal.width;
  public height = this.modalConfig.Modal.height;
  public datasourceCategoria: any[] = [{}]; 

  /*
  fr = new FormGroup({
    categoria: new FormControl(['']),
    descricao: new FormControl([''])
  });
  */

  fr: FormGroup;

  constructor(
    public dialog: MatDialog,
    private service: AppService,
    private home: HomeComponent,
    private fb: FormBuilder
  ) {

    this.fr = this.fb.group({
      categoria: [''],
      detalhe: [''],
    });

    this.dropdownCategoria();
  }

  ngOnInit(): void {
    //this.datasourceCategoria[0];
    //console.log(this.datasourceCategoria);
  }

  ngAfterViewInit(): void {
    console.log('after',this.datasourceCategoria[0]);
  }


  /*
  enviarParaFilho() {
    this.service.setParametro('Valor enviado do pai');
  }
  */

  public openDialog(): void {
    let xp = [];
    const x: Model = {
      _id: '',
      titulo: '',
      descricao: '',
      categoria: '',
      tipo: '',
      detalhe: '',
      valor: 0,
      arquivo: '',
      state: 'inclusao',
      extensao: ''
    };
    xp.push(x);
    let dialogRef = this.dialog.open(ModalComponent, {
      height: this.height,
      width: this.width,
      data: xp
    });
  }

  detalheChanged(item: any): void {
    this.service.getDetalhe(item).subscribe({
      next: (response: any) => {
        this.home.ngOnInit();
        this.service.setParametro(response);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  public dropdownCategoria() {
    this.service.getCategoria().subscribe({
      next: (response: any) => {
        const arrayCategoria = response.map( (r: any) => {
          return { categoria: r }
        });
        this.datasourceCategoria = arrayCategoria;
      },
      complete: () => {
        console.log('=>', this.datasourceCategoria[0]);
        const categoria = this.datasourceCategoria[0];
        this.service.setParametro(categoria);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  public dropdownCategoriaSelected(item: any) {
    this.service.getDropdownCategoria(item).subscribe({
      next: (response: any) => {
        this.home.ngOnInit();
        this.service.setParametro(response);
      },
      error: (err: any) => {
        console.log(err);
      }
    })
    
  }
}
