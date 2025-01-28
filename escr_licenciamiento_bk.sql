-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-01-2025 a las 21:52:26
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
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `authorized` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `legal_id`, `name`, `website`, `sector`, `city`, `commercial_activity`, `phone`, `mobile`, `is_exporter`, `created_at`, `updated_at`, `status`, `authorized`) VALUES
(7, '123456789', 'Buzz', 'https://buzz.cr', 'tecnologia', 'san-jose', 'Servicios', '5415641', '641656', 1, '2024-11-15 01:01:15', '2025-01-24 18:44:41', 'active', 1),
(9, '987654321', 'Prueba', 'https://localhost.com.ar', 'Manufactura', 'Heredia', 'Productora Agropecuaria', '9234875000000', '20385700000', 1, '2024-11-15 01:34:14', '2025-01-24 18:44:30', 'active', 1),
(10, '34534534', '5sdfgsdg', 'https://localhost', 'Ag', 'sda', 'dasdas', '12341234', '234234', 1, '2025-01-17 01:18:10', '2025-01-17 01:18:10', 'active', 0);

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
  `imagen` varchar(255) NOT NULL,
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
  `logo_path` varchar(255) DEFAULT NULL,
  `fotografias_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fotografias_paths`)),
  `certificaciones_paths` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`certificaciones_paths`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `info_adicional_empresas`
--

INSERT INTO `info_adicional_empresas` (`id`, `company_id`, `nombre_comercial`, `nombre_legal`, `descripcion_es`, `descripcion_en`, `anio_fundacion`, `sitio_web`, `facebook`, `linkedin`, `instagram`, `sector`, `tamano_empresa`, `cantidad_hombres`, `cantidad_mujeres`, `cantidad_otros`, `telefono_1`, `telefono_2`, `es_exportadora`, `paises_exportacion`, `provincia`, `canton`, `distrito`, `cedula_juridica`, `actividad_comercial`, `producto_servicio`, `rango_exportaciones`, `planes_expansion`, `razon_licenciamiento_es`, `razon_licenciamiento_en`, `proceso_licenciamiento`, `recomienda_marca_pais`, `observaciones`, `mercadeo_nombre`, `mercadeo_email`, `mercadeo_puesto`, `mercadeo_telefono`, `mercadeo_celular`, `micrositio_nombre`, `micrositio_email`, `micrositio_puesto`, `micrositio_telefono`, `micrositio_celular`, `vocero_nombre`, `vocero_email`, `vocero_puesto`, `vocero_telefono`, `vocero_celular`, `representante_nombre`, `representante_email`, `representante_puesto`, `representante_telefono`, `representante_celular`, `logo_path`, `fotografias_paths`, `certificaciones_paths`, `created_at`, `updated_at`) VALUES
(5, 7, 'aaaaaaaaa', 'aaaaaaaaaaaa', 'aaaaaaaaaa', NULL, 1234, NULL, NULL, NULL, NULL, 'aaaaaaa', '51-200', NULL, NULL, NULL, '111111111111', NULL, 0, NULL, 'a0c41000002jQfAAAU', 'a0941000001qCHfAAM', NULL, 'aaaaaaa', 'aaaaaaaa', NULL, NULL, 'aaaaaa', 'aaaaaaaaaa', 'aaaaaaaaaaaaaaa', 'aaaaaaaaaaaaaaaaa', 0, 'aaaaaaaaaaaaaa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-01-24 17:56:09', '2025-01-24 18:17:09');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `companies_legal_id_unique` (`legal_id`);

--
-- Indices de la tabla `company_products`
--
ALTER TABLE `company_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_products_company_id_foreign` (`company_id`),
  ADD KEY `company_products_info_adicional_empresa_id_foreign` (`info_adicional_empresa_id`);

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
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `company_products`
--
ALTER TABLE `company_products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `company_products`
--
ALTER TABLE `company_products`
  ADD CONSTRAINT `company_products_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`),
  ADD CONSTRAINT `company_products_info_adicional_empresa_id_foreign` FOREIGN KEY (`info_adicional_empresa_id`) REFERENCES `info_adicional_empresas` (`id`);

--
-- Filtros para la tabla `info_adicional_empresas`
--
ALTER TABLE `info_adicional_empresas`
  ADD CONSTRAINT `info_adicional_empresas_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
