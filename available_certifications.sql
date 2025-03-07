-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2025 a las 15:35:23
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `escr_licenciamiento_bk`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `available_certifications`
--

CREATE TABLE `available_certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `tipo` varchar(255) DEFAULT NULL,
  `categoria` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `available_certifications`
--

INSERT INTO `available_certifications` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`, `activo`, `tipo`, `categoria`) VALUES
(1, 'INTE B5:2020', NULL, '2024-11-18 22:42:07', '2025-03-05 08:23:02', 0, 'ISO', NULL),
(2, 'INTE G12:2019', NULL, '2024-11-18 22:42:07', '2025-03-05 08:23:10', 0, NULL, NULL),
(3, 'INTE G8:2013', NULL, '2024-11-18 22:42:07', '2025-03-05 08:23:28', 0, 'OTRO', NULL),
(5, 'ISO 9001', 'ISO 9001', '2024-11-20 23:37:14', '2025-03-05 00:47:00', 1, 'ISO', NULL),
(6, 'INTE G:2896', 'INTE G:2896', '2024-11-20 23:53:15', '2025-03-05 08:46:41', 0, 'INTE', NULL),
(11, 'ISO 13485', 'ISO 13485', '2025-03-04 01:28:02', '2025-03-05 00:47:06', 1, 'ISO', NULL),
(18, 'ISO 14001', NULL, '2025-03-05 01:42:33', '2025-03-05 01:42:33', 1, 'ISO', NULL),
(19, 'ISO 14064-1', NULL, '2025-03-05 01:42:47', '2025-03-05 01:42:47', 1, 'ISO', NULL),
(20, 'ISO 22000', NULL, '2025-03-05 01:43:00', '2025-03-05 01:43:00', 1, 'ISO', NULL),
(21, 'ISO 22301', NULL, '2025-03-05 01:43:09', '2025-03-05 01:43:09', 1, 'ISO', NULL),
(22, 'ISO/IEC 27001', NULL, '2025-03-05 01:43:25', '2025-03-05 01:43:25', 1, 'ISO', NULL),
(23, 'ISO 28001', NULL, '2025-03-05 01:43:37', '2025-03-05 01:43:37', 1, 'ISO', NULL),
(24, 'ISO 37001', NULL, '2025-03-05 01:43:45', '2025-03-05 01:43:45', 1, 'ISO', NULL),
(25, 'ISO 45001', NULL, '2025-03-05 01:43:54', '2025-03-05 01:43:54', 1, 'ISO', NULL),
(26, 'ISO 46001', NULL, '2025-03-05 01:44:03', '2025-03-05 01:44:03', 1, 'ISO', NULL),
(27, 'ISO 50001', NULL, '2025-03-05 01:44:13', '2025-03-05 01:44:13', 1, 'ISO', NULL),
(28, 'INTE B5', NULL, '2025-03-05 01:44:25', '2025-03-05 01:44:25', 1, 'INTE', NULL),
(29, 'INTE G8', NULL, '2025-03-05 01:44:34', '2025-03-05 01:44:34', 1, 'INTE', NULL),
(30, 'INTE G12', NULL, '2025-03-05 01:44:41', '2025-03-05 01:44:41', 1, 'INTE', NULL),
(31, 'INTE G38', NULL, '2025-03-05 01:44:51', '2025-03-05 01:44:51', 1, 'INTE', NULL),
(32, 'Bonsucro Production Estándar v4.2 o Production Standard for Smallholder Farmers V.1.0', NULL, '2025-03-05 01:45:16', '2025-03-05 01:45:16', 1, 'OTRO', NULL),
(33, 'BRCGS -Global Standard for Food Safety issue 8,', NULL, '2025-03-05 01:45:32', '2025-03-05 01:45:32', 1, 'OTRO', NULL),
(34, 'Estándar de la cadena de custodia para el balance de masa de Bonsucro y guía para su implementación versión 5.1', NULL, '2025-03-05 01:45:40', '2025-03-05 01:45:40', 1, 'OTRO', NULL),
(35, 'Fair Trade USA / Fair Trade Certified: Estándar de Comercio 2.1.0', NULL, '2025-03-05 01:45:56', '2025-03-05 01:45:56', 1, 'OTRO', NULL),
(36, 'Fair Trade USA / Fair Trade Certified: Estándar de Producción Agrícola 1.2.0', NULL, '2025-03-05 01:46:05', '2025-03-05 01:46:05', 1, 'OTRO', NULL),
(37, 'Fair Trade USA / Fair Trade Certified: Estándar para fábricas de prendas de vestir y productos del hogar. Versión 1.4.0', NULL, '2025-03-05 01:46:13', '2025-03-05 01:46:13', 1, 'OTRO', NULL),
(38, 'Fairtrade International Criterios de comercio justo fairtrade para pequeños productores 03-04-2019-v2.4', NULL, '2025-03-05 01:46:22', '2025-03-05 01:46:22', 1, 'OTRO', NULL),
(39, 'Fairtrade International: Criterio de comercio justo fairtrade para comerciantes versión 01.03.2015v1.6', NULL, '2025-03-05 01:46:32', '2025-03-05 01:46:32', 1, 'OTRO', NULL),
(40, 'Fairtrade International: Criterio de comercio justo fairtrade para trabajo contratado 15.01.2014-v17', NULL, '2025-03-05 01:46:42', '2025-03-05 01:46:42', 1, 'OTRO', NULL),
(41, 'Fairtrade International: Fairtrade Textile Standard versión 22.03.2016.v1.2', NULL, '2025-03-05 01:46:52', '2025-03-05 01:46:52', 1, 'OTRO', NULL),
(42, 'FSC', NULL, '2025-03-05 01:47:05', '2025-03-05 01:47:05', 1, 'OTRO', NULL),
(43, 'FSSC22000', NULL, '2025-03-05 01:47:14', '2025-03-05 01:47:14', 1, 'OTRO', NULL),
(44, 'GlobalGap -Global Gap Harmonized Produce Safety Standard v 1.2, Global Gap Produce Handling Assurance (PHA) v1.2 y esquemas adicionales reconocidos por GFSI', NULL, '2025-03-05 01:47:26', '2025-03-05 01:47:26', 1, 'OTRO', NULL),
(45, 'IFS Food', NULL, '2025-03-05 01:47:36', '2025-03-05 01:47:36', 1, 'OTRO', NULL),
(46, 'Rainforest Alliance: Estándar para la Agricultura Sostenible de Rainforest Alliance. Requisitos de la Cadena de Suministro versión 1.1', NULL, '2025-03-05 01:47:49', '2025-03-05 01:47:49', 1, 'OTRO', NULL),
(47, 'Rainforest Alliance: Estándar para la Agricultura Sostenible de Rainforest Alliance. Requisitos para Fincas 2020 versión 1.1', NULL, '2025-03-05 01:48:25', '2025-03-05 01:48:25', 1, 'OTRO', NULL),
(48, 'RSPO Estándar de Certificación de cadena de suministro 2020', NULL, '2025-03-05 01:48:33', '2025-03-05 01:48:33', 1, 'OTRO', NULL),
(49, 'RSPO Principios y Criterios para la producción de aceite de palma sostenible 2018', NULL, '2025-03-05 01:48:42', '2025-03-05 01:48:42', 1, 'OTRO', NULL),
(50, 'SQF -Food Safety Code for Primary Production -Food Safety Code for Manufacture of Food Packaging', NULL, '2025-03-05 01:48:51', '2025-03-05 01:48:51', 1, 'OTRO', NULL),
(51, '4C Certification Código de Conducta 4C', NULL, '2025-03-05 01:49:02', '2025-03-05 01:49:02', 1, 'OTRO', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `available_certifications_nombre_unique` (`nombre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
