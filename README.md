FireRelations
=========

A small library providing a utility to interact with firebase like a sql database, with basic statements. Soon to have more complex.

## Installation

  npm install firerelations --save

## Usage

  var fireRelation = require('fireRelations');
  <br>
  fireRelation.init("Firebase URL");
  //add a table definition
  <br>
  var userCols = ["Column1","Column2"];
  <br>
  fireRelation.addTable("Table Name",userCols);
  <br>
  //insert
  <br>
  fireRelation.insert().into("Table").values("Data1,Data2");
  <br>
  //Select, will return a promise with data 
  <br>
  var data = fireRelation.select().from("Table").where("Column").equals("Value");
  <br>
  data.then(function(callback){
  <br>
  	console.log(callback);
  <br>
  })
  <br>
  //Delete
  <br>
  fireRelation.delete().from("Table").where("Column").equals("Value");

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

## Release History

* 1.0.0 Initial release