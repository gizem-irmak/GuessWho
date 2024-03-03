'use strict';

/* Data Access Object (DAO) module for accessing films data */

const db = require('./db');


exports.addGame = (secretItemId) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO games (secret_id) VALUES (?) ';
    db.run(sql, [secretItemId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getGameById(this.lastID));
    });
  });
};


exports.addScore = (gameId, score) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO games (user_id, start_date, difficulty, secret_id) VALUES (?, ?, ?, ?) ';
    db.run(sql, [userId, formattedDate, difficulty, secretItemId], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(exports.getGameById(this.lastID));
    });
  });
};


exports.updateGame = (gameId, userId, startDate, difficulty, score) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE games SET user_id=?, start_date=?, difficulty=?, score=? WHERE id=? ';
    db.run(sql, [userId, startDate, difficulty, score,  gameId], function (err) {
      if (err) {
        reject(err);
      }
      if (this.changes !== 1) {
        resolve({ error: 'No film was updated.' });
      } else {
        resolve(exports.getGameById(gameId)); 
      }
    });
  });
};


exports.getHistory = (userId) => {
  return new Promise((resolve, reject) => { 
    const sql = 'SELECT * FROM games WHERE user_id=? ';
    db.all(sql, [userId], (err, rows) => {
      if (err) { reject(err); }
      resolve(rows);
    });
  });
};


 exports.getGameById = (id) => {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM games WHERE id=? ';
      db.get(sql, [id], (err, row) => {
        if (err)
          reject(err);
        else if (row === undefined)
          resolve({ error: 'Game not found.' });
        else {
          const game = { id: row.id, secret_id: row.secret_id }
          resolve(game);
        }
      });
    });
  };


  exports.deleteGames = () => {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM games WHERE user_id IS NULL OR score IS NULL';
      db.run(sql, function (err) {
        if (err) {
          reject(err);
        }
          resolve('Deletion completed!');
      });
    });
  };
  
