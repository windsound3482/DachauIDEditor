import { Component, Input, SimpleChanges, OnInit, Output, EventEmitter } from '@angular/core';

import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { MatDialog } from '@angular/material/dialog';



interface FileElement {
  id?: string;
  isFolder: boolean;
  name: string;
  parent: string;
}

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})

export class FileExplorerComponent implements OnInit{
  constructor(public dialog: MatDialog) {}

  @Input() fileElements: FileElement[]=[];
  @Input() canNavigateUp: boolean=false;
  @Input() path: string="";
  @Input() type: string='';
 

  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  @Output() checkoutFile = new EventEmitter<FileElement>();
  @Output() deleteCurrentFile = new EventEmitter<FileElement>();

  pictureHeight=80
  

  ngOnChanges(changes: SimpleChanges): void {}


  navigate(element: FileElement) {
    if (element.isFolder) {
      this.navigatedDown.emit(element);
    }
    else
    {
      this.checkoutFile.emit(element);
    }
  }

  navigateUp() {
    this.navigatedUp.emit();
  }

  open(element: FileElement){
    if (!element.isFolder) 
      window.open('api/multimedia/'+this.path+element.name)
  }

  deleteFile(element: FileElement){
    if (!element.isFolder) {
      this.deleteCurrentFile.emit(element)
    }
  }

  boxWidth=400

  ngOnInit(): void {
    this.boxWidth=window.innerWidth/100*41-40 ;
  }

  onBoxResize(box:any){
    console.log(box)
    this.boxWidth=window.innerWidth/100*41-40 ;
  }

}
