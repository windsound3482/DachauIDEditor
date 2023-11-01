import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-relation-dialog',
  templateUrl: './confirm-delete-relation-dialog.component.html',
  styleUrls: ['./confirm-delete-relation-dialog.component.css']
})
export class ConfirmDeleteRelationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteRelationDialogComponent>,
    private service: DatabaseService,
    private _snackBar: MatSnackBar,
  ) {}
  id:any=null;
  OnConfirmClick():void{
    this.service.deleteRelation(this.id).then((data) => {
      this.dialogRef.close({data:data});
      this._snackBar.open(data['Msg'], "close");
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
