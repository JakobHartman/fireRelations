FireRelations
=========

A small library providing a utility to interact with firebase like a sql database, with basic statements. Soon to have more complex.

## Installation

```bash
npm install firerelations --save
```

## Usage

```javascript
var fireRelation = require('fireRelations');
fireRelation.init("Firebase URL");

//add a table definition
var userCols = ["Column1","Column2"];
fireRelation.addTable("Table Name",userCols);

//insert
fireRelation.insert().into("Table").values("Data1,Data2");

//Select, will return a promise with data 
var data = fireRelation.select().from("Table").where("Column").equals("Value");
data.then(function(callback){
  console.log(callback);
})

//Delete
fireRelation.delete().from("Table").where("Column").equals("Value");
```

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 1.0.0 Initial release
* 1.0.1 Fixed bugs
* 1.0.2 Readme Updates
