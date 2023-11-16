import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import { CSVService } from '../csv.service';

@Component({
  selector: 'app-add-multi-object-dialog',
  templateUrl: './add-multi-object-dialog.component.html',
  styleUrls: ['./add-multi-object-dialog.component.css']
})
export class AddMultiObjectDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddMultiObjectDialogComponent>,
    private service: DatabaseService,
    private _snackBar: MatSnackBar,
    private csvService: CSVService
  ) {}
  onNoClick(): void {
    this.dialogRef.close();
  }
  uploadObjects:Array<any>=[]
  

  confirm=false;

  OnApplyClick():void{
    this.uploadObjects.forEach((object:any,index:number)=>{
      if (object.Msg!="")
        this.service.addObject(object.id,object.type,object.value).then((data) => {
          if (data['error']){
            this.confirm=true;
            object.Msg=data['Msg']
          }
          else{
            object.Msg=""
            object.id=data.id
          }
        });
    })
  }

  OnConfirmClick():void{
    this.uploadObjects.forEach((object:any,index:number)=>{
      if (object.Msg!="")
        this.service.addObject(object.id,object.type,object.value,true).then((data) => {
          
        });
    })
    this.dialogRef.close("okay");
    this.OnDownloadClick();
    this._snackBar.open("All the Data are uploaded with forced", "close");
    
  }

  OnDownloadClick(){
    this.csvService.jsonToCSV(this.uploadObjects);
  }

  newExist(){
    let exist=false
    this.uploadObjects.forEach((object:any)=>{
      if (object.Msg!="")
        exist=true
    })
    return exist
  }


  inputCheck():boolean{
    let notValid=false
    this.uploadObjects.forEach((object:any)=>{
      if (object.value=='' || object.type==''){
        notValid=true
      } 
    })

    return notValid || this.newExist()==false
  }
}
