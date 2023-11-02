import { Component,OnInit,ViewChildren, QueryList,AfterViewInit  } from '@angular/core';
import { DatabaseService } from './database.service';
import { PeopleInformationComponent } from './people-information/people-information.component';


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
    let tempObject2=Object.assign(this.leftObject)
    this.leftObject=Object.assign(this.rightObject)
    this.rightObject=tempObject2
    let tempObject=Object.assign(this.components.first.currentObject)
    this.components.first.currentObjectChange(Object.assign(this.components.last.currentObject))
    this.components.last.currentObjectChange(tempObject)
    
  }
  


  relationRefresh(){
    this.components.forEach((component)=>{
      component.refreshRelation();
    })
  }

}
