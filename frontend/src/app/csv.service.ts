import { Injectable } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { FileserverService } from './fileserver.service';
import {MatSnackBar} from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root'
})
export class CSVService {

  constructor(private papa: Papa,
    private fileService:FileserverService,
    private _snackBar: MatSnackBar,) { }

  containsFields(arr:any,fields:any){
    let flag=true
    console.log(fields)
    fields.forEach((field:any)=>{
      if (!arr.includes(field))
        flag=false
    })
    return flag
  }

  tabDelimiter(delimiter:any){
    console.log(delimiter)
    return delimiter=== "\\t" ? "\t" : delimiter
  }

  async importObjectListsFromCSV(data:any) {
    return await new Promise((resolve, reject) => {
      this.papa.parse(data, {
        complete: (results:any, file:any) => {
            
            if (!this.containsFields(results.meta.fields,['id','type','value'])){
              this._snackBar.open("Do not contain all of the ['id','type','value']" as string, "close");
              reject("err")
            }
            else
            {
              console.log('Parsed: ', results, file);
              results.data.map(
                (object:any)=>{
                  object.Msg='Ready'
                }
              )
              resolve(results.data)
            }
            
        },
        error (err, file) {
          reject(err)
        },
        delimiter: "\t",
        header: true,
        skipEmptyLines: true,
  
        // Add your options here
      })
    })
  }

  async importRelationListsFromCSV(data:any) {
    
    return await new Promise((resolve, reject) => {
      this.papa.parse(data, {
        complete: (results:any, file:any) => {
            
            if (!this.containsFields(results.meta.fields,['aid','relation','bid'])){
              this._snackBar.open("Do not contain all of the ['aid','relation','bid']" as string, "close");
              reject("err")
            }
            else
            {
              console.log('Parsed: ', results, file);
              results.data.map(
                (object:any)=>{
                  object.Msg='Ready'
                }
              )
              resolve(results.data)
            }
            
        },
        error (err, file) {
          reject(err)
        },
        delimiter: "\t",
        header: true,
        skipEmptyLines: true,
  
        // Add your options here
      })
    })
    

    return null; 
  }

  async jsonToCSV(data:any,filename='result.txt'){
    let csv = this.papa.unparse(data,{
      delimiter:"\t"
    })
    this.fileService.downloadFile(csv,filename)
  }
}
