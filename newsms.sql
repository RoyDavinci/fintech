-- MySQL dump 10.14  Distrib 5.5.68-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: newRingo
-- ------------------------------------------------------
-- Server version	5.5.68-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity_logs`
--

DROP TABLE IF EXISTS `activity_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `action` text NOT NULL,
  `platform` varchar(100) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_password_resets`
--

DROP TABLE IF EXISTS `admin_password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_password_resets` (
  `email` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `admin_password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admin_wallet_requests`
--

DROP TABLE IF EXISTS `admin_wallet_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_wallet_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `approval_id` int(11) DEFAULT NULL,
  `wallet_id` varchar(20) NOT NULL,
  `amount` decimal(20,2) NOT NULL,
  `duplicate` varchar(3) DEFAULT NULL,
  `description` varchar(250) NOT NULL,
  `type` enum('CREDIT','DEBIT') NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `ext_ref` text,
  `method` varchar(50) DEFAULT NULL,
  `int_ref` text,
  `payload` text,
  `batch` varchar(100) NOT NULL,
  `account_no` varchar(100) DEFAULT NULL,
  `date` varchar(40) DEFAULT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `payer_name` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activation` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `level` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `firstname` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_path` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `agent_infos`
--

DROP TABLE IF EXISTS `agent_infos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `agent_infos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lg_of_origin` varchar(150) DEFAULT NULL,
  `state_of_origin` varchar(100) DEFAULT NULL,
  `address_of_origin` varchar(225) DEFAULT NULL,
  `lg_of_residence` varchar(150) DEFAULT NULL,
  `state_of_residence` varchar(100) DEFAULT NULL,
  `resident_address` varchar(225) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `super_agent` int(11) DEFAULT NULL,
  `sub_agent_state` enum('0','1') DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '1',
  `dob` date DEFAULT NULL,
  `bvn` bigint(20) DEFAULT NULL,
  `percentage` int(5) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24569 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `airtime_details`
--

DROP TABLE IF EXISTS `airtime_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airtime_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reference` varchar(50) NOT NULL,
  `amount` decimal(20,2) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `airtime_requests`
--

DROP TABLE IF EXISTS `airtime_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `airtime_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `network` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `type` varchar(20) DEFAULT NULL,
  `bulk_id` int(11) DEFAULT NULL,
  `bulk_phone` text,
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `trariff` varchar(100) DEFAULT NULL,
  `external_ref` varchar(500) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `payload` varchar(250) DEFAULT NULL,
  `channel` enum('0','1','2') DEFAULT NULL,
  `source` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `request_id` (`request_id`),
  KEY `user_id` (`user_id`),
  KEY `biller_id` (`biller_id`),
  KEY `network` (`network`),
  KEY `phone_number` (`phone_number`),
  KEY `category_id` (`category_id`),
  KEY `status_idx` (`status`),
  KEY `bulk_id` (`bulk_id`)
) ENGINE=InnoDB AUTO_INCREMENT=79302405 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `apis`
--

DROP TABLE IF EXISTS `apis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apis` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `api_key` varchar(150) NOT NULL,
  `type` enum('merchant','bank') NOT NULL DEFAULT 'bank',
  `vendor_code` varchar(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `vendor_code` (`vendor_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `appversions`
--

DROP TABLE IF EXISTS `appversions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `appversions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `version` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bank_tables`
--

DROP TABLE IF EXISTS `bank_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bank_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `account_no` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banks`
--

DROP TABLE IF EXISTS `banks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `banks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `key_name` varchar(250) NOT NULL,
  `auth` varchar(250) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bet_requests`
--

DROP TABLE IF EXISTS `bet_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bet_requests` (
  `id` bigint(6) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `category_id` bigint(6) unsigned NOT NULL,
  `biller_id` bigint(6) unsigned NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `customerId` varchar(200) DEFAULT NULL,
  `phoneNumber` varchar(200) DEFAULT NULL,
  `biller` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `category_id` (`category_id`),
  KEY `biller_id` (`biller_id`),
  CONSTRAINT `bet_requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `bet_requests_ibfk_2` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `billers`
--

DROP TABLE IF EXISTS `billers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `billers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bulk_requests`
--

DROP TABLE IF EXISTS `bulk_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bulk_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `type` enum('vtu','data','SMS') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `response` text,
  `request_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` double(11,2) DEFAULT NULL,
  `payload` text,
  `biller_id` int(11) DEFAULT NULL,
  `trans_code` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `category_id` int(11) NOT NULL,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `bvn_verifications`
--

DROP TABLE IF EXISTS `bvn_verifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bvn_verifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(200) NOT NULL,
  `lastname` varchar(200) NOT NULL,
  `middlename` varchar(200) NOT NULL,
  `date_of_birth` varchar(20) NOT NULL,
  `validity` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('0','1','2','3') DEFAULT NULL,
  `bvn` varchar(20) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `card_histories`
--

DROP TABLE IF EXISTS `card_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `card_histories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `product` varchar(100) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  `reference` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `cardless_requests`
--

DROP TABLE IF EXISTS `cardless_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cardless_requests` (
  `id` bigint(6) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `category_id` bigint(6) unsigned NOT NULL,
  `biller_id` bigint(6) unsigned NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `phoneNumber` varchar(200) DEFAULT NULL,
  `fac` varchar(200) DEFAULT NULL,
  `charge` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `category_id` (`category_id`),
  KEY `biller_id` (`biller_id`),
  CONSTRAINT `cardless_requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `cardless_requests_ibfk_2` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `commission_details`
--

DROP TABLE IF EXISTS `commission_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `commission_details` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(11) NOT NULL,
  `category_id` bigint(11) NOT NULL,
  `value` decimal(11,2) NOT NULL,
  `status` enum('0','1','2') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `user_id_idx` (`user_id`),
  KEY `category_id_idx` (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `configs`
--

DROP TABLE IF EXISTS `configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `daily_balances`
--

DROP TABLE IF EXISTS `daily_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `daily_balances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `biller` varchar(50) DEFAULT NULL,
  `balance` varchar(25) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `data_requests`
--

DROP TABLE IF EXISTS `data_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `data_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `network` varchar(50) NOT NULL,
  `package` varchar(50) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `external_ref` varchar(500) DEFAULT NULL,
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `bulk_id` int(11) DEFAULT NULL,
  `phone_number` varchar(20) NOT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` varchar(250) DEFAULT NULL,
  `source` varchar(20) DEFAULT NULL,
  `bundle` varchar(50) DEFAULT NULL,
  `type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `request_id` (`request_id`),
  KEY `user_id` (`user_id`),
  KEY `biller_id` (`biller_id`),
  KEY `network` (`network`),
  KEY `package` (`package`),
  KEY `phone_number` (`phone_number`),
  KEY `category_id` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `datah_bundles`
--

DROP TABLE IF EXISTS `datah_bundles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `datah_bundles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `network` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `actual_amount` decimal(8,2) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `allowance` varchar(50) NOT NULL,
  `code` varchar(5) NOT NULL,
  `validity` varchar(100) NOT NULL,
  `tariff` varchar(5) NOT NULL DEFAULT '9',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `device_tables`
--

DROP TABLE IF EXISTS `device_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `device_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `trade_partner_id` int(11) NOT NULL,
  `agent_id` int(11) NOT NULL,
  `device_serial_no` varchar(30) NOT NULL,
  `device_location` varchar(20) NOT NULL,
  `update_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `directbundle_requests`
--

DROP TABLE IF EXISTS `directbundle_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directbundle_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `network` varchar(20) NOT NULL,
  `category` varchar(50) NOT NULL,
  `actual_amount` decimal(8,2) NOT NULL,
  `price` decimal(8,2) NOT NULL,
  `data_amount` double(11,2) DEFAULT NULL,
  `allowance` varchar(50) NOT NULL,
  `code` varchar(5) NOT NULL,
  `validity` varchar(100) NOT NULL,
  `tariff` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bundlecode` varchar(10) DEFAULT NULL,
  `ringoeq` varchar(100) DEFAULT NULL,
  `ringoamount` double(11,2) DEFAULT NULL,
  `product_id` varchar(200) DEFAULT NULL,
  `biller_id` int(11) NOT NULL DEFAULT '5',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `hapari_code` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=129 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `disco_requests`
--

DROP TABLE IF EXISTS `disco_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `disco_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `meterNo` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `phoneNumber` varchar(50) DEFAULT NULL,
  `params` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `min_amount` double(11,2) DEFAULT NULL,
  `type` varchar(100) NOT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(100) DEFAULT NULL,
  `address` text,
  `token` varchar(100) DEFAULT NULL,
  `units` text,
  `tax` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `request_id` (`request_id`),
  KEY `status` (`status`),
  KEY `biller_id` (`biller_id`),
  KEY `category_id` (`category_id`),
  KEY `meterNo` (`meterNo`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=463 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `discounts`
--

DROP TABLE IF EXISTS `discounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `discounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `regular` decimal(20,2) DEFAULT '0.00',
  `B` decimal(20,2) DEFAULT '0.00',
  `C` decimal(20,2) DEFAULT '0.00',
  `D` decimal(20,2) DEFAULT '0.00',
  `E` decimal(20,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `downloads`
--

DROP TABLE IF EXISTS `downloads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `downloads` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `dubai_visa`
--

DROP TABLE IF EXISTS `dubai_visa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dubai_visa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(191) NOT NULL,
  `phone_number` varchar(50) NOT NULL,
  `email` varchar(191) NOT NULL,
  `dob` date NOT NULL,
  `passport_number` int(11) NOT NULL,
  `guardian_passport` int(11) DEFAULT NULL,
  `passport_expiry` date NOT NULL,
  `image` varchar(100) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `note` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `email_tables`
--

DROP TABLE IF EXISTS `email_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `email_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `status` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `endpoints`
--

DROP TABLE IF EXISTS `endpoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `endpoints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `input` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epins`
--

DROP TABLE IF EXISTS `epins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `epins` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` bigint(20) unsigned NOT NULL,
  `count` int(11) DEFAULT NULL,
  `pin_length` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pin_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serial_length` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `network` enum('MTN','Airtel','Glo','9mobile') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` double(11,2) DEFAULT NULL,
  `path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('0','1','2','3') COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `epins_admin_id_foreign` (`admin_id`),
  CONSTRAINT `epins_admin_id_foreign` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epins_analysis`
--

DROP TABLE IF EXISTS `epins_analysis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `epins_analysis` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `network` varchar(50) NOT NULL,
  `100` int(11) NOT NULL,
  `200` int(11) NOT NULL,
  `400` int(11) NOT NULL,
  `500` int(11) NOT NULL,
  `1000` int(11) NOT NULL,
  `1500` int(11) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epins_callback`
--

DROP TABLE IF EXISTS `epins_callback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `epins_callback` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `callback` varchar(250) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `epins_prices`
--

DROP TABLE IF EXISTS `epins_prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `epins_prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` double(11,2) NOT NULL,
  `actual_price` double(11,2) DEFAULT NULL,
  `status` enum('0','1','3') DEFAULT NULL,
  `network` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `etisalat_balances`
--

DROP TABLE IF EXISTS `etisalat_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `etisalat_balances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `balance` varchar(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `faq_tables`
--

DROP TABLE IF EXISTS `faq_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `faq_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `question` text,
  `answer` text,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fund_requests`
--

DROP TABLE IF EXISTS `fund_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fund_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` decimal(20,2) NOT NULL,
  `charge` decimal(11,2) NOT NULL,
  `rate` decimal(11,3) NOT NULL,
  `total` decimal(20,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `status` enum('0','1','2') NOT NULL,
  `trans_code` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `fund_transfers`
--

DROP TABLE IF EXISTS `fund_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fund_transfers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` double(11,2) DEFAULT NULL,
  `total_amount` double(11,2) DEFAULT NULL,
  `code` varchar(20) DEFAULT NULL,
  `account_no` varchar(100) DEFAULT NULL,
  `account_name` varchar(100) DEFAULT NULL,
  `bank_name` varchar(200) DEFAULT NULL,
  `charge` double(11,2) DEFAULT NULL,
  `trans_code` varchar(100) DEFAULT NULL,
  `payload` text,
  `response` text,
  `c_status` varchar(3) DEFAULT NULL,
  `biller_ref` varchar(100) DEFAULT NULL,
  `status` enum('0','1','2','3') DEFAULT NULL,
  `biller_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `request_id` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `glo_balances`
--

DROP TABLE IF EXISTS `glo_balances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `glo_balances` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `balance` varchar(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_tables`
--

DROP TABLE IF EXISTS `group_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `insurance_requests`
--

DROP TABLE IF EXISTS `insurance_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `insurance_requests` (
  `id` bigint(6) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `category_id` bigint(6) unsigned NOT NULL,
  `biller_id` bigint(6) unsigned NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `vehicle_make` varchar(200) DEFAULT NULL,
  `productCode` varchar(200) DEFAULT NULL,
  `phoneNumber` varchar(200) DEFAULT NULL,
  `quantity` varchar(200) DEFAULT NULL,
  `insured_name` varchar(200) DEFAULT NULL,
  `insurance_type` varchar(200) DEFAULT NULL,
  `chassis_number` varchar(200) DEFAULT NULL,
  `engine_number` varchar(200) DEFAULT NULL,
  `plate_number` varchar(200) DEFAULT NULL,
  `vehicle_model` varchar(200) DEFAULT NULL,
  `vehicle_color` varchar(200) DEFAULT NULL,
  `year_of_make` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `category_id` (`category_id`),
  KEY `biller_id` (`biller_id`),
  CONSTRAINT `insurance_requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `insurance_requests_ibfk_2` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ip_table`
--

DROP TABLE IF EXISTS `ip_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ip_table` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `ip` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('0','1') NOT NULL,
  `channel` varchar(200) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ip_tables`
--

DROP TABLE IF EXISTS `ip_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ip_tables` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `vendor_code` varchar(20) NOT NULL,
  `ip` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `jamb_requests`
--

DROP TABLE IF EXISTS `jamb_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jamb_requests` (
  `id` bigint(6) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `category_id` bigint(6) unsigned NOT NULL,
  `biller_id` bigint(6) unsigned NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `pin` varchar(200) DEFAULT NULL,
  `product` varchar(200) DEFAULT NULL,
  `phoneNumber` varchar(200) DEFAULT NULL,
  `clientReference` varchar(200) DEFAULT NULL,
  `profileCode` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `category_id` (`category_id`),
  KEY `biller_id` (`biller_id`),
  CONSTRAINT `jamb_requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `jamb_requests_ibfk_2` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `managers` (
  `id` bigint(20) unsigned NOT NULL,
  `sessionid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `msisdn` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endpoint_id` bigint(20) NOT NULL,
  `network` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `manual_funding_histories`
--

DROP TABLE IF EXISTS `manual_funding_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `manual_funding_histories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` decimal(11,2) NOT NULL,
  `reference` text NOT NULL,
  `description` varchar(100) NOT NULL,
  `type` enum('CREDIT','DEBIT') NOT NULL,
  `initiator_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `maximumvends`
--

DROP TABLE IF EXISTS `maximumvends`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maximumvends` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `network` varchar(12) NOT NULL,
  `amount` decimal(11,2) NOT NULL,
  `quantity` int(11) DEFAULT NULL,
  `status` enum('0','1','2') NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrate_tables`
--

DROP TABLE IF EXISTS `migrate_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrate_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `old_wallet` varchar(100) NOT NULL,
  `balance` double(11,2) NOT NULL,
  `balance_after` double(11,2) DEFAULT NULL,
  `response` text,
  `status` enum('0','1','2') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `model_has_permissions`
--

DROP TABLE IF EXISTS `model_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_permissions` (
  `permission_id` int(10) unsigned NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`model_id`,`model_type`),
  KEY `model_has_permissions_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `model_has_roles`
--

DROP TABLE IF EXISTS `model_has_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `model_has_roles` (
  `role_id` int(10) unsigned NOT NULL,
  `model_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model_id` bigint(20) unsigned NOT NULL,
  PRIMARY KEY (`role_id`,`model_id`,`model_type`),
  KEY `model_has_roles_model_id_model_type_index` (`model_id`,`model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `mtn_vtus`
--

DROP TABLE IF EXISTS `mtn_vtus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mtn_vtus` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone` varchar(20) NOT NULL,
  `status` enum('1','0') NOT NULL,
  `balance` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `multichoice_requests`
--

DROP TABLE IF EXISTS `multichoice_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `multichoice_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productsCodes` varchar(100) NOT NULL,
  `customerNumber` varchar(100) NOT NULL,
  `smartcardNumber` varchar(100) NOT NULL,
  `customerName` varchar(100) NOT NULL,
  `invoicePeriod` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` varchar(250) DEFAULT NULL,
  `api_method` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `payload` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `request_id` (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notice_tables`
--

DROP TABLE IF EXISTS `notice_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notice_tables` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ntel_requests`
--

DROP TABLE IF EXISTS `ntel_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ntel_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(100) DEFAULT NULL,
  `description` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `payload` text,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `request_code` text,
  `amount` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT '1',
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `request_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`),
  KEY `biller_id` (`biller_id`),
  KEY `category_id` (`category_id`),
  KEY `status` (`status`),
  KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `number_bases`
--

DROP TABLE IF EXISTS `number_bases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `number_bases` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `network` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `msisdn` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `msisdn` (`msisdn`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `number_series`
--

DROP TABLE IF EXISTS `number_series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `number_series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `series` varchar(10) NOT NULL,
  `network` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `numbers`
--

DROP TABLE IF EXISTS `numbers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `numbers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number` varchar(20) DEFAULT NULL,
  `network` varchar(50) DEFAULT NULL,
  `status` enum('0','1','2','') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `phone_idx` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_resets`
--

DROP TABLE IF EXISTS `password_resets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `payment_method`
--

DROP TABLE IF EXISTS `payment_method`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment_method` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `api` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `paytv_requests`
--

DROP TABLE IF EXISTS `paytv_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `paytv_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(100) DEFAULT NULL,
  `smartcardNumber` varchar(100) NOT NULL,
  `customerName` varchar(100) NOT NULL,
  `payload` text,
  `user_id` bigint(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `productsCodes` varchar(100) DEFAULT NULL,
  `request_code` text,
  `amount` int(11) DEFAULT NULL,
  `period` int(11) DEFAULT '1',
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `addondetails` varchar(1000) DEFAULT NULL,
  `request_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `packagename` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `user_id` (`user_id`),
  KEY `type` (`type`),
  KEY `biller_id` (`biller_id`),
  KEY `category_id` (`category_id`),
  KEY `status` (`status`),
  KEY `smartcardNumber` (`smartcardNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=165 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `permissions` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pin_requests`
--

DROP TABLE IF EXISTS `pin_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pin_requests` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `batch_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `network` enum('MTN','Airtel','Glo','9mobile') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `biller_id` int(11) DEFAULT NULL,
  `amount` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `status` enum('0','1','2','3','4','5','6','7') COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `reversal_status` enum('0','1','2') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `remainder` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text COLLATE utf8mb4_unicode_ci,
  `response` varchar(10000) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'response',
  `message` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `over` int(11) NOT NULL DEFAULT '0',
  `over_status` int(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `pin_requests_user_id_foreign` (`user_id`),
  KEY `request_id_idx` (`request_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pinprint_requests`
--

DROP TABLE IF EXISTS `pinprint_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pinprint_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `wallet_id` varchar(100) NOT NULL,
  `amount_charged` double(11,2) DEFAULT NULL,
  `balance_after` double(11,2) DEFAULT NULL,
  `user_id` bigint(11) NOT NULL,
  `status` enum('0','1','2') DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pinreset_questions`
--

DROP TABLE IF EXISTS `pinreset_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pinreset_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question1_id` int(11) NOT NULL,
  `answer1` varchar(200) NOT NULL,
  `question2_id` int(11) NOT NULL,
  `answer2` varchar(200) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pins`
--

DROP TABLE IF EXISTS `pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pins` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned DEFAULT NULL,
  `epin_id` bigint(20) unsigned DEFAULT NULL,
  `batch_id` bigint(20) unsigned DEFAULT NULL,
  `network` enum('MTN','Airtel','Glo','9mobile') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `pin` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serial_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiry_date` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `assigned_time` datetime DEFAULT NULL,
  `status` enum('0','1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pins_pin_unique` (`pin`),
  UNIQUE KEY `pins_serial_no_unique` (`serial_no`),
  KEY `pins_user_id_foreign` (`user_id`),
  KEY `pins_epin_id_foreign` (`epin_id`),
  KEY `pins_batch_id_foreign` (`batch_id`),
  KEY `status_idx` (`status`),
  KEY `amount_idx` (`amount`),
  KEY `network_idx` (`network`),
  CONSTRAINT `pins_batch_id_foreign` FOREIGN KEY (`batch_id`) REFERENCES `pin_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pins_epin_id_foreign` FOREIGN KEY (`epin_id`) REFERENCES `epins` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `priorities`
--

DROP TABLE IF EXISTS `priorities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `priorities` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `priority` int(11) NOT NULL,
  `network` varchar(20) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_categories`
--

DROP TABLE IF EXISTS `product_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(2) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` double(11,2) DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `product_commisions`
--

DROP TABLE IF EXISTS `product_commisions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `product_commisions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `value` decimal(11,2) NOT NULL,
  `group_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `biller_id` bigint(20) unsigned NOT NULL,
  `price` double(8,2) DEFAULT NULL,
  `api_path` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `commission_type` enum('flat','percentage') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'percentage',
  `has_stakeholder` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `stakeholder_id` int(11) DEFAULT NULL,
  `stakeholder_value` decimal(11,2) DEFAULT NULL,
  `tradepartner_value` decimal(11,2) DEFAULT NULL,
  `sp_value` decimal(11,2) DEFAULT NULL,
  `agent_value` decimal(11,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_biller_id_foreign` (`biller_id`),
  KEY `biller_id_idx` (`biller_id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `products_biller_id_foreign` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=304 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `remita_requests`
--

DROP TABLE IF EXISTS `remita_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `remita_requests` (
  `id` bigint(6) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `category_id` bigint(6) unsigned NOT NULL,
  `biller_id` bigint(6) unsigned NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `customerId` varchar(200) DEFAULT NULL,
  `payerName` varchar(200) DEFAULT NULL,
  `debittedAccount` varchar(200) DEFAULT NULL,
  `incomeAccount` varchar(200) DEFAULT NULL,
  `productCode` varchar(200) DEFAULT NULL,
  `phone` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `category_id` (`category_id`),
  KEY `biller_id` (`biller_id`),
  CONSTRAINT `remita_requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `remita_requests_ibfk_2` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `request_tables`
--

DROP TABLE IF EXISTS `request_tables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `request_tables` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `source` text NOT NULL,
  `request` text NOT NULL,
  `response` text NOT NULL,
  `status` enum('0','1','2','3') NOT NULL DEFAULT '0',
  `amount` decimal(20,0) NOT NULL,
  `product_category_id` int(11) NOT NULL,
  `payment_method` enum('wallet','card','bank') NOT NULL,
  `product_type` varchar(50) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resolutions`
--

DROP TABLE IF EXISTS `resolutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resolutions` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `remainder` int(11) DEFAULT NULL,
  `status` int(1) NOT NULL DEFAULT '0',
  `unit_amount` int(11) NOT NULL,
  `batch_id` int(11) NOT NULL,
  `network` varchar(20) NOT NULL,
  `amount` decimal(20,2) DEFAULT NULL,
  `reversal` decimal(20,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `revenue_reports`
--

DROP TABLE IF EXISTS `revenue_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `revenue_reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` double(20,2) DEFAULT NULL,
  `type` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `role_has_permissions`
--

DROP TABLE IF EXISTS `role_has_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role_has_permissions` (
  `permission_id` int(10) unsigned NOT NULL,
  `role_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`permission_id`,`role_id`),
  KEY `role_has_permissions_role_id_foreign` (`role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `guard_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sent_email_logs`
--

DROP TABLE IF EXISTS `sent_email_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sent_email_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(100) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `id` bigint(20) unsigned NOT NULL,
  `sessionid` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `msisdn` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `endpoint_id` bigint(20) NOT NULL,
  `network` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `showmax_requests`
--

DROP TABLE IF EXISTS `showmax_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `showmax_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerNumber` varchar(100) DEFAULT NULL,
  `subscription_period` varchar(100) NOT NULL,
  `code` varchar(100) NOT NULL,
  `payload` text,
  `user_id` bigint(20) NOT NULL,
  `subscription_type` varchar(50) DEFAULT NULL,
  `package` text,
  `amount` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT '1',
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `request_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `user_id` (`user_id`),
  KEY `subscription_type` (`subscription_type`),
  KEY `biller_id` (`biller_id`),
  KEY `category_id` (`category_id`),
  KEY `status` (`status`),
  KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=245 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smile_requests`
--

DROP TABLE IF EXISTS `smile_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smile_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `customerAccountId` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `package` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `response` text,
  `request_id` varchar(500) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `trans_code` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `api_method` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `payload` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `smiledata_requests`
--

DROP TABLE IF EXISTS `smiledata_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `smiledata_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT NULL,
  `bundle` varchar(100) DEFAULT NULL,
  `network` varchar(50) NOT NULL,
  `amount` decimal(11,2) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `package` varchar(50) NOT NULL,
  `account_id` varchar(20) NOT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `trans_code` varchar(20) NOT NULL,
  `payload` varchar(250) DEFAULT NULL,
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `request_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `spectranet_pins`
--

DROP TABLE IF EXISTS `spectranet_pins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spectranet_pins` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pin` varchar(100) NOT NULL,
  `serial_no` varchar(100) NOT NULL,
  `request_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `spectranet_requests`
--

DROP TABLE IF EXISTS `spectranet_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `spectranet_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT NULL,
  `bundle` varchar(20) DEFAULT NULL,
  `network` varchar(50) NOT NULL,
  `amount` double(11,2) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `package` varchar(50) NOT NULL,
  `pinNo` int(10) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` bigint(11) NOT NULL,
  `user_id` int(20) DEFAULT NULL,
  `trans_code` varchar(20) NOT NULL,
  `payload` varchar(500) DEFAULT NULL,
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `request_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `stakeholders`
--

DROP TABLE IF EXISTS `stakeholders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stakeholders` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) NOT NULL,
  `wallet_id` varchar(20) NOT NULL,
  `commission_value` decimal(20,0) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `startimes_requests`
--

DROP TABLE IF EXISTS `startimes_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `startimes_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `smartCardNumber` varchar(50) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` int(11) NOT NULL,
  `trans_code` varchar(20) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `api_method` varchar(150) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `payload` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sub_products`
--

DROP TABLE IF EXISTS `sub_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_products` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) unsigned NOT NULL,
  `package` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `status` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sub_products_product_id_foreign` (`product_id`),
  CONSTRAINT `sub_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `supports`
--

DROP TABLE IF EXISTS `supports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `value` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `suspense_accounts`
--

DROP TABLE IF EXISTS `suspense_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suspense_accounts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) NOT NULL,
  `amount` decimal(20,0) NOT NULL,
  `description` varchar(50) NOT NULL,
  `status` enum('0','1') NOT NULL,
  `approved_by` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `switchers`
--

DROP TABLE IF EXISTS `switchers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `switchers` (
  `id` bigint(11) NOT NULL AUTO_INCREMENT,
  `category_id` bigint(11) NOT NULL,
  `biller_id` bigint(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `product_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `switches`
--

DROP TABLE IF EXISTS `switches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `switches` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `c_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `category_id` bigint(20) unsigned NOT NULL,
  `product_id` bigint(20) unsigned NOT NULL,
  `biller_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `switches_category_id_foreign` (`category_id`),
  KEY `switches_product_id_foreign` (`product_id`),
  KEY `switches_biller_id_foreign` (`biller_id`),
  CONSTRAINT `switches_biller_id_foreign` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `switches_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `switches_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `token` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `toll_requests`
--

DROP TABLE IF EXISTS `toll_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `toll_requests` (
  `id` bigint(6) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `amount` int(11) DEFAULT NULL,
  `type` varchar(200) DEFAULT NULL,
  `category_id` bigint(6) unsigned NOT NULL,
  `biller_id` bigint(6) unsigned NOT NULL,
  `trans_code` varchar(50) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `request_id` varchar(150) DEFAULT NULL,
  `response` text,
  `api_method` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL,
  `payload` text,
  `name` varchar(200) DEFAULT NULL,
  `address` varchar(200) DEFAULT NULL,
  `tax` varchar(200) DEFAULT NULL,
  `productCode` varchar(200) DEFAULT NULL,
  `phoneNumber` varchar(200) DEFAULT NULL,
  `quantity` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `trans_code` (`trans_code`),
  KEY `category_id` (`category_id`),
  KEY `biller_id` (`biller_id`),
  CONSTRAINT `toll_requests_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `product_categories` (`id`),
  CONSTRAINT `toll_requests_ibfk_2` FOREIGN KEY (`biller_id`) REFERENCES `billers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactionlimits`
--

DROP TABLE IF EXISTS `transactionlimits`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactionlimits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `maximumvend` decimal(11,2) NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `transactions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `amount` double(8,2) NOT NULL,
  `balance_after` double(20,2) DEFAULT '0.00',
  `product_id` bigint(20) unsigned DEFAULT NULL,
  `unit` int(11) DEFAULT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('0','1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('0','1','2') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `product_category_id` int(11) DEFAULT NULL,
  `source` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` enum('WEB','APP','POS','B2B','USSD') COLLATE utf8mb4_unicode_ci NOT NULL,
  `request_id` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `destination` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `transactions_product_id_foreign` (`product_id`),
  KEY `product_category_id_idx` (`product_category_id`),
  KEY `user_id_idx` (`user_id`),
  KEY `source_idx` (`source`),
  KEY `created_at_idx` (`created_at`),
  KEY `request_id_idx` (`request_id`(191)),
  KEY `reference_idx` (`reference`),
  KEY `description_idx` (`description`),
  CONSTRAINT `transactions_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=791 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date DEFAULT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Default',
  `discount` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'regular',
  `status` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL,
  `whitelistip` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `auto_detect` enum('0','1') CHARACTER SET utf8mb4 DEFAULT '0',
  `topicstatus` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_time` timestamp NOT NULL DEFAULT '2021-01-21 08:58:13',
  `api_token` text COLLATE utf8mb4_unicode_ci,
  `device_info` text CHARACTER SET utf8mb4,
  `device_first_raw` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_failed_raw` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device_failed_hash` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempt` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pin_auth` enum('0','1','2') COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `trials` int(2) DEFAULT NULL,
  `question1` text COLLATE utf8mb4_unicode_ci,
  `question2` text COLLATE utf8mb4_unicode_ci,
  `answer1` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `answer2` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pin` int(5) DEFAULT NULL,
  `referred` enum('Y','N') COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `phone_verified` enum('0','1','2','3') CHARACTER SET latin1 DEFAULT '0',
  `email_verified` enum('0','1','2','3') CHARACTER SET latin1 DEFAULT '0',
  `bvn_verified` enum('0','1','2','3') CHARACTER SET latin1 DEFAULT '0',
  `email_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pass_reset` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_token` int(4) DEFAULT NULL,
  `token_exp_date` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token_expiry_time` timestamp NULL DEFAULT NULL,
  `activation` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `b2b` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `print_charge` double(11,2) DEFAULT NULL,
  `print_amount_charged` double(11,2) DEFAULT NULL,
  `epinsprint` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `app_token` text COLLATE utf8mb4_unicode_ci,
  `web_hook` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referred_id` int(11) DEFAULT NULL,
  `providus_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolez_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolez_status` enum('0','1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `sterling_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sterling_reference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sterling_status` enum('0','1','2','3') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `providus_reference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `providus_status` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rubies_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rolez_reference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rubies_status` enum('0','1') CHARACTER SET utf8mb4 DEFAULT '0',
  `rubies_reference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wema_reference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wema_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wema_status` enum('0','1','2','3','4','5') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commission` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hash` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'individual',
  `group_id` int(11) DEFAULT NULL,
  `transacting` enum('0','1','2') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fire_hash` text COLLATE utf8mb4_unicode_ci,
  `fire_failed` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users2`
--

DROP TABLE IF EXISTS `users2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users2` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthday` date DEFAULT NULL,
  `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Default',
  `discount` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'regular',
  `status` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL,
  `topicstatus` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `username` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referred` enum('Y','N') COLLATE utf8mb4_unicode_ci DEFAULT 'N',
  `phone_verified` enum('0','1','2','3') CHARACTER SET latin1 DEFAULT '0',
  `email_verified` enum('0','1','2','3') CHARACTER SET latin1 DEFAULT '0',
  `bvn_verified` enum('0','1','2','3') CHARACTER SET latin1 DEFAULT '0',
  `email_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_token` int(4) DEFAULT NULL,
  `token_expiry_time` timestamp NULL DEFAULT NULL,
  `activation` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT '0',
  `b2b` enum('0','1') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `print_charge` double(11,2) DEFAULT NULL,
  `print_amount_charged` double(11,2) DEFAULT NULL,
  `epinsprint` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `app_token` text COLLATE utf8mb4_unicode_ci,
  `web_hook` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referred_id` int(11) DEFAULT NULL,
  `providus_account` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `providus_reference` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `providus_status` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `commission` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hash` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'individual',
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_logs`
--

DROP TABLE IF EXISTS `users_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `action` varchar(1000) NOT NULL,
  `channel` varchar(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ussd_sessions`
--

DROP TABLE IF EXISTS `ussd_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ussd_sessions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `msisdn` varchar(20) NOT NULL,
  `session` varchar(200) NOT NULL,
  `account` varchar(500) DEFAULT NULL,
  `is2FAEnabled` enum('0','1','2') NOT NULL DEFAULT '0',
  `isTransactionEnabled` enum('0','1','2') NOT NULL DEFAULT '0',
  `account_string` text,
  `isMilti` enum('0','1','2') NOT NULL DEFAULT '0',
  `screen` int(5) NOT NULL,
  `level` int(5) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('0','1','2','3') NOT NULL DEFAULT '1',
  `response` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `waec_requests`
--

DROP TABLE IF EXISTS `waec_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `waec_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(20) DEFAULT NULL,
  `bundle` varchar(20) DEFAULT NULL,
  `network` varchar(50) NOT NULL,
  `amount` double(11,2) NOT NULL,
  `status` enum('0','1','2') NOT NULL DEFAULT '0',
  `package` varchar(50) NOT NULL,
  `pinNo` int(10) DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `biller_id` bigint(11) NOT NULL,
  `user_id` int(20) DEFAULT NULL,
  `trans_code` varchar(20) NOT NULL,
  `payload` varchar(500) DEFAULT NULL,
  `response` text,
  `request_id` varchar(200) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallet_histories`
--

DROP TABLE IF EXISTS `wallet_histories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallet_histories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `amount` double(20,2) NOT NULL,
  `user_id` bigint(20) unsigned NOT NULL,
  `source` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channel` varchar(191) CHARACTER SET latin1 DEFAULT NULL,
  `status` enum('0','1','2') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `balance_after` double(20,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(250) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'CREDIT',
  PRIMARY KEY (`id`),
  KEY `wallet_histories_user_id_foreign` (`user_id`),
  KEY `reference_idx` (`reference`)
) ENGINE=InnoDB AUTO_INCREMENT=1207 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallet_requests`
--

DROP TABLE IF EXISTS `wallet_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallet_requests` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) NOT NULL,
  `destination` varchar(20) NOT NULL,
  `type` varchar(10) NOT NULL,
  `status` enum('0','1','2','3') NOT NULL DEFAULT '0',
  `bank` varchar(250) DEFAULT NULL,
  `account_name` varchar(250) DEFAULT NULL,
  `category_id` bigint(20) NOT NULL,
  `biller_id` bigint(20) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `response` text CHARACTER SET utf8 COLLATE utf8_bin,
  `request_id` varchar(200) DEFAULT NULL,
  `payload` text,
  `bin` varchar(20) DEFAULT NULL,
  `trans_code` varchar(30) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `charge` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `walletbackups`
--

DROP TABLE IF EXISTS `walletbackups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `walletbackups` (
  `id` bigint(20) unsigned NOT NULL DEFAULT '0',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `codeBackup` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `balance` double(20,2) NOT NULL DEFAULT '0.00',
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bonus_balance` decimal(20,2) NOT NULL,
  `commission_balance` decimal(20,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wallets`
--

DROP TABLE IF EXISTS `wallets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `wallets` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codeBackup` text COLLATE utf8mb4_unicode_ci,
  `balance` double(20,2) NOT NULL DEFAULT '0.00',
  `user_id` bigint(20) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bonus_balance` decimal(20,2) NOT NULL,
  `commission_balance` decimal(20,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `wallet_id` (`code`),
  KEY `wallets_user_id_foreign` (`user_id`),
  KEY `user_id_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24734 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `walletsbackup2`
--

DROP TABLE IF EXISTS `walletsbackup2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `walletsbackup2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(100) NOT NULL,
  `codeBackup` text,
  `balance` double(20,2) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `bonus_balance` double(20,2) DEFAULT NULL,
  `commission_balance` double(20,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-09 11:20:49
