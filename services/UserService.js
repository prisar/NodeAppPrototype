const mysql = require('mysql');
const {connection} = require('./../database');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const config = require('./../config');

module.exports = {
  addUser: function(post) {
    return new Promise((resolve, reject) => {
      var queryString = "SELECT email FROM ?? WHERE ?? = ?";
      var table = ["USER", "email", post.email];
      queryString = mysql.format(queryString, table);
      connection.query(queryString, (err, rows) => {
        if (err)  {
          return reject({
            "error": true,
            "message": "Error in executing sql"
          });
        }
        else {
          //query executed successfully
          if(rows.length == 0) {
            //Create an user object
            var userObject = [
              post.first_name,
              post.last_name,
              post.dob,
              post.device_type,
              post.latitude,
              post.longitude,
              post.email,
              md5(post.password),
              post.phone_number,
              post.is_verified,
              post.block_status
            ];
            //Insert new user
            var queryString = "INSERT INTO ?? (`first_name`, `last_name`, `dob`, `device_type`, `latitude`,`longitude`, `email`, `password`, \
                               `phone_number`,`is_verified`,`block_status`)  \
                               values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ";
            var table = ["USER"];
            queryString = mysql.format(queryString, table);
            connection.query(queryString, userObject, (err, rows) => {
                console.log("Hi");
                if(err) {
                  return reject({
                    "error": true,
                    "message": "Error in executing sql"
                  });
                }

                resolve({
                  "Error": false,
                  "Message": "Success"
                });

            });
          }
        }
      });
    });
  },

  userLoginCheckService: function(post) {
    //return a new promise object
    return new Promise((resolve, reject) => {
      var queryString = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
      var tableValues = ["USER", "password", md5(post.password), "email", post.email];
      queryString = mysql.format(queryString, tableValues);
      connection.query(queryString, (err, rows) => {
        if(err){
          return reject({
            "error": true,
            "message": "Error in executing sql"
          });
        }

        //query successfully executed
        else {
          if(rows.length == 1) {
            var token = jwt.sign({rows}, config.secret, { expiresIn: 1440 });
            return resolve({
              "error": false,
              "message": "Token generated for user"
            });
          } else {
            return reject({
              "error": true,
              "message": "error in token generation"
            });
          }
        }
      });
    });
  },

  showAllUsers: function() {
    return new Promise((resolve, reject) => {
      var queryString = "SELECT * FROM ?? LIMIT 100"; //show 100 users
      var values = ["USER"];
      queryString = mysql.format(queryString, values);
      connection.query(queryString, (err, rows) => {
        if(err) {
          return reject({
            "error": false,
            "message": "error in query execution"
          });
        }
          return resolve({
            "error": true,
            "message": "query executed successfully",
            "users": rows
          });

      });
    });
  },

  updateUser: function(user, id) {
    return new Promise((resolve, reject) => {
      //console.log(user);
      var editedUser = [
        user.first_name,
        user.last_name,
        user.email,
        md5(user.password),
        user.dob,
        user.phone_number,
        user.device_type,
        user.latitude,
        user.longitude,
        user.is_verified,
        user.block_status,
        id
      ];
      //console.log(editedUser);
      var queryString = "UPDATE ?? SET `first_name` = ?,`last_name` = ?, `email` = ?, `password` = ?,\
                        `dob` = ?, `phone_number` = ?,`device_type` = ?,`latitude` = ?,\
                        `longitude` = ?, `is_verified` = ?, `block_status` = ? WHERE user_id = ?";
          
      var table = ["USER"];
      queryString = mysql.format(queryString, table);
      console.log(queryString);
      
      console.log("Hi");
      connection.query(queryString, editedUser, (err, rows) => {
        if(err) {
          console.log("rejected");
          return reject({
            "error": true,
            "message": "error in sql query execution"
          });
        }
        resolve({
          "error": false,
          "message": "query executed successfully"
        });
      });
    });
  }
}