-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-11-2024 a las 21:32:22
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
-- Estructura de tabla para la tabla `available_certifications`
--

CREATE TABLE `available_certifications` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `available_certifications`
--

INSERT INTO `available_certifications` (`id`, `nombre`, `descripcion`, `created_at`, `updated_at`) VALUES
(1, 'INTE B5:2020', NULL, '2024-11-18 22:42:07', '2024-11-18 22:42:07'),
(2, 'INTE G12:2019', NULL, '2024-11-18 22:42:07', '2024-11-18 22:42:07'),
(3, 'INTE G8:2013', NULL, '2024-11-18 22:42:07', '2024-11-18 22:42:07'),
(4, 'INTE G38:2015', NULL, '2024-11-18 22:42:07', '2024-11-18 22:42:07');

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
('admin@buzz.cr|127.0.0.1', 'i:1;', 1731968953),
('admin@buzz.cr|127.0.0.1:timer', 'i:1731968953;', 1731968953),
('mauricio20@buzz.cr|127.0.0.1', 'i:1;', 1731969186),
('mauricio20@buzz.cr|127.0.0.1:timer', 'i:1731969186;', 1731969186),
('sebas@buzz.cr|127.0.0.1', 'i:1;', 1731968946),
('sebas@buzz.cr|127.0.0.1:timer', 'i:1731968946;', 1731968946);

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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `certifications`
--

INSERT INTO `certifications` (`id`, `company_id`, `nombre`, `fecha_obtencion`, `fecha_expiracion`, `indicadores`, `created_at`, `updated_at`) VALUES
(10, 7, 'INTE G12:2019', '2024-10-30', '2024-12-01', 2, '2024-11-19 18:29:11', '2024-11-19 18:29:19');

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
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `legal_id`, `name`, `website`, `sector`, `city`, `commercial_activity`, `phone`, `mobile`, `is_exporter`, `created_at`, `updated_at`) VALUES
(7, '123456789', 'Buzz', 'https://buzz.cr', 'tecnologia', 'san-jose', 'Servicios', '5415641', '641656', 1, '2024-11-15 01:01:15', '2024-11-15 01:01:15'),
(9, '987654321', 'Teruel 2', 'https://localhost.com.ar', 'Manufactura', 'Heredia', 'Productora Agropecuaria', '9234875000000', '20385700000', 1, '2024-11-15 01:34:14', '2024-11-15 02:01:47');

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
(11, '2024_11_18_193753_create_available_certifications_table', 8);

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
('AyjUuYl3gm7YxlPytYtMHWgsSUr96JJLz0T8IELe', 37, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTo2OntzOjY6Il90b2tlbiI7czo0MDoiUjNkSHQ5Q0hNeUo1bmljZTlYN0tOeElpYzlYOENUbkxDdGVEekFCaSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6MzI6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9lc2NyLWFkbWluIjt9czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozMjoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL2VzY3ItYWRtaW4iO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aTozNztzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJGdUMXI0Z1RQaXV2aGYuZmxQa05Ia3V0N05DaGp3VEhsTDBZRVZRaHNtTHl3TkRSZGZzTUxHIjt9', 1732134703),
('BRlzbVcOCUgvmdebgVPP9O2hyAT9aJjE4GH8lV06', 37, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMlNVNU9iWjBnV2JPZmxTY0VkN1N6cHRXZFZ0R2haZFZHRmg0N0UxeiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjM3O30=', 1732133539);

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
(32, 'Mauricio 20', NULL, NULL, NULL, 'mauricio20@buzz.com', NULL, '$2y$12$j8.UrfZJeO.cTZqHxavO2u7ZNRDWa6.iZYU0BSj8iXb9WqJLCjsCe', NULL, '2024-11-19 01:21:04', '2024-11-19 01:21:04', NULL, 'user', 'pending'),
(33, 'Mauricio 20', NULL, NULL, NULL, 'mauricio20@buzz.cr', NULL, '$2y$12$rE.WpFQ8V/t.msQZXlSl4uY5h24aboN.eMJnLdYDSmUqwdWOH0SO6', NULL, '2024-11-19 01:32:19', '2024-11-19 01:32:19', NULL, 'user', 'pending'),
(34, 'Mauricio Teruel 1', NULL, NULL, NULL, 'mauricioteruel98@gmail.com', NULL, '$2y$12$E5UGpVLJ.CUv7ygv5QrxtOf90cLQFLvMkcwQkiXqSnK9v6LqB5fsS', NULL, '2024-11-19 20:16:28', '2024-11-19 20:32:02', 7, 'user', 'rejected'),
(35, 'Mauricio Teruel', NULL, NULL, NULL, 'mauricioteruel1998@gmail.com', NULL, '$2y$12$we8XoQJjyVJe3OaTocDuBuaghnFTWjknoFBa.nddU6D.b.tPt4rWm', NULL, '2024-11-19 22:37:42', '2024-11-19 23:04:13', 7, 'user', 'approved'),
(36, 'TITITITITIT', '', NULL, '20394590238', 'ti@ti.com', NULL, '$2y$12$OgWIyk12x41vJ/UNFfSJe.wWnj/rCGmaCLYd90BOaIonNtyGaLETW', NULL, '2024-11-19 22:38:46', '2024-11-19 22:38:46', 7, 'user', 'approved'),
(37, 'Super Admin', NULL, NULL, NULL, 'admin@admin.com', NULL, '$2y$12$gT1r4gTPiuvhf.flPkNHkut7NChjwTHlL0YEVQhsmLywNDRdfsMLG', NULL, '2024-11-20 23:09:50', '2024-11-20 23:09:50', NULL, 'super_admin', 'pending');

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
-- Indices de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

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
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_company_id_foreign` (`company_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `available_certifications`
--
ALTER TABLE `available_certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `companies`
--
ALTER TABLE `companies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_company_id_foreign` FOREIGN KEY (`company_id`) REFERENCES `companies` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
