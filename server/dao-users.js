'use strict';

const db = require('./db');
const crypto = require('crypto');


// This function returns user's information given its id.
exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE id = ? ';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        resolve({ error: 'User not found.' });
      else {
        // By default, the local strategy looks for "username": 
        // for simplicity, instead of using "email", we create an object with that property.
        const user = { id: row.id, username: row.username, name: row.name, total_score: row.total_score }
        resolve(user);
      }
    });
  });
};


// This function is used at log-in time to verify username and password.
exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ? ';
    db.get(sql, [username], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { id: row.id, username: row.username, name: row.name };
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { 
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) 
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};


exports.updateTotalScore = (user_id, score) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE users SET total_score = total_score + ? WHERE id = ?';
    db.run(sql, [score, user_id], function (err) {
      if (err) {
        reject(err);
      }
      resolve('Total score is updated!');
    });
  });
};








