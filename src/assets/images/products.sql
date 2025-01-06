-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: 20 ديسمبر 2024 الساعة 00:19
-- إصدار الخادم: 10.11.10-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u273709809_watchizer`
--

-- --------------------------------------------------------

--
-- بنية الجدول `products`
--

CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `category_type_id` bigint(20) UNSIGNED NOT NULL,
  `brand_id` bigint(20) UNSIGNED NOT NULL,
  `grade_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sub_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dial_color_id` bigint(20) UNSIGNED DEFAULT NULL,
  `band_color_id` bigint(20) UNSIGNED DEFAULT NULL,
  `band_closure_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dial_display_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `case_size` decimal(8,2) DEFAULT NULL,
  `case_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `case_shape_id` bigint(20) UNSIGNED DEFAULT NULL,
  `band_material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `watch_movement_id` bigint(20) UNSIGNED DEFAULT NULL,
  `band_length` decimal(8,2) DEFAULT NULL,
  `band_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `water_resistance` int(11) DEFAULT NULL,
  `water_resistance_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `band_width` decimal(8,2) DEFAULT NULL,
  `band_width_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `case_thickness` decimal(8,2) DEFAULT NULL,
  `case_thickness_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dial_case_material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `dial_glass_material_id` bigint(20) UNSIGNED DEFAULT NULL,
  `feature_id` bigint(20) UNSIGNED DEFAULT NULL,
  `watch_height` decimal(8,2) DEFAULT NULL,
  `watch_height_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `watch_width` decimal(8,2) DEFAULT NULL,
  `watch_width_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `watch_length` decimal(8,2) DEFAULT NULL,
  `watch_length_size_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `sku_unique` varchar(255) NOT NULL,
  `model_number` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `warranty_years` varchar(255) DEFAULT NULL,
  `interchangeable_dial` tinyint(1) DEFAULT NULL,
  `interchangeable_strap` tinyint(1) DEFAULT NULL,
  `wa_code` varchar(255) NOT NULL,
  `rate` int(11) DEFAULT NULL,
  `purchase_price` decimal(8,2) NOT NULL,
  `selling_price` decimal(8,2) NOT NULL,
  `discount_value` decimal(8,2) DEFAULT NULL,
  `stock` decimal(8,2) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1,
  `watch_box` tinyint(1) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- إرجاع أو استيراد بيانات الجدول `products`
--

INSERT INTO `products` (`id`, `category_id`, `category_type_id`, `brand_id`, `grade_id`, `sub_type_id`, `dial_color_id`, `band_color_id`, `band_closure_id`, `dial_display_type_id`, `case_size`, `case_size_type_id`, `case_shape_id`, `band_material_id`, `watch_movement_id`, `band_length`, `band_size_type_id`, `water_resistance`, `water_resistance_size_type_id`, `band_width`, `band_width_size_type_id`, `case_thickness`, `case_thickness_size_type_id`, `dial_case_material_id`, `dial_glass_material_id`, `feature_id`, `watch_height`, `watch_height_size_type_id`, `watch_width`, `watch_width_size_type_id`, `watch_length`, `watch_length_size_type_id`, `sku_unique`, `model_number`, `image`, `warranty_years`, `interchangeable_dial`, `interchangeable_strap`, `wa_code`, `rate`, `purchase_price`, `selling_price`, `discount_value`, `stock`, `active`, `watch_box`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(32, 8, 9, 8, 9, 8, 1, 5, 2, 2, 20.00, 1, 3, 1, 1, 20.00, 1, 50, 1, 20.00, 1, 10.00, 1, NULL, NULL, NULL, 20.00, 1, 20.00, 1, 15.00, 1, 'SKU12345', '154214842', '1734582478_2024-12-19_1.webp', '2000', 1, 0, '1451548', 5, 150.00, 300.00, 100.00, 10.00, 1, 0, 3, NULL, '2024-12-19 04:27:58', '2024-12-19 04:27:58'),
(33, 8, 9, 5, 7, 5, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SKU12346', NULL, '1734583367_2024-12-19_2.webp', NULL, NULL, NULL, '14515485', NULL, 2500.00, 3000.00, 500.00, 100.00, 1, NULL, 3, NULL, '2024-12-19 04:42:47', '2024-12-19 04:42:47'),
(35, 8, 9, 6, NULL, 6, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'SKU12347', NULL, '1734583751_2024-12-19_3.webp', NULL, NULL, NULL, '145154856', NULL, 2500.00, 3000.00, 500.00, 5.00, 1, NULL, 3, NULL, '2024-12-19 04:49:11', '2024-12-19 04:49:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `products_category_id_foreign` (`category_id`),
  ADD KEY `products_category_type_id_foreign` (`category_type_id`),
  ADD KEY `products_brand_id_foreign` (`brand_id`),
  ADD KEY `products_grade_id_foreign` (`grade_id`),
  ADD KEY `products_sub_type_id_foreign` (`sub_type_id`),
  ADD KEY `products_dial_color_id_foreign` (`dial_color_id`),
  ADD KEY `products_band_color_id_foreign` (`band_color_id`),
  ADD KEY `products_band_closure_id_foreign` (`band_closure_id`),
  ADD KEY `products_dial_display_type_id_foreign` (`dial_display_type_id`),
  ADD KEY `products_case_size_type_id_foreign` (`case_size_type_id`),
  ADD KEY `products_case_shape_id_foreign` (`case_shape_id`),
  ADD KEY `products_band_material_id_foreign` (`band_material_id`),
  ADD KEY `products_watch_movement_id_foreign` (`watch_movement_id`),
  ADD KEY `products_band_size_type_id_foreign` (`band_size_type_id`),
  ADD KEY `products_water_resistance_size_type_id_foreign` (`water_resistance_size_type_id`),
  ADD KEY `products_band_width_size_type_id_foreign` (`band_width_size_type_id`),
  ADD KEY `products_case_thickness_size_type_id_foreign` (`case_thickness_size_type_id`),
  ADD KEY `products_dial_case_material_id_foreign` (`dial_case_material_id`),
  ADD KEY `products_dial_glass_material_id_foreign` (`dial_glass_material_id`),
  ADD KEY `products_feature_id_foreign` (`feature_id`),
  ADD KEY `products_watch_height_size_type_id_foreign` (`watch_height_size_type_id`),
  ADD KEY `products_watch_width_size_type_id_foreign` (`watch_width_size_type_id`),
  ADD KEY `products_watch_length_size_type_id_foreign` (`watch_length_size_type_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- قيود الجداول المُلقاة.
--

--
-- قيود الجداول `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_band_closure_id_foreign` FOREIGN KEY (`band_closure_id`) REFERENCES `closure_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_band_color_id_foreign` FOREIGN KEY (`band_color_id`) REFERENCES `colors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_band_material_id_foreign` FOREIGN KEY (`band_material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_band_size_type_id_foreign` FOREIGN KEY (`band_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_band_width_size_type_id_foreign` FOREIGN KEY (`band_width_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_brand_id_foreign` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`),
  ADD CONSTRAINT `products_case_shape_id_foreign` FOREIGN KEY (`case_shape_id`) REFERENCES `shapes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_case_size_type_id_foreign` FOREIGN KEY (`case_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_case_thickness_size_type_id_foreign` FOREIGN KEY (`case_thickness_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`),
  ADD CONSTRAINT `products_category_type_id_foreign` FOREIGN KEY (`category_type_id`) REFERENCES `category_types` (`id`),
  ADD CONSTRAINT `products_dial_case_material_id_foreign` FOREIGN KEY (`dial_case_material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_dial_color_id_foreign` FOREIGN KEY (`dial_color_id`) REFERENCES `colors` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_dial_display_type_id_foreign` FOREIGN KEY (`dial_display_type_id`) REFERENCES `display_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_dial_glass_material_id_foreign` FOREIGN KEY (`dial_glass_material_id`) REFERENCES `materials` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_feature_id_foreign` FOREIGN KEY (`feature_id`) REFERENCES `features` (`id`),
  ADD CONSTRAINT `products_grade_id_foreign` FOREIGN KEY (`grade_id`) REFERENCES `grades` (`id`),
  ADD CONSTRAINT `products_sub_type_id_foreign` FOREIGN KEY (`sub_type_id`) REFERENCES `sub_types` (`id`),
  ADD CONSTRAINT `products_watch_height_size_type_id_foreign` FOREIGN KEY (`watch_height_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_watch_length_size_type_id_foreign` FOREIGN KEY (`watch_length_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_watch_movement_id_foreign` FOREIGN KEY (`watch_movement_id`) REFERENCES `movement_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_watch_width_size_type_id_foreign` FOREIGN KEY (`watch_width_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `products_water_resistance_size_type_id_foreign` FOREIGN KEY (`water_resistance_size_type_id`) REFERENCES `size_types` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
