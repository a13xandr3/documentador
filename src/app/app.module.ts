import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ModalComponent } from './modal/modal.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { SafePipe } from './safe.pipe';
import { PaginadorComponent } from './paginador/paginador.component';
import { MaterialModule } from './material/material.module';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    ModalComponent,
    PdfViewerComponent,
    SafePipe,
    PaginadorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [ {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: true }}, HomeComponent ],
  entryComponents: [ MatDialogModule ],
  bootstrap: [AppComponent]
})
export class AppModule { }
