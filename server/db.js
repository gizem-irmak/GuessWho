'use strict';

/** DB access module **/

const sqlite = require('sqlite3').verbose();

// open the database
const db = new sqlite.Database('gw.db', (err) => {
  if (err) throw err;
});


module.exports = db;