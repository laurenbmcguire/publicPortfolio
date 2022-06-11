"use strict";
const fs = require('fs')
const nodemailer = require("nodemailer");

fs.readFile('./config/scriptsconfig.json', 'utf8', function (err, jsonRaw) {
    if (err) {
        return console.log(err);
    }
    var globalconfig = JSON.parse(jsonRaw);

    fs.readFile(globalconfig.receivers, 'utf8', function (err, jsonRaw) {
        if (err) {
            return console.log(err);
        }

        var obj = JSON.parse(jsonRaw);
        console.log(`Contact list loaded succesfully! ${obj.length} contacts loaded \nStarting job...\n`)

        var i = 0;

        (function loop() {
            sendEmail(obj[i], globalconfig);
            if (++i < obj.length) {
                setTimeout(loop, globalconfig.sendDelay);
            } else {
                console.log('\nAll emails sent successfuly! ')
            }
        })();
    });
});

function sendEmail(receiver, config) {
    fs.readFile('./template/metadata.json', 'utf8', function (err, jsonRaw) {
        if (err) {
            return console.log(err);
        }

        var metadata = JSON.parse(jsonRaw);

        fs.readFile(metadata.text, 'utf8', function (err, text) {
            if (err) {
                return console.log(err);
            }
            var body = text;

            fs.readFile(metadata.html, 'utf8', function (err, html) {
                if (err) {
                    return console.log(err);
                }
                html = html + `<img src="${config.analytics}" />`;

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport(config.smtptransporter);

                var message = {
                    from: metadata.from, // sender address
                    to: receiver, // list of receivers
                    subject: metadata.subject, // Subject line
                    text: body, // plain text body
                    html: html, // html body
                };

                transporter.sendMail(message).then(info => {
                    console.log('Email sent successfully: ' + info.accepted);
                });

                console.log(message)
            });
        });
    });
}