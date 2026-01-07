-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: matafuegos_db
-- ------------------------------------------------------
-- Server version	8.4.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `cuit` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) NOT NULL,
  `observaciones` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Juan Pérez','20-12345678-9','(342) 123-4567','juan@test.com','Av. San Martín 1234, Malabrigo','Cliente frecuente, tiene 3 extintores ABC','2025-10-23 18:03:29','2025-10-23 18:03:29'),(2,'Juan Pérez','28-12345278-9','(342) 123-1237','jaun@test.com','Av. San Martín 798, Romang','Cliente frecuente, tiene 5 extintores ABC','2025-10-24 12:50:09','2025-10-24 12:50:09');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `compras`
--

DROP TABLE IF EXISTS `compras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `compras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `productoId` int NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `precioUnitario` decimal(10,2) NOT NULL,
  `precioTotal` decimal(10,2) NOT NULL,
  `fechaCompra` date NOT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `numeroFactura` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_fe776b37e33079c880756b95184` (`productoId`),
  CONSTRAINT `FK_fe776b37e33079c880756b95184` FOREIGN KEY (`productoId`) REFERENCES `productos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `compras`
--

LOCK TABLES `compras` WRITE;
/*!40000 ALTER TABLE `compras` DISABLE KEYS */;
INSERT INTO `compras` VALUES (1,2,20.00,2400.00,48000.00,'2025-10-25','Distribuidora del Norte','FC-0001234','Compra de manómetros por stock bajo','2025-10-25 21:21:33','2025-10-25 21:21:33');
/*!40000 ALTER TABLE `compras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comprobantes`
--

DROP TABLE IF EXISTS `comprobantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comprobantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numeroComprobante` varchar(255) NOT NULL,
  `recargaId` int NOT NULL,
  `clienteId` int NOT NULL,
  `fechaEmision` date NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `detalles` text,
  `estado` varchar(255) NOT NULL DEFAULT 'emitido',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_4fbc45a30adb38440ec7e707cd` (`numeroComprobante`),
  KEY `FK_59121457e9a7857be011e113c5c` (`recargaId`),
  KEY `FK_57150157e5a5d9a428ec3c9c7a4` (`clienteId`),
  CONSTRAINT `FK_57150157e5a5d9a428ec3c9c7a4` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_59121457e9a7857be011e113c5c` FOREIGN KEY (`recargaId`) REFERENCES `recargas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comprobantes`
--

LOCK TABLES `comprobantes` WRITE;
/*!40000 ALTER TABLE `comprobantes` DISABLE KEYS */;
INSERT INTO `comprobantes` VALUES (1,'00000001',1,2,'2025-10-24',15000.00,'{\"items\":[{\"descripcion\":\"Carga Extintor ABC Capac. 5 Kg\",\"cantidad\":1,\"importe\":8000},{\"descripcion\":\"Manómetro repl. diámetro 14 x 35\",\"cantidad\":1,\"importe\":2500},{\"descripcion\":\"Reparación Gatillo c/o Vástago\",\"cantidad\":1,\"importe\":1800},{\"descripcion\":\"Prueba de Presión Hidráulica PPH\",\"cantidad\":1,\"importe\":2700}],\"observaciones\":\"Extintor en buen estado. Se realizó recarga completa y cambio de manómetro. Próximo vencimiento: 25/10/2026\"}','emitido','2025-10-29 12:16:51','2025-10-29 12:16:51'),(2,'00000002',1,2,'2025-10-24',15000.00,'{\"items\":[{\"descripcion\":\"Carga Extintor ABC Capac. 5 Kg\",\"cantidad\":1,\"importe\":8000},{\"descripcion\":\"Manómetro repl. diámetro 14 x 35\",\"cantidad\":1,\"importe\":2500},{\"descripcion\":\"Reparación Gatillo c/o Vástago\",\"cantidad\":1,\"importe\":1800},{\"descripcion\":\"Prueba de Presión Hidráulica PPH\",\"cantidad\":1,\"importe\":2700}],\"observaciones\":\"Extintor en buen estado. Se realizó recarga completa y cambio de manómetro. Próximo vencimiento: 25/10/2026\"}','emitido','2025-10-31 19:52:39','2025-10-31 19:52:39'),(3,'00000003',1,2,'2025-10-24',8000.00,'{\"items\":[{\"descripcion\":\"Carga Extintor ABC Capac. 5 Kg\",\"cantidad\":1,\"importe\":8000}],\"observaciones\":\"Extintor en buen estado. Se realizó recarga completa y cambio de manómetro. Próximo vencimiento: 25/10/2026\"}','emitido','2025-10-31 20:10:56','2025-10-31 20:10:56'),(4,'00000004',1,2,'2025-10-30',8000.00,'{\"items\":[{\"descripcion\":\"Carga Extintor ABC Capac. 5 Kg\",\"cantidad\":1,\"importe\":8000}],\"observaciones\":\"Extintor en buen estado. Próximo vencimiento: 31/10/2026\"}','emitido','2025-11-02 15:49:51','2025-11-02 15:49:51'),(5,'00000005',1,1,'2025-11-01',16000.00,'{\"items\":[{\"descripcion\":\"Carga Extintor ABC Capac. 5 Kg\",\"cantidad\":1,\"precioUnitario\":8000},{\"descripcion\":\"Manómetro repl. diámetro 14 x 35\",\"cantidad\":2,\"precioUnitario\":2500},{\"descripcion\":\"Prueba Hidráulica PPH\",\"cantidad\":1,\"precioUnitario\":3000}],\"observaciones\":\"Recarga completa. Extintor en buen estado. Próximo vencimiento: 11/2026\"}','emitido','2025-11-03 12:38:42','2025-11-03 12:38:42');
/*!40000 ALTER TABLE `comprobantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `extintores`
--

DROP TABLE IF EXISTS `extintores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `extintores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numeroEquipo` varchar(255) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `capacidad` decimal(5,2) NOT NULL,
  `marca` varchar(255) DEFAULT NULL,
  `fechaUltimaRecarga` date DEFAULT NULL,
  `fechaVencimiento` date DEFAULT NULL,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `clienteId` int NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_c7a16f08cd77bf69115b32fbf4` (`numeroEquipo`),
  KEY `FK_7a4c692c7644dad0432bd1237ab` (`clienteId`),
  CONSTRAINT `FK_7a4c692c7644dad0432bd1237ab` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `extintores`
--

LOCK TABLES `extintores` WRITE;
/*!40000 ALTER TABLE `extintores` DISABLE KEYS */;
INSERT INTO `extintores` VALUES (1,'78561','ABC',5.00,'Drago','2025-10-23','2026-10-23','activo',1,'2025-10-24 19:28:50','2025-10-25 20:56:24');
/*!40000 ALTER TABLE `extintores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `unidadMedida` varchar(255) NOT NULL,
  `stockActual` decimal(10,2) NOT NULL DEFAULT '0.00',
  `stockMinimo` decimal(10,2) NOT NULL DEFAULT '10.00',
  `precioUnitario` decimal(10,2) DEFAULT NULL,
  `descripcion` text,
  `estado` varchar(255) NOT NULL DEFAULT 'activo',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_829134a4f7cf07f2132c2e3607` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'Polvo Químico ABC','polvo','kg',50.00,10.00,1500.00,'Polvo químico seco ABC para extintores','activo','2025-10-25 21:17:48','2025-10-25 21:17:48'),(2,'Manómetro 14x35','repuesto','unidad',25.00,10.00,2400.00,'Manómetro diámetro 14x35 para extintores ABC','activo','2025-10-25 21:19:07','2025-10-25 21:21:33');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recargas`
--

DROP TABLE IF EXISTS `recargas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recargas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `extintorId` int NOT NULL,
  `clienteId` int NOT NULL,
  `fechaRecarga` date NOT NULL,
  `fechaProximaRecarga` date DEFAULT NULL,
  `polvoKg` decimal(10,2) NOT NULL DEFAULT '0.00',
  `manometros` int NOT NULL DEFAULT '0',
  `vastagos` int NOT NULL DEFAULT '0',
  `valvulas` int NOT NULL DEFAULT '0',
  `orings` int NOT NULL DEFAULT '0',
  `mangueras` int NOT NULL DEFAULT '0',
  `boquillas` int NOT NULL DEFAULT '0',
  `seguros` int NOT NULL DEFAULT '0',
  `etiquetas` int NOT NULL DEFAULT '0',
  `precioTotal` decimal(10,2) NOT NULL,
  `observaciones` text,
  `estado` varchar(255) NOT NULL DEFAULT 'completada',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_4d7ba6b214a68778351e94e86ed` (`extintorId`),
  KEY `FK_6deb6022a801e96fe4a66ec2c5a` (`clienteId`),
  CONSTRAINT `FK_4d7ba6b214a68778351e94e86ed` FOREIGN KEY (`extintorId`) REFERENCES `extintores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_6deb6022a801e96fe4a66ec2c5a` FOREIGN KEY (`clienteId`) REFERENCES `clientes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recargas`
--

LOCK TABLES `recargas` WRITE;
/*!40000 ALTER TABLE `recargas` DISABLE KEYS */;
INSERT INTO `recargas` VALUES (1,1,1,'2025-10-24','2026-10-24',5.00,1,0,0,1,0,0,0,1,15000.00,'Recarga completa ABC 5kg. Se cambió manómetro y O-ring. Extintor en buen estado.','completada','2025-10-25 20:56:24','2025-10-25 20:56:24');
/*!40000 ALTER TABLE `recargas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_9f78cfde576fc28f279e2b7a9c` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','$2b$10$Chk7mrI9VeOY4vnx9uSiE.PJEAoNkSUYsxHWH4b58Q50pF3KbtQIG','admin@test.com','user','2025-10-21 23:24:07');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'matafuegos_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-07 19:16:23
