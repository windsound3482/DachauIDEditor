import { Component,OnInit,ViewChildren, QueryList,AfterViewInit  } from '@angular/core';
import { DatabaseService } from './database.service';
import { PeopleInformationComponent } from './people-information/people-information.component';
import { CSVService } from './csv.service';
import {MatDialog} from '@angular/material/dialog';
import { AddMultiObjectDialogComponent } from './add-multi-object-dialog/add-multi-object-dialog.component';
import { AddMultiRelationDialogComponent } from './add-multi-relation-dialog/add-multi-relation-dialog.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'frontend';
  leftObject={type:"Person",id:null,data:""}
  rightObject={type:"Person",id:null,data:""}
  @ViewChildren('card') components:QueryList<PeopleInformationComponent>={} as QueryList<PeopleInformationComponent>;
  ngAfterViewInit(){
    console.log(this.components)
  }

  constructor(
    private service: DatabaseService,
    private csvService:CSVService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.getTypeList();
  }
  typelist:any=[]
  getTypeList(){
    this.service.listTypes().then((data) => {
      this.typelist=data;
    })
  }

  switchObject(){
    let tempObject=Object.assign(this.components.first.currentObject)
    this.components.first.currentObjectChange(Object.assign(this.components.last.currentObject))
    this.components.last.currentObjectChange(tempObject)
    this.relationRefresh()
    
  }
  


  relationRefresh(){
    this.components.forEach((component)=>{
      component.refreshRelation();
    })
  }

  uploadFile(file:any){
    if (file.files.length!=0){
      this.csvService.importObjectListsFromCSV(file.files[0]).then((data) => {
        const dialogRef = this.dialog.open(AddMultiObjectDialogComponent);
        let instance = dialogRef.componentInstance;
        instance.uploadObjects=data as any[]
        dialogRef.afterClosed().subscribe(result => {
            this.relationRefresh();
        });
      });
    }
    file.value='';
    
    
  }

  uploadRelaFile(file:any){
    if (file.files.length!=0){
      this.csvService.importRelationListsFromCSV(file.files[0]).then((data) => {
        const dialogRef = this.dialog.open(AddMultiRelationDialogComponent);
        let instance = dialogRef.componentInstance;
        instance.uploadObjects=data as any[]
        dialogRef.afterClosed().subscribe(result => {
            this.relationRefresh();
        });
      });
    }
    file.value='';
    
    
  }

}
