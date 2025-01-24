-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 22-01-2025 a las 22:41:06
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

INSERT INTO `info_adicional_empresas` (`id`, `company_id`, `nombre_comercial`, `nombre_legal`, `descripcion_es`, `descripcion_en`, `anio_fundacion`, `sitio_web`, `facebook`, `linkedin`, `instagram`, `sector`, `tamano_empresa`, `cantidad_hombres`, `cantidad_mujeres`, `cantidad_otros`, `telefono_1`, `telefono_2`, `es_exportadora`, `paises_exportacion`, `provincia`, `canton`, `distrito`, `cedula_juridica`, `actividad_comercial`, `producto_servicio`, `rango_exportaciones`, `planes_expansion`, `razon_licenciamiento_es`, `razon_licenciamiento_en`, `proceso_licenciamiento`, `recomienda_marca_pais`, `observaciones`, `mercadeo_nombre`, `mercadeo_email`, `mercadeo_puesto`, `mercadeo_telefono`, `mercadeo_celular`, `micrositio_nombre`, `micrositio_email`, `micrositio_puesto`, `micrositio_telefono`, `micrositio_celular`, `vocero_nombre`, `vocero_email`, `vocero_puesto`, `vocero_telefono`, `vocero_celular`, `representante_nombre`, `representante_email`, `representante_puesto`, `representante_telefono`, `representante_celular`, `productos`, `logo_path`, `fotografias_paths`, `certificaciones_paths`, `created_at`, `updated_at`) VALUES
(3, 9, 'Prueba', 'Prueba', 'Prueba', 'Prueba', 1998, 'http://localhost', 'http://localhost', 'http://localhost', 'http://localhost', 'http://localhost', '1-10', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL, NULL, 'http://localhost', 'http://localhost', NULL, NULL, NULL, 'http://localhost', 'http://localhost', 'http://localhost', 0, 'http://localhost', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '[{\"nombre\":\"aaaa\",\"descripcion\":\"aaaa\",\"imagen_path\":null},{\"nombre\":null,\"descripcion\":null,\"imagen_path\":null},{\"nombre\":null,\"descripcion\":null,\"imagen_path\":null}]', NULL, NULL, NULL, '2025-01-23 00:28:45', '2025-01-23 00:38:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `info_adicional_empresas_company_id_foreign` (`company_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  ADD CONSTRAINT `info_adicional_empresas_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
