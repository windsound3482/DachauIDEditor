import {Component, ViewChild,Input,Output,EventEmitter,AfterViewInit} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';


export interface UserData {
  id: any;
  type: any;
  data: any;
}

@Component({
  selector: 'app-object-list',
  templateUrl: './object-list.component.html',
  styleUrls: ['./object-list.component.css']
})
export class ObjectListComponent implements AfterViewInit {
  displayedColumns: string[] = ['id', 'type', 'data'];
  dataSource: MatTableDataSource<UserData>={} as MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator: MatPaginator={} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort={} as MatSort;

  @Input() set objects(data:any){
    console.log(data)
    if (data){
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
   
    }
    else{
      this.dataSource = new MatTableDataSource([{id:0,type:'Person',data:'Einstein'}]);

    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  @Output() nodeChanged= new EventEmitter<any>();

  constructor() {
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectObject(object:any){
    console.log(object)
    this.nodeChanged.emit(
      {
        type:object.type,
        data:object.label,
        id:object.id
      }
    )

  }
}

