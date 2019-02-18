const router = require('express').Router();
const mysql = require('mysql');
const {connection} = require('./../database');
const md5 = require('md5');
const config = require('./../config');

router.get('/new', (req, res) => {
  var queryString = "SELECT nicename FROM ??";          
  var table = ["TB_COUNTRY"];
  queryString = mysql.format(queryString, table);
  connection.query(queryString, (err, rows) => {
    if(err) {
      res.status(500).send(err);
    }
    //console.log(rows);
    res.render('company/AddCompany.ejs', {
      title: 'Add new company',
      companies: rows
    });
  });
  
  // //test
  // var testObj = {
  //   id: 1,
  //   nicename: "United States"
  // };
  //console.log(testObj);
  // res.render('company/AddCompany.ejs', {
  //   title: 'Add a company',
  //   companies: testObj
  // });
});

router.post('/new', (req, res) => {
  //console.log(req.body);
  //res.json(req.body);
  var queryString = "SELECT email FROM ?? WHERE ?? = ?";
  var values = ["TB_COMPANY", "email", req.body.email];
  queryString = mysql.format(queryString, values);
  connection.query(queryString, (err, rows) => {
    if(err) {
      res.send(err);
    } else {
      if(rows.length == 0)
      {
        var companyObj = [
          req.body.address1,
          req.body.address2,
          req.body.city,
          req.body.companyName,
          md5(req.body.confirmPassword),
          md5(req.body.password),
          req.body.country,
          req.body.email,
          req.body.phoneNumber,
          req.body.state,
          req.body.userName,
          req.body.zip
        ];
        let queryString = "INSERT INTO ?? (`address1`,`address2`,`city`,`company_name`,`confirm_password`,\
                          `password`,`country`,`email`,`phone`,`state`,`username`,`zip`) \
                          VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
        let table = ["TB_COMPANY"];
        console.log(companyObj);

        queryString = mysql.format(queryString, table);
        connection.query(queryString, companyObj, (err, rows) => {
          if(err) {
            res.send(err);
          } else {
            
            console.log(companyObj);
            res.send(JSON.stringify(companyObj, null, 3));
          }
        });
      }
    }
  });
  
});

router.get('/getCompaniesList', (req, res) => {
  res.render('company/ViewCompanyList', {
    title: "View Company List"
  });
});

router.post('/getCompanyList', (req, res) => {
  //console.log(req);
  let orderingColumnNo = req.body.order[0].column;
  let orderingColumn = req.body.columns[orderingColumnNo].name;
  let orderingDirection = req.body.order[0].dir;
  let filter = req.body.search.value;
  let length = req.body.length;
  let start = req.body.start;
  let draw = req.body.draw;
  //console.log(length); console.log(start); console.log(draw);
  var gridSortColumn = orderingColumn;
  var gridSortDirection = orderingDirection;
  var filter = filter;
  // var queryString = "SELECT id AS REG_ID, \
  //                     company_name AS COMPANY_NAME, \
  //                     city AS CITY, \
  //                     phone AS PHONE, \
  //                     country AS COUNTRY \
  //                   FROM ?? \
  //                   WHERE ? LIKE CASE \
  //                                 WHEN ? IS NULL \
  //                                 THEN company_name \
  //                                 ELSE ? \
  //                                END \
  //                                + '%' \
  //                   ORDER BY";
});

module.exports = router;