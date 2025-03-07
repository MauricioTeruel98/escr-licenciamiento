-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-03-2025 a las 18:47:57
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
-- Estructura de tabla para la tabla `auto_evaluation_result`
--

CREATE TABLE `auto_evaluation_result` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `nota` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'pendiente',
  `fecha_aprobacion` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `application_sended` tinyint(1) NOT NULL DEFAULT 0,
  `form_sended` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auto_evaluation_result`
--

INSERT INTO `auto_evaluation_result` (`id`, `company_id`, `nota`, `status`, `fecha_aprobacion`, `created_at`, `updated_at`, `application_sended`, `form_sended`) VALUES
(34, 25, 0, 'apto', '2025-03-06 20:56:21', '2025-03-06 20:56:07', '2025-03-06 20:56:21', 1, 0),
(35, 26, 0, 'apto', '2025-03-06 22:07:15', '2025-03-06 22:05:02', '2025-03-06 22:07:15', 1, 1),
(36, 27, 0, 'apto', '2025-03-06 22:35:07', '2025-03-06 22:34:51', '2025-03-06 22:35:07', 1, 1),
(37, 28, 0, 'apto', '2025-03-06 22:43:50', '2025-03-06 22:43:28', '2025-03-06 22:43:50', 1, 1),
(38, 29, 0, 'apto', '2025-03-06 23:04:01', '2025-03-06 23:03:44', '2025-03-06 23:04:01', 1, 1),
(39, 30, 0, 'apto', NULL, '2025-03-06 23:29:41', '2025-03-06 23:30:00', 1, 1),
(40, 31, 0, 'apto', '2025-03-06 23:47:23', '2025-03-06 23:47:06', '2025-03-06 23:47:23', 1, 1),
(42, 32, 0, 'apto', '2025-03-07 01:42:42', '2025-03-07 01:42:28', '2025-03-07 01:42:42', 1, 1),
(43, 33, 0, 'apto', '2025-03-07 01:45:53', '2025-03-07 01:45:38', '2025-03-07 01:45:53', 0, 0),
(44, 35, 0, 'apto', '2025-03-07 18:10:42', '2025-03-07 18:10:27', '2025-03-07 18:10:42', 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auto_evaluation_subcategory_result`
--

CREATE TABLE `auto_evaluation_subcategory_result` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_id` bigint(20) UNSIGNED NOT NULL,
  `nota` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `fecha_evaluacion` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auto_evaluation_subcategory_result`
--

INSERT INTO `auto_evaluation_subcategory_result` (`id`, `company_id`, `value_id`, `subcategory_id`, `nota`, `fecha_evaluacion`, `created_at`, `updated_at`) VALUES
(403, 32, 31, 53, 100, '2025-03-07 01:42:28', '2025-03-07 01:42:28', '2025-03-07 01:42:28'),
(404, 32, 31, 54, 67, '2025-03-07 01:42:28', '2025-03-07 01:42:28', '2025-03-07 01:42:28'),
(405, 32, 31, 55, 100, '2025-03-07 01:42:28', '2025-03-07 01:42:28', '2025-03-07 01:42:28'),
(406, 32, 32, 56, 100, '2025-03-07 01:42:37', '2025-03-07 01:42:37', '2025-03-07 01:42:37'),
(407, 32, 32, 57, 50, '2025-03-07 01:42:37', '2025-03-07 01:42:37', '2025-03-07 01:42:37'),
(408, 32, 32, 58, 100, '2025-03-07 01:42:37', '2025-03-07 01:42:37', '2025-03-07 01:42:37'),
(409, 32, 33, 59, 100, '2025-03-07 01:42:42', '2025-03-07 01:42:42', '2025-03-07 01:42:42'),
(410, 32, 33, 60, 100, '2025-03-07 01:42:42', '2025-03-07 01:42:42', '2025-03-07 01:42:42'),
(411, 33, 31, 53, 100, '2025-03-07 01:45:38', '2025-03-07 01:45:38', '2025-03-07 01:45:38'),
(412, 33, 31, 54, 67, '2025-03-07 01:45:38', '2025-03-07 01:45:38', '2025-03-07 01:45:38'),
(413, 33, 31, 55, 100, '2025-03-07 01:45:38', '2025-03-07 01:45:38', '2025-03-07 01:45:38'),
(414, 33, 32, 56, 100, '2025-03-07 01:45:46', '2025-03-07 01:45:46', '2025-03-07 01:45:46'),
(415, 33, 32, 57, 50, '2025-03-07 01:45:46', '2025-03-07 01:45:46', '2025-03-07 01:45:46'),
(416, 33, 32, 58, 100, '2025-03-07 01:45:46', '2025-03-07 01:45:46', '2025-03-07 01:45:46'),
(417, 33, 33, 59, 100, '2025-03-07 01:45:53', '2025-03-07 01:45:53', '2025-03-07 01:45:53'),
(418, 33, 33, 60, 100, '2025-03-07 01:45:53', '2025-03-07 01:45:53', '2025-03-07 01:45:53'),
(419, 35, 31, 53, 100, '2025-03-07 18:10:27', '2025-03-07 18:10:27', '2025-03-07 18:10:27'),
(420, 35, 31, 54, 67, '2025-03-07 18:10:27', '2025-03-07 18:10:27', '2025-03-07 18:10:27'),
(421, 35, 31, 55, 50, '2025-03-07 18:10:27', '2025-03-07 18:10:27', '2025-03-07 18:10:27'),
(422, 35, 32, 58, 100, '2025-03-07 18:10:36', '2025-03-07 18:10:36', '2025-03-07 18:10:36'),
(423, 35, 32, 56, 100, '2025-03-07 18:10:36', '2025-03-07 18:10:36', '2025-03-07 18:10:36'),
(424, 35, 32, 57, 50, '2025-03-07 18:10:36', '2025-03-07 18:10:36', '2025-03-07 18:10:36'),
(425, 35, 33, 59, 100, '2025-03-07 18:10:42', '2025-03-07 18:10:42', '2025-03-07 18:10:42'),
(426, 35, 33, 60, 100, '2025-03-07 18:10:42', '2025-03-07 18:10:42', '2025-03-07 18:10:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auto_evaluation_valor_result`
--

CREATE TABLE `auto_evaluation_valor_result` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_id` bigint(20) UNSIGNED DEFAULT NULL,
  `nota` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `fecha_evaluacion` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auto_evaluation_valor_result`
--

INSERT INTO `auto_evaluation_valor_result` (`id`, `company_id`, `value_id`, `subcategory_id`, `nota`, `fecha_evaluacion`, `created_at`, `updated_at`) VALUES
(170, 32, 31, NULL, 89, '2025-03-07 01:42:28', '2025-03-07 01:42:28', '2025-03-07 01:42:28'),
(171, 32, 32, NULL, 83, '2025-03-07 01:42:37', '2025-03-07 01:42:37', '2025-03-07 01:42:37'),
(172, 32, 33, NULL, 100, '2025-03-07 01:42:42', '2025-03-07 01:42:42', '2025-03-07 01:42:42'),
(173, 33, 31, NULL, 89, '2025-03-07 01:45:38', '2025-03-07 01:45:38', '2025-03-07 01:45:38'),
(174, 33, 32, NULL, 83, '2025-03-07 01:45:46', '2025-03-07 01:45:46', '2025-03-07 01:45:46'),
(175, 33, 33, NULL, 100, '2025-03-07 01:45:53', '2025-03-07 01:45:53', '2025-03-07 01:45:53'),
(176, 35, 31, NULL, 72, '2025-03-07 18:10:27', '2025-03-07 18:10:27', '2025-03-07 18:10:27'),
(177, 35, 32, NULL, 83, '2025-03-07 18:10:36', '2025-03-07 18:10:36', '2025-03-07 18:10:36'),
(178, 35, 33, NULL, 100, '2025-03-07 18:10:42', '2025-03-07 18:10:42', '2025-03-07 18:10:42');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('notifications_sent_30_33', 'b:1;', 1741336801),
('notifications_sent_31_31_evaluacion-completada', 'b:1;', 1741337504),
('notifications_sent_31_33', 'b:1;', 1741337409),
('notifications_sent_31_33_evaluado', 'b:1;', 1741337727);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `certifications`
--

CREATE TABLE `certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fecha_obtencion` date NOT NULL,
  `fecha_expiracion` date NOT NULL,
  `indicadores` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `homologation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `organismo_certificador` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `certifications`
--

INSERT INTO `certifications` (`id`, `company_id`, `nombre`, `fecha_obtencion`, `fecha_expiracion`, `indicadores`, `created_at`, `updated_at`, `homologation_id`, `organismo_certificador`) VALUES
(46, 32, 'ISO 9001', '2025-02-26', '2025-03-28', 23, '2025-03-07 01:18:56', '2025-03-07 01:18:56', 5, 'ISO'),
(47, 27, 'ISO 9001', '2025-02-27', '2025-03-22', 3, '2025-03-07 17:40:31', '2025-03-07 17:40:31', 5, 'ISO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `legal_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `website` varchar(255) NOT NULL,
  `sector` varchar(255) NOT NULL,
  `provincia` varchar(255) NOT NULL,
  `commercial_activity` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `is_exporter` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `authorized` tinyint(1) NOT NULL DEFAULT 0,
  `autoeval_ended` tinyint(1) NOT NULL DEFAULT 0,
  `estado_eval` enum('auto-evaluacion','auto-evaluacion-completed','evaluacion-pendiente','evaluacion','evaluacion-completada','evaluado') NOT NULL DEFAULT 'auto-evaluacion',
  `canton` varchar(255) DEFAULT NULL,
  `distrito` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `legal_id`, `name`, `website`, `sector`, `provincia`, `commercial_activity`, `phone`, `mobile`, `is_exporter`, `created_at`, `updated_at`, `status`, `authorized`, `autoeval_ended`, `estado_eval`, `canton`, `distrito`) VALUES
(7, '123456789', 'Buzz', 'https://buzz.cr', 'Agricultura', 'san-jose', 'Servicios', '11111111111', '641656', 1, '2024-11-15 01:01:15', '2025-03-04 21:34:28', 'active', 1, 1, 'evaluacion-pendiente', NULL, NULL),
(9, '987654321', 'Prueba', 'https://localhost.com.ar', 'Manufactura', 'Heredia', 'Productora Agropecuaria', '9234875000000', '20385700000', 1, '2024-11-15 01:34:14', '2024-11-15 02:01:47', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(10, '34534534', '5sdfgsdg', 'https://localhost', 'Ag', 'sda', 'dasdas', '12341234', '234234', 1, '2025-01-17 01:18:10', '2025-01-17 01:18:10', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(11, '1140502996', 'Aprobado', 'https://buzz.cr/', 'tecnologia', 'san-jose', 'AGRICOLA', '111122334455', '1122776182', 1, '2025-01-17 22:01:43', '2025-01-17 22:01:43', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(12, '1140502995', 'Buzz_Prueba2', 'https://buzz.cr/', 'tecnologia', 'san-jose', 'Mkt', '111122334455', '1122776182', 1, '2025-01-22 21:38:12', '2025-01-22 21:38:12', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(13, '41125546', 'Buzz_Prueba', 'https://buzz.cr/', 'tecnologia', 'san-jose', 'Mkt', '111122334455', '1122776182', 1, '2025-01-27 19:54:05', '2025-01-27 19:54:05', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(14, 'PROCOMER', 'PROCOMER', 'https://www.procomer.com/', 'turismo', 'san-jose', 'Promotora', '25054648', '25054648', 1, '2025-02-21 15:31:11', '2025-02-21 15:31:11', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(15, 'No existe control en la cantidad', 'procomer', 'https://licenciamiento.esencialcostarica.com', 'tecnologia', 'san-jose', 'comercio exteridor', '999000dd', '000999dd', 0, '2025-02-26 14:34:20', '2025-02-28 15:01:49', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(16, '999999999', 'colombiana de telecomunicaciaones', 'https://abec.com', 'tecnologia', 'alajuela', 'actividad comercial', '7890\'5678', '4567890d', 1, '2025-02-26 19:10:23', '2025-03-04 15:22:29', 'active', 1, 0, 'evaluacion-pendiente', NULL, NULL),
(17, '1098634667', 'COCA COLA', 'https://www.coca-cola.com/co/es', 'Servicios', 'Limón', 'actividad comercial', '6592121', '3213213233', 1, '2025-03-03 14:17:05', '2025-03-05 21:29:03', 'active', 1, 0, 'evaluacion-pendiente', NULL, NULL),
(18, '30208132', 'postobon sa', 'https://postobon.com', 'alimentos', 'Puntarenas', 'actividad comercial postobon', '123456789789', '123145646746', 1, '2025-03-03 20:37:50', '2025-03-03 20:37:50', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(19, '1234567890', 'Vanti sa', 'https://vanti.com', 'agricola', 'Cartago', 'actividad comercial', '123456789123', '123456789', 1, '2025-03-04 17:36:14', '2025-03-06 17:15:21', 'active', 1, 1, 'evaluacion-completada', 'El Guarco', 'Tobosi'),
(20, '1095906617', 'ALPINA', 'https://ALPINA.COM.CO', 'alimentos', 'Cartago', 'actividad comercial', '321321312', '32132132131', 1, '2025-03-04 20:06:48', '2025-03-04 20:17:18', 'active', 0, 1, 'evaluacion-pendiente', NULL, NULL),
(21, '0000123654', 'Prueba', 'https://prueba.com', 'industria-especializada', 'Cartago', 'Servicios', '3423423', '4234234', 1, '2025-03-05 14:23:15', '2025-03-05 14:28:16', 'active', 1, 1, 'evaluacion', NULL, NULL),
(22, '30208555', 'Empresa', 'https://babaria.com.co', 'alimentos', 'Heredia', 'actividad comercial', 'dfsdfsdfsfs', 'dfsadfdsfsdafsdf', 1, '2025-03-05 19:30:08', '2025-03-06 17:33:50', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(23, '1098634660', 'Sena sas', 'https://senasas.com', 'servicios', 'Cartago', 'actividad comercial', '22222222', '22222222', 1, '2025-03-05 22:12:38', '2025-03-05 22:15:29', 'active', 0, 1, 'auto-evaluacion-completed', NULL, NULL),
(24, '1065161641', 'Ficticio', 'https://ficticio.com', 'alimentos', 'Cartago', 'Servicios', '234234', '234234', 1, '2025-03-06 17:53:15', '2025-03-06 19:41:14', 'active', 1, 1, 'evaluacion-completada', 'El Guarco', 'San Isidro'),
(25, '4234523524', 'Ficticio 2', 'https://ficticio2.com', 'alimentos', 'Alajuela', 'Aeroespacial', '2435234', '23523', 1, '2025-03-06 19:44:06', '2025-03-06 22:03:24', 'active', 1, 1, 'evaluacion-completada', 'Atenas', 'San Isidro'),
(26, '4563456456', 'Ficticio 3', 'https://ficti.com', 'alimentos', 'Cartago', 'Servicios', '132423423', '423423', 1, '2025-03-06 22:04:46', '2025-03-06 22:40:20', 'active', 1, 1, 'evaluacion', 'El Guarco', 'San Isidro'),
(27, '4353453453', 'Ficticio 4', 'https://ficticio.com', 'alimentos', 'Cartago', 'Servicios', '3815582223', '3815582223', 1, '2025-03-06 22:34:38', '2025-03-06 23:00:14', 'active', 1, 1, 'evaluacion-completada', 'Jiménez', 'Pejibaye'),
(28, '9489451756', 'Ficticio 5', 'https://srggf', 'alimentos', 'Alajuela', 'Aeroespacial', '41511651911', '3815582223', 1, '2025-03-06 22:43:12', '2025-03-06 22:51:45', 'active', 1, 1, 'evaluado', 'Zarcero', 'Tapezco'),
(29, '234234234', 'Ficticio 6', 'https://shdfgvoujihj', 'alimentos', 'Alajuela', 'Servicios', '34234', '23423', 1, '2025-03-06 23:03:30', '2025-03-06 23:07:59', 'active', 1, 1, 'evaluado', 'Atenas', 'San Isidro'),
(30, '4123423423', 'Ficticio 7', 'https://jhiupij', 'alimentos', 'Cartago', 'Servicios', '34234', '2342', 1, '2025-03-06 23:29:26', '2025-03-07 00:25:50', 'active', 1, 1, 'evaluacion-pendiente', 'Cartago', 'Carmen'),
(31, '9544165415', 'Ficticio 8', 'https://ujrfgj', 'alimentos', 'Alajuela', 'Aeroespacial', '34234', '12342342', 1, '2025-03-06 23:46:03', '2025-03-06 23:55:27', 'active', 1, 1, 'evaluado', 'Zarcero', 'Tapezco'),
(32, '4114146149', 'Ficticio', 'https://srgsfdg', 'alimentos', 'Alajuela', 'Servicios', '231423423', '423423', 1, '2025-03-07 01:18:35', '2025-03-07 01:43:48', 'active', 1, 1, 'evaluacion', 'Grecia', 'San Roque'),
(33, '3423523523', 'Ficticio', 'https://gsdgsdg', 'alimentos', 'Alajuela', 'Servicios', '43534534', '53453', 1, '2025-03-07 01:45:15', '2025-03-07 01:45:58', 'active', 0, 1, 'auto-evaluacion-completed', NULL, NULL),
(34, '2345234523', 'Ficticio 11', 'https://srgsfd', 'alimentos', 'Cartago', 'Aeroespacial', '342345234', '2342342', 1, '2025-03-07 03:29:01', '2025-03-07 03:29:01', 'active', 0, 0, 'auto-evaluacion', NULL, NULL),
(35, '000000252', 'Ficticio 12', 'https://srfgsfd', 'agricola', 'Limón', 'Servicios', '4234234', '234234', 1, '2025-03-07 18:10:10', '2025-03-07 19:42:44', 'active', 1, 0, 'evaluacion', 'Limón', 'Limón');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `company_evaluator`
--

CREATE TABLE `company_evaluator` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `company_evaluator`
--

INSERT INTO `company_evaluator` (`id`, `company_id`, `user_id`, `created_at`, `updated_at`) VALUES
(27, 12, 67, '2025-03-04 21:18:46', '2025-03-04 21:18:46'),
(28, 13, 67, '2025-03-04 21:18:46', '2025-03-04 21:18:46'),
(29, 7, 67, '2025-03-04 21:18:46', '2025-03-04 21:18:46'),
(36, 9, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(37, 14, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(38, 15, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(39, 16, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(40, 17, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(41, 19, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(42, 20, 78, '2025-03-04 22:32:37', '2025-03-04 22:32:37'),
(185, 7, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(186, 9, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(187, 11, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(188, 12, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(189, 13, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(190, 14, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(191, 15, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(192, 16, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(193, 17, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(194, 18, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(195, 19, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(196, 20, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(197, 21, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(198, 22, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(199, 23, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(200, 24, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(201, 25, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(202, 26, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(203, 27, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(204, 28, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(205, 29, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(206, 30, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47'),
(207, 31, 42, '2025-03-06 23:46:47', '2025-03-06 23:46:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `company_products`
--

CREATE TABLE `company_products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `info_adicional_empresa_id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `company_products`
--

INSERT INTO `company_products` (`id`, `company_id`, `info_adicional_empresa_id`, `nombre`, `descripcion`, `imagen`, `created_at`, `updated_at`) VALUES
(60, 35, 23, 'aaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'empresas/35/productos/r9gW4ULTcsyqLQzsTLkKvyDt1R5H0pJ2TcNBVwL0.jpg', '2025-03-07 19:23:56', '2025-03-07 19:23:56'),
(61, 35, 24, 'aaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 'empresas/35/productos/1741365533_STScI-01JCGZ1VJG6W74BWTQA2GFFZCP.png', '2025-03-07 19:38:53', '2025-03-07 19:38:53'),
(62, 35, 24, 'aaaaaaaaaavvvvvvvvvvvvvvvvvvvvvvvvv', 'aaaaaaaaaaaaaaaaavvvvvvvvvvvvvv', 'empresas/35/productos/1741365533_STScI-01JCGZ1VJG6W74BWTQA2GFFZCP.png', '2025-03-07 19:41:12', '2025-03-07 19:41:12'),
(63, 35, 24, 'aaaaaaaaaabbbbbbbbbbbbbbbbb', 'aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbb', 'empresas/35/productos/1741365533_STScI-01JCGZ1VJG6W74BWTQA2GFFZCP.png', '2025-03-07 19:41:55', '2025-03-07 19:41:55');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluation_questions`
--

CREATE TABLE `evaluation_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `indicator_id` bigint(20) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_binary` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluation_questions`
--

INSERT INTO `evaluation_questions` (`id`, `indicator_id`, `question`, `created_at`, `updated_at`, `is_binary`) VALUES
(433, 145, 'AAA', '2025-03-06 19:22:43', '2025-03-06 19:22:43', 1),
(434, 145, 'AAA', '2025-03-06 19:22:43', '2025-03-06 19:22:43', 1),
(435, 146, 'AAAA', '2025-03-06 19:22:59', '2025-03-06 19:22:59', 1),
(436, 147, 'EEEEEEE', '2025-03-06 19:23:53', '2025-03-06 19:23:53', 1),
(437, 148, 'EEEEEE', '2025-03-06 19:24:07', '2025-03-06 19:24:07', 1),
(439, 150, 'EEEEEEEEEE', '2025-03-06 19:24:49', '2025-03-06 19:24:49', 1),
(440, 151, 'QQQQQQ', '2025-03-06 19:25:07', '2025-03-06 19:25:07', 1),
(441, 151, 'QQQQQQ', '2025-03-06 19:25:07', '2025-03-06 19:25:07', 1),
(442, 152, 'AAAAAAAAAAAA', '2025-03-06 19:25:23', '2025-03-06 19:25:23', 1),
(443, 153, 'QQQQQQQQQQQQQ', '2025-03-06 19:25:36', '2025-03-06 19:25:36', 1),
(448, 149, 'aaaaaaaa', '2025-03-06 22:58:45', '2025-03-06 22:58:45', 1),
(453, 156, 'AAAAAAAAAAAA', '2025-03-07 01:20:13', '2025-03-07 02:51:49', 1),
(454, 156, 'AAAAAAA', '2025-03-07 01:20:13', '2025-03-07 02:51:49', 1),
(455, 155, 'AAAAA', '2025-03-07 01:20:25', '2025-03-07 01:20:25', 1),
(458, 154, 'WWWWW', '2025-03-07 01:48:10', '2025-03-07 01:48:10', 1),
(459, 154, 't3453', '2025-03-07 01:48:10', '2025-03-07 01:48:10', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluation_value_results`
--

CREATE TABLE `evaluation_value_results` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `nota` int(11) NOT NULL,
  `fecha_evaluacion` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluation_value_results`
--

INSERT INTO `evaluation_value_results` (`id`, `company_id`, `value_id`, `nota`, `fecha_evaluacion`, `created_at`, `updated_at`) VALUES
(23, 25, 31, 67, '2025-03-06', '2025-03-06 21:48:01', '2025-03-06 22:02:37'),
(24, 25, 32, 80, '2025-03-06', '2025-03-06 21:48:23', '2025-03-06 21:57:36'),
(25, 25, 33, 67, '2025-03-06', '2025-03-06 21:48:42', '2025-03-06 21:56:42'),
(26, 26, 31, 100, '2025-03-06', '2025-03-06 22:39:29', '2025-03-06 22:39:43'),
(27, 26, 33, 100, '2025-03-06', '2025-03-06 22:39:50', '2025-03-06 22:41:07'),
(28, 26, 32, 60, '2025-03-06', '2025-03-06 22:40:07', '2025-03-06 22:41:26'),
(29, 28, 31, 100, '2025-03-06', '2025-03-06 22:50:19', '2025-03-06 22:50:40'),
(30, 28, 33, 100, '2025-03-06', '2025-03-06 22:51:00', '2025-03-06 22:51:07'),
(31, 28, 32, 100, '2025-03-06', '2025-03-06 22:51:29', '2025-03-06 22:51:39'),
(32, 27, 31, 80, '2025-03-06', '2025-03-06 22:55:10', '2025-03-06 23:00:48'),
(33, 27, 32, 100, '2025-03-06', '2025-03-06 22:55:30', '2025-03-06 23:01:52'),
(34, 27, 33, 100, '2025-03-06', '2025-03-06 22:55:50', '2025-03-06 22:55:56'),
(35, 29, 31, 100, '2025-03-06', '2025-03-06 23:07:13', '2025-03-06 23:07:25'),
(36, 29, 32, 100, '2025-03-06', '2025-03-06 23:07:31', '2025-03-06 23:20:38'),
(37, 29, 33, 100, '2025-03-06', '2025-03-06 23:07:52', '2025-03-06 23:08:24'),
(38, 30, 31, 50, '2025-03-06', '2025-03-06 23:35:49', '2025-03-06 23:35:57'),
(39, 30, 32, 75, '2025-03-06', '2025-03-06 23:36:04', '2025-03-06 23:36:16'),
(40, 30, 33, 100, '2025-03-06', '2025-03-06 23:36:21', '2025-03-06 23:40:02'),
(41, 31, 31, 100, '2025-03-06', '2025-03-06 23:54:36', '2025-03-06 23:54:48'),
(42, 31, 32, 100, '2025-03-06', '2025-03-06 23:54:57', '2025-03-06 23:55:07'),
(43, 31, 33, 100, '2025-03-06', '2025-03-06 23:55:13', '2025-03-06 23:55:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluation_value_result_reference`
--

CREATE TABLE `evaluation_value_result_reference` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `value_completed` tinyint(1) NOT NULL DEFAULT 0,
  `fecha_completado` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluator_assessments`
--

CREATE TABLE `evaluator_assessments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `evaluation_question_id` bigint(20) UNSIGNED NOT NULL,
  `indicator_id` bigint(20) UNSIGNED NOT NULL,
  `approved` tinyint(1) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluator_assessments`
--

INSERT INTO `evaluator_assessments` (`id`, `company_id`, `user_id`, `evaluation_question_id`, `indicator_id`, `approved`, `comment`, `created_at`, `updated_at`) VALUES
(171, 25, 42, 433, 145, 1, 'aaaaaaaaa', '2025-03-06 21:48:01', '2025-03-06 21:48:01'),
(172, 25, 42, 434, 145, 0, 'aaaa', '2025-03-06 21:48:01', '2025-03-06 21:48:01'),
(173, 25, 42, 435, 146, 0, 'aaaa', '2025-03-06 21:48:08', '2025-03-06 21:48:08'),
(174, 25, 42, 436, 147, 1, 'aaaaaaa', '2025-03-06 21:48:09', '2025-03-06 21:48:09'),
(175, 25, 42, 437, 148, 1, 'aaaaaaaaaa', '2025-03-06 21:48:09', '2025-03-06 21:48:09'),
(176, 25, 42, 439, 150, 1, 'aaaaaaaaa', '2025-03-06 21:48:16', '2025-03-06 21:48:16'),
(177, 25, 42, 440, 151, 1, 'aaaaaaaa', '2025-03-06 21:48:23', '2025-03-06 21:48:23'),
(178, 25, 42, 441, 151, 1, 'aaaaaaa', '2025-03-06 21:48:23', '2025-03-06 21:48:23'),
(179, 25, 42, 442, 152, 0, 'aaaaaaaaa', '2025-03-06 21:48:28', '2025-03-06 21:48:28'),
(180, 25, 42, 443, 153, 1, 'aaaaaaaa', '2025-03-06 21:48:29', '2025-03-06 21:48:29'),
(181, 25, 42, 444, 154, 1, 'aaaaaaaaaaa', '2025-03-06 21:48:35', '2025-03-06 21:48:35'),
(182, 25, 42, 445, 155, 1, 'aaaaaaaaaaa', '2025-03-06 21:48:42', '2025-03-06 21:48:42'),
(183, 25, 42, 446, 156, 1, 'aaaaaaaaa', '2025-03-06 21:48:50', '2025-03-06 21:48:50'),
(184, 25, 42, 447, 156, 0, 'aaaaaa', '2025-03-06 21:48:50', '2025-03-06 21:48:50'),
(185, 26, 42, 433, 145, 1, 'aaaaaaaaaa', '2025-03-06 22:39:29', '2025-03-06 22:39:29'),
(186, 26, 42, 434, 145, 1, 'aaaaaaaaaaa', '2025-03-06 22:39:29', '2025-03-06 22:39:29'),
(187, 26, 42, 435, 146, 1, 'aaaaaaaaaaa', '2025-03-06 22:39:35', '2025-03-06 22:39:35'),
(188, 26, 42, 436, 147, 1, 'aaaaaaaaaa', '2025-03-06 22:39:36', '2025-03-06 22:39:36'),
(189, 26, 42, 439, 150, 1, 'aaaaaaaaaaaa', '2025-03-06 22:39:43', '2025-03-06 22:39:43'),
(190, 26, 42, 445, 155, 1, 'aaaaaaaaaaaa', '2025-03-06 22:39:50', '2025-03-06 22:39:50'),
(191, 26, 42, 446, 156, 1, 'aaaaaaaaaaaaaa', '2025-03-06 22:39:56', '2025-03-06 22:39:56'),
(192, 26, 42, 447, 156, 1, 'aaaaaaaaaaaaa', '2025-03-06 22:39:56', '2025-03-06 22:39:56'),
(193, 26, 42, 440, 151, 1, 'aaaaaaaaaaa', '2025-03-06 22:40:07', '2025-03-06 22:40:07'),
(194, 26, 42, 441, 151, 1, 'aaaaaaaaaaaa', '2025-03-06 22:40:07', '2025-03-06 22:41:26'),
(195, 26, 42, 442, 152, 1, 'aaaaaaaaaaa', '2025-03-06 22:40:12', '2025-03-06 22:40:12'),
(196, 26, 42, 443, 153, 0, NULL, '2025-03-06 22:40:12', '2025-03-06 22:40:12'),
(197, 26, 42, 444, 154, 0, 'aaaaaaaaaaaaa', '2025-03-06 22:40:20', '2025-03-06 22:40:20'),
(198, 28, 42, 433, 145, 1, 'aaaaaaaaaaaa', '2025-03-06 22:50:19', '2025-03-06 22:50:19'),
(199, 28, 42, 434, 145, 1, 'aaaaaaaaaaaa', '2025-03-06 22:50:19', '2025-03-06 22:50:19'),
(200, 28, 42, 435, 146, 1, 'aaaaaaaaaa', '2025-03-06 22:50:24', '2025-03-06 22:50:24'),
(201, 28, 42, 436, 147, 1, 'aaaaaaaaaaa', '2025-03-06 22:50:25', '2025-03-06 22:50:25'),
(202, 28, 42, 439, 150, 1, 'aaaaaaaaaaa', '2025-03-06 22:50:40', '2025-03-06 22:50:40'),
(203, 28, 42, 445, 155, 1, 'aaaaaaaaaaaa', '2025-03-06 22:51:00', '2025-03-06 22:51:00'),
(204, 28, 42, 446, 156, 1, 'aaaaaaaaaaaaa', '2025-03-06 22:51:07', '2025-03-06 22:51:07'),
(205, 28, 42, 447, 156, 1, 'aaaaaaaaaaaa', '2025-03-06 22:51:07', '2025-03-06 22:51:07'),
(206, 28, 42, 440, 151, 1, 'aaaaaaa', '2025-03-06 22:51:29', '2025-03-06 22:51:29'),
(207, 28, 42, 441, 151, 1, 'aaaaaaaaaaaa', '2025-03-06 22:51:29', '2025-03-06 22:51:29'),
(208, 28, 42, 442, 152, 1, 'aaaaaaaaaaaaa', '2025-03-06 22:51:33', '2025-03-06 22:51:33'),
(209, 28, 42, 444, 154, 1, 'aaaaaaaaaaaaa', '2025-03-06 22:51:39', '2025-03-06 22:51:39'),
(210, 27, 42, 433, 145, 0, 'aaaaaa', '2025-03-06 22:55:10', '2025-03-06 22:55:10'),
(211, 27, 42, 434, 145, 1, 'aaaaaaaaaa', '2025-03-06 22:55:10', '2025-03-06 22:55:10'),
(212, 27, 42, 435, 146, 1, 'aaaaaaaaaaaaa', '2025-03-06 22:55:18', '2025-03-06 22:55:18'),
(213, 27, 42, 437, 148, 1, 'aaaaaaaaaaaaaa', '2025-03-06 22:55:19', '2025-03-06 22:55:19'),
(214, 27, 42, 440, 151, 1, 'aaaaaaaaaa', '2025-03-06 22:55:30', '2025-03-06 22:55:30'),
(215, 27, 42, 441, 151, 1, 'aaaaaaaaa', '2025-03-06 22:55:30', '2025-03-06 22:55:30'),
(216, 27, 42, 442, 152, 1, 'aaaaaaaaaa', '2025-03-06 22:55:38', '2025-03-06 22:55:38'),
(217, 27, 42, 443, 153, 1, 'aaaaaaaaaaaa', '2025-03-06 22:55:39', '2025-03-06 22:55:39'),
(218, 27, 42, 444, 154, 1, 'aaaaaaaaaaaaa', '2025-03-06 22:55:45', '2025-03-06 22:55:45'),
(219, 27, 42, 445, 155, 1, 'aaaaaaaaaaaaaa', '2025-03-06 22:55:50', '2025-03-06 22:55:50'),
(222, 27, 42, 448, 149, 1, NULL, '2025-03-06 23:00:48', '2025-03-06 23:00:48'),
(223, 29, 42, 433, 145, 1, 'aaaaaaaaaaaaaa', '2025-03-06 23:07:13', '2025-03-06 23:07:13'),
(224, 29, 42, 434, 145, 1, 'aaaaaaaaaaaaaa', '2025-03-06 23:07:13', '2025-03-06 23:07:13'),
(225, 29, 42, 435, 146, 1, 'aaaaaaaa', '2025-03-06 23:07:19', '2025-03-06 23:07:19'),
(226, 29, 42, 436, 147, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:07:19', '2025-03-06 23:07:19'),
(227, 29, 42, 448, 149, 1, 'aaaaaaaaaaaaaa', '2025-03-06 23:07:25', '2025-03-06 23:07:25'),
(228, 29, 42, 440, 151, 1, 'aaaaaaaaaaa', '2025-03-06 23:07:31', '2025-03-06 23:07:31'),
(229, 29, 42, 441, 151, 1, 'aaaaaaaaaa', '2025-03-06 23:07:31', '2025-03-06 23:07:31'),
(230, 29, 42, 442, 152, 1, 'aaaaaaaaaaaaaa', '2025-03-06 23:07:37', '2025-03-06 23:07:37'),
(231, 29, 42, 444, 154, 1, 'aaaaaaaaaa', '2025-03-06 23:07:42', '2025-03-06 23:07:42'),
(232, 29, 42, 445, 155, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:07:52', '2025-03-06 23:07:52'),
(233, 29, 42, 446, 156, 1, 'aaaaaaaaa', '2025-03-06 23:07:59', '2025-03-06 23:07:59'),
(234, 29, 42, 447, 156, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:07:59', '2025-03-06 23:07:59'),
(235, 30, 42, 433, 145, 1, 'aaaaaaaaa', '2025-03-06 23:35:49', '2025-03-06 23:35:49'),
(236, 30, 42, 434, 145, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:35:49', '2025-03-06 23:35:49'),
(237, 30, 42, 435, 146, 0, 'ddddddddddd', '2025-03-06 23:35:52', '2025-03-06 23:35:52'),
(238, 30, 42, 448, 149, 0, 'dddddddddddd', '2025-03-06 23:35:57', '2025-03-06 23:35:57'),
(239, 30, 42, 440, 151, 1, 'ddddddddddd', '2025-03-06 23:36:04', '2025-03-06 23:36:04'),
(240, 30, 42, 441, 151, 1, 'ddddddddddd', '2025-03-06 23:36:04', '2025-03-06 23:36:04'),
(241, 30, 42, 442, 152, 0, 'ddddddddddd', '2025-03-06 23:36:08', '2025-03-06 23:36:08'),
(242, 30, 42, 444, 154, 1, 'aaaaaaaaaa', '2025-03-06 23:36:16', '2025-03-06 23:36:16'),
(243, 30, 42, 445, 155, 1, 'aaaaaaaaaaa', '2025-03-06 23:36:21', '2025-03-06 23:36:21'),
(244, 30, 42, 446, 156, 1, 'ddddddddd', '2025-03-06 23:36:30', '2025-03-06 23:36:30'),
(245, 30, 42, 447, 156, 1, 'dddddddddddd', '2025-03-06 23:36:30', '2025-03-06 23:36:30'),
(246, 31, 42, 433, 145, 1, 'aaaaaaaa', '2025-03-06 23:54:36', '2025-03-06 23:54:36'),
(247, 31, 42, 434, 145, 1, 'aaaaaaaaaaa', '2025-03-06 23:54:36', '2025-03-06 23:54:36'),
(248, 31, 42, 435, 146, 1, 'aaaaaa', '2025-03-06 23:54:42', '2025-03-06 23:54:42'),
(249, 31, 42, 436, 147, 1, 'aaaaaaaaa', '2025-03-06 23:54:42', '2025-03-06 23:54:42'),
(250, 31, 42, 448, 149, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:54:48', '2025-03-06 23:54:48'),
(251, 31, 42, 440, 151, 1, 'aaaaaaaaaaaa', '2025-03-06 23:54:57', '2025-03-06 23:54:57'),
(252, 31, 42, 441, 151, 1, 'aaaaaaaaaaaa', '2025-03-06 23:54:57', '2025-03-06 23:54:57'),
(253, 31, 42, 442, 152, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:55:01', '2025-03-06 23:55:01'),
(254, 31, 42, 444, 154, 1, 'aaaaaaaaaaaaaa', '2025-03-06 23:55:07', '2025-03-06 23:55:07'),
(255, 31, 42, 445, 155, 1, 'aaaaaaaaaaaaa', '2025-03-06 23:55:13', '2025-03-06 23:55:13'),
(256, 31, 42, 446, 156, 1, 'aaaaaaaaaaa', '2025-03-06 23:55:22', '2025-03-06 23:55:22'),
(257, 31, 42, 447, 156, 1, 'aaaaaaaaaaa', '2025-03-06 23:55:22', '2025-03-06 23:55:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicators`
--

CREATE TABLE `indicators` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `binding` tinyint(1) NOT NULL,
  `self_evaluation_question` text DEFAULT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_id` bigint(20) UNSIGNED NOT NULL,
  `evaluation_questions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `guide` text DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `requisito_id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_binary` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `indicators`
--

INSERT INTO `indicators` (`id`, `name`, `binding`, `self_evaluation_question`, `value_id`, `subcategory_id`, `evaluation_questions`, `guide`, `is_active`, `created_at`, `updated_at`, `requisito_id`, `is_binary`) VALUES
(145, 'E1', 0, 'AAA', 31, 53, '[\"AAA\",\"AAA\"]', 'AAA', 1, '2025-03-06 19:22:43', '2025-03-06 19:22:43', 46, 1),
(146, 'E2', 1, 'AAAA', 31, 54, '[\"AAAA\"]', 'AAA', 1, '2025-03-06 19:22:59', '2025-03-06 19:22:59', 47, 1),
(147, 'E3', 0, 'EEEEE', 31, 54, '[\"EEEEEEE\"]', 'EEEE', 1, '2025-03-06 19:23:53', '2025-03-06 19:23:53', 47, 1),
(148, 'E4', 0, 'EEEEEE', 31, 54, '[\"EEEEEE\"]', NULL, 1, '2025-03-06 19:24:07', '2025-03-06 19:24:07', 47, 1),
(149, 'E5', 0, 'EEEEEEE', 31, 55, '[\"aaaaaaaa\"]', 'EEEEEE', 1, '2025-03-06 19:24:25', '2025-03-06 22:58:45', 48, 1),
(150, 'E6', 0, 'EEEEEE', 31, 55, '[\"EEEEEEEEEE\"]', NULL, 1, '2025-03-06 19:24:38', '2025-03-06 19:24:49', 48, 1),
(151, 'I1', 1, 'QQQQ', 32, 56, '[\"QQQQQQ\",\"QQQQQQ\"]', NULL, 1, '2025-03-06 19:25:07', '2025-03-06 19:25:07', 49, 1),
(152, 'I2', 0, 'AAAAAAAA', 32, 57, '[\"AAAAAAAAAAAA\"]', NULL, 1, '2025-03-06 19:25:23', '2025-03-06 19:25:23', 50, 1),
(153, 'I3', 0, 'QQQQQ', 32, 57, '[\"QQQQQQQQQQQQQ\"]', NULL, 1, '2025-03-06 19:25:36', '2025-03-06 19:25:36', 50, 1),
(154, 'I4', 0, 'WWWWW', 32, 58, '[\"WWWWW\",\"t3453\"]', 'etyhetrh', 1, '2025-03-06 19:25:50', '2025-03-07 01:48:10', 51, 1),
(155, 'P1', 1, 'AAA', 33, 59, '[\"AAAAA\"]', NULL, 1, '2025-03-06 19:26:06', '2025-03-07 01:17:29', 52, 1),
(156, 'P2', 1, 'AAAAAAA', 33, 60, '[\"AAAAAAAAAAAA\",\"AAAAAAA\",\"aaaaaa\"]', NULL, 1, '2025-03-06 19:26:21', '2025-03-07 02:44:36', 53, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicator_answers`
--

CREATE TABLE `indicator_answers` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `indicator_id` bigint(20) UNSIGNED NOT NULL,
  `answer` varchar(255) NOT NULL,
  `is_binding` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `justification` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `indicator_answers`
--

INSERT INTO `indicator_answers` (`id`, `user_id`, `company_id`, `indicator_id`, `answer`, `is_binding`, `created_at`, `updated_at`, `justification`) VALUES
(1038, 102, 32, 145, '1', 0, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1039, 102, 32, 146, '1', 1, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1040, 102, 32, 147, '1', 0, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1041, 102, 32, 148, '0', 0, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1042, 102, 32, 149, '1', 0, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1043, 102, 32, 150, '1', 0, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1044, 102, 32, 155, '1', 1, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1045, 102, 32, 156, '1', 1, '2025-03-07 01:42:28', '2025-03-07 01:42:28', NULL),
(1046, 102, 32, 151, '1', 1, '2025-03-07 01:42:37', '2025-03-07 01:42:37', NULL),
(1047, 102, 32, 152, '1', 0, '2025-03-07 01:42:37', '2025-03-07 01:42:37', NULL),
(1048, 102, 32, 153, '0', 0, '2025-03-07 01:42:37', '2025-03-07 01:42:37', NULL),
(1049, 102, 32, 154, '1', 0, '2025-03-07 01:42:37', '2025-03-07 01:42:37', NULL),
(1050, 103, 33, 145, '1', 0, '2025-03-07 01:45:38', '2025-03-07 01:45:38', NULL),
(1051, 103, 33, 146, '1', 1, '2025-03-07 01:45:38', '2025-03-07 01:45:38', NULL),
(1052, 103, 33, 147, '1', 0, '2025-03-07 01:45:38', '2025-03-07 01:45:38', NULL),
(1053, 103, 33, 148, '0', 0, '2025-03-07 01:45:38', '2025-03-07 01:45:38', NULL),
(1054, 103, 33, 149, '1', 0, '2025-03-07 01:45:38', '2025-03-07 01:45:38', NULL),
(1055, 103, 33, 150, '1', 0, '2025-03-07 01:45:38', '2025-03-07 01:45:38', NULL),
(1056, 103, 33, 151, '1', 1, '2025-03-07 01:45:46', '2025-03-07 01:45:46', NULL),
(1057, 103, 33, 152, '1', 0, '2025-03-07 01:45:46', '2025-03-07 01:45:46', NULL),
(1058, 103, 33, 153, '0', 0, '2025-03-07 01:45:46', '2025-03-07 01:45:46', NULL),
(1059, 103, 33, 154, '1', 0, '2025-03-07 01:45:46', '2025-03-07 01:45:46', NULL),
(1060, 103, 33, 155, '1', 1, '2025-03-07 01:45:53', '2025-03-07 01:45:53', NULL),
(1061, 103, 33, 156, '1', 1, '2025-03-07 01:45:53', '2025-03-07 01:45:53', NULL),
(1062, 105, 35, 145, '1', 0, '2025-03-07 18:10:27', '2025-03-07 18:10:27', NULL),
(1063, 105, 35, 146, '1', 1, '2025-03-07 18:10:27', '2025-03-07 18:10:27', NULL),
(1064, 105, 35, 147, '1', 0, '2025-03-07 18:10:27', '2025-03-07 18:10:27', NULL),
(1065, 105, 35, 148, '0', 0, '2025-03-07 18:10:27', '2025-03-07 18:10:27', NULL),
(1066, 105, 35, 149, '1', 0, '2025-03-07 18:10:27', '2025-03-07 18:10:27', NULL),
(1067, 105, 35, 150, '0', 0, '2025-03-07 18:10:27', '2025-03-07 18:10:27', NULL),
(1068, 105, 35, 151, '1', 1, '2025-03-07 18:10:36', '2025-03-07 18:10:36', NULL),
(1069, 105, 35, 152, '1', 0, '2025-03-07 18:10:36', '2025-03-07 18:10:36', NULL),
(1070, 105, 35, 153, '0', 0, '2025-03-07 18:10:36', '2025-03-07 18:10:36', NULL),
(1071, 105, 35, 154, '1', 0, '2025-03-07 18:10:36', '2025-03-07 18:10:36', NULL),
(1072, 105, 35, 155, '1', 1, '2025-03-07 18:10:42', '2025-03-07 18:10:42', NULL),
(1073, 105, 35, 156, '1', 1, '2025-03-07 18:10:42', '2025-03-07 18:10:42', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicator_answers_evaluation`
--

CREATE TABLE `indicator_answers_evaluation` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `indicator_id` bigint(20) UNSIGNED NOT NULL,
  `answer` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_path` text NOT NULL DEFAULT '[]',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `evaluation_question_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `indicator_homologation`
--

CREATE TABLE `indicator_homologation` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `indicator_id` bigint(20) UNSIGNED NOT NULL,
  `homologation_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `indicator_homologation`
--

INSERT INTO `indicator_homologation` (`id`, `indicator_id`, `homologation_id`, `created_at`, `updated_at`) VALUES
(295, 156, 5, NULL, NULL),
(296, 155, 5, NULL, NULL),
(297, 154, 5, NULL, NULL),
(298, 154, 11, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `info_adicional_empresas`
--

CREATE TABLE `info_adicional_empresas` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_id` bigint(20) UNSIGNED NOT NULL,
  `nombre_comercial` varchar(255) DEFAULT NULL,
  `nombre_legal` varchar(255) DEFAULT NULL,
  `descripcion_es` text DEFAULT NULL,
  `descripcion_en` text DEFAULT NULL,
  `anio_fundacion` int(11) DEFAULT NULL,
  `sitio_web` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  `linkedin` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `otra_red_social` varchar(255) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `tamano_empresa` varchar(255) DEFAULT NULL,
  `cantidad_hombres` int(11) DEFAULT NULL,
  `cantidad_mujeres` int(11) DEFAULT NULL,
  `cantidad_otros` int(11) DEFAULT NULL,
  `telefono_1` varchar(255) DEFAULT NULL,
  `telefono_2` varchar(255) DEFAULT NULL,
  `es_exportadora` tinyint(1) NOT NULL DEFAULT 0,
  `paises_exportacion` text DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `canton` varchar(255) DEFAULT NULL,
  `distrito` varchar(255) DEFAULT NULL,
  `cedula_juridica` varchar(255) DEFAULT NULL,
  `actividad_comercial` varchar(255) DEFAULT NULL,
  `producto_servicio` varchar(255) DEFAULT NULL,
  `rango_exportaciones` varchar(255) DEFAULT NULL,
  `planes_expansion` text DEFAULT NULL,
  `razon_licenciamiento_es` text DEFAULT NULL,
  `razon_licenciamiento_en` text DEFAULT NULL,
  `proceso_licenciamiento` text DEFAULT NULL,
  `recomienda_marca_pais` tinyint(1) DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `mercadeo_nombre` varchar(255) DEFAULT NULL,
  `mercadeo_email` varchar(255) DEFAULT NULL,
  `mercadeo_puesto` varchar(255) DEFAULT NULL,
  `mercadeo_telefono` varchar(255) DEFAULT NULL,
  `mercadeo_celular` varchar(255) DEFAULT NULL,
  `micrositio_nombre` varchar(255) DEFAULT NULL,
  `micrositio_email` varchar(255) DEFAULT NULL,
  `micrositio_puesto` varchar(255) DEFAULT NULL,
  `micrositio_telefono` varchar(255) DEFAULT NULL,
  `micrositio_celular` varchar(255) DEFAULT NULL,
  `vocero_nombre` varchar(255) DEFAULT NULL,
  `vocero_email` varchar(255) DEFAULT NULL,
  `vocero_puesto` varchar(255) DEFAULT NULL,
  `vocero_telefono` varchar(255) DEFAULT NULL,
  `vocero_celular` varchar(255) DEFAULT NULL,
  `representante_nombre` varchar(255) DEFAULT NULL,
  `representante_email` varchar(255) DEFAULT NULL,
  `representante_puesto` varchar(255) DEFAULT NULL,
  `representante_telefono` varchar(255) DEFAULT NULL,
  `representante_celular` varchar(255) DEFAULT NULL,
  `productos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`productos`)),
  `logo_path` varchar(255) DEFAULT NULL,
  `fotografias_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fotografias_paths`)),
  `certificaciones_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certificaciones_paths`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `info_adicional_empresas`
--

INSERT INTO `info_adicional_empresas` (`id`, `company_id`, `nombre_comercial`, `nombre_legal`, `descripcion_es`, `descripcion_en`, `anio_fundacion`, `sitio_web`, `facebook`, `linkedin`, `instagram`, `otra_red_social`, `sector`, `tamano_empresa`, `cantidad_hombres`, `cantidad_mujeres`, `cantidad_otros`, `telefono_1`, `telefono_2`, `es_exportadora`, `paises_exportacion`, `provincia`, `canton`, `distrito`, `cedula_juridica`, `actividad_comercial`, `producto_servicio`, `rango_exportaciones`, `planes_expansion`, `razon_licenciamiento_es`, `razon_licenciamiento_en`, `proceso_licenciamiento`, `recomienda_marca_pais`, `observaciones`, `mercadeo_nombre`, `mercadeo_email`, `mercadeo_puesto`, `mercadeo_telefono`, `mercadeo_celular`, `micrositio_nombre`, `micrositio_email`, `micrositio_puesto`, `micrositio_telefono`, `micrositio_celular`, `vocero_nombre`, `vocero_email`, `vocero_puesto`, `vocero_telefono`, `vocero_celular`, `representante_nombre`, `representante_email`, `representante_puesto`, `representante_telefono`, `representante_celular`, `productos`, `logo_path`, `fotografias_paths`, `certificaciones_paths`, `created_at`, `updated_at`) VALUES
(11, 19, 'Vanti sa', 'Vanti sa', 'Vanti sa', 'Vanti sa', 1998, 'https://vanti.com', 'https://pizarro.com', 'https://pizarro.com', 'https://pizarro.com', 'https://pizarro.com', 'agricola', '11-50', 25, 25, NULL, '123456789123', '123456789', 1, NULL, NULL, NULL, NULL, '1234567890', 'actividad comercial', NULL, NULL, NULL, 'aaa', 'aaaaaaaaaaa', 'aaaaaaaaaaaaa', 0, 'aaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'empresas/19/logos/1741225284_1740066315_logo_esc.png', '\"[\\\"empresas\\\\\\/19\\\\\\/fotografias\\\\\\/1741225284_apple-touch-icon.png\\\",\\\"empresas\\\\\\/19\\\\\\/fotografias\\\\\\/1741225284_Header_pdf.png\\\",\\\"empresas\\\\\\/19\\\\\\/fotografias\\\\\\/1741225823_Imagen de WhatsApp 2025-02-26 a las 15.42.42_5499b9ee.jpg\\\"]\"', '\"[\\\"empresas\\\\\\/19\\\\\\/certificaciones\\\\\\/1741223979_bmw-m3-gtr-strassenversion.jpg\\\",\\\"empresas\\\\\\/19\\\\\\/certificaciones\\\\\\/1741225284_contratacion.png\\\",\\\"empresas\\\\\\/19\\\\\\/certificaciones\\\\\\/1741225284_1740066315_image (2) (2).png\\\",\\\"empresas\\\\\\/19\\\\\\/certificaciones\\\\\\/1741225335_formacion-personal.png\\\",\\\"empresas\\\\\\/19\\\\\\/certificaciones\\\\\\/1741225335_Imagen de WhatsApp 2025-02-26 a las 15.42.42_5499b9ee.jpg\\\"]\"', '2025-03-06 04:19:39', '2025-03-06 04:50:23'),
(12, 24, 'Ficticio', 'Ficticio SA', 'FICTICIO', 'FICTICIO', 2025, 'https://ficticio.com', 'https://pizarro.com', 'https://pizarro.com', 'https://pizarro.com', 'https://pizarro.com', 'alimentos', '11-50', 11, 45, NULL, '234234', '234234', 1, NULL, NULL, NULL, NULL, '1065161641', 'Servicios', NULL, NULL, NULL, 'AAAAAAA', 'AAAAAAAAAAAA', 'AAAAAAAAAAAA', 0, 'AAAAAAA', 'AA', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'empresas/24/logos/1741275581_Header_pdf.png', '\"[\\\"empresas\\\\\\/24\\\\\\/fotografias\\\\\\/1741275581_favicon-32x32.png\\\"]\"', '\"[\\\"empresas\\\\\\/24\\\\\\/certificaciones\\\\\\/1741275581_Imagen de WhatsApp 2025-02-26 a las 15.42.42_5499b9ee.jpg\\\"]\"', '2025-03-06 18:39:41', '2025-03-06 19:30:00'),
(13, 25, 'Ficticio 2', 'aaaaaaaaa', 'aaa', 'aaaaaaaaaaaaaa', 2001, 'https://ficticio2.com', NULL, NULL, NULL, NULL, 'alimentos', '11-50', 34, 43, NULL, '2435234', '23523', 1, NULL, NULL, NULL, NULL, '4234523524', 'Aeroespacial', NULL, NULL, NULL, 'aaa', 'aaaaaaaa', 'aaaaaaaaaaa', 0, 'aaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06 19:45:46', '2025-03-06 19:45:46'),
(14, 26, 'Ficticio 3', 'asda', 'sda', 'sdasda', 1990, 'https://ficti.com', NULL, NULL, NULL, NULL, 'alimentos', '11-50', 34, 432, NULL, '132423423', '423423', 1, NULL, NULL, NULL, NULL, '4563456456', 'Servicios', NULL, NULL, NULL, 'aa', 'aaaaaaaaaa', 'aaaaaaaa', 0, 'aaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06 22:07:55', '2025-03-06 22:07:55'),
(15, 27, 'Ficticio 4', 'aaaa', 'aaaaaaaaaa', 'aaaaaaaaaaaaaaaaaa', 1988, 'https://ficticio.com', NULL, NULL, NULL, NULL, 'alimentos', '11-50', 32, 322, NULL, '3815582223', '3815582223', 1, 'Andorra,Angola,Anguilla,Antártida,Antigua y Barbuda,Argentina,Armenia,Aruba,Australia,Austria,Azerbaiyán,Bahamas,Bahrein,Bangladesh,Barbados,Bielorrusia,Bélgica,Belice,Benín,Bermuda,Bután,Bolivia,Bosnia-Herzegovina,Botswana,Brasil,Brunei,Bulgaria,Burkina Faso,Burundi,Camboya,Camerún,Canadá,Cabo Verde,Islas Caimán,República Centroafricana,Chad,Chile,China,Isla de Navidad,Islas Cocos,Colombia,Comores,República del Congo,República Democrática del Congo,Islas Cook,Costa Rica,Costa de Marfíl,Croacia,Cuba,Chipre,República Checa,Dinamarca,Djibouti,Dominica,República Dominicana,Ecuador,Egipto,El Salvador,Guinea Ecuatorial,Eritrea,Estonia,Etiopía,Islas Malvinas,Islas Feroe,Fiji,Finlandia,Francia,Guyana Francesa,Polinesia Francesa,Tierras Australes y Antárticas Francesas,Gabón,Gambia,Georgia,Alemania,Ghana,Gibraltar,Grecia,Groenlandia,Granada,Guadalupe,Guam,Guatemala,Guinea,Guinea-Bissau,Guyana,Haití,Vaticano,Honduras,Hong Kong,Hungría,Islandia,India,Indonesia,Irán,Iraq,Irlanda,Israel,Italia,Jamaica,Japón,Jordania,Kazajstán,Kenia,Kiribati,Corea del Norte,Corea del Sur,Kuwait,Kirguistán,Laos,Letonia,Líbano,Lesotho,Liberia,Libia,Liechtenstein,Lituania,Luxemburgo,Macao,Macedonia,Madagascar,Malawi,Malasia,Maldivas,Mali,Malta,Islas Marshall,Martinica,Mauritania,Mauricio,Mayotte,México,Estados Federados de Micronesia,Moldavia,Mónaco,Mongolia,Montserrat,Marruecos,Mozambique,Myanmar,Namibia,Nauru,Nepal,Holanda,Antillas Holandesas,Nueva Caledonia,Nueva Zelanda,Nicaragua,Niger,Nigeria,Niue,Islas Norfolk,Islas Marianas del Norte,Noruega,Omán,Pakistán,Palau,Palestina,Panamá,Papua Nueva Guinea,Paraguay,Perú,Filipinas,Pitcairn,Polonia,Portugal,Puerto Rico,Qatar,Reunión,Rumanía,Rusia,Ruanda,Santa Helena,San Kitts y Nevis,Santa Lucía,San Vicente y Granadinas,Samoa,San Marino,Santo Tomé y Príncipe,Arabia Saudita,Senegal,Serbia,Seychelles,Sierra Leona,Singapur,Eslovaquía,Eslovenia,Islas Salomón,Somalia,Sudáfrica,España,Sri Lanka,Sudán,Surinam,Swazilandia,Suecia,Suiza,Siria,Taiwán,Tadjikistan,Tanzania,Tailandia,Timor Oriental,Togo,Tokelau,Tonga,Trinidad y Tobago,Túnez,Turquía,Turkmenistan,Islas Turcas y Caicos,Tuvalu,Uganda,Ucrania,Emiratos Árabes Unidos,Reino Unido,Estados Unidos,Uruguay,Uzbekistán,Vanuatu,Venezuela,Vietnam,Islas Vírgenes Británicas,Islas Vírgenes Americanas,Wallis y Futuna,Sáhara Occidental,Yemen,Zambia,Zimbabwe', NULL, NULL, NULL, '4353453453', 'Servicios', 'aaaaaaa', '10001-50000', 'aaaaaaa', 'aaaaaaaaaaa', 'aaaaaaaaaaaa', 'aaaaaaa', 0, 'aaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06 22:35:44', '2025-03-06 23:00:14'),
(16, 28, 'Ficticio 5', 'erthgertdh', 'reth', 'erther', 1988, 'https://srggf', NULL, NULL, NULL, NULL, 'alimentos', '51-200', 345, 345, NULL, '41511651911', '3815582223', 1, NULL, NULL, NULL, NULL, '9489451756', 'Aeroespacial', NULL, NULL, NULL, '34534', '534', '5345', 0, '3453', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06 22:44:36', '2025-03-06 22:44:36'),
(17, 29, 'Ficticio 6', 'sdfadfs', 'adf', 'sdfsdf', 1996, 'https://shdfgvoujihj', NULL, NULL, NULL, NULL, 'alimentos', '51-200', 23, 123, NULL, '34234', '23423', 1, 'Afganistán,Albania,Algeria,Samoa Americana,Andorra,Angola,Anguilla,Antártida,Antigua y Barbuda,Argentina,Armenia,Aruba,Australia,Austria,Azerbaiyán,Bahamas,Bahrein,Bangladesh,Barbados,Bielorrusia,Bélgica,Belice,Benín,Bermuda,Bután,Bolivia,Bosnia-Herzegovina,Botswana,Brasil,Brunei,Bulgaria,Burkina Faso,Burundi,Camboya,Camerún,Canadá,Cabo Verde,Islas Caimán,República Centroafricana,Chad,Chile,China,Isla de Navidad,Islas Cocos,Colombia,Comores,República del Congo,República Democrática del Congo,Islas Cook,Costa Rica,Costa de Marfíl,Croacia,Cuba,Chipre,República Checa,Dinamarca,Djibouti,Dominica,República Dominicana,Ecuador,Egipto,El Salvador,Guinea Ecuatorial,Eritrea,Estonia,Etiopía,Islas Malvinas,Islas Feroe,Fiji,Finlandia,Francia,Guyana Francesa,Polinesia Francesa,Tierras Australes y Antárticas Francesas,Gabón,Gambia,Georgia,Alemania,Ghana,Gibraltar,Grecia,Groenlandia,Granada,Guadalupe,Guam,Guatemala,Guinea,Guinea-Bissau,Guyana,Haití,Vaticano,Honduras,Hong Kong,Hungría,Islandia,India,Indonesia,Irán,Iraq,Irlanda,Israel,Italia,Jamaica,Japón,Jordania,Kazajstán,Kenia,Kiribati,Corea del Norte,Corea del Sur,Kuwait,Kirguistán,Laos,Letonia,Líbano,Lesotho,Liberia,Libia,Liechtenstein,Lituania,Luxemburgo,Macao,Macedonia,Madagascar,Malawi,Malasia,Maldivas,Mali,Malta,Islas Marshall,Martinica,Mauritania,Mauricio,Mayotte,México,Estados Federados de Micronesia,Moldavia,Mónaco,Mongolia,Montserrat,Marruecos,Mozambique,Myanmar,Namibia,Nauru,Nepal,Holanda,Antillas Holandesas,Nueva Caledonia,Nueva Zelanda,Nicaragua,Niger,Nigeria,Niue,Islas Norfolk,Islas Marianas del Norte,Noruega,Omán,Pakistán,Palau,Palestina,Panamá,Papua Nueva Guinea,Paraguay,Perú,Filipinas,Pitcairn,Polonia,Portugal,Puerto Rico,Qatar,Reunión,Rumanía,Rusia,Ruanda,Santa Helena,San Kitts y Nevis,Santa Lucía,San Vicente y Granadinas,Samoa,San Marino,Santo Tomé y Príncipe,Arabia Saudita,Senegal,Serbia,Seychelles,Sierra Leona,Singapur,Eslovaquía,Eslovenia,Islas Salomón,Somalia,Sudáfrica,España,Sri Lanka,Sudán,Surinam,Swazilandia,Suecia,Suiza,Siria,Taiwán,Tadjikistan,Tanzania,Tailandia,Timor Oriental,Togo,Tokelau,Tonga,Trinidad y Tobago,Túnez,Turquía,Turkmenistan,Islas Turcas y Caicos,Tuvalu,Uganda,Ucrania,Emiratos Árabes Unidos,Reino Unido,Estados Unidos,Uruguay,Uzbekistán,Vanuatu,Venezuela,Vietnam,Islas Vírgenes Británicas,Islas Vírgenes Americanas,Wallis y Futuna,Sáhara Occidental,Yemen,Zambia,Zimbabwe', NULL, NULL, NULL, '234234234', 'Servicios', 'aaaa', '0-10000', 'aaa', 'aaa', 'a', 'aa', 0, 'aa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06 23:04:53', '2025-03-06 23:04:53'),
(18, 30, 'Ficticio 7243534534', 'dsrfghsedrth6', 'gsret356:L:::', 'herther', 1998, 'https://jhiupij', 'https://localhotshttps://localhots', 'https://localhots', 'https://pizarro.com', 'https://pizarro.com', 'alimentos', '201-500', 234, 234, NULL, '34234', '2342', 1, 'Samoa Americana,Angola,Anguilla,Antártida,Antigua y Barbuda,Argentina', NULL, NULL, NULL, '4123423423', 'Servicios', 'tfghftghfgf', '10001-50000', 'ghfghfgh', 'aaaaaaaaa4532453::GHGJRFG', 'aaaaaaaa32453453453', 'aaaaaaaaa:RTGH', 0, 'aaaaaa', 'dgssdgsdggsdgs', 'aaa@aaa.com', 'sdgsdgdsgsdgsd', '42352345', '25325235', 'gsdgsdg', 'pruebas@gmail.com', 'sdgsd', '235235', '23523', 'sdgs', 'pruebas@gmail.com', 'gsdg', '234', '52345235', 'sdg', '3prueba@gmail.com', 'sdgsd', '2352', '35235', NULL, 'empresas/30/logos/1741296268_Header_pdf.png', '\"[\\\"empresas\\\\\\/30\\\\\\/fotografias\\\\\\/1741296268_android-chrome-512x512.png\\\",\\\"empresas\\\\\\/30\\\\\\/fotografias\\\\\\/1741296268_favicon-16x16.png\\\"]\"', '\"[\\\"empresas\\\\\\/30\\\\\\/certificaciones\\\\\\/1741296268_android-chrome-192x192.png\\\",\\\"empresas\\\\\\/30\\\\\\/certificaciones\\\\\\/1741296268_apple-touch-icon.png\\\",\\\"empresas\\\\\\/30\\\\\\/certificaciones\\\\\\/1741296268_favicon-16x16.png\\\",\\\"empresas\\\\\\/30\\\\\\/certificaciones\\\\\\/1741296268_Imagen de WhatsApp 2025-02-26 a las 15.42.42_5499b9ee.jpg\\\",\\\"empresas\\\\\\/30\\\\\\/certificaciones\\\\\\/1741296268_control_de_expedientes.png\\\"]\"', '2025-03-06 23:32:17', '2025-03-07 00:24:28'),
(19, 31, 'Ficticio 8', '34234', '23423', '423423', 2001, 'https://ujrfgj', NULL, NULL, NULL, NULL, 'alimentos', '1-10', 32, 232, NULL, '34234', '12342342', 1, NULL, NULL, NULL, NULL, '9544165415', 'Aeroespacial', NULL, NULL, NULL, '234234', '234', '2342', 0, '234', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-03-06 23:48:24', '2025-03-06 23:48:24'),
(24, 35, 'Ficticio 12', 'aaaaaaaaavvvvvvvvvvv', 'aaaaaaaaaaaaaaaaaavvvvvvvvvvvvvv', 'aaaaaaaaaavvvvvvvvvvvvvvv', 2001, 'https://ficticio.com', 'https://pizarro.comcccccccc', 'https://pizarro.comcccccccccccccc', 'https://pizarro.comccccccccccc', 'https://pizarro.comccccccccccccccc', 'agricola', '501-1000', 1900, 1998, NULL, '42342344234234234234', '23423432423423423', 1, 'Afganistán,Albania,Algeria,Samoa Americana,Andorra', NULL, NULL, NULL, '000000252', 'Servicios', 'SDGFSDGggggggggggggggggggggggggggg', '100001-500000', 'aaaaaaaaaaaaagggggggggggggggggggggggggggg22', 'aaaaaaaaaavvvvvvvvvvvvv', 'aaaaaaaaaavvvvvvvvvvvvvvvv', 'aaaaaaaaaaaavvvvvvvvvvvvvv', 1, 'aaaaaaaaaavvvvvvvvvvvvvvvvv', 'aaaavvvvvvvvv', 'aaa@aaa.com', 'aaaaaaaaaaaaaaavvvvvvvvvvvvvvv', '222222333333333333333333', '222222222222333333333333333', 'aaaaaaaaaaaaavvvvvvvvvvvvvvvv', 'pruebas@gmail.com', 'aaaaaaaaaaavvvvvvvvvvvvvvvvvv', '2222222222223333333333333333', '2222222222222223333333333333333', 'aaaaaaaaavvvvvvvvvvvvvvvvvvvvv', 'pruebas@gmail.com', 'aaaaaaaaaaaaavvvvvvvvvvvvvvv', '22222222222222333333333333333333', '22222222222233333333333333', 'aaaaaaaaaaaaavvvvvvvvvvvvvvvvv', '3prueba@gmail.com', 'aaaaaaaaaaaavvvvvvvvvvvvvvvvvv', '22222222223333333333333', '222222222222233333333333333333', NULL, 'empresas/35/logos/1741365761_STScI-01JCGZ1VJG6W74BWTQA2GFFZCP.png', '\"[\\\"empresas\\/35\\/fotografias\\/1741365702_STScI-01JCGZ1VJG6W74BWTQA2GFFZCP.png\\\",\\\"empresas\\/35\\/fotografias\\/1741365702_STScI-01JC43BEDNK4EW6RPET72R7P1D.jpg\\\",\\\"empresas\\/35\\/fotografias\\/1741365702_STScI-01JKBZWFE5CDC2ZEYER7RMRYSS.jpg\\\"]\"', '\"[\\\"empresas\\/35\\/certificaciones\\/1741365554_STScI-01JNCRZW5BQBZAS3X7RAT0EFGS.jpg\\\",\\\"empresas\\/35\\/certificaciones\\/1741365703_STScI-01JCGZ1VJG6W74BWTQA2GFFZCP.png\\\",\\\"empresas\\/35\\/certificaciones\\/1741365703_STScI-01JC43BEDNK4EW6RPET72R7P1D.jpg\\\",\\\"empresas\\/35\\/certificaciones\\/1741365703_STScI-01JKBZWFE5CDC2ZEYER7RMRYSS.jpg\\\",\\\"empresas\\/35\\/certificaciones\\/1741365703_STScI-01JFGAZ9EJFV0XAB5SDZGBCGE7.png\\\"]\"', '2025-03-07 19:38:17', '2025-03-07 19:42:44');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2024_11_13_204855_create_company_table', 1),
(5, '2024_11_14_211158_add_column_role_to_users_table', 2),
(6, '2024_11_15_000000_create_access_requests_table', 3),
(7, '2024_11_14_221751_add_column_status_to_users_table', 4),
(8, '2024_11_15_155807_add_profile_fields_to_users_table', 5),
(9, '2024_11_15_180301_create_personal_access_tokens_table', 6),
(10, '2024_11_18_193651_create_certifications_table', 7),
(11, '2024_11_18_193753_create_available_certifications_table', 8),
(12, '2024_11_20_203515_add_active_column_to_available_certifications_table', 9),
(13, '2024_11_20_204617_add_type_column_to_available_certifications_table', 10),
(14, '2024_11_20_204902_add_category_column_to_available_certifications_table', 11),
(15, '2024_11_28_203650_create_values_table', 12),
(16, '2024_11_28_211310_create_indicators_table', 13),
(17, '2024_03_15_000000_modify_indicators_table', 14),
(18, '2024_11_29_173910_create_subcategories_table', 15),
(19, '2024_11_29_184010_remove_homologation_id_from_indicators', 16),
(20, '2024_11_29_182721_create_indicator_homologation_table', 17),
(21, '2024_11_29_195301_add_status_column_to_companies_table', 18),
(22, '2024_12_06_211557_create_indicator_answer_table', 19),
(23, '2024_12_06_224732_create_auto_evaluation_valor_result_table', 20),
(24, '2024_12_06_224952_create_auto_evaluation_result_table', 21),
(25, '2024_12_06_231151_create_auto_evaluation_subcategory_result_table', 22),
(26, '2024_12_10_164548_add_is_binding_column_to_indicator_answers_table', 23),
(27, '2024_12_11_195124_create_evaluation_questions_table', 24),
(28, '2024_12_12_171745_create_indicator_answer_evaluation_table', 25),
(29, '2024_12_12_202803_modify_file_path_in_indicator_answers_evaluation', 26),
(30, '2024_12_12_create_add_indicator_id_to_indicator_answers_evaluation', 27),
(31, '2024_12_27_175243_create_company_evaluator_table', 28),
(32, '2024_12_27_253457_create_evaluator_assessments_table', 29),
(33, '2025_01_03_131523_add_homologation_id_to_certifications_table', 30),
(34, '2025_01_07_204259_add_column_application_sended_to_auto_evaluation_result_table', 31),
(36, '2025_01_13_192336_create_info_adicional_empresas_table', 32),
(37, '2025_01_16_191445_add_form_sended_column_to_auto_evaluation_result_table', 33),
(38, '2025_02_28_161913_add_terms_accepted_to_users_table', 34),
(39, '2025_02_28_164506_rename_city_to_provincia_in_companies_table', 35),
(40, '2025_02_28_184112_add_column_puesto_to_users_table', 36),
(41, '2025_03_03_154321_add_autoeval_ended_column_to_company_table', 37),
(42, '2025_03_03_182038_add_estado_eval_column_to_companies_table', 38),
(43, '2025_03_04_172753_add_is_binary_column_to_indicators_table', 39),
(44, '2025_03_04_172844_add_justification_column_to_indicator_answers_table', 40),
(45, '2025_03_04_172935_add_is_binaty_column_to_evaluation_questions_table', 41),
(46, '2025_03_05_160018_create_evaluation_value_results_table', 42),
(47, '2025_03_05_231739_add_columns_to_companies_table', 43),
(48, '2025_03_06_155245_create_evaluation_value_result_reference_table', 44),
(49, '2025_03_07_000402_add_order_column_to_subcategories_table', 45);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`email`, `token`, `created_at`) VALUES
('juan@ficticio7.com', '$2y$12$NrMpDiMD3h.hsLKL8ZGQE.IUYY.WgibhI7TAUolUoZ/1Eyc7CLqf6', '2025-03-07 00:47:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `requisitos`
--

CREATE TABLE `requisitos` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `requisitos`
--

INSERT INTO `requisitos` (`id`, `name`, `description`, `value_id`, `subcategory_id`, `is_active`, `created_at`, `updated_at`) VALUES
(46, 'Requisito e1', NULL, 31, 53, 1, '2025-03-06 19:21:21', '2025-03-06 19:21:21'),
(47, 'Requisito e2', NULL, 31, 54, 1, '2025-03-06 19:21:30', '2025-03-06 19:21:30'),
(48, 'Requisito e3', NULL, 31, 55, 1, '2025-03-06 19:21:39', '2025-03-06 19:21:39'),
(49, 'Requisito i1', NULL, 32, 56, 1, '2025-03-06 19:21:48', '2025-03-06 19:21:48'),
(50, 'Requisito i2', NULL, 32, 57, 1, '2025-03-06 19:21:56', '2025-03-06 19:21:56'),
(51, 'Requisito i3', NULL, 32, 58, 1, '2025-03-06 19:22:07', '2025-03-06 19:22:07'),
(52, 'Requisito p1', NULL, 33, 59, 1, '2025-03-06 19:22:15', '2025-03-06 19:22:15'),
(53, 'Requisito p2', NULL, 33, 60, 1, '2025-03-06 19:22:21', '2025-03-06 19:22:21');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('B07UBDlxOGBXeXOckN0n6as5S7ACc6BCsqnoP4C6', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiVTZISmtBVWNpOElmZjhsT1FNTXlPZDFwbDBEb2g3djVRYXBLUXlkVyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MTI5OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvcmVzZXQtcGFzc3dvcmQvNjdmYWRjYTZjNDMxNjQ1YzYyZmQxMmI2ZjhiYTExODBjMTE3ZGIyMTk1ZDhlZmZiY2E2MzViYjEyMzM2Mjg4ZD9lbWFpbD1qdWFuJTQwZmljdGljaW8xMi5jb20iO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1741359906),
('heo7aAVLPOlOrlW96lBl0oNV9FzDdn1hBdhk41p9', 37, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiWWE4ZURqNFZNN1VkUU5BaW91T2hlRFpGZTlLSWtIZ1dCeU0yY001dSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mzc7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdXBlci9wcm9ncmVzb3MiO319', 1741365858),
('lf3Vvkj7xOG18kBYh7toUAhjfzXfaGFbWSXIzZkO', 105, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYUtFbEhOeERPTGllNHBuSXRsd3cxVThrMEJpVWxibm1XUVVVajlsOSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9mb3JtLWVtcHJlc2EiO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxMDU7fQ==', 1741367911);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `subcategories`
--

CREATE TABLE `subcategories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `subcategories`
--

INSERT INTO `subcategories` (`id`, `name`, `description`, `value_id`, `is_active`, `created_at`, `updated_at`, `order`) VALUES
(53, 'Componente 1', NULL, 31, 1, '2025-03-06 19:20:06', '2025-03-07 03:19:21', 2),
(54, 'Componente e2', NULL, 31, 1, '2025-03-06 19:20:14', '2025-03-07 03:19:21', 3),
(55, 'Componente e3', NULL, 31, 1, '2025-03-06 19:20:23', '2025-03-07 03:19:21', 1),
(56, 'Componente i1', NULL, 32, 1, '2025-03-06 19:20:33', '2025-03-07 03:31:41', 2),
(57, 'Componente i2', NULL, 32, 1, '2025-03-06 19:20:40', '2025-03-07 03:31:41', 3),
(58, 'Componente i3', NULL, 32, 1, '2025-03-06 19:20:48', '2025-03-07 03:31:41', 1),
(59, 'Componente p1', NULL, 33, 1, '2025-03-06 19:20:57', '2025-03-07 03:18:49', 2),
(60, 'Componente p2', NULL, 33, 1, '2025-03-06 19:21:06', '2025-03-07 03:18:49', 1),
(62, 'Hola', NULL, 39, 1, '2025-03-07 03:21:16', '2025-03-07 03:32:16', 2),
(63, 'Mundo', NULL, 39, 1, '2025-03-07 03:21:24', '2025-03-07 03:32:16', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) DEFAULT NULL,
  `id_number` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `company_id` bigint(20) UNSIGNED DEFAULT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'user',
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `form_sended` int(11) DEFAULT NULL,
  `terms_accepted` tinyint(1) NOT NULL DEFAULT 0,
  `puesto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `id_number`, `phone`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `company_id`, `role`, `status`, `form_sended`, `terms_accepted`, `puesto`) VALUES
(18, 'Admin', 'Buzz', '41125546', '38155289832', 'admin@buzz.com', NULL, '$2y$12$mVQYud6VqEmady6.GBDFgOjAlnczYmWPCzhrM8rW1rdePIEuTFWvW', NULL, '2024-11-15 01:00:54', '2024-11-15 19:04:48', 7, 'admin', 'approved', 0, 0, NULL),
(21, 'Mauricio', NULL, NULL, NULL, 'mauricio@email.com', NULL, '$2y$12$WlgSoQwLJpbaMvpC8By/zulkti6YiIWvoprY5tEu1oXHQheRaTiN6', NULL, '2024-11-15 01:23:58', '2024-11-15 01:24:42', 7, 'user', 'approved', 0, 0, NULL),
(22, 'Mauricio 2', NULL, NULL, NULL, 'mauricio2@email.com', NULL, '$2y$12$/JG31Cth3bQLlWkB/OqTnO3GN0DtvYzLvkXmZ1MHOz9iVPM4D2b2y', NULL, '2024-11-15 01:25:30', '2024-11-15 01:28:50', 7, 'user', 'approved', 0, 0, NULL),
(23, 'Mauricio 3', NULL, NULL, NULL, 'mauricio3@email.com', NULL, '$2y$12$oMP/uctaH4uMYPJRd9Ta4eIv5ke2jcT01NK9sCSUieG0lFS5SxC.C', NULL, '2024-11-15 01:30:19', '2024-11-15 01:30:32', 7, 'user', 'approved', 0, 0, NULL),
(24, 'Mauricio 4', NULL, NULL, NULL, 'mauricio4@email.com', NULL, '$2y$12$405q2FyfiluSLtGkMNTcC.Pv5wJBIttXRFPnJ7xl6F8jgsMtMQAzu', NULL, '2024-11-15 01:31:14', '2024-11-15 21:21:40', 7, 'user', 'approved', 0, 0, NULL),
(26, 'Admin Teruel', NULL, NULL, NULL, 'admin@teruel.com', NULL, '$2y$12$bSe..UDHVUa6DOiKr5gLruHQd3mN/OahDxVBNvCbrJlmJ9qos9PjC', NULL, '2024-11-15 01:33:50', '2024-11-15 01:34:14', 9, 'admin', 'approved', 0, 0, NULL),
(28, 'Mauricio', '5', NULL, '32845792837', 'mauricio5@gmail.com', NULL, '$2y$12$K3MrXaDImp58HppwVgD4JuqPUP9BoLs0wUkI9d89o1n3aWTnEUagy', NULL, '2024-11-15 21:10:43', '2024-11-15 21:10:43', 7, 'user', 'approved', 0, 0, NULL),
(29, 'Mauricio 7', NULL, NULL, NULL, 'mauricio7@buzz.cr', NULL, '$2y$12$9rdk7gUV9229oLOvMMAADOm80N6jcQJ5H9kphvdfW77Y8qT1mSal6', NULL, '2024-11-15 21:22:20', '2024-11-15 21:48:21', 7, 'user', 'rejected', 0, 0, NULL),
(30, 'Mauricio 8', NULL, NULL, NULL, 'mauricio8@buzz.cr', NULL, '$2y$12$B7OeNuSBZEHuol6oa.8M7.ZcoL4U.OlJhR1GwNogklRv0Irif.SDu', NULL, '2024-11-15 21:42:04', '2024-11-19 00:31:57', 7, 'user', 'rejected', 0, 0, NULL),
(31, 'Mauricio 10', NULL, NULL, NULL, 'mauricio10@buzz.cr', NULL, '$2y$12$OeyzCz5jMIryrwYep4.XceJFwBCLTX/0oziXSqmtiodVkEnup95Ti', NULL, '2024-11-19 01:06:59', '2024-11-19 01:59:38', 7, 'user', 'rejected', 0, 0, NULL),
(35, 'Mauricio Teruel', NULL, NULL, NULL, 'mauricioteruel1998@gmail.com', NULL, '$2y$12$we8XoQJjyVJe3OaTocDuBuaghnFTWjknoFBa.nddU6D.b.tPt4rWm', NULL, '2024-11-19 22:37:42', '2024-11-19 23:04:13', 7, 'user', 'approved', 0, 0, NULL),
(36, 'TITITITITIT', '', NULL, '20394590238', 'ti@ti.com', NULL, '$2y$12$OgWIyk12x41vJ/UNFfSJe.wWnj/rCGmaCLYd90BOaIonNtyGaLETW', NULL, '2024-11-19 22:38:46', '2024-11-19 22:38:46', 7, 'user', 'approved', 0, 0, NULL),
(37, 'Super', 'Admin SA', NULL, '4563674563456', 'admin@admin.com', NULL, '$2y$12$gT1r4gTPiuvhf.flPkNHkut7NChjwTHlL0YEVQhsmLywNDRdfsMLG', NULL, '2024-11-20 23:09:50', '2025-03-06 22:58:24', 27, 'super_admin', 'approved', 0, 0, NULL),
(38, 'Mauricio Teruel', NULL, NULL, NULL, 'prueba400@buzz.cr', NULL, '$2y$12$FsYDUU6jJYe3BH.Drs.T6.5M0mM7y1hvcng7pov9Wfs2DSGzL4tOe', NULL, '2024-12-05 17:40:55', '2024-12-10 20:45:24', 7, 'user', 'approved', 0, 0, NULL),
(39, 'Juan pere', NULL, NULL, NULL, 'juan@teruel.com', NULL, '$2y$12$2DUtGePN8wh77zxg.zT.leqbzj05z0PkK8uIJp0cQyrQ9ZzYGZhtG', NULL, '2024-12-06 18:37:43', '2024-12-06 18:38:21', 9, 'user', 'pending', 0, 0, NULL),
(40, 'Mauricio', NULL, NULL, NULL, 'mauricio50@buzz.cr', NULL, '$2y$12$ta72rpxw3n.lrnHmBfaNT.PkAq8Dl.j7d1fHQKYszYlqn/VtpYLJG', NULL, '2024-12-18 23:02:43', '2025-01-02 23:25:37', 7, 'user', 'rejected', 0, 0, NULL),
(41, 'Evaluador', '1', NULL, NULL, 'evaluador@admin.com', NULL, '$2y$12$cxu3plTBpg.ujstsmd6XPOAr6A4HTId8N98ssBqwvRxLQYGS0Jd66', NULL, '2024-12-27 20:10:40', '2024-12-27 20:10:40', 7, 'user', 'approved', 0, 0, NULL),
(42, 'Evaluador', 'Uno', NULL, '65141897', 'evaluador1@email.com', NULL, '$2y$12$xa/5zaCopTEfYf4svsEibOQ6IHQopiBNxOJsdC8GYDuxEMF3.GNCW', NULL, '2024-12-27 20:13:16', '2025-03-06 23:53:51', 31, 'evaluador', 'approved', 1, 0, 'Evaluador'),
(43, 'Prueba', NULL, NULL, NULL, 'prueba@email.com', NULL, '$2y$12$7j4O1M09ZWs7h3/LK2KaiuABABy25BjemaYIsjznBbwlYPmlFpxGS', NULL, '2025-01-07 19:50:36', '2025-01-07 19:50:36', NULL, 'user', 'pending', 0, 0, NULL),
(44, 'Maricio', '', NULL, '32845792837', 'mauricio500@gmail.com', NULL, '$2y$12$g50x20BTIYZLwxidmbSIfeWxwDFbXtozJXhkg9LoIj.gZ.JeY8UUu', NULL, '2025-01-14 18:57:26', '2025-01-14 18:57:26', 7, 'user', 'approved', 0, 0, NULL),
(45, 'Maricio', '', NULL, '32845792837', 'mauricio50000@gmail.com', NULL, '$2y$12$JjCQG/fMUMEJVXLeOEI5Z.rX89hwMzIazoph7rKXq0H8TmmQ.yCwS', NULL, '2025-01-15 17:27:41', '2025-01-15 17:27:41', 9, 'user', 'approved', 0, 0, NULL),
(46, 'aaaa', NULL, NULL, NULL, 'aaa@email.com', NULL, '$2y$12$5w2Upn/89BTHlNWvXUpuv.6S9ZI8o78zQk3wuo85S6DU.wjDhU6EG', NULL, '2025-01-17 01:45:40', '2025-01-17 01:45:40', NULL, 'user', 'pending', 0, 0, NULL),
(47, 'Mauricio 20', NULL, NULL, NULL, 'mauricio20@buzz.cr', NULL, '$2y$12$BfabpBUqC86MbrUi7GBYb.K44AjkEDSsE4dt/TFy/TSpTSRhi.SF6', NULL, '2025-01-17 16:21:30', '2025-01-17 16:21:30', NULL, 'user', 'pending', NULL, 0, NULL),
(48, 'Mauricio 20', NULL, NULL, NULL, 'mauricio10101@buzz.cr', NULL, '$2y$12$6kK55ZZzzGHnMtK40/hDWefbb3PYs9sfGQVG5QVzVTqhPgP3xjTSe', NULL, '2025-01-17 16:23:53', '2025-01-17 16:23:53', NULL, 'user', 'pending', NULL, 0, NULL),
(49, 'Mauricio 20', NULL, NULL, NULL, 'mauricio2010@buzz.cr', NULL, '$2y$12$L90I8n5DuptR19Sr8JNfReYNNXD9cC7VYL2wOKbQ6sIswLtJ7vcIC', NULL, '2025-01-17 16:25:12', '2025-01-17 16:25:12', NULL, 'user', 'pending', NULL, 0, NULL),
(50, 'Mauricio 20', NULL, NULL, NULL, 'mauricio22100@buzz.cr', NULL, '$2y$12$3Fh.B4hVwXmH07f9eEs8m.gSyPz.AypKBkf1K7CPX0NqxvPuByS5C', NULL, '2025-01-17 16:26:25', '2025-01-17 16:26:25', NULL, 'user', 'pending', NULL, 0, NULL),
(51, 'Mauricio 20', NULL, NULL, NULL, 'mauricio2030@buzz.cr', NULL, '$2y$12$Ze8zS/qMieAtIDMrR1ihUuI1epYF.FZNB66PynXK3jcWvNY1TImRi', NULL, '2025-01-17 16:31:27', '2025-01-17 16:31:27', NULL, 'user', 'pending', NULL, 0, NULL),
(52, 'Oswaldo', 'Alvarez', NULL, NULL, 'evaluador1@buzz.cr', NULL, '$2y$12$gBM.jyCu9Ci9sUNv.P2zo.Azr/wStFBLF0741fvzaUNMqtVh62X8m', NULL, '2025-01-17 20:14:01', '2025-01-17 20:14:45', 7, 'evaluador', 'approved', 1, 0, NULL),
(53, 'Prueba de campo Aprobador', NULL, NULL, NULL, 'aprobador@buzz.cr', NULL, '$2y$12$9CuBA7R.FwwRFBftkLj/1.89HLIEaVTLJdsDCXUWd2PXfpq428qzC', NULL, '2025-01-17 21:23:05', '2025-01-17 21:23:25', 7, 'user', 'pending', 0, 0, NULL),
(54, 'Proceso Aprobado', NULL, NULL, NULL, 'paprobado@buzz.cr', NULL, '$2y$12$lpK4FZhH9gGCrPBXV4jRNedmzUGLs8mgxLJa8Z0HRZXcoLCCGM5Ra', NULL, '2025-01-17 22:00:57', '2025-01-17 22:01:43', 11, 'admin', 'approved', 0, 0, NULL),
(55, 'Mauricio 20', 'aaa', NULL, NULL, 'mauricioteruel98@gmail.com', NULL, '$2y$12$mk3VnM.yDO9uBMGa45ggbeC3aGIofovhmohBXGsO9hZV6Li2AqmqK', NULL, '2025-01-22 19:09:18', '2025-01-22 19:09:18', NULL, 'user', 'pending', NULL, 0, NULL),
(56, 'Mauricio 20', 'a', NULL, NULL, 'mauricio@buzz.cr', NULL, '$2y$12$jUefap9XHIHi3G/Rr3CDP.CmT7ns3lLkpt1RQsbLWvwWhJXv4WRFW', NULL, '2025-01-22 19:11:04', '2025-01-22 19:11:04', NULL, 'user', 'pending', NULL, 0, NULL),
(57, 'Jose', 'Prueba', NULL, '1122334455', 'joseprueba@buzz.cr', NULL, '$2y$12$7g9KaIkUkHy1k/uNNCr7WerMAr55csGLVKysXayAWWYs0X8UE3Pj.', NULL, '2025-01-22 21:14:37', '2025-01-22 21:14:37', 7, 'user', 'approved', 0, 0, NULL),
(58, 'Jose', 'Prueba55', NULL, '555555555555', 'joseprueba55@buzz.cr', NULL, '$2y$12$zPQWNte/18CTLjr5hPnTFuMsC6X0vebnHWWaDk9OxZS7IMcvLrRRa', NULL, '2025-01-22 21:15:23', '2025-01-22 21:15:23', 7, 'user', 'approved', 0, 0, NULL),
(59, 'RAFAEL', 'Costaaaa', NULL, NULL, 'costa@buzz.cr', NULL, '$2y$12$ygATdnS61OT.mJUPCx8DYOgWywFOJ9xqkGt6ZrzrPtHMBo19Z1X2C', NULL, '2025-01-22 21:36:15', '2025-01-22 21:38:12', 12, 'admin', 'approved', 0, 0, NULL),
(60, 'Jose', 'Prueba2', NULL, '1122334455', 'joseprueba2@buzz.cr', NULL, '$2y$12$priUwvHVUwNL908YDHGY2OBH9JAHqPpSejmugE9MXlC5PLXIsGA9C', NULL, '2025-01-27 19:52:09', '2025-01-27 19:52:09', 7, 'user', 'approved', 0, 0, NULL),
(61, 'Jose_Piñango', 'Costaaaa', '112233445566', NULL, 'gabo@gmail.com', NULL, '$2y$12$RLSBFcmBQ3D0Wctnd/07vunKFnY1ODP3A4a1MG.ICdbCSAuAMOJ9q', NULL, '2025-01-27 19:53:27', '2025-01-27 19:57:25', 13, 'admin', 'approved', 0, 0, NULL),
(62, 'Validación Previa AUtoeva', 'Evaluación', NULL, NULL, 'evaluacionprevia@buzz.cr', NULL, '$2y$12$3YwznpKctMwxEODN7B11ie9ZrJvwa/nQ5M6lx96O7b40489/qZqBO', NULL, '2025-01-28 20:22:07', '2025-01-28 20:25:56', 9, 'user', 'pending', NULL, 0, NULL),
(63, 'Evaluación Previa', 'Evaluación', NULL, NULL, 'evaluacionprevia1@buzz.cr', NULL, '$2y$12$DS8DP/wPsAba2hnshs62uuz3BOA8g2sDureNkeaE4NN6F.HLmTTrS', NULL, '2025-01-28 20:23:13', '2025-01-28 20:23:13', NULL, 'user', 'pending', NULL, 0, NULL),
(64, 'Evaluacion previa', 'Previa', NULL, NULL, 'previa@buzz.cr', NULL, '$2y$12$YBLa63pk9GBPx05YJHhPWO389rtsStzO2qhk3k8ee6GK1U6QQ0buO', NULL, '2025-01-28 21:45:53', '2025-01-28 21:45:53', NULL, 'user', 'pending', NULL, 0, NULL),
(65, 'Previa', 'Costaaaa', NULL, NULL, 'previa1@buzz.cr', NULL, '$2y$12$avjValZA6vatgdeY9XVQxuY55F04T0Je8/lazyYMe2YcITzyGsFLG', NULL, '2025-01-28 21:48:49', '2025-01-28 21:49:02', 12, 'user', 'pending', 0, 0, NULL),
(66, 'Nombre1', 'Apellido2', NULL, NULL, 'nombre@buzz.cr', NULL, '$2y$12$1Eg2BufbQzWUGT7t652jR.nlYSZtr7T1SMzl3t55Y6xqqx7EcMjsq', NULL, '2025-01-29 21:02:18', '2025-01-29 21:02:36', 12, 'user', 'pending', 0, 0, NULL),
(67, 'Evaluador', 'Apellido', NULL, '88118811', 'evaluador4@email.com', NULL, '$2y$12$r1XL0GPGDHoQkFMizBY.J.Uvb5VHuP9DGG1aFSMQumYMmoqsV7F8i', NULL, '2025-02-18 15:59:04', '2025-03-04 21:18:46', 7, 'evaluador', 'approved', NULL, 0, 'Puesto laboral'),
(69, 'Juan', 'Perez', NULL, NULL, 'juan@perez.com', NULL, '$2y$12$k2/LymrPcJHTQDjNq.2/Ku0xnSbY86uUNkiHNjfMgO3O058F7FaO.', NULL, '2025-02-25 18:08:27', '2025-02-25 18:11:10', 7, 'user', 'pending', 0, 0, NULL),
(71, 'procomer', 'Suarez', NULL, NULL, 'ing.andreamantilla+24@gmail.com', NULL, '$2y$12$tKAKWgvsS3NKsv5UgqmwU.Gj6ZDSVU5rXAbKRLfqvlGWhRHJNpUFu', NULL, '2025-02-26 15:18:35', '2025-02-26 15:33:59', 7, 'user', 'pending', 0, 0, NULL),
(74, 'juana', 'peresz', NULL, NULL, 'ing.andreamantilla+20@gmail.com', NULL, '$2y$12$9IJ7GJaHek9RoEKoS5YrPuBh1fE2vsBojFPfUMTLz55oJCWLEyi7u', NULL, '2025-02-26 19:00:53', '2025-02-27 14:24:50', 16, 'user', 'approved', 0, 0, NULL),
(75, 'Camilo', 'Jerez', NULL, NULL, 'ing.andreamantilla@gmail.com', NULL, '$2y$12$X9WzFoNau69RoWxyPfx1tuEsYMqK1XJFEg9WlbofP3ZzfXhAv5aly', NULL, '2025-02-26 19:09:33', '2025-02-26 19:10:23', 16, 'admin', 'approved', 0, 0, NULL),
(76, 'juan', 'perez', NULL, NULL, 'juan@admin.com', NULL, '$2y$12$rIQDu6AqmN2SS1OTq8/d5eA0C.qWpzpkcR9I7Nz4.a0tVF3DeaiVi', NULL, '2025-02-26 19:46:29', '2025-02-26 19:46:29', NULL, 'user', 'pending', NULL, 0, NULL),
(77, 'juan', 'perez', NULL, NULL, 'ing.andreamantilla+99@gmail.com', NULL, '$2y$12$P4woq1gtCw2twg8IoB4QvO7joZjZj0wbA9pmgFU/HzO8Pfj5xgwfu', NULL, '2025-02-26 19:47:47', '2025-02-26 19:47:47', NULL, 'user', 'pending', NULL, 0, NULL),
(78, 'andrea', 'evaluador', NULL, '3213213217', 'ing.andreamantilla+ev@gmail.com', NULL, '$2y$12$RYtE/1FmRRfHKMIKQtCnNuwI67UtOcXDziFvi1HvgER6YClPS2bje', NULL, '2025-02-27 20:59:03', '2025-03-05 20:43:08', 19, 'evaluador', 'approved', 0, 0, 'auditor'),
(79, 'ss', 'letras y espacios', 'adfdafadfdf', '12313 213', 'jason@gmail.com', NULL, '$2y$12$/k67aomnNguWUDmQpysJc.Nn1N6tBFaLeotP7mfLiRMNV9GTpKk3e', NULL, '2025-03-03 14:15:11', '2025-03-04 21:15:27', 17, 'admin', 'approved', 0, 1, NULL),
(81, 'admin postobon', 'parra parra', NULL, NULL, 'adminpostobon@gmail.com', NULL, '$2y$12$eRF4Kemk2nyn/jj8cQHyheogWfdC2jThXVMnN.CME1jTra2HvrEwm', NULL, '2025-03-03 20:36:59', '2025-03-03 20:37:50', 18, 'admin', 'approved', 0, 1, NULL),
(82, 'nueva empresa', 'admin empresa', NULL, NULL, 'nuevaempresaadmin@empresa.com', NULL, '$2y$12$h5FdEHn/TY7E/96r2/FO/u6jCsKHHw4DujX.fyQqY7/EA7U6F/ZtS', NULL, '2025-03-04 17:34:59', '2025-03-04 17:36:14', 19, 'admin', 'approved', 0, 1, NULL),
(83, 'Juan Carlos', 'velandia', NULL, NULL, 'juan@gmail.com.co', NULL, '$2y$12$RvslBPxzRLa5o6HwOE340OrcBcAhUAC7F7wjVfXEmiFdd.wT6KrQ2', NULL, '2025-03-04 20:05:59', '2025-03-04 20:06:48', 20, 'admin', 'approved', 0, 1, NULL),
(84, 'Nuevo', 'Usuario', NULL, NULL, 'nuevo@gmail.com', NULL, '$2y$12$023gRa1P/WdZ1i7xhUPBFuv2nBi.kNVDsEvitIuKpCrRH6EWLCOFC', NULL, '2025-03-04 20:42:19', '2025-03-04 20:42:19', NULL, 'user', 'pending', NULL, 1, NULL),
(85, 'Nombre', 'C de telecomunicaciaones SDFADF', NULL, '88118811', 'ing.andreamantilla+@gmail.com', NULL, '$2y$12$SuQZDalC0R9FAt1LlTIzPOTIWGamocy4dByOkdgfbg.bO3C8ZOpg2', NULL, '2025-03-04 20:45:03', '2025-03-04 23:02:20', 10, 'user', 'pending', NULL, 1, 'Puesto'),
(86, 'Test', 'Brenes Mata', NULL, NULL, 'correofantasma@mail.com', NULL, '$2y$12$.DcINltw4ykUY7.cxrSRdOsd0MiSc0PH87LKFpJ9xlvT0TOgUvmPa', NULL, '2025-03-04 23:18:33', '2025-03-04 23:18:33', NULL, 'user', 'pending', NULL, 1, NULL),
(87, 'Usuario', 'Prueba', NULL, NULL, 'prueba@prueba.com', NULL, '$2y$12$RHHX5gamL8fIVJSI24MlZerKNQuBqFFUU158hvXyYe7E2algkEBcK', NULL, '2025-03-05 14:22:48', '2025-03-05 14:23:15', 21, 'admin', 'approved', 0, 1, NULL),
(88, 'nuevo usuario', 'apellidos', NULL, '321321311', 'nuevaempresauser@gmail.com', NULL, '$2y$12$LldS/NkJSSZLwdrTAkLkNeFs59l4E.vPr96Q44cKPo9ZTU9NDu9N2', NULL, '2025-03-05 19:14:29', '2025-03-05 19:14:29', 19, 'user', 'approved', NULL, 0, 'puesto'),
(89, 'nombres', 'apellidos', NULL, '123456789', 'nuevaempresa2@empresa.com', NULL, '$2y$12$9f191kw6hSvrnwW4TxgbkeaO4TzjVdvfUhGcC6BBl2nXa5bCPs7cW', NULL, '2025-03-05 19:14:55', '2025-03-05 19:14:55', 19, 'user', 'approved', NULL, 0, 'puesto'),
(90, 'carlos', 'suarez', NULL, NULL, 'carlosusuario@gmail.com', NULL, '$2y$12$LaLfGPai0yqaG5aM90yY9O8HyQYW0MOdPe/..YBPNqgf24omc7vM2', NULL, '2025-03-05 19:29:33', '2025-03-05 19:30:08', 22, 'admin', 'approved', 0, 1, NULL),
(91, 'Andrea', 'Mantilla', NULL, NULL, 'nueva@gmail.com', NULL, '$2y$12$jA01x4PRlLc6W2LYxvmXeuOjVbXTM813azlulFq5gmLTnKkSglfEa', NULL, '2025-03-05 20:47:01', '2025-03-05 20:47:01', NULL, 'user', 'pending', NULL, 1, NULL),
(92, 'michael', 'parra', NULL, NULL, 'admin.sena@gmail.com', NULL, '$2y$12$nvceEBz2JDyGmuOeZOTNx.j5kATAI5F40o61fz/p2UjzYnBOCY7lu', NULL, '2025-03-05 22:11:28', '2025-03-05 22:12:38', 23, 'admin', 'approved', 0, 1, NULL),
(93, 'Juan', 'Ficticio', NULL, NULL, 'juan@ficticio.com', NULL, '$2y$12$1azC/O9NLt8Pc6YSqdEm8O/4lsXddbao9jnHdnvR1mbLAY5poZ3uK', NULL, '2025-03-06 17:52:42', '2025-03-06 17:53:15', 24, 'admin', 'approved', 0, 1, NULL),
(94, 'Juan', 'Ficticio', NULL, NULL, 'juan@fictiocio2.com', NULL, '$2y$12$oxtGmnZSEmIh6X8GyDE0eetMN2zuJuo5jD9oixBSLIkG/cSEMsp0m', NULL, '2025-03-06 19:43:39', '2025-03-06 19:44:06', 25, 'admin', 'approved', 0, 1, NULL),
(95, 'Juan', 'Ficticio Tres', NULL, NULL, 'juan@ficticio3.com', NULL, '$2y$12$UCOv4kGmKMLWzi3IW.Rgdek7dyv1rnkNUdgR//j85TMyztYt0tS9.', NULL, '2025-03-06 22:04:22', '2025-03-06 22:04:46', 26, 'admin', 'approved', 0, 1, NULL),
(96, 'Diana', 'Badilla', NULL, '111111111111', 'dbadilla@procomer.com', NULL, '$2y$12$qdGw5Nm7d1/RhfrmjiJLKOJk.6oZrDJrmVLE1bZQeIOBEJZh7aDfi', NULL, '2025-03-06 22:21:41', '2025-03-06 22:21:41', 14, 'super_admin', 'approved', NULL, 0, 'Administradora General'),
(97, 'Juan', 'Ficticio Cuatro', NULL, NULL, 'juan@ficticio4.com', NULL, '$2y$12$1wu2abVZSFLaNi9Qs2fjA.M6efgWcM2raXiQYM5TyOABLa2Tuh/yq', NULL, '2025-03-06 22:33:56', '2025-03-06 22:34:38', 27, 'admin', 'approved', 0, 1, NULL),
(98, 'Juan', 'Ficticio Cinco', NULL, NULL, 'juan@ficticio5.com', NULL, '$2y$12$DyVKPaIf1coGy2o5YgbtWe0YxNQ274l1X8DT8NBirMgaov7S28gNi', NULL, '2025-03-06 22:42:46', '2025-03-06 22:43:12', 28, 'admin', 'approved', 0, 1, NULL),
(99, 'Juan', 'Ficticio', NULL, NULL, 'juan@ficticio6.com', NULL, '$2y$12$8/iUCUoqDKtAtfp5IwQWP.6E6VPKreERl2R3VQa961kGruM4PIuvC', 'TDlbkXGOuJLg3gS0aePgR4IBH3pxVmTOkWM4hvgzS9Qy1X7L9ChjbwKl24gp', '2025-03-06 23:02:27', '2025-03-07 00:47:22', 29, 'admin', 'approved', 0, 1, NULL),
(100, 'Juan', 'Ficticio', NULL, NULL, 'juan@ficticio7.com', NULL, '$2y$12$JG1XhuPPek1hcu/EmLcdxeuT0ebiUcANIucdaB5VLlnxBtDO9lh4u', NULL, '2025-03-06 23:28:49', '2025-03-06 23:29:26', 30, 'admin', 'approved', 0, 1, NULL),
(101, 'Juan', 'Ficticio', NULL, NULL, 'juan@ficticio8.com', NULL, '$2y$12$8G4GVJVbaV0LNFj3MwF07.g7W8EwhnfsXuzRYdPrORKW28gVjjbpC', NULL, '2025-03-06 23:45:41', '2025-03-06 23:46:03', 31, 'admin', 'approved', 0, 1, NULL),
(102, 'Juan', 'Ficticio', NULL, NULL, 'juan@ficticio9.com', NULL, '$2y$12$./ZcXWtyN18Ejos6Zs1uDO1/RQP37FxxnTFzHDi7WPYljs3HqRYlK', NULL, '2025-03-07 01:18:16', '2025-03-07 01:18:35', 32, 'admin', 'approved', 0, 1, NULL),
(103, 'Juan', 'Ficticio diez', NULL, NULL, 'juan@ficticio10.com', NULL, '$2y$12$v.5y5WAqhUNRaSI3uItwjOq.2fyikUnmLfVaEEkTBsw3UJkAut0/O', NULL, '2025-03-07 01:44:55', '2025-03-07 01:45:15', 33, 'admin', 'approved', 0, 1, NULL),
(104, 'Juan', 'Ficticio', NULL, NULL, 'juan@ficticio11.com', NULL, '$2y$12$HVxaAxYx/yZAjwUGW5I9JeupYphB86Wx864FXjvwSj.i6PzZ8A7J6', NULL, '2025-03-07 03:28:38', '2025-03-07 03:29:01', 34, 'admin', 'approved', 0, 1, NULL),
(105, 'Juan', 'Fic', NULL, NULL, 'juan@ficticio12.com', NULL, '$2y$12$imLztBrNicqWHyt6aG0/peOeVIa2hUkMe0Yl3xkGYOS0u0xWFnNKy', '9obqhKl0O3CCemvBOdQtg3M4KP3skdoQLoSoyckXhBTgbxtn8FiAA5NtXkLZ', '2025-03-07 18:04:03', '2025-03-07 18:10:10', 35, 'admin', 'approved', 0, 1, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `values`
--

CREATE TABLE `values` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `minimum_score` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `values`
--

INSERT INTO `values` (`id`, `name`, `slug`, `minimum_score`, `is_active`, `created_at`, `updated_at`) VALUES
(31, 'Excelencia', 'excelencia', 50, 1, '2024-12-11 23:40:36', '2025-03-06 19:52:16'),
(32, 'Innovación', 'innovacion', 50, 1, '2024-12-11 23:40:36', '2025-03-06 19:52:13'),
(33, 'Progreso social', 'progreso-social', 50, 1, '2024-12-11 23:40:36', '2025-03-06 19:52:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `value_subcategory`
--

CREATE TABLE `value_subcategory` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `value_id` bigint(20) UNSIGNED NOT NULL,
  `subcategory_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auto_evaluation_result`
--
ALTER TABLE `auto_evaluation_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auto_evaluation_result_company_id_foreign` (`company_id`);

--
-- Indices de la tabla `auto_evaluation_subcategory_result`
--
ALTER TABLE `auto_evaluation_subcategory_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auto_evaluation_subcategory_result_company_id_foreign` (`company_id`),
  ADD KEY `auto_evaluation_subcategory_result_value_id_foreign` (`value_id`),
  ADD KEY `auto_evaluation_subcategory_result_subcategory_id_foreign` (`subcategory_id`);

--
-- Indices de la tabla `auto_evaluation_valor_result`
--
ALTER TABLE `auto_evaluation_valor_result`
  ADD PRIMARY KEY (`id`),
  ADD KEY `auto_evaluation_valor_result_company_id_foreign` (`company_id`),
  ADD KEY `auto_evaluation_valor_result_value_id_foreign` (`value_id`);

--
-- Indices de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `available_certifications_nombre_unique` (`nombre`);

--
-- Indices de la tabla `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indices de la tabla `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `certifications_company_id_foreign` (`company_id`);

--
-- Indices de la tabla `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `companies_legal_id_unique` (`legal_id`);

--
-- Indices de la tabla `company_evaluator`
--
ALTER TABLE `company_evaluator`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `company_evaluator_company_id_user_id_unique` (`company_id`,`user_id`),
  ADD KEY `company_evaluator_user_id_foreign` (`user_id`);

--
-- Indices de la tabla `company_products`
--
ALTER TABLE `company_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_products_company_id_foreign` (`company_id`),
  ADD KEY `company_products_info_adicional_empresa_id_foreign` (`info_adicional_empresa_id`);

--
-- Indices de la tabla `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluation_questions_indicator_id_foreign` (`indicator_id`);

--
-- Indices de la tabla `evaluation_value_results`
--
ALTER TABLE `evaluation_value_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluation_value_results_company_id_foreign` (`company_id`),
  ADD KEY `evaluation_value_results_value_id_foreign` (`value_id`);

--
-- Indices de la tabla `evaluation_value_result_reference`
--
ALTER TABLE `evaluation_value_result_reference`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluation_value_result_reference_company_id_foreign` (`company_id`),
  ADD KEY `evaluation_value_result_reference_value_id_foreign` (`value_id`);

--
-- Indices de la tabla `evaluator_assessments`
--
ALTER TABLE `evaluator_assessments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluator_assessments_user_id_foreign` (`user_id`),
  ADD KEY `evaluator_assessments_evaluation_question_id_foreign` (`evaluation_question_id`),
  ADD KEY `evaluator_assessments_indicator_id_foreign` (`indicator_id`),
  ADD KEY `evaluator_assessments_company_id_evaluation_question_id_index` (`company_id`,`evaluation_question_id`);

--
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indices de la tabla `indicators`
--
ALTER TABLE `indicators`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicators_value_id_foreign` (`value_id`),
  ADD KEY `indicators_requisito_id_foreign` (`requisito_id`);

--
-- Indices de la tabla `indicator_answers`
--
ALTER TABLE `indicator_answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicator_answers_user_id_foreign` (`user_id`),
  ADD KEY `indicator_answers_company_id_foreign` (`company_id`),
  ADD KEY `indicator_answers_indicator_id_foreign` (`indicator_id`);

--
-- Indices de la tabla `indicator_answers_evaluation`
--
ALTER TABLE `indicator_answers_evaluation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicator_answers_evaluation_user_id_foreign` (`user_id`),
  ADD KEY `indicator_answers_evaluation_company_id_foreign` (`company_id`),
  ADD KEY `indicator_answers_evaluation_indicator_id_foreign` (`indicator_id`);

--
-- Indices de la tabla `indicator_homologation`
--
ALTER TABLE `indicator_homologation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `indicator_homologation_indicator_id_foreign` (`indicator_id`),
  ADD KEY `indicator_homologation_homologation_id_foreign` (`homologation_id`);

--
-- Indices de la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `info_adicional_empresas_company_id_foreign` (`company_id`);

--
-- Indices de la tabla `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indices de la tabla `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indices de la tabla `requisitos`
--
ALTER TABLE `requisitos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `value_id` (`value_id`),
  ADD KEY `subcategory_id` (`subcategory_id`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indices de la tabla `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subcategories_value_id_foreign` (`value_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_company_id_foreign` (`company_id`);

--
-- Indices de la tabla `values`
--
ALTER TABLE `values`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `values_slug_unique` (`slug`);

--
-- Indices de la tabla `value_subcategory`
--
ALTER TABLE `value_subcategory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `value_subcategory_value_id_foreign` (`value_id`),
  ADD KEY `value_subcategory_subcategory_id_foreign` (`subcategory_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_result`
--
ALTER TABLE `auto_evaluation_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_subcategory_result`
--
ALTER TABLE `auto_evaluation_subcategory_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=427;

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_valor_result`
--
ALTER TABLE `auto_evaluation_valor_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=179;

--
-- AUTO_INCREMENT de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `company_evaluator`
--
ALTER TABLE `company_evaluator`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=208;

--
-- AUTO_INCREMENT de la tabla `company_products`
--
ALTER TABLE `company_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=462;

--
-- AUTO_INCREMENT de la tabla `evaluation_value_results`
--
ALTER TABLE `evaluation_value_results`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT de la tabla `evaluation_value_result_reference`
--
ALTER TABLE `evaluation_value_result_reference`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `evaluator_assessments`
--
ALTER TABLE `evaluator_assessments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT de la tabla `indicator_answers`
--
ALTER TABLE `indicator_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1074;

--
-- AUTO_INCREMENT de la tabla `indicator_answers_evaluation`
--
ALTER TABLE `indicator_answers_evaluation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=706;

--
-- AUTO_INCREMENT de la tabla `indicator_homologation`
--
ALTER TABLE `indicator_homologation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=299;

--
-- AUTO_INCREMENT de la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `requisitos`
--
ALTER TABLE `requisitos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=64;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT de la tabla `values`
--
ALTER TABLE `values`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `value_subcategory`
--
ALTER TABLE `value_subcategory`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auto_evaluation_result`
--
ALTER TABLE `auto_evaluation_result`
  ADD CONSTRAINT `auto_evaluation_result_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `auto_evaluation_subcategory_result`
--
ALTER TABLE `auto_evaluation_subcategory_result`
  ADD CONSTRAINT `auto_evaluation_subcategory_result_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auto_evaluation_subcategory_result_subcategory_id_foreign` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `auto_evaluation_subcategory_result_value_id_foreign` FOREIGN KEY (`value_id`) REFERENCES `values` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `auto_evaluation_valor_result`
--
ALTER TABLE `auto_evaluation_valor_result`
  ADD CONSTRAINT `auto_evaluation_valor_result_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `company_evaluator`
--
ALTER TABLE `company_evaluator`
  ADD CONSTRAINT `company_evaluator_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_evaluator_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `evaluation_value_results`
--
ALTER TABLE `evaluation_value_results`
  ADD CONSTRAINT `evaluation_value_results_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `evaluation_value_results_value_id_foreign` FOREIGN KEY (`value_id`) REFERENCES `values` (`id`);

--
-- Filtros para la tabla `evaluation_value_result_reference`
--
ALTER TABLE `evaluation_value_result_reference`
  ADD CONSTRAINT `evaluation_value_result_reference_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `evaluation_value_result_reference_value_id_foreign` FOREIGN KEY (`value_id`) REFERENCES `values` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
