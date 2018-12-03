PLEASE PREFER INSTALLATION STEPS FROM ITD for more information
//APPLICATION DEPLOYED TO http://35.189.240.85:8100/

//TO INSTALL NODEJS 8.9.X
sudo apt-get install python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install nodejs
 
//TO INSTALL MYSQL SERVER 
sudo apt install mysql-server mysql-client
sudo mysql_secure_installation

//DATABASE SCHEMA
CREATE DATABASE TRAVLENDER;
USE TRAVLENDER;
CREATE TABLE USERS(userId int NOT NULL AUTO_INCREMENT PRIMARY KEY,userName int NOT NULL UNIQUE,password varchar(100),name varchar(100),email varchar(100),mobno varchar(100));
CREATE TABLE LOCATION(locationId int NOT NULL AUTO_INCREMENT KEY,isTTEnabled boolean,startLdeoc varchar(255),endLoc varchar(255),time varchar(255),distance varchar(100));
INSERT INTO LOCATION VALUES(1,0,"","","","")
CREATE TABLE EVENTS(eventid int NOT NULL AUTO_INCREMENT PRIMARY KEY,userId int(255),eventname varchar(100),isallday boolean, startTime datetime,endTime datetime,locationId int(11));

CREATE TABLE TRANSIT_PREF(USERID int(11),BUS boolean,SUBWAY boolean,TRAIN boolean,TRAM boolean,RAIL boolean);

//GET CODEBASE AND UPZIP IT

//Under Server folder run these commands. Make sure no node_module folder is not avaialble. if yes please delete and then run these commands
npm install
nodejs start.js

//UNDER client folder run this command. Make sure no nodejs_modules folder is not avaialble  
npm install -g cordova ionic
npm install
Ionic serve 
 
 


 
