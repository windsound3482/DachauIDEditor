const express = require('express')
const pdftopic = require ("pdftopic");
var fs = require('fs')
const Path = require("path");
const app = express()
const sqlite3 = require("sqlite3").verbose();
const filepath = "./dachau.db";
const port=80
const cors = require('cors');
const imageThumbnail = require('image-thumbnail');
const streamtoarray = require('stream-to-array');
const imagemagick = require("imagemagick-stream");
const { exec } = require('child_process');
const  EmlParser = require('eml-parser');
const nodeHtmlToImage = require('node-html-to-image');



//helpfunction imagemagickconverter
const imagemagickconverter = async (pdf,type) => {
  console.log(type)
  const imagemagickstream = imagemagick()
      .set('density', 200)
      .set('strip')
      .quality(90)
      .set("background", "white")
      .set("flatten");

  const onError = imagemagickstream.onerror;

  imagemagickstream.onerror = (err) => {
      if (Buffer.isBuffer(err)) {
          console.log(`Ignore the error in ImageMagick.:\n${err.toString()}`);
          return;
      }
      console.log(`Error:\n${err} from ImageMagick`);
      onError.apply(this, arguments);
  };

  imagemagickstream.input = `${type}:-[0]`;
  imagemagickstream.output = 'png:-';

  imagemagickstream.end(pdf);


  const parts = await streamtoarray(imagemagickstream);
  const buffers = parts.map(part => Buffer.isBuffer(part) ? part : Buffer.from(part));
  const resultBuffer = Buffer.concat(buffers);


  return resultBuffer;
}


const db= new sqlite3.Database(filepath, (error) => {
  if (error) {
    return console.error(error.message);
  }
});

app.use(cors({
  origin: '*'
}));

app.use(express.json({limit: '50mb'}));



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
  if (id!=null && id!=""){
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

function selectObjectsWithValue(value,res) {
  db.all(`SELECT o.id,o.data as data,o.type as type  FROM objects o where o.data='`+value+`'`, (error, nodes) => {
    if (error) {
      throw new Error(error.message);
    }
    if (nodes.length==0)
      res.send({result:false});
    else
      res.send({node:nodes[0],result:true});
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
  db.all(`SELECT * FROM objects where objects.id=${aid} or objects.id=${bid}`,(err,row)=>{
    if (row.length==2){
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
    else{
      if (row.length==0)
        res.send({'error':true,'Msg':`Objects with ${aid} and ${bid} both do not existed`});
      else
      if (row[0].id==aid)
        res.send({'error':true,'Msg':`Object with ${bid} does not existed`});
      else
        res.send({'error':true,'Msg':`Object with ${aid} does not existed`});
    }
  })
  
  
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
    else{
      if (req.body['value']!=null){
        selectObjectsWithValue(req.body['value'],res)
      } 
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

app.get('/api/multimedia/Picture/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  fs.readFile('multimedia/Picture/'+req.params[0], function(err, data) {
    if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'image/jpeg'})
      res.end(data)})
});

function thumbnailImage(fileOrPath,res){
  imageThumbnail(fileOrPath,{ height:500})
    .then(thumbnail => { 
      res.writeHead(200, {'Content-Type': 'image/jpeg'})
      res.end(thumbnail)
      console.log(thumbnail) 
  })
}

app.get('/api/multimediaThumbnail/Picture/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  
  thumbnailImage('multimedia/Picture/'+req.params[0],res)

});



app.get('/api/multimedia/pdf/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  fs.readFile('multimedia/pdf/'+req.params[0], function(err, data) {
    if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'application/pdf'})
      res.end(data)})
});

app.get('/api/multimediaThumbnail/pdf/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  
  fs.readFile('multimedia/pdf/'+req.params[0], function(err, originalPdfData) {
    (async () => {
      const converted_result = await pdftopic.pdftobuffer(originalPdfData, 0);
      thumbnailImage(converted_result[0],res)  
    })();
  })
});

app.get('/api/multimedia/doc/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  fs.readFile('multimedia/doc/'+req.params[0], function(err, data) {
    if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'})
      res.end(data)})
});

app.get('/api/multimediaThumbnail/doc/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  console.log('receiving data ...');
  exec('cp multimedia/doc/'+req.params[0]+' temp.docx; libreoffice --headless --convert-to pdf temp.docx', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    fs.readFile('temp.pdf', function(err, originalPdfData) {
      (async () => {
        console.log(originalPdfData)
        const converted_result = await pdftopic.pdftobuffer(originalPdfData, 0);
        thumbnailImage(converted_result[0],res) 
      })();
    })
  });
  
});



app.get('/api/multimedia/Email/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  fs.readFile('multimedia/Email/'+req.params[0], function(err, data) {
    if (err) throw err // Fail if the file can't be read.
      res.writeHead(200, {'Content-Type': 'application/vnd.ms-outlook'})
      res.end(data)})
});

async function sendResHtml(html,res){
  const image=await nodeHtmlToImage({
    html: `<html>
    <head>
      <style>
        body {
          width: 470px;
          height: 300px;
        }
      </style>
    </head>
    <body>${html}</body>
    </html>`,
    puppeteerArgs: {
      args:  ['--no-sandbox' ,'--disable-setuid-sandbox']
    }
  });
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image, 'binary');
}

app.get('/api/multimediaThumbnail/Email/*', function (req, res) {
  //res.header("Access-Control-Allow-Origin", "*");
  console.log('receiving data ...');
  let  file = fs.createReadStream('multimedia/Email/'+req.params[0])
  if (req.params[0].slice(-3)=='eml')
    new  EmlParser(file).getEmailAsHtml().then(html=>{
      sendResHtml(html,res)
    })
    
    .catch(err  => {
      console.log(err);
    })
  if (req.params[0].slice(-3)=='msg')
    new  EmlParser(file).getMessageAsHtml().then(html=>{
      sendResHtml(html,res)
    })
    
    .catch(err  => {
      console.log(err);
    })
});




Files  = [];
fileIndex=1;

function ThroughDirectory(Directory,currentName) {
  fs.readdirSync(Directory).forEach(File => {
      const Absolute = Path.join(Directory, File);
      this.fileIndex+=1
      if (fs.statSync(Absolute).isDirectory()) 
      {
        console.log(this.Files)
        this.Files.push({
          id:Absolute,
          isFolder: true,
          name: File,
          parent: currentName
        })
        ThroughDirectory(Absolute,Absolute)
      }
      else 
        this.Files.push({
          id:Absolute,
          isFolder: false,
          name: File,
          parent: currentName
        })
  });
}

app.post('/api/multimedia', function (req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
  //res.header("Access-Control-Allow-Origin", "*");
  this.Files = []
  this.fileIndex=1
  this.Files.push({
    id:'multimedia/'+req.body['type'],
    isFolder: true,
    name:req.body['type'] ,
    parent: "root"
  })
  ThroughDirectory('multimedia/'+req.body['type'],'multimedia/'+req.body['type'])
  

  res.send(this.Files)
});



app.post('/api/multimedia/upload', function(req, res) {
  console.log('Load Data')
  console.log('receiving data ...');
  console.log('body is ',req.body);
  fs.mkdirSync('multimedia/'+req.body['path'], { recursive: true })
  let base64Image = req.body['fileData'].split(';base64,').pop();
  fs.writeFileSync('multimedia/'+req.body['name'], base64Image, {encoding: 'base64'}, function(err) {
    
    console.log('File created');
  });
  res.send({"result":"Successful"})
});

app.post('/api/multimedia/delete', function(req, res) {
  console.log('receiving data ...');
  console.log('body is ',req.body);
 
  fs.unlink('multimedia/'+req.body['name'],function(err){
        if(err) return console.log(err);
        res.send({'data':{
        type:req.body['type'],
        data:"",
        id:null
      },'error':false,'Msg':`A Object ${req.body['name']} is deleted`});
        console.log('file deleted successfully');
  });  

});



app.listen(port, "10.10.10.110", () => {
  console.log(`Example app listening on port ${port}`);
});