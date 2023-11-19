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
  multimedia=false;
  OnConfirmClick():void{
    if (!this.multimedia)
      this.service.deleteObject(this.id,this.type).then((data) => {
        
          this.dialogRef.close({data:data.data});
          this._snackBar.open(data['Msg'], "close");
      });
    else{
      this.service.deleteFile(this.type,this.type+"/"+this.name)
      this.service.listObject(null,null,this.name).then((data) => {
        console.log(data)
        if (data.result){
          this.service.deleteObject(data.node.id,data.node.type).then((data) => {
            this.dialogRef.close({data:data.data,exist:true});
            this._snackBar.open(data['Msg'], "close");
          });
        }
        else{
          this.dialogRef.close({exist:false});
          this._snackBar.open("The Picture has been deleted from the disk", "close");
        }
      })
    }
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
