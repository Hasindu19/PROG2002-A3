-- MySQL dump for 'crowdfunding_db'
-- Host: localhost
-- Database: crowdfunding_db
-- ------------------------------------------------------
-- Server version	8.0

-- Drop database if it exists, and recreate it
DROP DATABASE IF EXISTS crowdfunding_db;
CREATE DATABASE crowdfunding_db;
USE crowdfunding_db;

-- Table structure for `CATEGORY`
DROP TABLE IF EXISTS `CATEGORY`;
CREATE TABLE `CATEGORY` (
  `CATEGORY_ID` int NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL,
  PRIMARY KEY (`CATEGORY_ID`)
);

-- Insert initial data into `CATEGORY`
INSERT INTO `CATEGORY` VALUES 
(1,'Technology'), 
(2,'Education'), 
(3,'Environment'), 
(4,'Healthcare');

-- Table structure for `FUNDRAISER`
DROP TABLE IF EXISTS `FUNDRAISER`;
CREATE TABLE `FUNDRAISER` (
  `FUNDRAISER_ID` int NOT NULL AUTO_INCREMENT,
  `ORGANIZER` varchar(255) NOT NULL,
  `CAPTION` varchar(255) NOT NULL,
  `TARGET_FUNDING` float NOT NULL,
  `CURRENT_FUNDING` float NOT NULL DEFAULT '0',
  `CITY` varchar(255) NOT NULL,
  `ACTIVE` tinyint(1) DEFAULT '1',
  `CATEGORY_ID` int DEFAULT NULL,
  `IMAGE_URL` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`FUNDRAISER_ID`),
  KEY `CATEGORY_ID` (`CATEGORY_ID`),
  CONSTRAINT `fundraiser_ibfk_1` FOREIGN KEY (`CATEGORY_ID`) REFERENCES `CATEGORY` (`CATEGORY_ID`) ON UPDATE CASCADE
);

-- Insert initial data into `FUNDRAISER`
INSERT INTO `FUNDRAISER` VALUES 
(1,'John Doe','Help raise funds for school supplies',10000,5000,'New York',1,1,'https://www.shutterstock.com/shutterstock/videos/1107873581/thumb/1.jpg?ip=x480'),
(2,'Jane Smith','Support local animal shelter',20000,15000,'Los Angeles',1,2,'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrBS6nz0CFdTRE12m-avKKwnWWjW3beXKvyg&s'),
(3,'Alice Johnson','Community health initiative',15000,8000,'Chicago',0,1,'https://www.habitatforhumanity.org.uk/wp-content/uploads/2018/08/volunteer-abroad-project-fight-poverty-charity.jpg'),
(4,'Bob Brown','Fund youth sports programs',12000,6000,'Houston',1,3,'https://littlethingscount.ca/wp-content/uploads/Volunteer-V2.jpg'),
(5,'Emma White','Clean water access project',25000,20000,'Miami',1,2,'https://www.worldbank.org/content/dam/photos/780x439/2016/sep-3/Oct---Mahmud-MapBGD-MR-2006-0006429.JPG');

-- Table structure for `DONATION`
DROP TABLE IF EXISTS `DONATION`;
CREATE TABLE `DONATION` (
  `DONATION_ID` int NOT NULL AUTO_INCREMENT,
  `DATE` date NOT NULL,
  `AMOUNT` decimal(10,2) NOT NULL,
  `GIVER` varchar(255) NOT NULL,
  `FUNDRAISER_ID` int,
  PRIMARY KEY (`DONATION_ID`),
  FOREIGN KEY (`FUNDRAISER_ID`) REFERENCES `FUNDRAISER` (`FUNDRAISER_ID`) ON DELETE CASCADE
); 

-- Insert initial data into `DONATION`
INSERT INTO `DONATION` (DATE, AMOUNT, GIVER, FUNDRAISER_ID) VALUES 
('2024-09-25', 100.00, 'Sarah Lee', 1),
('2024-09-26', 50.00, 'Mike Jordan', 1),
('2024-09-27', 75.00, 'Emily Clark', 2),
('2024-09-28', 200.00, 'Tom Hardy', 3),
('2024-09-29', 150.00, 'Sandra Bullock', 2),
('2024-09-30', 60.00, 'Will Smith', 5),
('2024-09-30', 90.00, 'Emma Watson', 4);
