import { Component } from '@angular/core';

import {MatDialog} from '@angular/material/dialog';

import { AddObjectDialogComponent } from '../add-object-dialog/add-object-dialog.component';
@Component({
  selector: 'app-toolbox',
  templateUrl: './toolbox.component.html',
  styleUrls: ['./toolbox.component.css']
})
export class ToolboxComponent {
  constructor(public dialog: MatDialog) { }
  addPerson(){
    const dialogRef = this.dialog.open(AddObjectDialogComponent);
    let instance = dialogRef.componentInstance;
    instance.type = "Person";
    instance.title = "Person";
  }

  
}


