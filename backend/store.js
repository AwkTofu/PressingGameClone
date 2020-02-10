var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var app = express();
var uuid = require('uuid');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('../')); //sets the path that express will read files from

var serverIp = 'localhost';
var htmPath = 'index.htm';

app.get('/', function(req, res) {
  res.sendFile(htmPath);
  //res.send("response: " + res.statusCode);
});

MongoClient.connect('mongodb://' + serverIp + ':27017/myproject', function(err, db) {
	if(err){throw err; console.log(err);}

	app.post('/', function(req, res, doc){
		var doc = db.collection('Graphs');

  	//console.log("POST received:" + res.statusCode);
  	
  	doc.find({_id : req.body.graph_id}).toArray(function(e, l){
			if(l.length != 0){
				//var newID = createID(req.body.graph_id); //this var stores a new ID so it can be consoled
		  	//console.log("orig: " + req.body.graph_id);
		  	//console.log("_new: " + newID + "\n");
		  	doc.insert({ _id : createID(req.body.graph_id), 'Data' : req.body});
			}
			else if(l.length == 0){
		  	//console.log("not found \n");
				doc.insert({ _id : req.body.graph_id, 'Data' : req.body});
				//console.log(req.body.graph_id + " was added normally \n");
			}
		});
		
		//doc.remove({}); remove ALL documents from the db*/
		//doc.find().toArray(function(err, items){console.log(items);}); //show all documets in the db
	});
	
		
	app.listen(3000, function(){
		console.log('Example app listening on port 3000!');
	});	

});


function createID(origID){
	ID = "graph-" + uuid.v4();
	//console.log("new: " + ID);
	if(ID == origID){
		createID(origID);
	}
	else{return ID;}
}
