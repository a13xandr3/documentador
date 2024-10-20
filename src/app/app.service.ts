import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly url = 'http://localhost:3000/items';
  private readonly urlB64 = 'http://localhost:3000/base64';

  private dataUpdatedSource = new BehaviorSubject<boolean>(false);
  
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  constructor(private http: HttpClient) { }

  //Método para buscar pelo id o base64 para transformar e exibir em tela a imagem ou doc
  public getBase64(id: string): Observable<any> {
    return this.http.get(`${this.urlB64}/${id}`);
  }

  // Método para obter todos os itens
  public getItems(): Observable<any> {
    return this.http.get(this.url);
  }

  // Método para incluir um novo item
  public postItem(body: any): Observable<any> {
    return this.http.post(this.url, body);
  }

  // Novo método para atualizar um item existente
  public updateItem(id: string, body: any): Observable<any> {
    return this.http.put(`${this.url}/${id}`, body);
  }

  // Método para deletar um item
  public deleteItem(id: string): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }

  notifyDataUpdated() {
    this.dataUpdatedSource.next(true);
  }

}
