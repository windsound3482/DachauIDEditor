import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';

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

export class FileExplorerComponent {
  constructor(public dialog: MatDialog) {}

  @Input() fileElements: FileElement[]=[];
  @Input() canNavigateUp: boolean=false;
  @Input() path: string="";
  @Input() type: string='';
 

  @Output() navigatedDown = new EventEmitter<FileElement>();
  @Output() navigatedUp = new EventEmitter();
  @Output() checkoutFile = new EventEmitter<FileElement>();
  @Output() deleteCurrentFile = new EventEmitter<FileElement>();
  

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
    window.open('api/multimedia/'+this.path+element.name)
  }

  deleteFile(element: FileElement){
    this.deleteCurrentFile.emit(element)
  }

}
