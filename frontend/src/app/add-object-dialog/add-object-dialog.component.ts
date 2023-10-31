import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-add-object-dialog',
  templateUrl: './add-object-dialog.component.html',
  styleUrls: ['./add-object-dialog.component.css'],
  
})
export class AddObjectDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AddObjectDialogComponent>,
    private service: DatabaseService,
    private _snackBar: MatSnackBar,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  id:any=null;
  name:string="";
  type:string="";
  typeEditDisabled=true;
  title:string="";

  confirm=false;

  OnApplyClick():void{
    this.service.addObject(this.id,this.type,this.name).then((data) => {
      if (data['error']){
        this.confirm=true;
      }
      else{
        this.dialogRef.close({data:this.type});
      }
      this._snackBar.open(data['Msg'], "close");
    });
  }

  OnConfirmClick():void{
    this.service.addObject(this.id,this.type,this.name,true).then((data) => {
      this.dialogRef.close({data:this.type});
      this._snackBar.open(data['Msg'], "close");
    });
  }

  inputCheck():boolean{
    return (this.name=='') || (this.type=='')
  }
  
}