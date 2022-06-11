const express = require('express')
const app = express()
const mysql = require("mysql")
const port = 80
const fs = require("fs");
var device = require('express-device');
var geoip = require('geoip-lite');

app.use(device.capture());
app.listen(port, () => {
    console.log(`-> Email feedback server started on localhost:${port}/analytics  \nWaiting for emails... \n\n`)
})

fs.readFile('../config/scriptsconfig.json', 'utf8', function (err, jsonRaw) {
    if (err) {
        return console.log(err);
    }
    var globalconfig = JSON.parse(jsonRaw);

    var mysqlConnection = mysql.createConnection(globalconfig.mysqlconnection);

    mysqlConnection.connect((err) => {
        if (!err)
            console.log('MySQL connection established successfully');
        else
            console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
    });

    app.get('/analytics', function (req, res) {
        var img = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+OtjPQAJHQNdceK7LQAAAABJRU5ErkJggg==', 'base64');

        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);

        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        var clock = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        today = yyyy + '-' + mm + '-' + dd;
        var date = `${today} - ${clock} | `
        console.log(date, 'email opened')

        const logid = (0 ? req.device.type === "desktop" : 1) * 10 + Math.floor(Math.random() * 1000);
        const geolocation = geoip.lookup(req.socket.remoteAddress) || "undefined";
        var sql = `INSERT INTO analytics (date, country, region, devicetype) VALUES ('${today} ${clock}', "${geolocation.country}", "${geolocation.region}", "${req.device.type}")`;
        mysqlConnection.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
    });

    /*  app.get('/analytics', function (req, res) {
          var img = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8+OtjPQAJHQNdceK7LQAAAABJRU5ErkJggg==', 'base64');
  
          res.writeHead(200, {
              'Content-Type': 'image/png',
              'Content-Length': img.length
          });
          res.end(img);
  
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0');
          var yyyy = today.getFullYear();
          var clock = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
          today = yyyy + '-' + mm + '-' + dd;
          var date = `${today} - ${clock} | `
          console.log(date, 'email opened')
  
          const logid = (0 ? req.device.type === "desktop" : 1) * 10 + Math.floor(Math.random() * 1000);
          const geolocation = geoip.lookup(req.socket.remoteAddress) || "undefined";
          var sql = `INSERT INTO analytics (date, country, region, devicetype) VALUES ('${today} ${clock}', "${geolocation.country}", "${geolocation.region}", "${req.device.type}")`;
          mysqlConnection.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
          });
      });
  });*/

    app.get('/api/:username/:password/listall/week', function (req, res) {
        fs.readFile('../config/scriptsconfig.json', 'utf8', function (err, jsonRaw) {
            if (err) {
                return console.log(err);
            }
            var globalconfig = JSON.parse(jsonRaw);

            globalconfig.mysqlconnection.user = req.params.username;
            globalconfig.mysqlconnection.password = req.params.password;

            var mysqlConnection = mysql.createConnection(globalconfig.mysqlconnection);

            mysqlConnection.connect((err) => {
                if (!err) {
                    console.log('MySQL connection established successfully');
                    listWeek(mysqlConnection);
                }
                else {
                    console.log('Connection Failed!' + JSON.stringify(err, undefined, 2));
                    res.send("0");
                }
            });
        });

        let listWeek = (mysqlConnection) => {
            let week = new Array(7);
            week.fill(0, 0, 7);

            mysqlConnection.query("SELECT * FROM analytics", function (err, results, fields) {
                if (err) throw err;
                results.map((result) => {
                    var date = result.date.getDay();
                    week[date] = ++week[date];
                })
                res.send(week);
            });
        }
    });
});