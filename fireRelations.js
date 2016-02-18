

function FireRelations(){
	var url;
	var firebaseUrl;
	var column;
	var table;
	var key;
	var into;

	this.schema = {};


	this.init = function(url){
		this.firebaseUrl = new Firebase(url);
		return this.firebaseUrl;
	}

	this.select = function(column){
		this.column = column;
		return this;
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

	this.insert = function(){
		return this;
	}

	this.into = function(into){
		this.into = into
		return this 
	}

	this.values = function(values){
		var selectedTable = this.schema[this.into];
		values = values.split(",");
		if(selectedTable.checkColumns(values)){
			var newRow = this.firebaseUrl.child(this.into).push();
			for(var i = 0;i < values.length;i++){
				newRow.child(selectedTable.columns[i]).set(values[i]);
			}
		}
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
}


function fireTable(name,columns){
	this.name = name;
	this.columns = columns;
	this.checkColumns = function(values){
		return values.length == this.columns.length;
	}
}











