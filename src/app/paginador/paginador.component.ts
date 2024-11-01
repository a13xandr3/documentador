import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
@Component({
  selector: 'app-paginador',
  templateUrl: './paginador.component.html',
  styleUrls: ['./paginador.component.scss']
})
export class PaginadorComponent implements OnInit {

  @Input() public data: any;

  displayedColumns: string[] = ["titulo", "descricao", "detalhe", "categoria", "tipo", "valor"];

  public dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  totalRecords: number = 20;
  pageSize: number = 10;

  pageEvent: PageEvent | undefined;
  
  ngOnInit() {

    this.dataSource = new MatTableDataSource(this.data);

    this.totalRecords = this.dataSource.data.length;
    this.dataSource.paginator = this.paginator;


   


  }

  onPaginateChange(event: any) {
    //console.log(event);
    //console.log(Math.ceil(this.totalRecords / this.pageSize) - 1);

    if (event.pageIndex == Math.ceil(this.totalRecords / this.pageSize) - 1) {
      //console.log("API call");
      let apiRes = this.data;
      let oldRes = this.dataSource.data;
      let newRes = [...oldRes, ...apiRes];

      this.dataSource = new MatTableDataSource(newRes);
      this.totalRecords = this.dataSource.data.length;
      this.dataSource.paginator = this.paginator;
    }
  }
  getData() {
    let _arr: any;
    let dta: any = this.data;
    //console.log('dta', dta);
    //console.log('dentro', dta[0]);


    for( let i = 0; i < this.data.length; i ++ ) {
      
      console.log('dentro', this.data[0].titulo);

      /*
      _arr.push({
        titulo: dta[i].titulo, 
        descricao: dta[i].titulo, 
        detalhe: dta[i].titulo, 
        categoria: dta[i].titulo, 
        tipo: dta[i].titulo, 
        valor: dta[i].titulo
      });
      */
    }
    //return _arr;
  }
}

/**  Copyright 2019 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
