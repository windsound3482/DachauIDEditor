import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-comfirm-delete-object-dialog',
  templateUrl: './comfirm-delete-object-dialog.component.html',
  styleUrls: ['./comfirm-delete-object-dialog.component.css']
})
export class ComfirmDeleteObjectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ComfirmDeleteObjectDialogComponent>,
    private service: DatabaseService,
    private _snackBar: MatSnackBar,
  ) {}
  id:any=null;
  name:string="";
  type:string="";
  OnConfirmClick():void{
    this.service.deleteObject(this.id,this.type).then((data) => {
      this.dialogRef.close({data:data.data});
      this._snackBar.open(data['Msg'], "close");
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
