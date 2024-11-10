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
  fr: FormGroup;
  public modalConfig = Environment;
  public width = this.modalConfig.Modal.width;
  public height = this.modalConfig.Modal.height;
  public datasourceCategoria: any[] = [{}]; 
  public dataSource: any[] = [];
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
  }
  ngAfterViewInit(): void {
  }
  private datasourcePush(response: any, i: number) {
    return this.dataSource.push({
      _id: response[i]._id,
      titulo: response[i].titulo,
      descricao: response[i].descricao,
      categoria: response[i].categoria,
      tipo: response[i].tipo,
      detalhe: response[i].detalhe,
      valor: response[i].valor,
      arquivo: response[i].arquivo,
      extensao: response[i].extensao
    });          
  }
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
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  //**
   /* 
   * @param item - recebe parametro para pesquisar a categoria
   *  
   */
  public dropdownCategoriaSelected(item: string) {
    this.dataSource = [];
    this.service.getDropdownCategoria(item).subscribe({
      next: (response: any) => {
        for ( let i = 0 ; i < response.length ; i ++ ) {
          this.datasourcePush(response, i);
        }
        this.home.ngOnInit();
        this.service.setParametro(this.dataSource);
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }
}
