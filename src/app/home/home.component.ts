import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppService } from '../app.service';
import { Model } from '../app.model';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from '../environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public dataSource: any[] = [];
  public modalConfig = Environment;
  public width = this.modalConfig.Modal.width;
  public height = this.modalConfig.Modal.height;
  public extensions = this.modalConfig.Extensions;
  constructor(
    public dialog: MatDialog,
    private service: AppService) {
      this.service.dataUpdated$.subscribe((updated) => {
        if (updated) {
          this.dataSource = [];
        }
      });
      this.service.parametro$.subscribe((response) => {
        if ( response ) {
          this.dataSource = [];
          this.dataSource = response;
        }
      }); 
  }
  ngOnInit(): void {
  }
  // Método para decodificar strings base64
  public decodeBase64(base64: string): string {
    return decodeURIComponent(escape(atob(base64)));
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
      arquivo: response[i]._id,
      extensao: response[i].extensao
    });          
  }
  public getDetalhe(key: string): void {
    this.service.getDetalhe(key).subscribe({
      next: (response: any) => {
        for ( let i = 0 ; i < response.length ; i ++ ) {
          this.datasourcePush(response, i);
        }
      },
      complete: () => {
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

  /*
  public getItems(): void {
    this.service.getItems().subscribe({
      next: (response: any) => {
        for ( let i = 0 ; i < response.length ; i ++ ) {
          this.datasourcePush(response, i);
        }
      },
      complete: () => {
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
  */

  public openModalForm(item: Model, state: string): void {
    let itemArray = [];
    const x: Model = {
      _id: item._id,
      titulo: item.titulo,
      descricao: item.descricao,
      categoria: item.categoria,
      tipo: item.tipo,
      detalhe: item.detalhe,
      valor: item.valor,
      arquivo: item.arquivo,
      state: state,
      extensao: item.extensao
    };
    itemArray.push(x);
    let dialogRef = this.dialog.open(ModalComponent, {
      height: this.height,
      width: this.width,
      data: itemArray
    });
  }
  trackByItemId(index: number, item: any): number {
    return item.id;
  }
  // Método para deletar um item
  public deleteItem(id: string): void {
    this.service.deleteItem(id).subscribe({
      next: () => {
        this.dataSource = [];
        this.getDetalhe(id);
      },
      complete: () => {
        this.service.notifyDataUpdated();
      },
      error: (err) => console.error('Erro ao deletar item:', err)
    });
  }
  public showIcoView(item: any): any {
    let retorno;
    let _item = item.split('/')[1];
    switch(_item) {
      case 'jpg': 
      case 'jpeg':
      case 'png':
      case 'svg':
        retorno = '../../assets/icons/image.svg';
        break;
      case 'pdf':
        retorno = '../../assets/icons/pdf.svg';
        break;
      case 'doc':
      case 'docx':
      case 'xls':
      case 'xlsx':
      case 'ppt':
      case 'pptx':
      case 'htm':
      case 'html':
        retorno = '../../assets/icons/doc.svg';
        break;
      default:
        retorno = '../../assets/icons/no-image.svg';
    }
    return retorno;
  }
}
