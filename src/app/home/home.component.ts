import { Component, OnInit } from '@angular/core';
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

  constructor(
    public dialog: MatDialog,
    private service: AppService) {
      this.service.dataUpdated$.subscribe((updated) => {
        if (updated) {
          this.dataSource = [];
          this.getItems();
        }
      });
  }

  ngOnInit(): void {
      this.getItems();
  }

  // Método para decodificar strings base64
  public decodeBase64(base64: string): string {
    return decodeURIComponent(escape(atob(base64)));
  }
  
  public getItems(): void {
    this.service.getItems().subscribe({
      next: (response: any[]) => {
        this.dataSource = response;
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }

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
      state: state
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
      next: () => this.getItems(),
      error: (err) => console.error('Erro ao deletar item:', err)
    });
  }
 
  public showIcoView(item: any): any {
    let _item = item.arquivo;
    let retorno;
    if ( _item != null ) {
      if ( _item.indexOf('/jpg', 0) != -1 ) {
        retorno = '../../assets/icons/image.svg';
      } 
      if ( _item.indexOf('/jpeg', 0) != -1 ) {
        retorno = '../../assets/icons/image.svg';
      }
      if ( _item.indexOf('/png', 0) != -1 ) {
        retorno = '../../assets/icons/image.svg';
      }
      if ( _item.indexOf('/pdf', 0) != -1 ) {
        retorno = '../../assets/icons/pdf.svg';
      }
      if ( _item.indexOf('/svg', 0) != -1 ) {
        retorno = '../../assets/icons/image.svg';
      }
      if ( _item.indexOf('/doc', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/docx', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/xls', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/xlsx', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/ppt', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/pptx', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/htm', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }
      if ( _item.indexOf('/html', 0) != -1 ) {
        retorno = '../../assets/icons/doc.svg';
      }

    } else {
      retorno = '../../assets/icons/no-image.svg';
    }
    return retorno;
  }

}
