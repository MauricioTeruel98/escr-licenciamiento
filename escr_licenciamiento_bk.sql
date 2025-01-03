-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-01-2025 a las 14:41:42
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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `auto_evaluation_result`
--

INSERT INTO `auto_evaluation_result` (`id`, `company_id`, `nota`, `status`, `fecha_aprobacion`, `created_at`, `updated_at`) VALUES
(15, 7, 0, 'apto', '2024-12-13 00:23:05', '2024-12-12 01:51:02', '2024-12-13 00:23:05'),
(16, 9, 0, 'apto', '2024-12-27 21:25:32', '2024-12-27 21:24:39', '2024-12-27 21:25:32');

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
(90, 7, 31, 25, 50, '2024-12-12 20:13:55', '2024-12-12 01:51:02', '2024-12-12 20:13:55'),
(91, 7, 31, 26, 100, '2024-12-12 20:13:55', '2024-12-12 01:51:02', '2024-12-12 20:13:55'),
(92, 7, 31, 27, 100, '2024-12-12 20:13:55', '2024-12-12 01:51:02', '2024-12-12 20:13:55'),
(93, 7, 31, 28, 100, '2024-12-12 20:13:55', '2024-12-12 01:51:02', '2024-12-12 20:13:55'),
(94, 7, 32, 29, 100, '2024-12-12 01:51:42', '2024-12-12 01:51:12', '2024-12-12 01:51:42'),
(95, 7, 32, 30, 100, '2024-12-12 01:51:42', '2024-12-12 01:51:12', '2024-12-12 01:51:42'),
(96, 7, 32, 31, 100, '2024-12-12 01:51:42', '2024-12-12 01:51:12', '2024-12-12 01:51:42'),
(97, 7, 32, 32, 100, '2024-12-12 01:51:42', '2024-12-12 01:51:12', '2024-12-12 01:51:42'),
(98, 7, 33, 33, 100, '2024-12-12 01:51:17', '2024-12-12 01:51:17', '2024-12-12 01:51:17'),
(99, 7, 34, 34, 100, '2024-12-13 00:23:05', '2024-12-12 01:51:22', '2024-12-13 00:23:05'),
(100, 7, 35, 35, 100, '2024-12-12 01:51:49', '2024-12-12 01:51:26', '2024-12-12 01:51:49'),
(101, 7, 34, 36, 100, '2024-12-13 00:23:05', '2024-12-13 00:23:05', '2024-12-13 00:23:05'),
(102, 9, 31, 25, 100, '2024-12-27 21:24:39', '2024-12-27 21:24:39', '2024-12-27 21:24:39'),
(103, 9, 31, 26, 100, '2024-12-27 21:24:39', '2024-12-27 21:24:39', '2024-12-27 21:24:39'),
(104, 9, 31, 27, 100, '2024-12-27 21:24:39', '2024-12-27 21:24:39', '2024-12-27 21:24:39'),
(105, 9, 31, 28, 100, '2024-12-27 21:24:39', '2024-12-27 21:24:39', '2024-12-27 21:24:39'),
(106, 9, 32, 29, 100, '2024-12-27 21:24:50', '2024-12-27 21:24:50', '2024-12-27 21:24:50'),
(107, 9, 32, 30, 100, '2024-12-27 21:24:50', '2024-12-27 21:24:50', '2024-12-27 21:24:50'),
(108, 9, 32, 31, 100, '2024-12-27 21:24:50', '2024-12-27 21:24:50', '2024-12-27 21:24:50'),
(109, 9, 32, 32, 100, '2024-12-27 21:24:50', '2024-12-27 21:24:50', '2024-12-27 21:24:50'),
(110, 9, 33, 33, 100, '2024-12-27 21:25:08', '2024-12-27 21:25:08', '2024-12-27 21:25:08'),
(111, 9, 34, 34, 100, '2024-12-27 21:25:15', '2024-12-27 21:25:15', '2024-12-27 21:25:15'),
(112, 9, 34, 36, 100, '2024-12-27 21:25:15', '2024-12-27 21:25:15', '2024-12-27 21:25:15'),
(113, 9, 35, 35, 100, '2024-12-27 21:25:32', '2024-12-27 21:25:32', '2024-12-27 21:25:32');

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
(60, 7, 31, NULL, 88, '2024-12-12 20:13:55', '2024-12-12 01:51:02', '2024-12-12 20:13:55'),
(61, 7, 32, NULL, 100, '2024-12-12 01:51:42', '2024-12-12 01:51:12', '2024-12-12 01:51:42'),
(62, 7, 33, NULL, 100, '2024-12-12 01:51:17', '2024-12-12 01:51:17', '2024-12-12 01:51:17'),
(63, 7, 34, NULL, 100, '2024-12-13 00:23:05', '2024-12-12 01:51:22', '2024-12-13 00:23:05'),
(64, 7, 35, NULL, 100, '2024-12-12 01:51:49', '2024-12-12 01:51:26', '2024-12-12 01:51:49'),
(65, 9, 31, NULL, 100, '2024-12-27 21:24:39', '2024-12-27 21:24:39', '2024-12-27 21:24:39'),
(66, 9, 32, NULL, 100, '2024-12-27 21:24:50', '2024-12-27 21:24:50', '2024-12-27 21:24:50'),
(67, 9, 33, NULL, 100, '2024-12-27 21:25:08', '2024-12-27 21:25:08', '2024-12-27 21:25:08'),
(68, 9, 34, NULL, 100, '2024-12-27 21:25:15', '2024-12-27 21:25:15', '2024-12-27 21:25:15'),
(69, 9, 35, NULL, 100, '2024-12-27 21:25:32', '2024-12-27 21:25:32', '2024-12-27 21:25:32');

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
(1, 'INTE B5:2020', NULL, '2024-11-18 22:42:07', '2024-11-28 19:04:27', 1, NULL, NULL),
(2, 'INTE G12:2019', NULL, '2024-11-18 22:42:07', '2024-11-18 22:42:07', 1, NULL, NULL),
(3, 'INTE G8:2013', NULL, '2024-11-18 22:42:07', '2024-11-18 22:42:07', 1, NULL, NULL),
(5, 'ISO:9001', 'ISO 9001', '2024-11-20 23:37:14', '2024-11-20 23:37:14', 1, NULL, NULL),
(6, 'INTE G:2896', 'INTE G:2896', '2024-11-20 23:53:15', '2024-11-20 23:53:15', 1, 'INTE', 'PROGRESO_SOCIAL');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `homologation_id` bigint(20) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `certifications`
--

INSERT INTO `certifications` (`id`, `company_id`, `nombre`, `fecha_obtencion`, `fecha_expiracion`, `indicadores`, `created_at`, `updated_at`, `homologation_id`) VALUES
(20, 7, 'INTE B5:2020', '2025-01-01', '2025-02-02', 2, '2025-01-03 16:39:01', '2025-01-03 16:39:01', 1),
(21, 7, 'ISO:9001', '2025-01-01', '2025-02-02', 3, '2025-01-03 16:39:17', '2025-01-03 16:39:17', 5);

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
  `city` varchar(255) NOT NULL,
  `commercial_activity` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `mobile` varchar(255) NOT NULL,
  `is_exporter` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `legal_id`, `name`, `website`, `sector`, `city`, `commercial_activity`, `phone`, `mobile`, `is_exporter`, `created_at`, `updated_at`, `status`) VALUES
(7, '123456789', 'Buzz', 'https://buzz.cr', 'tecnologia', 'san-jose', 'Servicios', '5415641', '641656', 1, '2024-11-15 01:01:15', '2024-11-15 01:01:15', 'active'),
(9, '987654321', 'Prueba', 'https://localhost.com.ar', 'Manufactura', 'Heredia', 'Productora Agropecuaria', '9234875000000', '20385700000', 1, '2024-11-15 01:34:14', '2024-11-15 02:01:47', 'active');

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `evaluation_questions`
--

CREATE TABLE `evaluation_questions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `indicator_id` bigint(20) UNSIGNED NOT NULL,
  `question` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `evaluation_questions`
--

INSERT INTO `evaluation_questions` (`id`, `indicator_id`, `question`, `created_at`, `updated_at`) VALUES
(15, 35, '¿Se identifican oportunidades y amenazas del mercado?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(16, 35, '¿Se evalúan las tendencias del sector?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(20, 37, '¿Existen mecanismos de medición?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(21, 37, '¿Se analizan las quejas y reclamos?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(22, 37, '¿Se implementan mejoras basadas en la retroalimentación?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(23, 38, '¿Existen indicadores de proceso?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(24, 38, '¿Se realiza mejora continua?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(25, 38, '¿Se controlan los procesos críticos?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(26, 39, '¿Se destinan recursos para innovación?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(27, 39, '¿Se mide el impacto de las innovaciones?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(28, 40, '¿Existen programas de incentivos para la innovación?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(29, 40, '¿Se promueve la generación de ideas?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(30, 41, '¿Se desarrollan nuevos productos/servicios?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(31, 41, '¿Se mejoran los existentes?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(32, 42, '¿Se implementan nuevas tecnologías?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(33, 42, '¿Se optimizan los procesos existentes?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(34, 43, '¿Existen objetivos de impacto social?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(35, 43, '¿Se mide el impacto en la comunidad?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(36, 44, '¿Se tienen objetivos ambientales?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(37, 44, '¿Se mide la huella de carbono?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(38, 45, '¿Se tienen convenios con otras organizaciones?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(39, 45, '¿Se mide el impacto de las alianzas?', '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(41, 34, '¿El plan estratégico está alineado con la misión y visión?', '2025-01-02 23:29:37', '2025-01-02 23:29:37'),
(42, 34, '¿Se revisa periódicamente el cumplimiento del plan?', '2025-01-02 23:29:37', '2025-01-02 23:29:37'),
(43, 34, '¿Existe un proceso de seguimiento y medición de objetivos?', '2025-01-02 23:29:37', '2025-01-02 23:29:37'),
(44, 36, '¿Se identifican necesidades de formación?', '2025-01-02 23:29:46', '2025-01-02 23:29:46'),
(45, 36, '¿Se evalúa la efectividad de las capacitaciones?', '2025-01-02 23:29:46', '2025-01-02 23:29:46'),
(46, 36, '¿Existe un presupuesto asignado para formación?', '2025-01-02 23:29:46', '2025-01-02 23:29:46'),
(47, 46, '¿Hola Mundo?', '2025-01-02 23:30:19', '2025-01-02 23:30:19');

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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `indicators`
--

INSERT INTO `indicators` (`id`, `name`, `binding`, `self_evaluation_question`, `value_id`, `subcategory_id`, `evaluation_questions`, `guide`, `is_active`, `created_at`, `updated_at`) VALUES
(34, 'E1.1', 1, '¿La empresa cuenta con un plan estratégico documentado?', 31, 25, '[\"\\u00bfEl plan estrat\\u00e9gico est\\u00e1 alineado con la misi\\u00f3n y visi\\u00f3n?\",\"\\u00bfSe revisa peri\\u00f3dicamente el cumplimiento del plan?\",\"\\u00bfExiste un proceso de seguimiento y medici\\u00f3n de objetivos?\"]', 'Verificar la existencia y aplicación del plan estratégico', 1, '2024-12-11 23:40:36', '2025-01-02 23:29:37'),
(35, 'E1.2', 0, '¿Se realiza análisis del entorno empresarial?', 31, 25, NULL, 'Revisar documentación de análisis FODA y estudios de mercado', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(36, 'C1.1', 1, '¿Existe un plan de capacitación?', 31, 26, '[\"\\u00bfSe identifican necesidades de formaci\\u00f3n?\",\"\\u00bfSe eval\\u00faa la efectividad de las capacitaciones?\",\"\\u00bfExiste un presupuesto asignado para formaci\\u00f3n?\"]', 'Verificar plan de capacitación y registros de formación', 1, '2024-12-11 23:40:36', '2025-01-02 23:29:46'),
(37, 'EC1.1', 0, '¿Se mide la satisfacción del cliente?', 31, 27, NULL, 'Revisar sistema de medición de satisfacción', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(38, 'P1.1', 1, '¿Se tienen procesos documentados y controlados?', 31, 28, NULL, 'Revisar documentación y control de procesos', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(39, 'IE1.1', 1, '¿Existe una estrategia de innovación?', 32, 29, NULL, 'Verificar estrategia y recursos para innovación', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(40, 'IC1.1', 1, '¿Se fomenta la cultura de innovación?', 32, 30, NULL, 'Revisar programas de fomento a la innovación', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(41, 'IEC1.1', 1, '¿Se innova en productos y servicios?', 32, 31, NULL, 'Verificar desarrollo de nuevos productos/servicios', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(42, 'IP1.1', 1, '¿Se innova en procesos?', 32, 32, NULL, 'Revisar mejoras e innovaciones en procesos', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(43, 'PS1.1', 1, '¿Se incluye el impacto social en la estrategia?', 33, 33, NULL, 'Verificar estrategia de impacto social', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(44, 'S1.1', 1, '¿Existe una estrategia de sostenibilidad?', 34, 34, NULL, 'Verificar estrategia ambiental', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(45, 'V1.1', 1, '¿Existen alianzas estratégicas?', 35, 35, NULL, 'Verificar convenios y alianzas', 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(46, 'S2', 0, '¿Hola?', 34, 36, '[\"\\u00bfHola Mundo?\"]', NULL, 1, '2024-12-13 00:22:51', '2024-12-13 00:22:51');

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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `indicator_answers`
--

INSERT INTO `indicator_answers` (`id`, `user_id`, `company_id`, `indicator_id`, `answer`, `is_binding`, `created_at`, `updated_at`) VALUES
(236, 26, 9, 45, '1', 1, '2024-12-27 21:25:32', '2024-12-27 21:25:32');

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
  `description` varchar(255) NOT NULL,
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
(15, 34, 1, NULL, NULL),
(16, 34, 2, NULL, NULL),
(17, 36, 5, NULL, NULL),
(18, 46, 5, NULL, NULL),
(19, 46, 6, NULL, NULL);

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
(33, '2025_01_03_131523_add_homologation_id_to_certifications_table', 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
('4VRGObkdrZwD0769P22bJVbPL2YCJ6unCLJPdqXf', 18, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiR2RXb2MycWNrd1loa25OdGZGRThkNG5YdU56ZVRPVXdIT1AzeEVxUSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTg7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jZXJ0aWZpY2F0aW9ucy9jcmVhdGUiO319', 1735851152),
('l1ChJzT8AeVlVikHUqnszFtDZWIoIDsnzyXfZeoR', 37, '127.0.0.1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNnl5M3JMZGpPNDdpM29NZ01qVkVEYlMwenQ4ZXRWNTJ5cEFGZlhGQyI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6NDM6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9jZXJ0aWZpY2F0aW9ucy9jcmVhdGUiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTozNzt9', 1735911670),
('XlnG5hig5GkHfQytRA2WJ5gsdt8m5QkjYBDFy5RW', 37, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiNEduNHIzZEw1c0thbm5TckV3ckVCYzZZQmNKWmQ4YU83TDV4djEwQSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6Mzc7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mzg6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9zdXBlci9pbmRpY2F0b3JzIjt9fQ==', 1735849825);

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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `subcategories`
--

INSERT INTO `subcategories` (`id`, `name`, `description`, `value_id`, `is_active`, `created_at`, `updated_at`) VALUES
(25, 'Estrategia Empresarial', NULL, 31, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(26, 'Cultura organizacional', NULL, 31, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(27, 'Experiencia del cliente y calidad', NULL, 31, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(28, 'Proceso y cadena de suministro', NULL, 31, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(29, 'Estrategia Empresarial', NULL, 32, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(30, 'Cultura organizacional', NULL, 32, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(31, 'Experiencia del cliente y calidad', NULL, 32, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(32, 'Proceso y cadena de suministro', NULL, 32, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(33, 'Estrategia Empresarial', NULL, 33, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(34, 'Estrategia Empresarial', NULL, 34, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(35, 'Estrategia Empresarial', NULL, 35, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(36, 'Cultura organizacional', NULL, 34, 1, '2024-12-13 00:21:58', '2024-12-13 00:21:58');

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
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `id_number`, `phone`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `company_id`, `role`, `status`) VALUES
(18, 'Admin', 'Buzz', '41125546', '38155289832', 'admin@buzz.com', NULL, '$2y$12$mVQYud6VqEmady6.GBDFgOjAlnczYmWPCzhrM8rW1rdePIEuTFWvW', NULL, '2024-11-15 01:00:54', '2024-11-15 19:04:48', 7, 'admin', 'approved'),
(19, 'Mauricio', 'null', NULL, '515641451', 'mauricio@buzz.cr', NULL, '$2y$12$UaxIQEM6jyf71N/D0MYK3uQNoVBv.An71L1h32DGwB2VPE6OvMDWi', NULL, '2024-11-15 01:01:33', '2024-11-18 20:15:07', 7, 'user', 'approved'),
(21, 'Mauricio', NULL, NULL, NULL, 'mauricio@email.com', NULL, '$2y$12$WlgSoQwLJpbaMvpC8By/zulkti6YiIWvoprY5tEu1oXHQheRaTiN6', NULL, '2024-11-15 01:23:58', '2024-11-15 01:24:42', 7, 'user', 'approved'),
(22, 'Mauricio 2', NULL, NULL, NULL, 'mauricio2@email.com', NULL, '$2y$12$/JG31Cth3bQLlWkB/OqTnO3GN0DtvYzLvkXmZ1MHOz9iVPM4D2b2y', NULL, '2024-11-15 01:25:30', '2024-11-15 01:28:50', 7, 'user', 'approved'),
(23, 'Mauricio 3', NULL, NULL, NULL, 'mauricio3@email.com', NULL, '$2y$12$oMP/uctaH4uMYPJRd9Ta4eIv5ke2jcT01NK9sCSUieG0lFS5SxC.C', NULL, '2024-11-15 01:30:19', '2024-11-15 01:30:32', 7, 'user', 'approved'),
(24, 'Mauricio 4', NULL, NULL, NULL, 'mauricio4@email.com', NULL, '$2y$12$405q2FyfiluSLtGkMNTcC.Pv5wJBIttXRFPnJ7xl6F8jgsMtMQAzu', NULL, '2024-11-15 01:31:14', '2024-11-15 21:21:40', 7, 'user', 'approved'),
(26, 'Admin Teruel', NULL, NULL, NULL, 'admin@teruel.com', NULL, '$2y$12$bSe..UDHVUa6DOiKr5gLruHQd3mN/OahDxVBNvCbrJlmJ9qos9PjC', NULL, '2024-11-15 01:33:50', '2024-11-15 01:34:14', 9, 'admin', 'approved'),
(28, 'Mauricio', '5', NULL, '32845792837', 'mauricio5@gmail.com', NULL, '$2y$12$K3MrXaDImp58HppwVgD4JuqPUP9BoLs0wUkI9d89o1n3aWTnEUagy', NULL, '2024-11-15 21:10:43', '2024-11-15 21:10:43', 7, 'user', 'approved'),
(29, 'Mauricio 7', NULL, NULL, NULL, 'mauricio7@buzz.cr', NULL, '$2y$12$9rdk7gUV9229oLOvMMAADOm80N6jcQJ5H9kphvdfW77Y8qT1mSal6', NULL, '2024-11-15 21:22:20', '2024-11-15 21:48:21', 7, 'user', 'rejected'),
(30, 'Mauricio 8', NULL, NULL, NULL, 'mauricio8@buzz.cr', NULL, '$2y$12$B7OeNuSBZEHuol6oa.8M7.ZcoL4U.OlJhR1GwNogklRv0Irif.SDu', NULL, '2024-11-15 21:42:04', '2024-11-19 00:31:57', 7, 'user', 'rejected'),
(31, 'Mauricio 10', NULL, NULL, NULL, 'mauricio10@buzz.cr', NULL, '$2y$12$OeyzCz5jMIryrwYep4.XceJFwBCLTX/0oziXSqmtiodVkEnup95Ti', NULL, '2024-11-19 01:06:59', '2024-11-19 01:59:38', 7, 'user', 'rejected'),
(34, 'Mauricio Teruel 1', NULL, NULL, NULL, 'mauricioteruel98@gmail.com', NULL, '$2y$12$E5UGpVLJ.CUv7ygv5QrxtOf90cLQFLvMkcwQkiXqSnK9v6LqB5fsS', NULL, '2024-11-19 20:16:28', '2024-11-19 20:32:02', 7, 'user', 'rejected'),
(35, 'Mauricio Teruel', NULL, NULL, NULL, 'mauricioteruel1998@gmail.com', NULL, '$2y$12$we8XoQJjyVJe3OaTocDuBuaghnFTWjknoFBa.nddU6D.b.tPt4rWm', NULL, '2024-11-19 22:37:42', '2024-11-19 23:04:13', 7, 'user', 'approved'),
(36, 'TITITITITIT', '', NULL, '20394590238', 'ti@ti.com', NULL, '$2y$12$OgWIyk12x41vJ/UNFfSJe.wWnj/rCGmaCLYd90BOaIonNtyGaLETW', NULL, '2024-11-19 22:38:46', '2024-11-19 22:38:46', 7, 'user', 'approved'),
(37, 'Super Admin', 'SA', NULL, NULL, 'admin@admin.com', NULL, '$2y$12$gT1r4gTPiuvhf.flPkNHkut7NChjwTHlL0YEVQhsmLywNDRdfsMLG', NULL, '2024-11-20 23:09:50', '2025-01-02 18:43:47', 7, 'super_admin', 'approved'),
(38, 'Mauricio Teruel', NULL, NULL, NULL, 'prueba400@buzz.cr', NULL, '$2y$12$FsYDUU6jJYe3BH.Drs.T6.5M0mM7y1hvcng7pov9Wfs2DSGzL4tOe', NULL, '2024-12-05 17:40:55', '2024-12-10 20:45:24', 7, 'user', 'approved'),
(39, 'Juan pere', NULL, NULL, NULL, 'juan@teruel.com', NULL, '$2y$12$2DUtGePN8wh77zxg.zT.leqbzj05z0PkK8uIJp0cQyrQ9ZzYGZhtG', NULL, '2024-12-06 18:37:43', '2024-12-06 18:38:21', 9, 'user', 'pending'),
(40, 'Mauricio', NULL, NULL, NULL, 'mauricio50@buzz.cr', NULL, '$2y$12$ta72rpxw3n.lrnHmBfaNT.PkAq8Dl.j7d1fHQKYszYlqn/VtpYLJG', NULL, '2024-12-18 23:02:43', '2025-01-02 23:25:37', 7, 'user', 'rejected'),
(41, 'Evaluador', '1', NULL, NULL, 'evaluador@admin.com', NULL, '$2y$12$cxu3plTBpg.ujstsmd6XPOAr6A4HTId8N98ssBqwvRxLQYGS0Jd66', NULL, '2024-12-27 20:10:40', '2024-12-27 20:10:40', 7, 'user', 'approved'),
(42, 'Evaluador', '1', NULL, NULL, 'evaluador1@email.com', NULL, '$2y$12$xa/5zaCopTEfYf4svsEibOQ6IHQopiBNxOJsdC8GYDuxEMF3.GNCW', NULL, '2024-12-27 20:13:16', '2025-01-02 18:53:52', 7, 'evaluador', 'approved');

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
(31, 'Excelencia', 'excelencia', 70, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(32, 'Innovación', 'innovacion', 70, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(33, 'Progreso social', 'progreso-social', 70, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(34, 'Sostenibilidad', 'sostenibilidad', 70, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36'),
(35, 'Vinculación', 'vinculacion', 70, 1, '2024-12-11 23:40:36', '2024-12-11 23:40:36');

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
-- Indices de la tabla `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `evaluation_questions_indicator_id_foreign` (`indicator_id`);

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
  ADD KEY `indicators_value_id_foreign` (`value_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_subcategory_result`
--
ALTER TABLE `auto_evaluation_subcategory_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_valor_result`
--
ALTER TABLE `auto_evaluation_valor_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `company_evaluator`
--
ALTER TABLE `company_evaluator`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `evaluator_assessments`
--
ALTER TABLE `evaluator_assessments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `indicator_answers`
--
ALTER TABLE `indicator_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237;

--
-- AUTO_INCREMENT de la tabla `indicator_answers_evaluation`
--
ALTER TABLE `indicator_answers_evaluation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT de la tabla `indicator_homologation`
--
ALTER TABLE `indicator_homologation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT de la tabla `values`
--
ALTER TABLE `values`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

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
-- Filtros para la tabla `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  ADD CONSTRAINT `evaluation_questions_indicator_id_foreign` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `evaluator_assessments`
--
ALTER TABLE `evaluator_assessments`
  ADD CONSTRAINT `evaluator_assessments_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `evaluator_assessments_evaluation_question_id_foreign` FOREIGN KEY (`evaluation_question_id`) REFERENCES `evaluation_questions` (`id`),
  ADD CONSTRAINT `evaluator_assessments_indicator_id_foreign` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`),
  ADD CONSTRAINT `evaluator_assessments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Filtros para la tabla `indicators`
--
ALTER TABLE `indicators`
  ADD CONSTRAINT `indicators_value_id_foreign` FOREIGN KEY (`value_id`) REFERENCES `values` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `indicator_answers`
--
ALTER TABLE `indicator_answers`
  ADD CONSTRAINT `indicator_answers_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `indicator_answers_indicator_id_foreign` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `indicator_answers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `indicator_answers_evaluation`
--
ALTER TABLE `indicator_answers_evaluation`
  ADD CONSTRAINT `indicator_answers_evaluation_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `indicator_answers_evaluation_indicator_id_foreign` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `indicator_answers_evaluation_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `indicator_homologation`
--
ALTER TABLE `indicator_homologation`
  ADD CONSTRAINT `indicator_homologation_homologation_id_foreign` FOREIGN KEY (`homologation_id`) REFERENCES `available_certifications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `indicator_homologation_indicator_id_foreign` FOREIGN KEY (`indicator_id`) REFERENCES `indicators` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `subcategories`
--
ALTER TABLE `subcategories`
  ADD CONSTRAINT `subcategories_value_id_foreign` FOREIGN KEY (`value_id`) REFERENCES `values` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);

--
-- Filtros para la tabla `value_subcategory`
--
ALTER TABLE `value_subcategory`
  ADD CONSTRAINT `value_subcategory_subcategory_id_foreign` FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `value_subcategory_value_id_foreign` FOREIGN KEY (`value_id`) REFERENCES `values` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
