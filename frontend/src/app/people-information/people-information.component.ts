import { Component,Input, Output, EventEmitter} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {FormControl} from '@angular/forms'
import { AddObjectDialogComponent } from '../add-object-dialog/add-object-dialog.component';
@Component({
  selector: 'app-people-information',
  templateUrl: './people-information.component.html',
  styleUrls: ['./people-information.component.css']
})
export class PeopleInformationComponent  {
  @Input() typeList=[{type:'Person'}];
  @Output() refreshTypeListEvent = new EventEmitter<string>();
  constructor(public dialog: MatDialog) { }
  Person:any=null;
  typeControlValue=new FormControl('Person');
  NotPropertyList=['Person']
  prevMatSelectValue:any='Person'
  public onMatSelectOpen(form:any): void {
    this.prevMatSelectValue = this.typeControlValue.value;
  }

  typeControl(type:any){
    console.log(type)
    if (this.typeControlValue.value=="Add New"){
      this.typeControlValue.setValue(this.prevMatSelectValue);
      const dialogRef = this.dialog.open(AddObjectDialogComponent);
      let instance = dialogRef.componentInstance;
      instance.type = "";
      instance.title = "Property";
      instance.typeEditDisabled=false;
      dialogRef.afterClosed().subscribe(result => {
        if (result!=null){
          this.refreshTypeListEvent.emit("");
          this.typeControlValue.setValue(result.data);
        }
      });
    }
  };
  

}
