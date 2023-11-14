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
import {MatTabsModule} from '@angular/material/tabs';
import { NetworkgraphComponent } from './networkgraph/networkgraph.component';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import { AddObjectDialogComponent } from './add-object-dialog/add-object-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import { ComfirmDeleteObjectDialogComponent } from './comfirm-delete-object-dialog/comfirm-delete-object-dialog.component';
import { ConfirmDeleteRelationDialogComponent } from './confirm-delete-relation-dialog/confirm-delete-relation-dialog.component';
import { AddMultiObjectDialogComponent } from './add-multi-object-dialog/add-multi-object-dialog.component';
import { AddMultiRelationDialogComponent } from './add-multi-relation-dialog/add-multi-relation-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    RelationHandlerComponent,
    MultimediaHandlerComponent,
    PeopleInformationComponent,
    NetworkgraphComponent,
    AddObjectDialogComponent,
    ComfirmDeleteObjectDialogComponent,
    ConfirmDeleteRelationDialogComponent,
    AddMultiObjectDialogComponent,
    AddMultiRelationDialogComponent
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
    NgxChartsModule,
    MatSnackBarModule,
    MatDialogModule,MatSelectModule,ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
