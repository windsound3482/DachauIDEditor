const express = require('express')
var fs = require('fs')
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

app.use(cors({
  origin: '*'
}));

app.use(express.json());


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
          res.send({'id':this.lastID,'data':{
            type:type,
            id:id,
            data:data
            },'error':false,'Msg':`Inserted a Object [${id},${type},${data}] with the ID: ${this.lastID}`});
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
          res.send({'id':this.lastID,'data':{
            type:type,
            id:this.lastID,
            data:data
            },'error':false,'Msg':`Inserted a Object [${id},${type},${data}] with the ID: ${this.lastID}`});
        }
      );
  }
  
}



function selectTypes(res) {
  db.all(`SELECT distinct(type) FROM objects`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    res.send(row);
  });
}

function selectObjectsWithType(type,res) {
  db.all(`SELECT o.id,o.data as label,o.type as type  FROM objects o where o.type='`+type+`'`, (error, nodes) => {
    if (error) {
      throw new Error(error.message);
    }
    db.all(`SELECT r.id,
      r.aid as source,
      r.bid as target,
      r.relation as label  FROM 
      relations r
      left join objects leftObj on r.aid=leftObj.id
      left join objects rightObj on r.bid=rightObj.id 
       where 
        leftObj.type='`+type+`'
        and
        rightObj.type='`+type+`'`, (error, links) => {
        if (error) {
          throw new Error(error.message);
        }
        res.send({nodes:nodes,links:links});
    });
    
    
  });
}

function selectObjectsWithId(id,res) {
  db.all(`SELECT
  r.id,
  r.aid as source,
  r.bid as target,
  r.relation as label  FROM relations r
  where aid=`+id+ ` or bid=`+id , (error, links) => {
    if (error) {
      throw new Error(error.message);
    }
    db.all(`
    SELECT distinct
    o1.id as id,
    o1.data as label,
    o1.type as type  
    FROM relations r1
    left join objects o1 on  r1.aid = o1.id 
    where aid=`+id+ ` or bid=`+id + `
    union
    SELECT distinct
    o2.id as id,
    o2.data as label,
    o2.type as type  
    FROM relations r2
    left join objects o2 on  r2.bid = o2.id 
    where aid=`+id+ ` or bid=`+id
    , (error, nodes) => {
      if (error) {
        throw new Error(error.message);
      }
      if (nodes.length==0)
        db.all(`SELECT o.id,o.data as label,o.type as type  FROM objects o where o.id=`+id, (error, nodes) => {
          if (error) {
            throw new Error(error.message);
          }
          res.send({nodes:nodes,links:links});
        })
      else
        res.send({nodes:nodes,links:links});
    })
  });
}

function addOrSelectRelation(aid,relation,bid,res) {
  db.all(`
    SELECT * 
    FROM relations
    where (aid=`+aid+ ` and bid=`+bid+ `) or (bid=`+aid+ ` and aid=`+bid+ `)`, (error, row) => {
    if (error) {
      throw new Error(error.message);
    }
    if (row.length==0){
      addOrSelectRelation_forced(aid,relation,bid,res);
    }
    else{
      let existedRls="["
      console.log('Existed items:'+row)
      row.forEach((object)=>{
        existedRls=existedRls+object['relation'].toString()+',';
      });
      existedRls=existedRls+']'
      console.log(`Following Relations between aid and bid existed:${existedRls}`);
      res.send({'duplicatedRls':row,'error':true,'Msg':`Following Relations between aid and bid existed:${existedRls}`});
    }
  });
  
}

function addOrSelectRelation_forced(aid,relation,bid,res){
  db.run(`
  INSERT INTO relations (aid, relation,bid)
  VALUES (?,?,?)`,
  [aid,relation,bid],
  function (error) {
    if (error) {
      console.error(error.message);
    }
    console.log(`Inserted a Relation [${aid},${relation},${bid}] with the ID: ${this.lastID}`);
    res.send({'id':this.lastID,'error':false,'Msg':`Inserted a Relation [${aid},${relation},${bid}] with the ID: ${this.lastID}`});
  }
  );
}

function deleteRelation(id,res){
  db.run(`
  Delete from relations where id=`+id,
  function (error) {
    if (error) {
      console.error(error.message);
    }
    console.log(`Delete a Relation with the ID: ${id}`);
    res.send({'error':false,'Msg':`Delete a Relation with the ID: ${id}`});
  }
  );
}

function deleteObject(id,type,res) {
  db.run(`
    Delete from objects where id=`+id,
    function (error) {
      if (error) {
        console.error(error.message);
      }
      console.log(`Delete a Object [${id},${type}]`);
      db.run(`
        Delete from relations where aid=`+id+` or bid=`+id,
        function (error) {
          if (error) {
            console.error(error.message);
          }
          db.all(`
            SELECT * 
            FROM objects 
            where type='`+type+`'`, (error, row) => {
            if (error) {
              throw new Error(error.message);
            }
            if (row.length==0){
              res.send({'data':{
                type:"Person",
                data:"",
                id:null
                },'error':false,'Msg':`A Object [${id},${type}] and all the related relations are deleted`});
            }
            else{
              res.send({'data':{
                type:type,
                data:"",
                id:null
              },'error':false,'Msg':`A Object [${id},${type}] and all the related relations are deleted`});
            }
          });
          
        }
      );
    }
  );
}


app.post('/api/Objects', function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  if (req.body['id']!=null && req.body['id']!=""){
    selectObjectsWithId(req.body['id'],res)
  }
  else{
    if (req.body['type']!=null){
      selectObjectsWithType(req.body['type'],res)
    }
  }
});

app.post('/api/Objects/addOrGetObject', function(req, res) {
  console.log('AddOrGetObject: receiving data ...');
  console.log('body is ',req.body);
  if (req.body['forced']==true){
    addOrSelectObject_forced(req.body['id'],req.body['type'],req.body['value'],res)
  }
  else{
    if (req.body['id']==null || req.body['id']==''){
      addOrSelectObject(req.body['type'],req.body['value'],res);
    }
    else{
      addOrSelectObjectWithID(req.body['id'],req.body['type'],req.body['value'],res);
    }
  }
  
});

app.post('/api/Objects/deleteObject', function(req, res) {
  console.log('AddOrGetObject: receiving data ...');
  console.log('body is ',req.body);
  deleteObject(req.body['id'],req.body['type'],res)
});


app.post('/api/Relations/addOrGetRelation', function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  if (req.body['forced']==true){
    addOrSelectRelation_forced(req.body['aid'],req.body['relation'],req.body['bid'],res)
  }
  else
    addOrSelectRelation(req.body['aid'],req.body['relation'],req.body['bid'],res);
 
});

app.post('/api/Relations/deleteRelation', function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  deleteRelation(req.body['id'],res)
});

app.get('/api/Types', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  selectTypes(res);
});

app.get('/api/multimedia/img/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  fs.readFile('multimedia/img/'+req.params[0], function(err, data) {
    if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'image/jpeg'})
      res.end(data)})
});





app.listen(port, "10.10.10.110", () => {
  console.log(`Example app listening on port ${port}`);
});