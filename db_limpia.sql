-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 27-03-2025 a las 22:07:13
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
-- Base de datos: `escr_licenciamiento`
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
  `homologation_id` bigint(20) UNSIGNED DEFAULT NULL,
  `organismo_certificador` varchar(255) DEFAULT NULL,
  `file_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`file_paths`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--

CREATE TABLE `companies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `legal_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `website` varchar(255) DEFAULT NULL,
  `sector` varchar(255) DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `commercial_activity` longtext DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `mobile` varchar(255) DEFAULT NULL,
  `is_exporter` tinyint(1) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `authorized` tinyint(1) NOT NULL DEFAULT 0,
  `autoeval_ended` tinyint(1) NOT NULL DEFAULT 0,
  `estado_eval` enum('auto-evaluacion','auto-evaluacion-completed','evaluacion-pendiente','evaluacion','evaluacion-completada','evaluado','evaluacion-calificada','evaluacion-desaprobada') NOT NULL DEFAULT 'auto-evaluacion',
  `canton` varchar(255) DEFAULT NULL,
  `distrito` varchar(255) DEFAULT NULL,
  `authorized_by_super_admin` tinyint(1) NOT NULL DEFAULT 0,
  `old_id` varchar(255) DEFAULT NULL,
  `fecha_calificacion_evaluador` timestamp NULL DEFAULT NULL,
  `auto_evaluation_document_path` varchar(255) DEFAULT NULL,
  `evaluation_document_path` varchar(255) DEFAULT NULL,
  `progreso_evaluacion` int(11) NOT NULL DEFAULT 0,
  `progreso_auto_evaluacion` int(11) NOT NULL DEFAULT 0,
  `fecha_inicio_auto_evaluacion` timestamp NULL DEFAULT NULL,
  `fecha_inicio_evaluacion` timestamp NULL DEFAULT NULL,
  `puntos_fuertes` text DEFAULT NULL,
  `justificacion` text DEFAULT NULL,
  `oportunidades` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `legal_id`, `name`, `website`, `sector`, `provincia`, `commercial_activity`, `phone`, `mobile`, `is_exporter`, `created_at`, `updated_at`, `status`, `authorized`, `autoeval_ended`, `estado_eval`, `canton`, `distrito`, `authorized_by_super_admin`, `old_id`, `fecha_calificacion_evaluador`, `auto_evaluation_document_path`, `evaluation_document_path`, `progreso_evaluacion`, `progreso_auto_evaluacion`, `fecha_inicio_auto_evaluacion`, `fecha_inicio_evaluacion`, `puntos_fuertes`, `justificacion`, `oportunidades`) VALUES
(3540, '1000000001', 'Super Admin', 'https://admin.com', 'servicios', 'Alajuela', 'Actividad', '1', '1', 1, '2025-03-28 00:06:01', '2025-03-28 00:06:01', 'active', 0, 0, 'auto-evaluacion', NULL, NULL, 0, NULL, NULL, NULL, NULL, 0, 0, '2025-03-28 00:06:01', NULL, NULL, NULL, NULL);

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
  `updated_at` timestamp NULL DEFAULT NULL,
  `imagenes_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`imagenes_paths`)),
  `imagen_2` varchar(255) DEFAULT NULL,
  `imagen_3` varchar(255) DEFAULT NULL
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
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_binary` tinyint(1) NOT NULL DEFAULT 1,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `is_binary` tinyint(1) NOT NULL DEFAULT 1,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `file_path` text DEFAULT NULL,
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
  `anio_fundacion` varchar(20) DEFAULT NULL,
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
  `updated_at` timestamp NULL DEFAULT NULL,
  `contacto_notificacion_nombre` varchar(255) DEFAULT NULL,
  `contacto_notificacion_email` varchar(255) DEFAULT NULL,
  `contacto_notificacion_puesto` varchar(255) DEFAULT NULL,
  `contacto_notificacion_cedula` varchar(255) DEFAULT NULL,
  `contacto_notificacion_telefono` varchar(255) DEFAULT NULL,
  `contacto_notificacion_celular` varchar(255) DEFAULT NULL,
  `asignado_proceso_nombre` varchar(255) DEFAULT NULL,
  `asignado_proceso_email` varchar(255) DEFAULT NULL,
  `asignado_proceso_puesto` varchar(255) DEFAULT NULL,
  `asignado_proceso_cedula` varchar(255) DEFAULT NULL,
  `asignado_proceso_telefono` varchar(255) DEFAULT NULL,
  `asignado_proceso_celular` varchar(255) DEFAULT NULL,
  `representante_cedula` varchar(255) DEFAULT NULL,
  `direccion_empresa` varchar(350) DEFAULT NULL,
  `cantidad_total` int(11) DEFAULT NULL,
  `puntos_fuertes` text DEFAULT NULL,
  `justificacion` text DEFAULT NULL,
  `oportunidades` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Estructura de tabla para la tabla `mail_logs`
--

CREATE TABLE `mail_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `to_email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `mailable_class` varchar(255) NOT NULL,
  `mailable_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`mailable_data`)),
  `status` enum('pending','sent','failed') NOT NULL,
  `error_message` text DEFAULT NULL,
  `attempts` int(11) NOT NULL DEFAULT 0,
  `last_attempt` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `mail_logs`
--

INSERT INTO `mail_logs` (`id`, `to_email`, `subject`, `mailable_class`, `mailable_data`, `status`, `error_message`, `attempts`, `last_attempt`, `created_at`, `updated_at`) VALUES
(65, 'admin@admin.com', '¡Bienvenido a nuestra plataforma!', 'App\\Notifications\\WelcomeNotification', '{\"id\":null,\"locale\":null,\"connection\":null,\"queue\":null,\"delay\":null,\"afterCommit\":null,\"middleware\":[],\"chained\":[],\"chainConnection\":null,\"chainQueue\":null,\"chainCatchCallbacks\":null}', 'failed', 'Expected response code \"250\" but got code \"530\", with message \"530 5.7.1 Authentication required\".', 1, '2025-03-28 00:05:33', '2025-03-28 00:05:29', '2025-03-28 00:05:33');

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
(49, '2025_03_07_000402_add_order_column_to_subcategories_table', 45),
(50, '2025_03_07_212459_add_contactos_to_info_aditional_table', 46),
(51, '2025_03_07_220628_add_direccion_empresa_column_to_info', 47),
(52, '2025_03_11_132931_add_authorized_by_super_admin_column_to_companies_table', 48),
(53, '2025_03_12_194256_add_old_id_column_to_companies_table', 49),
(54, '2025_03_12_194316_add_from_migration_column_to_users_table', 50),
(56, '2025_03_12_204926_add_old_id_company_column_to_users_table', 51),
(58, '2025_03_12_210631_add_cedula_column_to_users_table', 52),
(61, 'zz_nullable_companies_columns', 53),
(62, '2025_03_13_030549_add_multiple_images_to_company_products', 54),
(63, '2025_03_13_034815_add_imagenes_path_to_company_products_table', 55),
(64, '2025_03_13_141225_create_products_images_table', 56),
(65, '2025_03_13_145529_add_columns_to_company_products_table', 57),
(66, '2025_03_13_174658_add_cantidad_total_column_to_info_adicional_empresas_table', 58),
(67, '2025_03_17_191305_add_organismo_column_to_users_table', 59),
(68, '2025_03_14_204835_add_fecha_calificacion_column_to_companies_table', 60),
(69, '2025_03_19_145139_add_columns_to_companies_table', 61),
(71, '2025_03_19_171118_add_progresos_columns_to_companies_table', 62),
(72, '2025_03_21_043704_add_logic_deleted_toindicators_table', 63),
(74, '2025_03_21_191712_add_images_columns_to_company_products_table', 64),
(75, '2025_03_25_220849_create_mail_logs_table', 65),
(77, '2025_03_26_001627_add_file_paths_to_certifications_table', 66),
(78, '2025_03_26_005105_change_file_path_required_in_indicator_answer_question_table', 67),
(79, '2025_03_26_194410_add_columns_to_companies_and_info_adicional_tables', 68),
(80, '2025_03_26_185658_change_file_paths_required_in_indicator_answer_question_table', 69),
(81, '2025_03_26_233038_change_type_columns_to_tables', 70);

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
-- Estructura de tabla para la tabla `products_images`
--

CREATE TABLE `products_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `company_product_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL,
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
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

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
('73A7HHKsiFATIOBOsxXM4UUgicME7EmP6BUb0lHg', 3913, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiN2tNV1pKSzg1eGo5Ymxsb0FKdEhEMmcwNDZIc0J1dHVQTzlsNGljRiI7czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzE6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9kYXNoYm9hcmQiO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTozOTEzO30=', 1743109592);

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
  `order` int(11) NOT NULL DEFAULT 0,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
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
  `puesto` varchar(255) DEFAULT NULL,
  `from_migration` tinyint(1) NOT NULL DEFAULT 0,
  `old_id_company` int(11) DEFAULT NULL,
  `cedula` varchar(255) DEFAULT NULL,
  `organismo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `id_number`, `phone`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `company_id`, `role`, `status`, `form_sended`, `terms_accepted`, `puesto`, `from_migration`, `old_id_company`, `cedula`, `organismo`) VALUES
(3913, 'Super', 'Admin', NULL, NULL, 'admin@admin.com', NULL, '$2y$12$Aq6LtIEyGZjLzGkNi5vHZOKfntA7XN1j57MCJd1SeTaLbvazHtkVq', NULL, '2025-03-28 00:05:29', '2025-03-28 00:06:01', 3540, 'admin', 'approved', 0, 1, NULL, 0, NULL, NULL, NULL);

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
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted` tinyint(1) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- Indices de la tabla `mail_logs`
--
ALTER TABLE `mail_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mail_logs_status_attempts_index` (`status`,`attempts`);

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
-- Indices de la tabla `products_images`
--
ALTER TABLE `products_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_images_company_product_id_foreign` (`company_product_id`);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=115;

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_subcategory_result`
--
ALTER TABLE `auto_evaluation_subcategory_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=998;

--
-- AUTO_INCREMENT de la tabla `auto_evaluation_valor_result`
--
ALTER TABLE `auto_evaluation_valor_result`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=386;

--
-- AUTO_INCREMENT de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT de la tabla `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3541;

--
-- AUTO_INCREMENT de la tabla `company_evaluator`
--
ALTER TABLE `company_evaluator`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=870;

--
-- AUTO_INCREMENT de la tabla `company_products`
--
ALTER TABLE `company_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT de la tabla `evaluation_questions`
--
ALTER TABLE `evaluation_questions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=535;

--
-- AUTO_INCREMENT de la tabla `evaluation_value_results`
--
ALTER TABLE `evaluation_value_results`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=89;

--
-- AUTO_INCREMENT de la tabla `evaluation_value_result_reference`
--
ALTER TABLE `evaluation_value_result_reference`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `evaluator_assessments`
--
ALTER TABLE `evaluator_assessments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=547;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `indicators`
--
ALTER TABLE `indicators`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=180;

--
-- AUTO_INCREMENT de la tabla `indicator_answers`
--
ALTER TABLE `indicator_answers`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2086;

--
-- AUTO_INCREMENT de la tabla `indicator_answers_evaluation`
--
ALTER TABLE `indicator_answers_evaluation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1087;

--
-- AUTO_INCREMENT de la tabla `indicator_homologation`
--
ALTER TABLE `indicator_homologation`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=316;

--
-- AUTO_INCREMENT de la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3528;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mail_logs`
--
ALTER TABLE `mail_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=82;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `products_images`
--
ALTER TABLE `products_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `requisitos`
--
ALTER TABLE `requisitos`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- AUTO_INCREMENT de la tabla `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3914;

--
-- AUTO_INCREMENT de la tabla `values`
--
ALTER TABLE `values`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

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

--
-- Filtros para la tabla `products_images`
--
ALTER TABLE `products_images`
  ADD CONSTRAINT `products_images_company_product_id_foreign` FOREIGN KEY (`company_product_id`) REFERENCES `company_products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
