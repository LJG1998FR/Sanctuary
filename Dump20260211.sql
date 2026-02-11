CREATE DATABASE  IF NOT EXISTS `sjsanctuary` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sjsanctuary`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sjsanctuary
-- ------------------------------------------------------
-- Server version	8.0.32

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
-- Table structure for table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctrine_migration_versions`
--

LOCK TABLES `doctrine_migration_versions` WRITE;
/*!40000 ALTER TABLE `doctrine_migration_versions` DISABLE KEYS */;
INSERT INTO `doctrine_migration_versions` VALUES ('DoctrineMigrations\\Version20260122164910','2026-01-30 00:37:40',36),('DoctrineMigrations\\Version20260122170852','2026-01-30 00:37:40',36),('DoctrineMigrations\\Version20260126153025','2026-01-30 00:37:40',7),('DoctrineMigrations\\Version20260129211351','2026-01-30 00:37:40',77),('DoctrineMigrations\\Version20260129232947','2026-01-30 00:37:40',9);
/*!40000 ALTER TABLE `doctrine_migration_versions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messenger_messages`
--

DROP TABLE IF EXISTS `messenger_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messenger_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL,
  `available_at` datetime NOT NULL,
  `delivered_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0E3BD61CE16BA31DBBF396750` (`queue_name`,`available_at`,`delivered_at`,`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messenger_messages`
--

LOCK TABLES `messenger_messages` WRITE;
/*!40000 ALTER TABLE `messenger_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messenger_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photo_collections`
--

DROP TABLE IF EXISTS `photo_collections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photo_collections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `cover` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL,
  `slugger` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photo_collections`
--

LOCK TABLES `photo_collections` WRITE;
/*!40000 ALTER TABLE `photo_collections` DISABLE KEYS */;
INSERT INTO `photo_collections` VALUES (3,'Angry GF','sensualjane_6980691362fac.jpg','2026-02-02 10:06:27','angry-gf'),(4,'Jiggling Style','sensualjane_69806b0211fc2.jpg','2026-02-02 10:14:42','jiggling-style'),(7,'Morning Sex','sensualjane_698639e028c78.jpg','2026-02-06 19:58:40','morning-sex');
/*!40000 ALTER TABLE `photo_collections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `photo_collection_id` int DEFAULT NULL,
  `position` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_876E0D9D5787C2A` (`photo_collection_id`),
  CONSTRAINT `FK_14B78418D5787C2A` FOREIGN KEY (`photo_collection_id`) REFERENCES `photo_collections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=476 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (23,'sensualjane_69806936725c6.jpg',3,2),(24,'sensualjane_6980693f4e513.jpg',3,6),(26,'sensualjane_69806ece952c8.jpg',3,3),(27,'sensualjane_698205562a15f.jpg',3,11),(28,'sensualjane_698205562c791.jpg',3,4),(29,'sensualjane_698205562cf0a.jpg',3,7),(30,'sensualjane_698205562d68f.jpg',3,10),(31,'sensualjane_698205562db6f.jpg',3,9),(32,'sensualjane_698205562e0f3.jpg',3,15),(34,'sensualjane_698205562eaee.jpg',3,12),(35,'sensualjane_698205562eee5.jpg',3,8),(36,'sensualjane_698205562f298.jpg',3,13),(37,'sensualjane_698205562f61f.jpg',3,14),(38,'sensualjane_698205562f93c.jpg',3,5),(39,'sensualjane_698205562fdc1.jpg',3,1),(41,'sensualjane_698267037785f.jpg',4,10),(42,'sensualjane_698267037a1db.jpg',4,6),(43,'sensualjane_698267037a7b8.jpg',4,4),(44,'sensualjane_6986766e2a9cd.jpg',4,1),(45,'sensualjane_698267037b38b.jpg',4,2),(46,'sensualjane_698267037b76b.jpg',4,3),(47,'sensualjane_698267037bc74.jpg',4,12),(48,'sensualjane_698267037bf51.jpg',4,7),(49,'sensualjane_698267037c387.jpg',4,8),(50,'sensualjane_698267037c76b.jpg',4,11),(51,'sensualjane_698267037cb64.jpg',4,13),(52,'sensualjane_698267037cf6c.jpg',4,15),(53,'sensualjane_698267037d367.jpg',4,14),(54,'sensualjane_698267037d979.jpg',4,5),(55,'sensualjane_698267037e128.jpg',4,9),(56,'sensualjane_6986758790287.jpg',7,1),(94,'sensualjane_6987b1b358063.jpg',7,2),(95,'sensualjane_6987b1b359c19.jpg',7,3),(96,'sensualjane_6987b1b35a510.jpg',7,4),(97,'sensualjane_6987b1b35aa42.jpg',7,5),(98,'sensualjane_6987b1b35b2ea.jpg',7,6),(99,'sensualjane_6987b1b35bacc.jpg',7,7),(100,'sensualjane_6987b1b35bf0e.jpg',7,8);
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
INSERT INTO `tags` VALUES (1,'Big Tits');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(180) NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_USERNAME` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','[\"ROLE_ADMIN\"]','$2y$13$jXI/l.Z1adXxD8HozF/TRuQ3TMVBFCIR0Ts8sJrp/L7z7opwUHHSa'),(2,'catdogperson','[]','$2y$13$kOkoxTnX.xd3sRU9w9uF7uhWOCGXFoltG4e86MFduoPBy2aRtUtbq'),(3,'charlie','[]','$2y$13$Sq7AF.Pt12tZqhaO5xLBl.o1IA//uutY/cefSijr8dQucBXVoA92i');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `video_tag`
--

DROP TABLE IF EXISTS `video_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `video_tag` (
  `video_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`video_id`,`tag_id`),
  KEY `IDX_F910728729C1004E` (`video_id`),
  KEY `IDX_F9107287BAD26311` (`tag_id`),
  CONSTRAINT `FK_F910728729C1004E` FOREIGN KEY (`video_id`) REFERENCES `videos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_F9107287BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `video_tag`
--

LOCK TABLES `video_tag` WRITE;
/*!40000 ALTER TABLE `video_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `video_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `thumbnailname` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `slugger` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,'Angry GF','sensualjane_697bf46b12c42.mp4',NULL,'2026-01-30 00:59:39','angry-gf'),(2,'Jiggling Style','sensualjane_69864c49ef920.mp4','sensualjane_69864c4a83eff.jpg','2026-02-06 21:17:13','jiggling-style'),(19,'All Dressed Up','sensualjane_69892c9c08ef3.mp4',NULL,'2026-02-09 01:38:52','all-dressed-up');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-11 17:53:02
