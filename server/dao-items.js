'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');


exports.getEasyItems = () => {
  return new Promise((resolve, reject) => { 
    const sql = 'SELECT * FROM items ';
    db.all(sql, [], (err, rows) => {
      if (err) { reject(err); }      
       // Filter items based on difficulty
       const filteredItems = rows.slice(0, 12);
      resolve(filteredItems);
    });
  });
};


exports.getMediumItems = () => {
  return new Promise((resolve, reject) => { 
    const sql = 'SELECT * FROM items ';
    db.all(sql, [], (err, rows) => {
      if (err) { reject(err); }      
       // Filter items based on difficulty
       const filteredItems = rows.slice(0, 24);
      resolve(filteredItems);
    });
  });
};


exports.getHardItems = () => {
  return new Promise((resolve, reject) => { 
    const sql = 'SELECT * FROM items ';
    db.all(sql, [], (err, rows) => {
      if (err) { reject(err); }      
       // Filter items based on difficulty
       const filteredItems = rows.slice(0, 36);
      resolve(filteredItems);
    });
  });
};


exports.getItemById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM items WHERE id=?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        const item = { id: row.id, image_url: row.image_url, properties: row.properties,}
        resolve(item);
      }
    });
  });
};





