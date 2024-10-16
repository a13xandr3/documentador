import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { ModalComponent } from '../modal/modal.component';
import { AppService } from '../app.service';
import { Model } from '../app.model';
import { Environment } from '../environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public modalConfig = Environment;

  public width = this.modalConfig.Modal.width;
  public height = this.modalConfig.Modal.height;

  fr = new FormGroup({
    titulo: new FormControl([''])
  });

  constructor(
    public dialog: MatDialog,
    private messageService: AppService,
    ) {
    }

  ngOnInit(): void {
    let jsonArrayObject=[];
    let demo={};
    demo={
        id:1,
        "name":"John Doe"
    }
    jsonArrayObject.push(demo);
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
      state: 'inclusao'
    };
    xp.push(x);
    let dialogRef = this.dialog.open(ModalComponent, {
      height: this.height,
      width: this.width,
      data: xp
    });

  }

}
