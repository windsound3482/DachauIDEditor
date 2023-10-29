import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import {MatGridListModule} from '@angular/material/grid-list';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { RelationHandlerComponent } from './relation-handler/relation-handler.component';
import { MultimediaHandlerComponent } from './multimedia-handler/multimedia-handler.component';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';
import { PeopleInformationComponent } from './people-information/people-information.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { ComponentSelectorComponent } from './component-selector/component-selector.component';
import {MatTabsModule} from '@angular/material/tabs';
import { NetworkgraphComponent } from './networkgraph/networkgraph.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { ToolboxComponent } from './toolbox/toolbox.component';
import { AddObjectDialogComponent } from './add-object-dialog/add-object-dialog.component';
import {MatSelectModule} from '@angular/material/select';



@NgModule({
  declarations: [
    AppComponent,
    RelationHandlerComponent,
    MultimediaHandlerComponent,
    PeopleInformationComponent,
    FileUploadComponent,
    ComponentSelectorComponent,
    NetworkgraphComponent,
    ToolboxComponent,
    AddObjectDialogComponent
  ],
  imports: [
    BrowserModule,
    MatGridListModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    DragDropModule,MatFormFieldModule, MatInputModule, 
    FormsModule, 
    NgIf, 
    MatButtonModule, 
    MatIconModule,
    MatCardModule,
    MatTabsModule,
    NgxGraphModule,
    MatSnackBarModule,
    MatDialogModule,MatSelectModule,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
