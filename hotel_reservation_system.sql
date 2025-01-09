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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `hotel_id` int NOT NULL,
  `checkin_date` date NOT NULL,
  `checkout_date` date NOT NULL,
  `guests` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `hotel_id` (`hotel_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`),
  CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



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
  `facilities` text,
  `rating` decimal(2,1) DEFAULT NULL,
  `reviews_count` int DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `contact_phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `checkin_time` time DEFAULT NULL,
  `checkout_time` time DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hotels`
--

LOCK TABLES `hotels` WRITE;
/*!40000 ALTER TABLE `hotels` DISABLE KEYS */;
INSERT INTO `hotels` VALUES (1,'Sunset Resort & Spa','Miami','Luxurious beachfront resort with world-class spa facilities',350.00,120,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20','Wi-Fi, Pool, Gym, Spa',4.5,120,'info@hotelxyz.com','+1234567890','123 Main Street, New York, NY','14:00:00','11:00:00'),(2,'Mountain View Lodge','Denver','Scenic mountain retreat with stunning views',180.00,50,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Urban Comfort Inn','New York','Modern hotel in the heart of Manhattan',280.00,75,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Seaside Paradise Hotel','San Diego','Beachfront property with private access to the ocean',290.00,85,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(5,'Grand Plaza Hotel','Chicago','Elegant downtown hotel with city views',240.00,100,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(6,'Desert Oasis Resort','Phoenix','Luxury desert retreat with pool and spa',200.00,60,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Lake View Inn','Seattle','Boutique hotel overlooking Lake Washington',220.00,40,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(8,'Historic Downtown Hotel','Boston','Charming hotel in historic district',260.00,55,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(9,'Pacific Coast Resort','Los Angeles','Modern beachfront resort with ocean views',320.00,150,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(10,'Mountain Pine Lodge','Aspen','Cozy mountain lodge with ski-in/ski-out access',400.00,45,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(11,'City Center Suites','San Francisco','All-suite hotel in downtown SF',310.00,80,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(12,'Riverside Hotel','Portland','Modern hotel along the Willamette River',190.00,70,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(13,'Palm Springs Resort','Palm Springs','Desert oasis with multiple pools and spa',230.00,90,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(14,'Harbor View Hotel','Baltimore','Waterfront hotel with harbor views',210.00,65,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(15,'Turkish Riviera Resort','Antalya','Luxury Mediterranean resort with private beach',280.00,150,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 14:18:20',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Skyline Luxury Suites','Los Angeles','Exclusive luxury suites with stunning city views',450.00,100,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 11:18:20','Wi-Fi, Pool, Gym, Spa',4.7,150,'contact@skylinehotel.com','+1987654321','456 Sunset Blvd, Los Angeles, CA','15:00:00','12:00:00'),(17,'Beachside Resort','Miami','Cozy resort with direct access to the beach',320.00,80,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 11:18:20','Wi-Fi, Pool, Beach Access, Lounge',4.3,100,'info@beachsidehotel.com','+1098765432','789 Ocean Drive, Miami, FL','14:00:00','11:00:00'),(18,'Mountain Retreat','Denver','Secluded retreat in the mountains with hiking trails',280.00,60,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 11:18:20','Wi-Fi, Gym, Hiking Trails',4.4,85,'contact@mountainretreat.com','+1239876543','987 Mountain Road, Denver, CO','15:00:00','12:00:00'),(19,'Ocean Breeze Hotel','San Diego','Relaxing beachfront hotel with premium amenities',330.00,120,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 11:18:20','Wi-Fi, Pool, Spa, Beach Access',4.6,130,'contact@oceanbreeze.com','+1232345678','567 Pacific Ave, San Diego, CA','14:00:00','11:00:00'),(20,'Grand Hotel & Suites','Chicago','Elegant suites with panoramic views of the city',370.00,90,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 11:18:20','Wi-Fi, Gym, Restaurant, Conference Rooms',4.5,120,'info@grandhotel.com','+1892345678','123 Wacker Drive, Chicago, IL','15:00:00','12:00:00'),(21,'Desert Mirage Resort','Phoenix','Luxury desert retreat with golf course and spa',320.00,100,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 11:18:20','Wi-Fi, Pool, Golf Course, Spa',4.7,140,'contact@desertmirage.com','+1234567899','123 Desert Blvd, Phoenix, AZ','14:00:00','11:00:00'),(22,'Blue Lake Hotel','Seattle','Serene hotel by the lake with stunning views',290.00,70,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 11:18:20','Wi-Fi, Spa, Lake Views',4.6,110,'info@bluelakehotel.com','+1324768590','456 Lakefront Drive, Seattle, WA','14:00:00','11:00:00'),(23,'Downtown Palace Hotel','Boston','Luxurious hotel with a historic charm in the city center',400.00,80,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 11:18:20','Wi-Fi, Gym, Restaurant, Parking',4.8,160,'contact@downtownpalace.com','+1456789012','789 Beacon St, Boston, MA','15:00:00','12:00:00'),(24,'Golden Sands Resort','Los Angeles','Upscale resort with private beach and luxury amenities',450.00,120,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 11:18:20','Wi-Fi, Pool, Spa, Beach Access',4.9,180,'info@goldensandsresort.com','+1450987654','123 Malibu Drive, Los Angeles, CA','14:00:00','11:00:00'),(25,'Winter Wonderland Lodge','Aspen','Charming mountain lodge with ski-in/ski-out access',500.00,50,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 11:18:20','Wi-Fi, Ski Access, Restaurant',4.8,130,'contact@winterlodge.com','+1576891234','456 Snowy Ridge, Aspen, CO','15:00:00','12:00:00'),(26,'Skyline Heights Hotel','San Francisco','Sophisticated hotel with panoramic city views',420.00,110,'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4','2025-01-06 11:18:20','Wi-Fi, Gym, Pool',4.7,150,'info@skylineheights.com','+1678901234','123 Market St, San Francisco, CA','14:00:00','11:00:00'),(27,'Riverfront Lodge','Portland','Secluded lodge with beautiful river views',280.00,60,'https://images.unsplash.com/photo-1566665797739-1674de7a421a','2025-01-06 11:18:20','Wi-Fi, Gym, River Views',4.5,110,'contact@riverfrontlodge.com','+1456789876','789 Riverside Dr, Portland, OR','15:00:00','12:00:00'),(28,'Palm Oasis Resort','Palm Springs','Oasis-style resort with multiple pools and outdoor activities',350.00,130,'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa','2025-01-06 11:18:20','Wi-Fi, Pool, Spa, Tennis Court',4.6,140,'info@palmoasisresort.com','+1349876543','123 Palm Blvd, Palm Springs, CA','14:00:00','11:00:00'),(29,'Harbor Breeze Hotel','Baltimore','Harbor-side hotel with incredible water views',310.00,70,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 11:18:20','Wi-Fi, Pool, Waterfront Views',4.4,90,'contact@harborbreeze.com','+1345987654','456 Bay St, Baltimore, MD','15:00:00','12:00:00'),(30,'Turkish Coast Resort','Antalya','Exclusive Mediterranean resort with private beach',380.00,150,'https://images.unsplash.com/photo-1566073771259-6a8506099945','2025-01-06 11:18:20','Wi-Fi, Pool, Beach Access, Spa',4.8,160,'info@turkishcoast.com','+1456892345','789 Blue Coast Rd, Antalya, TR','14:00:00','11:00:00');
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
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-10  2:45:41