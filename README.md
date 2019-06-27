### About

TabDat is a package for working with tabular data in CSV format. It leverages Papa Parse for the CSV to JSON conversion, and then mostly utilizes Lodash for the manipulation of the data. It is intended for users who want to easily work with tabular data in Node.js and particularly for users who may be used to working with data frames in R/Python/etc.

### Contributing

This is a side project (read: low priority) of mine so any contributions are welcome - just submit a pull request on GitHub. I really would like to see a robust Node.js package that allows for working with tabular data in a way that is similar to R/Python so I am hoping to get additional contributors and to be able to really flesh this package out in a thorough manner.

### Installation

```javascript
npm i tabdat
```

### Usage

The standard workflow looks like this:

```javascript
const TabDat = require('tabdat')

convert('/path/to/file.csv').then(data => {
  td = new TabDat(data)
  td.sortBy(row => row.mpg)
    .filter(row => countryOfOrigin === 'USA')
    .printTable()
})
```
Note that all methods are chainable.

### Available Methods

```javascript
convert(filepath)
```
Converts a CSV file to JSON for further processing. ```filepath``` is a string pointing to the correct location. Returns a promise with the converted data.
______________________________________________________________________________________________
```javascript
addCol(name, userFunction)
```

Adds a new column to the data and populates the column via the provided ```userFunction```. ```name``` is a string representing the name of the new column and ```userFunction``` is a function.

For example:

```javascript
addCol('myNewCol', row => row.mpg * 2)
```

This will create a new row called ```myNewCol``` and the values in this column will be the product of the value in the ```mpg``` column and 2.
________________________________________________________________________________________________
```javascript
addRow(row)
```
Adds a new row to the data. ```row``` is an object.

For example:

```javascript
addRow({
  countryOfOrigin: 'USA',
  mpg: 28,
  numCylinders: 6
})
```
Note: The keys of the object must match those that are already in the data (i.e. you can't add a new column this way, use ```addCol``` for that).
__________________________________________________________________________________________________
```javascript
deleteCol(colNames)
```
Deletes the column(s) that are specified in the array ```colNames```.

For example:
```javascript
deleteCol(['mpg', 'numCylinders'])
```
__________________________________________________________________________________________________
```javascript
filter(userFunction)
```
Filters the data based on the provided function.

For example:
```javascript
filter(row => row.mpg > 30)
```
__________________________________________________________________________________________________
```javascript
printColNames()
```
Prints to the console an array containing all of the current column names (object keys) in the data.
___________________________________________________________________________________________________
```javascript
printTable()
```
Prints the data to the console in a tabular format.
___________________________________________________________________________________________________
```javascript
renameCol(oldColName, newColName)
```
Renames the column ```oldColName``` to the name provided in ```newColName```. Both arguments are strings.

For example:
```javascript
renameCol('countryOfOrigin', 'country')
```
This will change the name of the column ```countryOfOrigin``` to ```country```.
___________________________________________________________________________________________________
```javascript
save(filepath)
```
Saves the data in its current state to a CSV file in the location provided in the ```filepath``` argument (which is a string).

For example:
```javascript
save('path/to/save/to.csv')
```
__________________________________________________________________________________________________
```javascript
size()
```
Prints to the console the current number of rows/columns the data consists of.
__________________________________________________________________________________________________
```javascript
sortBy(criteria)
```
Sorts the data by the given criteria which can either be a function or an array.

For example:
```javascript
sortBy(row => row.mpg)
```
This will sort the data in ascending order by the values in the ```mpg``` column.

```javascript
sortBy(['countryOfOrigin', 'mpg'])
```
This will sort the data first by ```countryOfOrigin``` and then by ```mpg```.
