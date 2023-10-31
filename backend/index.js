const express = require('express')
const app = express()
const sqlite3 = require("sqlite3").verbose();
const filepath = "./dachau.db";
const port=80
const cors = require('cors');
const db= new sqlite3.Database(filepath, (error) => {
  if (error) {
    return console.error(error.message);
  }
});


function addOrSelectObject(type,data,res) {
  db.all(`
    SELECT * 
    FROM objects 
    where type='`+type+ `' and data='`+data+`'`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    if (row.length==0){
      addOrSelectObject_forced(null,type,data,res);
    }
    else{
      let existedIds="["
      console.log('Existed items:'+row)
      row.forEach((object)=>{
        existedIds=existedIds+object['id'].toString()+',';
      });
      existedIds=existedIds+']'
      console.log(`A Object [${type},${data}] existed with the folling IDs: ${existedIds}`);
      res.send({'duplicatedObjs':row,'error':true,'Msg':`A Object [${type},${data}] existed with the folling IDs: ${existedIds}`});
    }
  });
  
}



function addOrSelectObjectWithID(id,type,data,res) {
  db.all(`
    SELECT * 
    FROM objects 
    where id=`+id, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    if (row.length==0){
      addOrSelectObject_forced(id,type,data,res);
    }
    else{
      if (row[0]['type']==type && row[0]['data']==data){
        console.log(`A Object [${type},${data}] with the ID ${row[0]['id']} already existed`);
        res.send({'error':true,'Msg':`A Object [${type},${data}] with the ID ${row[0]['id']} already existed`});
      }
      else{
        console.log(`There is a Object with the ID: ${row[0]['id']} shows the following ${row[0]['type']}:${row[0]['data']}`);
        res.send({'type':row[0]['type'],'data':row[0]['data'],'error':true,'Msg':`There is a Object with the ID: ${row[0]['id']} shows the following ${row[0]['type']}:${row[0]['data']}`});
    
      }
    }
  });
  
}

function addOrSelectObject_forced(id,type,data,res) {
  if (id!=null){
    db.run(`
        INSERT or replace INTO objects (id,type, data)
        VALUES (?, ?, ?)`,
        [id,type,data],
        function (error) {
          if (error) {
            console.error(error.message);
          }
          console.log(`Inserted a Object [${id},${type},${data}] with the ID: ${this.lastID}`);
          res.send({'id':this.lastID,'error':false,'Msg':`Inserted a Object [${id},${type},${data}] with the ID: ${this.lastID}`});
        }
      );
  }
  else{
    db.run(`
        INSERT into objects (type, data)
        VALUES ( ?, ?)`,
        [type,data],
        function (error) {
          if (error) {
            console.error(error.message);
          }
          console.log(`Inserted a Object [${id},${type},${data}] with the ID: ${this.lastID}`);
          res.send({'id':this.lastID,'error':false,'Msg':`Inserted a Object [${id},${type},${data}] with the ID: ${this.lastID}`});
        }
      );
  }
  
}

function addRelation(aid,relation,bid){
  db.run(`
  INSERT INTO objects (aid, relation,bid)
  VALUES (?,?,?)`,
  [aid,relation,bid],
  function (error) {
    if (error) {
      console.error(error.message);
    }
    console.log(`Inserted a Relation [${aid},${relation},${bid}] with the ID: ${this.lastID}`);
    res.sendStatus(200);
  }
  );
}

function selectTypes(res) {
  db.all(`SELECT distinct(type) FROM objects`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    res.send(row);
  });
}

function selectRelations(id,res) {
  db.each(`SELECT * FROM relations
  where aid='`+id+ `' or bid='`+id + `'`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    res.send(row);
  });
}

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.post('/api/Objects/addOrGetObject', function(req, res) {
  console.log('AddOrGetObject: receiving data ...');
  console.log('body is ',req.body);
  if (req.body['forced']==true){
    addOrSelectObject_forced(req.body['id'],req.body['type'],req.body['value'],res)
  }
  else{
    if (req.body['id']==null){
      addOrSelectObject(req.body['type'],req.body['value'],res);
    }
    else{
      addOrSelectObjectWithID(req.body['id'],req.body['type'],req.body['value'],res);
    }
  }
  
});


app.post('/api/Objects/addRelation', function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  addRelation(req.body['aid'],req.body['relation'],req.body['bid']);
 
});

app.post('/api/Relations/currentRelations', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  selectRelations(req.body['id'],res)
});


app.get('/api/Types', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  selectTypes(res);
});



app.listen(port, "10.10.10.110", () => {
  console.log(`Example app listening on port ${port}`);
});