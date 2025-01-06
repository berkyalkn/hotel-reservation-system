CREATE DATABASE  IF NOT EXISTS `hotel_reservation_system` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotel_reservation_system`;
-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: 127.0.0.1    Database: hotel_reservation_system
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `hotels`
--

DROP TABLE IF EXISTS `hotels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hotels` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `location` varchar(100) NOT NULL,
  `description` text,
  `price_per_night` decimal(10,2) NOT NULL,
  `total_rooms` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'Sunset Resort & Spa','Miami','Luxurious beachfront resort with world-class spa facilities',350.00,120,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20'),(2,'Mountain View Lodge','Denver','Scenic mountain retreat with stunning views',180.00,50,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20'),(3,'Urban Comfort Inn','New York','Modern hotel in the heart of Manhattan',280.00,75,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 14:18:20'),(4,'Seaside Paradise Hotel','San Diego','Beachfront property with private access to the ocean',290.00,85,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 14:18:20'),(5,'Grand Plaza Hotel','Chicago','Elegant downtown hotel with city views',240.00,100,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20'),(6,'Desert Oasis Resort','Phoenix','Luxury desert retreat with pool and spa',200.00,60,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20'),(7,'Lake View Inn','Seattle','Boutique hotel overlooking Lake Washington',220.00,40,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 14:18:20'),(8,'Historic Downtown Hotel','Boston','Charming hotel in historic district',260.00,55,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 14:18:20'),(9,'Pacific Coast Resort','Los Angeles','Modern beachfront resort with ocean views',320.00,150,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20'),(10,'Mountain Pine Lodge','Aspen','Cozy mountain lodge with ski-in/ski-out access',400.00,45,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20'),(11,'City Center Suites','San Francisco','All-suite hotel in downtown SF',310.00,80,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 14:18:20'),(12,'Riverside Hotel','Portland','Modern hotel along the Willamette River',190.00,70,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 14:18:20'),(13,'Palm Springs Resort','Palm Springs','Desert oasis with multiple pools and spa',230.00,90,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20'),(14,'Harbor View Hotel','Baltimore','Waterfront hotel with harbor views',210.00,65,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20'),(15,'Turkish Riviera Resort','Antalya','Luxury Mediterranean resort with private beach',280.00,150,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20');
/*!40000 ALTER TABLE `hotels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `bio` text,
  `phone_number` varchar(15) DEFAULT NULL,
  `address` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-06 19:23:02