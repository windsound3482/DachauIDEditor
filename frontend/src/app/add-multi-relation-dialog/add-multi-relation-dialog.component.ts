import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import { CSVService } from '../csv.service';

@Component({
  selector: 'app-add-multi-relation-dialog',
  templateUrl: './add-multi-relation-dialog.component.html',
  styleUrls: ['./add-multi-relation-dialog.component.css']
})
export class AddMultiRelationDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddMultiRelationDialogComponent>,
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
        this.service.addRelation(object.aid,object.relation,object.bid).then((data) => {
          if (data['error']){
            this.confirm=true;
            object.Msg=data['Msg']
          }
          else{
            object.Msg=""
          }
        });
    })
  }

  OnConfirmClick():void{
    this.uploadObjects.forEach((object:any,index:number)=>{
      if (object.Msg!="" && !(object.Msg as string).includes("not existed"))
        this.service.addRelation(object.aid,object.relation,object.bid,true).then((data) => {
          object.Msg=""
        });
    })
    this.dialogRef.close("okay");
    this.OnDownloadClick();
    this._snackBar.open("All the Data are uploaded with forced(excl. which Object does not exist)", "close");
    
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
      if (!object.aid || !object.bid || object.aid=='' || object.relation=='' || object.bid==''){
        notValid=true
      } 
    })

    return notValid || this.newExist()==false
  }
}
