import {Component,Input,Output,EventEmitter} from '@angular/core';
import { DatabaseService } from '../database.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-relation-handler',
  templateUrl: './relation-handler.component.html',
  styleUrls: ['./relation-handler.component.css']
})
export class RelationHandlerComponent {
  constructor(
    private service: DatabaseService,
    private _snackBar: MatSnackBar,
  ) {}

  
  @Input() set refreshaObject(data:any){
    this.confirm=false;
    this.aobject=data;
  }
  @Input() set refreshbObject(data:any){
    this.confirm=false;
    this.bobject=data;
  }
  @Output() onChange = new EventEmitter<any>();
  aobject={
    id:null,
    type:"Person",
    data:""
  }
  bobject={
    id:null,
    type:"Person",
    data:""
  }
  
  relation=""
  relationUploadEnabled=false
  confirm=false
  inputCheck(){
    if (this.aobject.id!=null && this.bobject.id!=null && this.aobject.id!=this.bobject.id && this.relation!="")
      return false;
    return true;
  }
  onApplyClick(){
    this.service.addRelation(this.aobject.id,this.relation,this.bobject.id).then((data) => {
      if (data['error']){
        this.confirm=true;
      }
      else{
        this.relation="";
        this.onChange.emit("");
      }
      this._snackBar.open(data['Msg'], "close");
    });
  }

  OnConfirmClick():void{
    this.service.addRelation(this.aobject.id,this.relation,this.bobject.id,true).then((data) => {
      this._snackBar.open(data['Msg'], "close");
      this.onChange.emit("");
    });
  }
  
  
  
}
