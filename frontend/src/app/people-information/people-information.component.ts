import { Component } from '@angular/core';
import { DatabaseService } from '../database.service';
@Component({
  selector: 'app-people-information',
  templateUrl: './people-information.component.html',
  styleUrls: ['./people-information.component.css']
})
export class PeopleInformationComponent {
  Person:any=null;

  constructor(private service: DatabaseService) { }
  checkList(){
    this.service.personList().then((data) => {
      this.Person=data;
  });
  }
}
