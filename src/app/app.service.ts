import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PDFDocumentProxy, getDocument } from 'pdfjs-dist';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private readonly url = 'http://localhost:3000/items'; // URL mais específica

  private dataUpdatedSource = new BehaviorSubject<boolean>(false);
  
  dataUpdated$ = this.dataUpdatedSource.asObservable();

  constructor(private http: HttpClient) { }

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

  // Método para carregar o PDF
  async loadPdf(url: string): Promise<PDFDocumentProxy> {
    const loadingTask = getDocument(url);
    return await loadingTask.promise;
  }
}
