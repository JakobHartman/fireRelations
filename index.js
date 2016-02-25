
var Firebase = require("firebase");

module.exports = new FireRelations();


function FireRelations(){
	var url;
	var firebaseUrl;
	var column;
	var table;
	var key;
	var intoTable;
	var deleteFlag = false;

	this.schema = {};


	this.init = function(url){
		this.firebaseUrl = new Firebase(url);
		return this.firebaseUrl;
	}

	this.select = function(column){
		this.column = column;
		return this;
	}

	this.delete = function(){
		this.deleteFlag = true;
		return this
	}

	this.from = function(table){
		this.table = table;
		return this;
	}

	this.where = function(key){
		this.key = key;
		return this;
	}

	this.equals = function(value){
		var t = this.firebaseUrl.child(this.table);
		console.log(this.table)
		var c = this.column;
		if(this.deleteFlag){
			t.orderByChild(this.key).equalTo(value).once("value").then(function(data){
				data.forEach(function(child){
					t.child(child.ref().key()).remove();
				})
				this.deleteFlag = false;
			})
			return this
		}else{
			return t.orderByChild(this.key).equalTo(value).once("value").then(function(data){
				var d = data.val();
				var rows = Object.keys(d);
				if(c == "*"){
					return d;
				}else{
					var rowObjects = new Array();
					var columnsNeeded = c.split(",");
					for(var i = 0;i < rows.length;i++){
						var returnObject = {};
						for(var o = 0; o < columnsNeeded.length;o++){
							returnObject[columnsNeeded] = d[rows[i]][columnsNeeded]
						}
						rowObjects.push(returnObject)
					}
					return rowObjects;
				}
			})
		}
		
	}

	this.insert = function(){
		return this;
	}

	this.into = function(into){
		this.intoTable = into
		return this 
	}
 
	this.values = function(values){
		var selectedTable = this.schema[this.intoTable];
		console.log(this.schema)
		console.log(selectedTable)
		values = values.split(",");
		if(selectedTable.checkColumns(values)){
			var newRow = this.firebaseUrl.child(this.intoTable).push();
			for(var i = 0;i < values.length;i++){
				newRow.child(selectedTable.columns[i]).set(values[i]);
			}
		}
		return this
	}

	this.addTable = function(name,table){
		var newTable = new fireTable(name,table)
		this.schema[name] = newTable;
	}

	this.describeSchema = function(){
		var keys = Object.keys(this.schema)
		var tables = new Array();
		for(var i = 0;i < keys.length; i++){
			tables.push(this.schema[keys[i]])
		}
		return tables;
	}

	
}

function fireTable(name,ecolumns){
		this.name = name;
		this.columns = ecolumns;
		this.checkColumns = function(values){
			return values.length == this.columns.length;
		}
}


