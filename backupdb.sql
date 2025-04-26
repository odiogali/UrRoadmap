CREATE DATABASE  IF NOT EXISTS `cpsc471_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cpsc471_project`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: cpsc471_project
-- ------------------------------------------------------
-- Server version	8.0.41

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
-- Table structure for table `admin_staff`
--

DROP TABLE IF EXISTS `admin_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin_staff` (
  `EID` int NOT NULL,
  PRIMARY KEY (`EID`),
  CONSTRAINT `admin_staff_ibfk_1` FOREIGN KEY (`EID`) REFERENCES `employee` (`EID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_staff`
--

LOCK TABLES `admin_staff` WRITE;
/*!40000 ALTER TABLE `admin_staff` DISABLE KEYS */;
INSERT INTO `admin_staff` VALUES (3001),(3002);
/*!40000 ALTER TABLE `admin_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
INSERT INTO `auth_permission` VALUES (1,'Can add log entry',1,'add_logentry'),(2,'Can change log entry',1,'change_logentry'),(3,'Can delete log entry',1,'delete_logentry'),(4,'Can view log entry',1,'view_logentry'),(5,'Can add permission',2,'add_permission'),(6,'Can change permission',2,'change_permission'),(7,'Can delete permission',2,'delete_permission'),(8,'Can view permission',2,'view_permission'),(9,'Can add group',3,'add_group'),(10,'Can change group',3,'change_group'),(11,'Can delete group',3,'delete_group'),(12,'Can view group',3,'view_group'),(13,'Can add user',4,'add_user'),(14,'Can change user',4,'change_user'),(15,'Can delete user',4,'delete_user'),(16,'Can view user',4,'view_user'),(17,'Can add content type',5,'add_contenttype'),(18,'Can change content type',5,'change_contenttype'),(19,'Can delete content type',5,'delete_contenttype'),(20,'Can view content type',5,'view_contenttype'),(21,'Can add session',6,'add_session'),(22,'Can change session',6,'change_session'),(23,'Can delete session',6,'delete_session'),(24,'Can view session',6,'view_session'),(25,'Can add admin staff',7,'add_adminstaff'),(26,'Can change admin staff',7,'change_adminstaff'),(27,'Can delete admin staff',7,'delete_adminstaff'),(28,'Can view admin staff',7,'view_adminstaff'),(29,'Can add course',8,'add_course'),(30,'Can change course',8,'change_course'),(31,'Can delete course',8,'delete_course'),(32,'Can view course',8,'view_course'),(33,'Can add degree program',9,'add_degreeprogram'),(34,'Can change degree program',9,'change_degreeprogram'),(35,'Can delete degree program',9,'delete_degreeprogram'),(36,'Can view degree program',9,'view_degreeprogram'),(37,'Can add department',10,'add_department'),(38,'Can change department',10,'change_department'),(39,'Can delete department',10,'delete_department'),(40,'Can view department',10,'view_department'),(41,'Can add student',11,'add_student'),(42,'Can change student',11,'change_student'),(43,'Can delete student',11,'delete_student'),(44,'Can view student',11,'view_student'),(45,'Can add has as antireq',12,'add_hasasantireq'),(46,'Can change has as antireq',12,'change_hasasantireq'),(47,'Can delete has as antireq',12,'delete_hasasantireq'),(48,'Can view has as antireq',12,'view_hasasantireq'),(49,'Can add has as preq',13,'add_hasaspreq'),(50,'Can change has as preq',13,'change_hasaspreq'),(51,'Can delete has as preq',13,'delete_hasaspreq'),(52,'Can view has as preq',13,'view_hasaspreq'),(53,'Can add has taken',14,'add_hastaken'),(54,'Can change has taken',14,'change_hastaken'),(55,'Can delete has taken',14,'delete_hastaken'),(56,'Can view has taken',14,'view_hastaken'),(57,'Can add professor',15,'add_professor'),(58,'Can change professor',15,'change_professor'),(59,'Can delete professor',15,'delete_professor'),(60,'Can view professor',15,'view_professor'),(61,'Can add section',16,'add_section'),(62,'Can change section',16,'change_section'),(63,'Can delete section',16,'delete_section'),(64,'Can view section',16,'view_section'),(65,'Can add teaching staff',17,'add_teachingstaff'),(66,'Can change teaching staff',17,'change_teachingstaff'),(67,'Can delete teaching staff',17,'delete_teachingstaff'),(68,'Can view teaching staff',17,'view_teachingstaff'),(69,'Can add textbook',18,'add_textbook'),(70,'Can change textbook',18,'change_textbook'),(71,'Can delete textbook',18,'delete_textbook'),(72,'Can view textbook',18,'view_textbook'),(73,'Can add graduate',19,'add_graduate'),(74,'Can change graduate',19,'change_graduate'),(75,'Can delete graduate',19,'delete_graduate'),(76,'Can view graduate',19,'view_graduate'),(77,'Can add undergraduate',20,'add_undergraduate'),(78,'Can change undergraduate',20,'change_undergraduate'),(79,'Can delete undergraduate',20,'delete_undergraduate'),(80,'Can view undergraduate',20,'view_undergraduate'),(81,'Can add employee',21,'add_employee'),(82,'Can change employee',21,'change_employee'),(83,'Can delete employee',21,'delete_employee'),(84,'Can view employee',21,'view_employee'),(85,'Can add specialization',22,'add_specialization'),(86,'Can change specialization',22,'change_specialization'),(87,'Can delete specialization',22,'delete_specialization'),(88,'Can view specialization',22,'view_specialization'),(89,'Can add blacklisted token',23,'add_blacklistedtoken'),(90,'Can change blacklisted token',23,'change_blacklistedtoken'),(91,'Can delete blacklisted token',23,'delete_blacklistedtoken'),(92,'Can view blacklisted token',23,'view_blacklistedtoken'),(93,'Can add outstanding token',24,'add_outstandingtoken'),(94,'Can change outstanding token',24,'change_outstandingtoken'),(95,'Can delete outstanding token',24,'delete_outstandingtoken'),(96,'Can view outstanding token',24,'view_outstandingtoken');
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user`
--

DROP TABLE IF EXISTS `auth_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) NOT NULL,
  `last_login` datetime(6) DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) NOT NULL,
  `first_name` varchar(150) NOT NULL,
  `last_name` varchar(150) NOT NULL,
  `email` varchar(254) NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user`
--

LOCK TABLES `auth_user` WRITE;
/*!40000 ALTER TABLE `auth_user` DISABLE KEYS */;
INSERT INTO `auth_user` VALUES (1,'pbkdf2_sha256$1000000$usH0bR1X1SxqBbrmWubhmR$CZeX4dCkFGCE3vJ3KKUrD8Sc7kXG7LTEhsI0ExyQwdA=','2025-04-25 01:02:41.389117',1,'admin','','','admin@admin.com',1,1,'2025-04-23 23:04:22.659101'),(2,'pbkdf2_sha256$1000000$old7NvOqL8wmbSpRDwq1IZ$6h285TeaXvh8awgbU2Lx4wssH7Wp/jvOdvoe2vj/liw=',NULL,1,'safe','','','safe@admin.com',1,1,'2025-04-23 23:13:33.648459'),(3,'pbkdf2_sha256$1000000$yQ0kuV0fFE8KluWpHLObG8$KJ0nT1uvGxDD5SbUvRAyw4TMqUac/wayUM1V2fsXVt4=',NULL,0,'alikhan','Ali','Khan','alikhan@gmail.com',0,1,'2025-04-25 01:03:47.000000');
/*!40000 ALTER TABLE `auth_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_groups`
--

DROP TABLE IF EXISTS `auth_user_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_groups` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_groups_user_id_group_id_94350c0c_uniq` (`user_id`,`group_id`),
  KEY `auth_user_groups_group_id_97559544_fk_auth_group_id` (`group_id`),
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`),
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_groups`
--

LOCK TABLES `auth_user_groups` WRITE;
/*!40000 ALTER TABLE `auth_user_groups` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_user_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_user_user_permissions`
--

DROP TABLE IF EXISTS `auth_user_user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_user_user_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq` (`user_id`,`permission_id`),
  KEY `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_user_user_permissions`
--

LOCK TABLES `auth_user_user_permissions` WRITE;
/*!40000 ALTER TABLE `auth_user_user_permissions` DISABLE KEYS */;
INSERT INTO `auth_user_user_permissions` VALUES (1,3,32),(3,3,36),(5,3,40),(7,3,48),(8,3,52),(9,3,56),(11,3,60),(2,3,64),(4,3,68),(6,3,72),(10,3,88);
/*!40000 ALTER TABLE `auth_user_user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `Course_code` varchar(10) NOT NULL,
  `Course_title` varchar(50) NOT NULL,
  `Textbook_ISBN` varchar(13) DEFAULT NULL,
  `Dno` int NOT NULL,
  PRIMARY KEY (`Course_code`),
  KEY `Textbook_ISBN` (`Textbook_ISBN`),
  KEY `Dno` (`Dno`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`Textbook_ISBN`) REFERENCES `textbook` (`ISBN`),
  CONSTRAINT `course_ibfk_2` FOREIGN KEY (`Dno`) REFERENCES `department` (`Dno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES ('CPSC301','Intro to Computer Science','9780132350884',1),('CPSC413','Algorithmic Thinking in CS','9780262033848',1),('CPSC441','Computer Networking','9780134685991',1),('CPSC471','Databases and Distributed Systems','9780131103627',1),('DATA211','Data and Properly Modeling It','9781119610418',2),('DATA301','Data and Statistics','9781492041139',2),('DATA401','Identifying Manipulative Data','9780262035613',2),('MATH211','Intro to Linear Algebra','9780321781079',3),('MATH265','Intro to Calculus','9781305253667',3),('MATH381','Lambda Calculus','9780486650883',3);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degree_program`
--

DROP TABLE IF EXISTS `degree_program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `degree_program` (
  `Prog_name` varchar(50) NOT NULL,
  PRIMARY KEY (`Prog_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degree_program`
--

LOCK TABLES `degree_program` WRITE;
/*!40000 ALTER TABLE `degree_program` DISABLE KEYS */;
INSERT INTO `degree_program` VALUES ('BSc Computer Science'),('BSc Data Science'),('BSc Mathematics'),('BSc Natural Science'),('BSc Natural Sciences');
/*!40000 ALTER TABLE `degree_program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `Dno` int NOT NULL AUTO_INCREMENT,
  `Dname` varchar(50) NOT NULL,
  `Manager_id` int DEFAULT NULL,
  PRIMARY KEY (`Dno`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'Computer Science',NULL),(2,'Data Science',NULL),(3,'Mathematics',NULL);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_admin_log`
--

DROP TABLE IF EXISTS `django_admin_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_admin_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext,
  `object_repr` varchar(200) NOT NULL,
  `action_flag` smallint unsigned NOT NULL,
  `change_message` longtext NOT NULL,
  `content_type_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `django_admin_log_content_type_id_c4bce8eb_fk_django_co` (`content_type_id`),
  KEY `django_admin_log_user_id_c564eba6_fk_auth_user_id` (`user_id`),
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`),
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`),
  CONSTRAINT `django_admin_log_chk_1` CHECK ((`action_flag` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_admin_log`
--

LOCK TABLES `django_admin_log` WRITE;
/*!40000 ALTER TABLE `django_admin_log` DISABLE KEYS */;
INSERT INTO `django_admin_log` VALUES (1,'2025-04-25 01:03:48.364469','3','alikhan',1,'[{\"added\": {}}]',4,1),(2,'2025-04-25 01:06:06.928893','3','alikhan',2,'[{\"changed\": {\"fields\": [\"First name\", \"Last name\", \"Email address\", \"User permissions\"]}}]',4,1);
/*!40000 ALTER TABLE `django_admin_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) NOT NULL,
  `model` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
INSERT INTO `django_content_type` VALUES (1,'admin','logentry'),(7,'api','adminstaff'),(8,'api','course'),(9,'api','degreeprogram'),(10,'api','department'),(21,'api','employee'),(19,'api','graduate'),(12,'api','hasasantireq'),(13,'api','hasaspreq'),(14,'api','hastaken'),(15,'api','professor'),(16,'api','section'),(22,'api','specialization'),(11,'api','student'),(17,'api','teachingstaff'),(18,'api','textbook'),(20,'api','undergraduate'),(3,'auth','group'),(2,'auth','permission'),(4,'auth','user'),(5,'contenttypes','contenttype'),(6,'sessions','session'),(23,'token_blacklist','blacklistedtoken'),(24,'token_blacklist','outstandingtoken');
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-04-23 23:03:38.941779'),(2,'auth','0001_initial','2025-04-23 23:03:39.659827'),(3,'admin','0001_initial','2025-04-23 23:03:39.834676'),(4,'admin','0002_logentry_remove_auto_add','2025-04-23 23:03:39.843699'),(5,'admin','0003_logentry_add_action_flag_choices','2025-04-23 23:03:39.853552'),(6,'api','0001_initial','2025-04-23 23:03:39.869562'),(7,'api','0002_employee_specialization_delete_requires_and_more','2025-04-23 23:03:39.874857'),(8,'contenttypes','0002_remove_content_type_name','2025-04-23 23:03:40.027523'),(9,'auth','0002_alter_permission_name_max_length','2025-04-23 23:03:40.124881'),(10,'auth','0003_alter_user_email_max_length','2025-04-23 23:03:40.152692'),(11,'auth','0004_alter_user_username_opts','2025-04-23 23:03:40.162781'),(12,'auth','0005_alter_user_last_login_null','2025-04-23 23:03:40.231927'),(13,'auth','0006_require_contenttypes_0002','2025-04-23 23:03:40.235377'),(14,'auth','0007_alter_validators_add_error_messages','2025-04-23 23:03:40.243824'),(15,'auth','0008_alter_user_username_max_length','2025-04-23 23:03:40.325626'),(16,'auth','0009_alter_user_last_name_max_length','2025-04-23 23:03:40.407986'),(17,'auth','0010_alter_group_name_max_length','2025-04-23 23:03:40.429455'),(18,'auth','0011_update_proxy_permissions','2025-04-23 23:03:40.446234'),(19,'auth','0012_alter_user_first_name_max_length','2025-04-23 23:03:40.533901'),(20,'sessions','0001_initial','2025-04-23 23:03:40.575686'),(21,'token_blacklist','0001_initial','2025-04-23 23:03:40.784015'),(22,'token_blacklist','0002_outstandingtoken_jti_hex','2025-04-23 23:03:40.864807'),(23,'token_blacklist','0003_auto_20171017_2007','2025-04-23 23:03:40.888194'),(24,'token_blacklist','0004_auto_20171017_2013','2025-04-23 23:03:40.973104'),(25,'token_blacklist','0005_remove_outstandingtoken_jti','2025-04-23 23:03:41.043072'),(26,'token_blacklist','0006_auto_20171017_2113','2025-04-23 23:03:41.070623'),(27,'token_blacklist','0007_auto_20171017_2214','2025-04-23 23:03:41.298695'),(28,'token_blacklist','0008_migrate_to_bigautofield','2025-04-23 23:03:41.570826'),(29,'token_blacklist','0010_fix_migrate_to_bigautofield','2025-04-23 23:03:41.584275'),(30,'token_blacklist','0011_linearizes_history','2025-04-23 23:03:41.587386'),(31,'token_blacklist','0012_alter_outstandingtoken_user','2025-04-23 23:03:41.600242');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_session`
--

DROP TABLE IF EXISTS `django_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_session` (
  `session_key` varchar(40) NOT NULL,
  `session_data` longtext NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`),
  KEY `django_session_expire_date_a5c62663` (`expire_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_session`
--

LOCK TABLES `django_session` WRITE;
/*!40000 ALTER TABLE `django_session` DISABLE KEYS */;
INSERT INTO `django_session` VALUES ('oxapy0oaw9i6usi1xeh41ccy411fc4l1','.eJxVjMsOwiAQRf-FtSHA8Cgu3fsNZBhAqgaS0q6M_65NutDtPefcFwu4rTVsIy9hTuzMJDv9bhHpkdsO0h3brXPqbV3myHeFH3Twa0_5eTncv4OKo35rKohJW1BoSsxkRJHoQTv0CZI3pMlFkF5kmJS1bhIKlDVeFQ2GkAR7fwD4MDeb:1u87Sj:KeLeq9h_JeeegwEElI60UtjD0iIfORCAUs7fu0yK48k','2025-05-09 01:02:41.393052');
/*!40000 ALTER TABLE `django_session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `EID` int NOT NULL AUTO_INCREMENT,
  `Fname` varchar(50) NOT NULL,
  `Lname` varchar(50) NOT NULL,
  `Salary` int DEFAULT NULL,
  `Dno` int DEFAULT NULL,
  PRIMARY KEY (`EID`),
  KEY `Dno` (`Dno`),
  CONSTRAINT `employee_ibfk_1` FOREIGN KEY (`Dno`) REFERENCES `department` (`Dno`)
) ENGINE=InnoDB AUTO_INCREMENT=3003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES (1001,'Alice','Nguyen',115000,1),(1002,'David','Kim',120000,2),(1003,'Emily','Zhao',110000,3),(1004,'Pablo','Hernandez',69000,3),(1738,'Fetty','Demetrius',215000,3),(3001,'Bob','Smith',55000,1),(3002,'Sarah','Lee',58000,2);
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `graduate`
--

DROP TABLE IF EXISTS `graduate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `graduate` (
  `Student_id` int NOT NULL,
  `Thesis_title` varchar(100) DEFAULT NULL,
  `Research_area` varchar(50) NOT NULL,
  `Teaching_id` int DEFAULT NULL,
  PRIMARY KEY (`Student_id`),
  KEY `Teaching_id` (`Teaching_id`),
  CONSTRAINT `graduate_ibfk_1` FOREIGN KEY (`Student_id`) REFERENCES `student` (`Student_id`),
  CONSTRAINT `graduate_ibfk_2` FOREIGN KEY (`Teaching_id`) REFERENCES `teaching_staff` (`EID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `graduate`
--

LOCK TABLES `graduate` WRITE;
/*!40000 ALTER TABLE `graduate` DISABLE KEYS */;
INSERT INTO `graduate` VALUES (2003,'Advanced Calculus in AI','Mathematics & AI',NULL),(2004,'Lambda Calculus Uses and Interpretations','Math and CS',1004);
/*!40000 ALTER TABLE `graduate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `has_as_antireq`
--

DROP TABLE IF EXISTS `has_as_antireq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `has_as_antireq` (
  `Course_code` varchar(10) NOT NULL,
  `Antireq_code` varchar(10) NOT NULL,
  PRIMARY KEY (`Course_code`,`Antireq_code`),
  KEY `Antireq_code` (`Antireq_code`),
  CONSTRAINT `has_as_antireq_ibfk_1` FOREIGN KEY (`Course_code`) REFERENCES `course` (`Course_code`),
  CONSTRAINT `has_as_antireq_ibfk_2` FOREIGN KEY (`Antireq_code`) REFERENCES `course` (`Course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `has_as_antireq`
--

LOCK TABLES `has_as_antireq` WRITE;
/*!40000 ALTER TABLE `has_as_antireq` DISABLE KEYS */;
INSERT INTO `has_as_antireq` VALUES ('CPSC471','DATA401'),('DATA301','MATH381'),('DATA401','MATH381');
/*!40000 ALTER TABLE `has_as_antireq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `has_as_preq`
--

DROP TABLE IF EXISTS `has_as_preq`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `has_as_preq` (
  `Course_code` varchar(10) NOT NULL,
  `Prereq_code` varchar(10) NOT NULL,
  PRIMARY KEY (`Course_code`,`Prereq_code`),
  KEY `Prereq_code` (`Prereq_code`),
  CONSTRAINT `has_as_preq_ibfk_1` FOREIGN KEY (`Course_code`) REFERENCES `course` (`Course_code`),
  CONSTRAINT `has_as_preq_ibfk_2` FOREIGN KEY (`Prereq_code`) REFERENCES `course` (`Course_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `has_as_preq`
--

LOCK TABLES `has_as_preq` WRITE;
/*!40000 ALTER TABLE `has_as_preq` DISABLE KEYS */;
INSERT INTO `has_as_preq` VALUES ('CPSC413','CPSC301'),('CPSC441','CPSC301'),('CPSC471','CPSC441'),('CPSC301','DATA211'),('DATA401','DATA211'),('CPSC441','MATH211'),('CPSC301','MATH265');
/*!40000 ALTER TABLE `has_as_preq` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `has_taken`
--

DROP TABLE IF EXISTS `has_taken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `has_taken` (
  `SCourse_code` varchar(10) NOT NULL,
  `S_ID` int NOT NULL,
  `Student_id` int NOT NULL,
  `Course_grade` varchar(2) DEFAULT NULL,
  `Course_status` varchar(2) DEFAULT NULL,
  PRIMARY KEY (`SCourse_code`,`S_ID`,`Student_id`),
  KEY `Student_id` (`Student_id`),
  CONSTRAINT `has_taken_ibfk_1` FOREIGN KEY (`SCourse_code`, `S_ID`) REFERENCES `section` (`SCourse_code`, `S_ID`),
  CONSTRAINT `has_taken_ibfk_2` FOREIGN KEY (`Student_id`) REFERENCES `student` (`Student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `has_taken`
--

LOCK TABLES `has_taken` WRITE;
/*!40000 ALTER TABLE `has_taken` DISABLE KEYS */;
INSERT INTO `has_taken` VALUES ('CPSC471',1,2001,'A','W'),('DATA301',1,2002,'B+','C'),('MATH265',1,2003,'A-','IP');
/*!40000 ALTER TABLE `has_taken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor`
--

DROP TABLE IF EXISTS `professor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor` (
  `Teaching_id` int NOT NULL,
  `Research_area` varchar(50) NOT NULL,
  PRIMARY KEY (`Teaching_id`),
  CONSTRAINT `professor_ibfk_1` FOREIGN KEY (`Teaching_id`) REFERENCES `teaching_staff` (`EID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor`
--

LOCK TABLES `professor` WRITE;
/*!40000 ALTER TABLE `professor` DISABLE KEYS */;
INSERT INTO `professor` VALUES (1001,'Systems'),(1002,'Data Mining'),(1003,'Probability'),(1738,'Probability Theory and Differentials');
/*!40000 ALTER TABLE `professor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `section`
--

DROP TABLE IF EXISTS `section`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `section` (
  `id` int NOT NULL AUTO_INCREMENT,
  `SCourse_code` varchar(10) NOT NULL,
  `S_ID` int NOT NULL,
  `Semester` varchar(6) DEFAULT NULL,
  `Instructor_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_scourse_sid` (`SCourse_code`,`S_ID`),
  KEY `Instructor_id` (`Instructor_id`),
  CONSTRAINT `section_ibfk_1` FOREIGN KEY (`SCourse_code`) REFERENCES `course` (`Course_code`),
  CONSTRAINT `section_ibfk_2` FOREIGN KEY (`Instructor_id`) REFERENCES `teaching_staff` (`EID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `section`
--

LOCK TABLES `section` WRITE;
/*!40000 ALTER TABLE `section` DISABLE KEYS */;
INSERT INTO `section` VALUES (1,'CPSC471',1,'Fall',1001),(2,'CPSC471',2,'Winter',1001),(3,'CPSC441',1,'Spring',1001),(4,'CPSC301',1,'Fall',1001),(5,'CPSC413',1,'Winter',1001),(6,'DATA301',1,'Fall',1002),(7,'DATA301',2,'Spring',1002),(8,'DATA401',1,'Fall',1002),(9,'DATA211',2,'Winter',1002),(10,'MATH211',1,'Spring',1003),(11,'MATH265',1,'Fall',1003),(12,'MATH381',1,'Winter',1003);
/*!40000 ALTER TABLE `section` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `specialization`
--

DROP TABLE IF EXISTS `specialization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `specialization` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sname` varchar(50) NOT NULL,
  `prog_name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prog_name` (`prog_name`,`sname`),
  CONSTRAINT `specialization_ibfk_1` FOREIGN KEY (`prog_name`) REFERENCES `degree_program` (`Prog_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `specialization`
--

LOCK TABLES `specialization` WRITE;
/*!40000 ALTER TABLE `specialization` DISABLE KEYS */;
/*!40000 ALTER TABLE `specialization` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `Student_id` int NOT NULL,
  `Fname` varchar(50) NOT NULL,
  `Lname` varchar(50) NOT NULL,
  PRIMARY KEY (`Student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (2001,'Ali','Khan'),(2002,'Maria','Lopez'),(2003,'John','Chen'),(2004,'Pablo','Hernandez');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teaching_staff`
--

DROP TABLE IF EXISTS `teaching_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teaching_staff` (
  `EID` int NOT NULL,
  PRIMARY KEY (`EID`),
  CONSTRAINT `teaching_staff_ibfk_1` FOREIGN KEY (`EID`) REFERENCES `employee` (`EID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teaching_staff`
--

LOCK TABLES `teaching_staff` WRITE;
/*!40000 ALTER TABLE `teaching_staff` DISABLE KEYS */;
INSERT INTO `teaching_staff` VALUES (1001),(1002),(1003),(1004),(1738);
/*!40000 ALTER TABLE `teaching_staff` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `textbook`
--

DROP TABLE IF EXISTS `textbook`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `textbook` (
  `ISBN` varchar(13) NOT NULL,
  `Title` varchar(200) NOT NULL,
  `Edition_no` int DEFAULT NULL,
  `Price` float DEFAULT NULL,
  PRIMARY KEY (`ISBN`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `textbook`
--

LOCK TABLES `textbook` WRITE;
/*!40000 ALTER TABLE `textbook` DISABLE KEYS */;
INSERT INTO `textbook` VALUES ('9780131103627','C Programming Language',3,89.99),('9780132350884','Clean Code',1,39.99),('9780134685991','Computer Networking',5,69.99),('9780262033848','Introduction to Algorithms',3,99.99),('9780262035613','Deep Learning',1,119.99),('9780321781079','Linear Algebra and Its Applications',4,89.99),('9780486650883','Introduction to Probability Theory',3,29.99),('9781119610418','Python for Data Analysis',2,69.99),('9781305253667','Calculus: Early Transcendentals',8,149.99),('9781318701145','Python for Machine Learning',1,69.99),('9781492041139','Hands-On Machine Learning with Scikit-Learn and TensorFlow',2,89.99);
/*!40000 ALTER TABLE `textbook` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_blacklistedtoken`
--

DROP TABLE IF EXISTS `token_blacklist_blacklistedtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_blacklistedtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `blacklisted_at` datetime(6) NOT NULL,
  `token_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_id` (`token_id`),
  CONSTRAINT `token_blacklist_blacklistedtoken_token_id_3cc7fe56_fk` FOREIGN KEY (`token_id`) REFERENCES `token_blacklist_outstandingtoken` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_blacklistedtoken`
--

LOCK TABLES `token_blacklist_blacklistedtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `token_blacklist_blacklistedtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token_blacklist_outstandingtoken`
--

DROP TABLE IF EXISTS `token_blacklist_outstandingtoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token_blacklist_outstandingtoken` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `token` longtext NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `expires_at` datetime(6) NOT NULL,
  `user_id` int DEFAULT NULL,
  `jti` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `token_blacklist_outstandingtoken_jti_hex_d9bdf6f7_uniq` (`jti`),
  KEY `token_blacklist_outs_user_id_83bc629a_fk_auth_user` (`user_id`),
  CONSTRAINT `token_blacklist_outs_user_id_83bc629a_fk_auth_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token_blacklist_outstandingtoken`
--

LOCK TABLES `token_blacklist_outstandingtoken` WRITE;
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` DISABLE KEYS */;
INSERT INTO `token_blacklist_outstandingtoken` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTUzNTkwNCwiaWF0IjoxNzQ1NDQ5NTA0LCJqdGkiOiJjNDAxZGY1MTJhNGI0MTdhODM4Y2NmNjYxMzM3MDRlNiIsInVzZXJfaWQiOjF9.ZqRrinhoCT3x36jIsyPO_QEl01q_DooCfqKz85-1n8A','2025-04-23 23:05:04.405610','2025-04-24 23:05:04.000000',1,'c401df512a4b417a838ccf66133704e6'),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTUzNjI3MCwiaWF0IjoxNzQ1NDQ5ODcwLCJqdGkiOiIyYWQwMDU4NTM2NDc0OGMyOWI5NjNlMDdlOTZjYjY2MiIsInVzZXJfaWQiOjF9.xAjC4mYBO5RgGIr-Crni2pH-IjwPKlM7HvePWM7uczY','2025-04-23 23:11:10.194832','2025-04-24 23:11:10.000000',1,'2ad00585364748c29b963e07e96cb662'),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTUzNjQzNSwiaWF0IjoxNzQ1NDUwMDM1LCJqdGkiOiJmN2FlYmEyNzU4ZGE0ZDQ5OWFmYzJmZWQ3ZGQzYzdhNyIsInVzZXJfaWQiOjJ9.G58bl-Vc-6cBJ7c-NI42ZmfNDLAz7xys-MWS8G7U71M','2025-04-23 23:13:55.750225','2025-04-24 23:13:55.000000',2,'f7aeba2758da4d499afc2fed7dd3c7a7'),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYxMjc4NiwiaWF0IjoxNzQ1NTI2Mzg2LCJqdGkiOiI2OTA4NzAwYWRkMTY0NTc4OWUzOTA4NDE0NTBlNzA5ZiIsInVzZXJfaWQiOjF9.EUeSl0PeCftriFixb08DmgLeVzZdOgTsbTdVHIf0L98','2025-04-24 20:26:26.998928','2025-04-25 20:26:26.000000',1,'6908700add1645789e390841450e709f'),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYxNDg3MywiaWF0IjoxNzQ1NTI4NDczLCJqdGkiOiI2NTkxMWIzYTM3N2I0ZDY3OTVhZGRlODdkYjBjNTVlZiIsInVzZXJfaWQiOjF9.PDKhFAirUzSb0O-_cNaQAQohrHR-pR9wYc-YNaMTBgs','2025-04-24 21:01:13.589743','2025-04-25 21:01:13.000000',1,'65911b3a377b4d6795adde87db0c55ef'),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYxNzg4OSwiaWF0IjoxNzQ1NTMxNDg5LCJqdGkiOiJiMjkyMTUxOTFjOWU0OGJjOWJkZTk3OWQ1YThiNDgxZiIsInVzZXJfaWQiOjF9.Yjjlq_6DVv6ONM5nzSCQc0-t0HlCFtTVmyXq6fHStUo','2025-04-24 21:51:29.904188','2025-04-25 21:51:29.000000',1,'b29215191c9e48bc9bde979d5a8b481f'),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYxNzk2MSwiaWF0IjoxNzQ1NTMxNTYxLCJqdGkiOiIzZmI3ZGEwOWI1NzU0MGY5YThmZmZiYThlMDEyODRmNiIsInVzZXJfaWQiOjF9.FGvUBz_VHGyQSkuOaLTaT6S51LpwNVufRqg2zwZ6RNw','2025-04-24 21:52:41.389393','2025-04-25 21:52:41.000000',1,'3fb7da09b57540f9a8fffba8e01284f6'),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYyMTA0MSwiaWF0IjoxNzQ1NTM0NjQxLCJqdGkiOiJlY2JiYzAxOGFhOTg0YmViOWU3MDIwYjg2YjMyNjgxMiIsInVzZXJfaWQiOjF9.K3Y9dukKltO1h_IqkhtZ_fGDnUV6La_t7Rx8IGU2q-M','2025-04-24 22:44:01.057159','2025-04-25 22:44:01.000000',1,'ecbbc018aa984beb9e7020b86b326812'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYyOTU4NywiaWF0IjoxNzQ1NTQzMTg3LCJqdGkiOiI3MzFmYjM1MWM1YWQ0NWUzYmJjYWE1OWQzYzEzYmM0ZiIsInVzZXJfaWQiOjN9.o9mhkwAwRpApcb7qtTyKf-Xa8dHjW7oHfQyvlLYavno','2025-04-25 01:06:27.249005','2025-04-26 01:06:27.000000',3,'731fb351c5ad45e3bbcaa59d3c13bc4f'),(10,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTYyOTc1NywiaWF0IjoxNzQ1NTQzMzU3LCJqdGkiOiJjNTNhYmM4ZjFjODA0YjA2YTJkYzZiMGY1NTkzYTZiYyIsInVzZXJfaWQiOjF9.0IqFJLlnOhyYWLIkJamryrMcdEueNvdWTz7yCIJpDQs','2025-04-25 01:09:17.035628','2025-04-26 01:09:17.000000',1,'c53abc8f1c804b06a2dc6b0f5593a6bc'),(11,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY0Mzc1OCwiaWF0IjoxNzQ1NTU3MzU4LCJqdGkiOiI5MjMyODNhNGU4OWM0NGUyYjZmODQ0ZmI3N2U3N2JlOSIsInVzZXJfaWQiOjN9.rmCQ5mgduuVHtft0YERrU5_08b-peB9o29Z706Vk8v4','2025-04-25 05:02:38.504004','2025-04-26 05:02:38.000000',3,'923283a4e89c44e2b6f844fb77e77be9'),(12,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY4ODgxOSwiaWF0IjoxNzQ1NjAyNDE5LCJqdGkiOiJhNDhkZDZmOTAzMTI0OTY2YjUxMGMxNmVhYzZhNTNlOCIsInVzZXJfaWQiOjF9.hhXd-w_GhU4uDrT0mJACcdVnkLp7QXFuVhcvdOpCX_U','2025-04-25 17:33:39.496093','2025-04-26 17:33:39.000000',1,'a48dd6f903124966b510c16eac6a53e8'),(13,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY4ODg1NSwiaWF0IjoxNzQ1NjAyNDU1LCJqdGkiOiJiZjE4OTk5NzM5MWQ0OWJhYWEwN2Y0NDQ0NjkwNGM3MiIsInVzZXJfaWQiOjN9.AL7dgge2dOa7PPXN7ovsUgxE3zrREI05067ymXuP3hM','2025-04-25 17:34:15.016642','2025-04-26 17:34:15.000000',3,'bf189997391d49baaa07f44446904c72'),(14,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY5NjA4NywiaWF0IjoxNzQ1NjA5Njg3LCJqdGkiOiJjYTA0MjliNDI1Y2I0NzVhOTkzMjAwNTU1NWE0OTQ0MiIsInVzZXJfaWQiOjN9.9ucfJjq0eJMmJCoYrPhVt6FalCsbl_8wleJhmjpLvT4','2025-04-25 19:34:47.294278','2025-04-26 19:34:47.000000',3,'ca0429b425cb475a9932005555a49442'),(15,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY5NjY0NywiaWF0IjoxNzQ1NjEwMjQ3LCJqdGkiOiJlNzhkOGY5ZTMyYmE0OTZiODAyNmU5ZjdlZmIwMGM4MyIsInVzZXJfaWQiOjN9.JZaCgOnZTam4b4qQL44ViElsGOoOhuIqpspwJZLQkD0','2025-04-25 19:44:07.710860','2025-04-26 19:44:07.000000',3,'e78d8f9e32ba496b8026e9f7efb00c83'),(16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY5NjY1OSwiaWF0IjoxNzQ1NjEwMjU5LCJqdGkiOiJhZTk0ODBhYjBkYzQ0MWFjOTY1MGNmNTEzNjIwNTVlOCIsInVzZXJfaWQiOjF9.pOmb7jzVGOY8duHyL70Qr6DZGez6hKwwWHP80XuQpN8','2025-04-25 19:44:19.221286','2025-04-26 19:44:19.000000',1,'ae9480ab0dc441ac9650cf51362055e8'),(17,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY5NjY3NiwiaWF0IjoxNzQ1NjEwMjc2LCJqdGkiOiJjOTc2ZDFkOWMxZDc0MzY0YTk5ODRmYzBkYjAzYmZkNSIsInVzZXJfaWQiOjN9.B5NymF5gyHMz6P5DW3L_bsK67LOqRcZWGyU88p_HDG8','2025-04-25 19:44:36.089962','2025-04-26 19:44:36.000000',3,'c976d1d9c1d74364a9984fc0db03bfd5'),(18,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY5Njc2NywiaWF0IjoxNzQ1NjEwMzY3LCJqdGkiOiI4ZjllZDI3YWMyY2I0NGM4OGY3NjIxNDgxZGM2YjEzYSIsInVzZXJfaWQiOjF9.kDwpq7nFs6RBssBenkDiQzEU9JazhKjaYQtMLrcsPxM','2025-04-25 19:46:07.666472','2025-04-26 19:46:07.000000',1,'8f9ed27ac2cb44c88f7621481dc6b13a'),(19,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTY5NzkzMywiaWF0IjoxNzQ1NjExNTMzLCJqdGkiOiI4NmUyOWU3NjZjN2M0ODk5OWQ5YzFhNTRkZDc5Y2QyNSIsInVzZXJfaWQiOjN9.uDUjbX1xvPtuENOFkUWwKkbzLIImntXbqNNQeuKATQ8','2025-04-25 20:05:33.631387','2025-04-26 20:05:33.000000',3,'86e29e766c7c48999d9c1a54dd79cd25'),(20,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTcwMTg3NiwiaWF0IjoxNzQ1NjE1NDc2LCJqdGkiOiJiNzQ2ZjY0ZjExNDE0YWJiYWY5Y2Y3YjUzNTQ1ZjgwMyIsInVzZXJfaWQiOjF9.g3UMTVeLeCRc4OwNdVCU4FRfEURSWDsth2t1fYj8zXc','2025-04-25 21:11:16.556842','2025-04-26 21:11:16.000000',1,'b746f64f11414abbaf9cf7b53545f803'),(21,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTcwNTkwMywiaWF0IjoxNzQ1NjE5NTAzLCJqdGkiOiJhOTA2YWYwYTgyZmY0NDNmODE3MzUwODI3NGUyM2VjNSIsInVzZXJfaWQiOjN9.fS4arhcQ40QZaac4hwdliYaFVc7lx3-2idN-571FuxA','2025-04-25 22:18:23.771802','2025-04-26 22:18:23.000000',3,'a906af0a82ff443f8173508274e23ec5'),(22,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTcwNjI5NywiaWF0IjoxNzQ1NjE5ODk3LCJqdGkiOiI1MjI0YmJlMWFjMTI0ODQyODIwYjg1OTZkYzQ2Y2Q0ZCIsInVzZXJfaWQiOjF9.R5V21vO3VYApRYvTfNZaPgsJ_rrarS8cfmPrI5ydQPc','2025-04-25 22:24:57.276776','2025-04-26 22:24:57.000000',1,'5224bbe1ac124842820b8596dc46cd4d'),(23,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTcwNzQwMSwiaWF0IjoxNzQ1NjIxMDAxLCJqdGkiOiIyYjc3ZDE0NjczNDM0ZTkwODEwZmU2N2MxZTg4ZDFkYiIsInVzZXJfaWQiOjN9.F3jtLYccR6j12PeClsrWhOEYMKyA0sxyxCu25x4BOpY','2025-04-25 22:43:21.155563','2025-04-26 22:43:21.000000',3,'2b77d14673434e90810fe67c1e88d1db'),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTcxNDYzNSwiaWF0IjoxNzQ1NjI4MjM1LCJqdGkiOiI4NmYyYTI4NTMxMGM0MTFhOGY3YzgwZjM5OGNmNGJhZSIsInVzZXJfaWQiOjN9.8o7ESmqeGrUEAvhrU2L8PWjwm310allXdXSgD6A0Dtk','2025-04-26 00:43:55.742341','2025-04-27 00:43:55.000000',3,'86f2a285310c411a8f7c80f398cf4bae'),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTc0NTcxNzg2NiwiaWF0IjoxNzQ1NjMxNDY2LCJqdGkiOiI1NzlkZWU2YzQzMmQ0NWMyOTdlMWI4MWYwNjEzM2EzNiIsInVzZXJfaWQiOjF9.1tYT8AasR1ldUo2z-MQ-YXWnBgQ0F0DghrCTStftJUg','2025-04-26 01:37:46.232860','2025-04-27 01:37:46.000000',1,'579dee6c432d45c297e1b81f06133a36');
/*!40000 ALTER TABLE `token_blacklist_outstandingtoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `undergraduate`
--

DROP TABLE IF EXISTS `undergraduate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `undergraduate` (
  `student_id` int NOT NULL,
  `credits_completed` int DEFAULT NULL,
  `major` varchar(50) NOT NULL DEFAULT 'Computer Science',
  `specialization_id` int DEFAULT NULL,
  `minor` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `major` (`major`),
  KEY `specialization_id` (`specialization_id`),
  KEY `minor` (`minor`),
  CONSTRAINT `undergraduate_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`Student_id`),
  CONSTRAINT `undergraduate_ibfk_2` FOREIGN KEY (`major`) REFERENCES `degree_program` (`Prog_name`),
  CONSTRAINT `undergraduate_ibfk_3` FOREIGN KEY (`specialization_id`) REFERENCES `specialization` (`id`),
  CONSTRAINT `undergraduate_ibfk_4` FOREIGN KEY (`minor`) REFERENCES `degree_program` (`Prog_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `undergraduate`
--

LOCK TABLES `undergraduate` WRITE;
/*!40000 ALTER TABLE `undergraduate` DISABLE KEYS */;
INSERT INTO `undergraduate` VALUES (2001,45,'BSc Computer Science',NULL,'BSc Data Science'),(2002,78,'BSc Data Science',NULL,'BSc Mathematics');
/*!40000 ALTER TABLE `undergraduate` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-25 21:41:13
