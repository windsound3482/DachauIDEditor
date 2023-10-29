import { Component,OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
@Component({
  selector: 'app-component-selector',
  templateUrl: './component-selector.component.html',
  styleUrls: ['./component-selector.component.css']
})
export class ComponentSelectorComponent implements OnInit {
  constructor(
    private service: DatabaseService,
  ) {}
  ngOnInit(): void {
    this.getTypeList();
  }
  typelist=[]
  getTypeList(){
    this.service.listTypes().then((data) => {
      this.typelist=data;
    })
  }
}
