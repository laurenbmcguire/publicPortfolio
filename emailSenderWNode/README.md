# Email sender with analytics
This project was made by me for a company that wanted to send email newsletter at a massive contact list. Sending manually was not an option, and sending an email to thousands of receivers wasn't an option either: https://www.freelancer.com/projects/email-marketing/Create-mailing-list-30973287/reviews 

## Getting Started
### 1. Configure the SMTP server settings and template path
First we need to configure the SMTP server settings. All the configurations files you need are located in the config directory.

To edit the configuration file run:
`vim ./config/scriptsconfig.json` 

After you have opened the text file please provide the following info:
- your receivers json string array file: (`"receivers": "yourpath/"`).  
- the delay between the sending of the emails (the delay is here to prevent the smtp server from overloading, recommended value: 5000).
- the parent directory path of your template, containing `template.html`, `template.txt` and `metadata.json`.
- the smtpcredentials for the `smtptransporter`.

### 2. Create the MySQL Database and provide the credentials
For analytics to work properly you need to create a new MySQL Database, with a single table in it named: `analytics`. For this please run the following mysql queries:
```
CREATE SCHEMA `email-sender`;
CREATE TABLE `emailsender`.`analytics` (
  `date` DATETIME NOT NULL,
  `country` VARCHAR(45) NOT NULL,
  `region` VARCHAR(45) NOT NULL,
  `devicetype` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`date`));
```
After you created the new database with the single table, please provide the information into the `scriptsconfig.json` and make sure to authenticate with a user that has full permissions to the current `emailsender` database.

### 3. Configure the analytics with the tracking pixel.
For the analytics we use a dummy image with the resolution of 1x1. This image is served by an express server that logs the request event in the `analytics` table when it happens. To capture activty you need to open a port for the analytics handler: the default is 80/analytics. You can modify the port from the `scriptsconfig.json`. After you open the port please make sure to provide in the config the public url to the trackingpixel.

### 4. Running and testing
1. Start the server (trackingpixel) with: `cd server && node index`
2. Run the script with: `node index`