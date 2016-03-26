
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
		var c = this.column;
		if(this.deleteFlag){
			t.orderByChild(this.key).equalTo(value).once("value").then(function(data){
				data.forEach(function(child){
					t.child(child.ref().key()).remove();
				})
			})
			this.deleteFlag = false;
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
		values = values.split(",");
		console.log(selectedTable)
		if(selectedTable.checkColumns(values)){
			var newRow = this.firebaseUrl.child(this.intoTable).push();
			for(var i = 0;i < values.length;i++){
				newRow.child(selectedTable.columns[i]).set(values[i]);
			}
		}
		return this
	}

	this.addTable = function(name,table){
		
		this.schema[name] = table;
	}

	this.describeSchema = function(){
		var keys = Object.keys(this.schema)
		var tables = new Array();
		for(var i = 0;i < keys.length; i++){
			tables.push(this.schema[keys[i]])
		}
		return tables;
	}

	this.like = function(values){
		var t = this.firebaseUrl.child(this.table);
		var c = this.column;
		var k = this.key
		return t.orderByChild(this.key).once("value").then(function(data){
				var d = data.val();
				var rows = Object.keys(d);
				if(c == "*"){
					var selectedRows = new Array();
					if(rows.length == 0){
						return "No rows selected"
					}
					for (var i = 0; i < rows.length; i++) {
						 if (d[rows[i]][k].indexOf(values) != -1){
						 	selectedRows.push(d[rows[i]])
						 }
					}
					return selectedRows
				}else{
					var selectedRows = new Array();
					if(rows.length == 0){
						return "No rows selected"
					}
					for (var i = 0; i < rows.length; i++) {
						 if (d[rows[i]][k].indexOf(values) != -1){
						 	selectedRows.push(rows[i])
						 }
					}
					return createObjects(d,selectedRows,c)
				}
			})
	}

	function createObjects(d,rows,c){
		var rowObjects = new Array();
		var columnsNeeded = c.split(",");
		console.log(rows)
		for(var i = 0;i < rows.length;i++){
			var returnObject = {};
			for(var o = 0; o < columnsNeeded.length;o++){
				returnObject[columnsNeeded] = d[rows[i]][columnsNeeded]
			}
			rowObjects.push(returnObject)
		}
		return rowObjects;
	}

	
}

function fireTable(name,ecolumns){
		this.name = name;
		this.columns = ecolumns;
		this.checkColumns = function(values){
			return values.length == this.columns.length;
		}
}


