import { Component, Input, OnChanges, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-multimedia-preview',
  templateUrl: './multimedia-preview.component.html',
  styleUrls: ['./multimedia-preview.component.css']
})
export class MultimediaPreviewComponent {
  @Input() type: string='';
  @Input() url: string='';

  fileIconVisiable=true
  


}
