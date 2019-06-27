const cTable = require('console.table'),
      Papa = require('papaparse'),
      fs = require('fs'),
      _ = require('lodash')

function convert (filepath) {
  const file = fs.createReadStream(filepath)
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      transformHeader (header) {
        return header.trim()
      },
      transform (val) {
        return typeof val === 'string' ? val.trim() : val
      },
      complete (results, file) {
        resolve(results)
      },
      error (err, file) {
        reject(err)
      }
    })
  })
}

class TabDat {
  constructor (data) {
    this.data = data.data
    this.meta = data.meta
  }
  addCol (name, userFunction) {
    this.meta.fields.push(name)
    this.data = this.data.map(row => _.set(row, name, userFunction(row)))
    return this
  }
  addRow (row) {
    const diffs = _.difference(_.keys(row), this.meta.fields, )
    if (diffs.length === 0) {
      this.data.push(row)
    } else {
      throw new Error(`New rows must include the same columns that currently exist in the table. The following columns do not currently exist in the table: ${diffs}. To add new columns, use the addCol method.`)
    }
    return this
  }
  deleteCol (colNames) {
    this.data = this.data.map(row => _.omit(row, colNames))
    return this
  }
  filter (userFunction) {
    this.data = _.filter(this.data, userFunction)
    return this
  }
  printColNames () {
    console.log(this.meta.fields)
    return this
  }
  printTable () {
    console.table(this.data)
    return this
  }
  renameCol (oldColName, newColName) {
    _.remove(this.meta.fields, field => field === oldColName)
    this.meta.fields.push(newColName)
    this.data = this.data.map(row => {
      _.set(row, newColName, row[oldColName])
      delete row[oldColName]
      return row
    })
    return this
  }
  save (filepath) {
    const csv = Papa.unparse(this.data)
    fs.writeFileSync(filepath, csv)
    return this
  }
  size () {
    console.log(`${this.data.length} rows x ${this.meta.fields.length} columns`)
    return this
  }
  sortBy (userFunction, array) {
    if (userFunction) {
      this.data = _.sortBy(this.data, userFunction)
      return this
    } else if (array) {
      this.data = _.sortBy(this.data, array)
      return this
    } else {
      throw new Error('You must pass either a function or an array to the sortBy method')
    }
  }
}
