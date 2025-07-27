-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 15, 2025 at 12:33 PM
-- Server version: 10.6.20-MariaDB-cll-lve
-- PHP Version: 8.1.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `traveld2_travel`
--

-- --------------------------------------------------------

--
-- Table structure for table `af_product_pdf`
--

CREATE TABLE `af_product_pdf` (
  `id` int(10) NOT NULL,
  `optioncode` varchar(100) NOT NULL,
  `pdfname` varchar(250) NOT NULL,
  `status` int(5) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `af_product_pdf`
--

INSERT INTO `af_product_pdf` (`id`, `optioncode`, `pdfname`, `status`, `date`) VALUES
(1, 'VFAGTARP001SIMTST', 'Version 4.00.000-v1-20180522_1301.pdf', 1, '0000-00-00 00:00:00'),
(3, 'ARKGTARP001SIMSE7', 'Simba Safari (JRO Serena) RS3418.pdf', 1, '0000-00-00 00:00:00'),
(10, 'simply-south-africa', 'Simply South Africa itinerary.pdf', 1, '2018-10-25 04:57:56'),
(32, 'JNBSPTHISSAAFFAFS', 'Affordable Africa (standard) Expo FEB 2019.pdf', 1, '2019-02-15 12:21:15'),
(35, 'JNBSPTHISSASPOILD', 'Spoil yourself in southern Africa itinerary.pdf', 1, '2019-04-17 01:59:40'),
(48, 'VFASPTVT001FE3NT1', 'The Falls Experience 4 days_The Kingdom.pdf', 1, '2019-05-01 03:41:38'),
(55, 'NBOSPARP001SDEASO', 'East African Explorer (Sopa).pdf', 1, '2020-01-09 03:26:49'),
(56, 'NBOSPARP001CKSOSP', 'Classic Kenya (Sopa) CKSO.pdf', 1, '2020-01-09 03:58:36'),
(65, 'JROGTARP001SIMSE7', 'Simba Serena JRO JRO (SIMSE7).pdf', 1, '2020-01-14 03:10:36'),
(66, 'JROGTARP001SIMTW7', 'Simba Safari (JRO TWC).pdf', 1, '2020-01-14 03:34:05'),
(67, 'JROGTARP001SIMSO', 'Simba Sopa JRO JRO (SIMSO).pdf', 1, '2020-01-14 04:04:00'),
(80, 'NBOGTARP001EAEKE', 'East African Explorer (Keekorok - Serena).pdf', 1, '2020-01-15 01:18:41'),
(81, 'JROGTARP001SIMWE7', 'Simba Wellworth JRO JRO (SIMWE7).pdf', 1, '2020-01-15 06:05:29'),
(83, 'NBOGTARP001CULKE7', 'Cultural Kenya 2019.pdf', 1, '2020-01-15 11:37:09'),
(84, 'NBOGTARP001THRSE3', 'Through the Rift Valley (Serena)THRSE3.pdf', 1, '2020-01-20 03:04:15'),
(86, 'NBOGTARP001THRKE3', 'Through the Rift Valley (Keekorok) THRK03.pdf', 1, '2020-01-20 03:11:51'),
(87, 'NBOGTARP001THRSO3', 'Through the Rift Valley (Sopa) THRSO3  2020.pdf', 1, '2020-01-20 03:25:02'),
(88, 'NBOGTARP001THRSM3', 'Through the Rift Valley (Sentrim) THRSO3  2020.pdf', 1, '2020-01-20 04:10:14'),
(90, 'VFAPKTVT001FE3NT5', 'Victoria Falls Experience 4 day Super Deal (standard).pdf', 1, '2020-01-28 04:25:22'),
(91, 'KGLPKAASAFAGERB', 'Gorilla Encounter Rwanda (basic).pdf', 1, '2020-03-09 06:11:27'),
(92, 'KGLPKAASAFAGERS', 'Gorilla Encounter Rwanda (standard).pdf', 1, '2020-03-09 10:46:46'),
(93, 'CPTPKTVT001CTERSS', 'Cape Town Explorer -  Tsogo Southern Sun Waterfront.pdf', 1, '2020-03-23 02:57:45'),
(94, 'KGLPKAASAFAGERD', 'Gorilla Encounter Rwanda (deluxe).pdf', 1, '2020-04-20 11:22:38'),
(95, 'KGLPKAASAFAGEUB ', 'Gorilla Encounter Uganda (basic).pdf', 1, '2020-04-21 12:32:25'),
(96, 'KGLPKAASAFAGEUS ', 'Gorilla Encounter Uganda (standard).pdf', 1, '2020-04-21 12:36:27'),
(97, 'KGLPKAASAFAGEUD', 'Gorilla Encounter Uganda (deluxe).pdf', 1, '2020-04-21 12:58:25'),
(98, 'EBBPKAASAFAGITMB ', 'Gorillas in the Mist (basic).pdf', 1, '2020-04-21 01:20:46'),
(99, 'CPTPKTVT001CTKDEL', 'Cape and Kruger_deluxe (CTKDEL).pdf', 1, '2020-04-22 01:38:57'),
(100, 'HDSPKMAKUTSMSSWLK', 'Kruger Walking Safari Makutsi Safari Springs.pdf', 1, '2020-04-22 02:27:26'),
(102, 'GKPPKTVT001KREDEL', 'Kruger Encompassed (deluxe) - KREDEL.pdf', 1, '2020-04-22 03:56:12'),
(103, 'CPTPKTVT001CTERVC', 'Cape Town Explorer -  Victoria & Alfred Hotel.pdf', 1, '2020-04-22 04:40:15'),
(104, 'CPTPKTVT001CTERTB', 'Cape Town Explorer -  The Table Bay.pdf', 1, '2020-04-22 05:01:45'),
(105, 'CPTPKTVT001CTERVL', 'Cape Town Explorer - Village & Life Waterfront Apartments.pdf', 1, '2020-04-22 05:49:50'),
(106, 'CPTPKTVT001CTERRB', 'Cape Town Explorer - Radisson Blu Waterfront.pdf', 1, '2020-04-22 06:09:02'),
(107, 'CPTPKTVT001CTRCO ', 'Cape Town Explorer -  The Commodore.pdf', 1, '2020-04-24 04:59:49'),
(108, 'CPTPKTV001CTERPW', 'Cape Town Explorer -  The Portswood.pdf', 1, '2020-04-24 05:35:30'),
(109, 'CPTPKTVT001CTERSS', 'Cape Town Explorer -  Tsogo Southern Sun Waterfront.pdf', 1, '2020-04-24 06:15:25'),
(110, 'CPTPKTVT001CTERHO', 'Cape Town Explorer - Cape Town Hollow Boutique Hotel.pdf', 1, '2020-04-24 06:24:13'),
(113, 'VFAPKTVT001FE3NT3', 'The Falls Experience 4 days 2020 brochure_Ilala Lodge.pdf', 1, '2020-04-27 04:11:33'),
(114, 'VFAPKTVT001FE3NT2', 'The Falls Experience 4 days 2020 brochure_A Zambezi.pdf', 1, '2020-04-27 04:18:41'),
(115, 'VFAPKTVT001FE3NT1', 'The Falls Experience 4 days 2020 brochure_The Kingdom.pdf', 1, '2020-04-27 04:19:37'),
(117, 'VFAPKTVT001FE3NT4', 'The Falls Experience 4 days 2020 brochure_Victoria Falls Hotel.pdf', 1, '2020-04-27 04:47:49'),
(118, 'VFAPKTVT001FE3NT8', 'The Falls Experience 4 days 2020 brochure_Elephant Camp.pdf', 1, '2020-04-27 05:39:45'),
(121, 'BBKPKCPKUZ CPKU3N', 'Chobe Bakwena 4D package (BBKPKCHOBAKBAK4DP) TP 2020.pdf', 1, '2020-04-29 02:49:52'),
(122, 'BBKPKCPKUZ CPKU2N', 'Camp Kuzuma 2N package ( Pay 2 Stay 3) 2020 TP.pdf', 1, '2020-04-29 02:59:47'),
(123, 'BBKPKCPKUZ CPKU4N', 'Camp Kuzuma 4N package 2020 TP.pdf', 1, '2020-04-29 03:09:50'),
(124, 'BBKPKCPKUZ CPKU4N', 'Camp Kuzuma 4N package 2020 TP.pdf', 1, '2020-04-29 03:11:54'),
(126, 'NBOPKTHISSAWLWFPC', 'Wildlife & Waterfalls 2020.pdf', 1, '2020-04-30 01:50:07'),
(127, 'NBOPKTHISSAWLWFPC', 'Wildlife & Waterfalls 2020.pdf', 1, '2020-04-30 01:52:02'),
(128, 'KGLPKARP001GERWDX', 'Gorilla Encounter Rwanda (deluxe).pdf', 1, '2020-04-30 04:21:29'),
(129, 'KGLPKAASAFAGERS  ', 'Gorilla Encounter Rwanda (standard).pdf', 1, '2020-04-30 04:51:09'),
(134, 'VFAPKTVT001FE2NT2', 'The Falls Explorer 3 days_A Zambezi.pdf', 1, '2020-05-11 11:14:05'),
(135, 'VFAPKTVT001FE2NT4', 'The Falls Explorer 3 days_Victoria Falls Hotel.pdf', 1, '2020-05-11 11:15:26'),
(136, 'VFAPKTVT001FE2NT1', 'The Falls Explorer 3 days_Kingdom Hotel.pdf', 1, '2020-05-11 11:16:13'),
(137, 'VFAPKTVT001FE2NT8', 'The Falls Explorer 3 days_Elephant Camp.pdf', 1, '2020-05-11 11:16:54'),
(138, 'VFAPKTVT001FE2NT7', 'The Falls Explorer 3 days_Stanley & Livingstone.pdf', 1, '2020-05-11 11:17:43'),
(139, 'VFAPKTVT001FE2NSL', 'The Falls Explorer 3 days_Victoria Falls Safari Lodge.pdf', 1, '2020-05-11 11:18:34'),
(141, 'JNBPKTHISSAHOSADE', 'Highlights of Southern Africa (deluxe) 2020.pdf', 1, '2020-05-12 06:40:04'),
(142, 'JNBPKTHISSAHOSAST', 'Highlights of Southern Africa - (standard) 2020.pdf', 1, '2020-05-13 05:04:13'),
(143, 'JNBPKTHISSAHOSALU', 'Highlights of Southern Africa (luxury) 2020.pdf', 1, '2020-05-15 12:27:30'),
(144, 'VFAPKTVT001FE3NT7', 'The Falls Experience 4 days 2020 brochure_Stanley & Livingstone.pdf', 1, '2020-05-19 04:11:50'),
(145, 'VFAPKTVT001FE3NT6', 'The Falls Experience 4 days 2020 brochure_Victoria Falls Safari Lodge.pdf', 1, '2020-05-19 04:13:32'),
(146, 'FAPKTVT001FC3NT7', 'The Falls Classic 4 days_The Elephant Camp.pdf', 1, '2020-05-19 04:15:50'),
(147, 'VFAPKTVT001FC3NT6', 'The Falls Classic 4 days_Stanley & Livingstone Hotel.pdf', 1, '2020-05-19 04:16:37'),
(148, 'VFAPKTVT001FC3NT4', 'The Falls Classic 4 days_Victoria Falls Hotel.pdf', 1, '2020-05-19 04:17:22'),
(150, 'VFAPKTVT001FC3NT2', 'The Falls Classic 4 days_The Kingdom Hotel.pdf', 1, '2020-05-19 04:18:47'),
(151, 'VFAPKTVT001FC3NT3', 'The Falls Classic 4 days_Ilala Lodge.pdf', 1, '2020-05-19 04:19:30'),
(152, 'VFAPKTVT001FC3NT1', 'The Falls Classic 4 days_A Zambezi.pdf', 1, '2020-05-19 04:20:31'),
(154, 'VFAPKTVT001FC3NT5', 'The Falls Classic 4 days_Vic Falls Safari Lodge.pdf', 1, '2020-05-25 01:00:59'),
(155, 'VFAPKTVT001VCODEL', 'Victoria Falls, Chobe and The Okavango Delta (Deluxe).pdf', 1, '2020-05-27 03:47:03'),
(156, 'VFAPKTVT001VCOLUX', 'Victoria Falls, Chobe and The Okavango Delt (luxury).pdf', 1, '2020-05-27 03:49:22'),
(157, 'VFAPKTVT001VCOSTD', 'Victoria Falls, Chobe and The Okavango Delt (standard).pdf', 1, '2020-05-27 03:51:17'),
(158, 'VFAPKTVT001VCSTD1', 'The Falls and Chobe (standard).pdf', 1, '2020-05-28 01:57:27'),
(160, 'VFAPKTVT001FSD3NS', 'Falls Super Deal - VFSL (standard room).pdf', 1, '2020-05-29 01:22:18'),
(161, 'VFAPKTVT001FSD3NW', 'Falls Super Deal - VFSL (waterhole facing room).pdf', 1, '2020-05-29 01:28:38'),
(162, 'BBKPKTVT001CHDELX', 'Chobe and the Delta (luxury) 2020.pdf', 1, '2020-06-02 12:19:42'),
(163, 'BBKPKTVT001CHDEST', 'Chobe and the Delta (standard) 2020.pdf', 1, '2020-06-02 01:02:33'),
(164, 'BBKPKCHOBAKBAK3DP', 'Chobe Bakwena 3D package (BAK3DP) 2020.pdf', 1, '2020-06-04 04:05:09'),
(165, 'BBKPKCHOBAKBAK4DP', 'Chobe Bakwena 4D package (BAK4DP).pdf', 1, '2020-06-04 04:06:01'),
(166, 'BBKPKCPKUZ CPKU2N', 'Camp Kuzuma 3D package (CPKU2N) 2020.pdf', 1, '2020-06-04 06:49:49'),
(168, 'JNBGTSUNWAYSUNA14', 'Botswana Wild Parks (Johannesburg start) 2020.pdf', 1, '2020-06-16 05:30:26'),
(169, 'MUBGTSUNWAYSUNA13', 'Botswana Wild Parks (Maun start) 2020.pdf', 1, '2020-06-16 05:31:20'),
(171, 'NBOGTARP001CKSM', 'Classic Kenya (Sentrim) CKSM 2020.pdf', 1, '2020-06-22 01:40:51'),
(173, 'NBOGTARP001CKSE  ', 'Classic Kenya (Serena) 2020.pdf', 1, '2020-06-22 01:44:21'),
(174, 'NBOGTARP001EAEKE ', 'East African Explorer (Keekorok - Serena) 2020.pdf', 1, '2020-06-24 11:56:31'),
(175, 'NBOGTARP001EAESE ', 'East African Explorer (Serena) 2020.pdf', 1, '2020-06-24 11:59:05'),
(177, 'NBOGTARP001FIMMSE', 'Mara Serena Safari Lodge 2N Fly-in Safari.pdf', 1, '2020-06-26 12:41:59'),
(178, 'BBKCRTVT001ZAM2NM', 'Zambezi Queen_ 3 days_master suite (ZAM2NM).pdf', 1, '2020-07-03 04:43:29'),
(179, 'BBKCRTVT001ZAM2NS', 'Zambezi Queen  2 night cruise (ZAM2NS).pdf', 1, '2020-07-13 12:48:10'),
(180, 'BBKCRTVT001ZAM3NM', 'Zambezi Queen_4 days_master suite (ZAM3NM).pdf', 1, '2020-07-13 02:27:44'),
(181, 'BBKCRTVT001ZAM3NS', 'Zambezi Queen_4 days_standard suite (ZAM3NS).pdf', 1, '2020-07-13 02:49:36'),
(182, 'BBKCRCHO018TIACP2', 'Chobe Princess_3 days 2020.pdf', 1, '2020-07-14 03:35:43'),
(183, 'BBKCRCHO018TIACP3', 'Chobe Princess_4 days 2020.pdf', 1, '2020-07-14 03:36:41'),
(184, 'CPTRLTRA005BLUDEL', 'The Blue Train_Cape Town to Pretoria_deluxe suite BLUDEL.pdf', 1, '2020-07-15 06:51:21'),
(185, 'CPTRLTRA005BLULUX', 'The Blue Train_Cape Town to Pretoria_luxury suite BLULUX.pdf', 1, '2020-07-15 06:52:30'),
(186, 'PRYRLTRA005BLUDEL', 'The Blue Train_Pretoria to Cape Town_deluxe suite BLUDEL.pdf', 1, '2020-07-15 06:53:08'),
(187, 'PRYRLTRA005BLULUX', 'The Blue Train_Pretoria to Cape Town_luxury suite BLULUX.pdf', 1, '2020-07-15 06:53:41'),
(188, 'NBOGTARP001CKSO  ', 'Classic Kenya (Sopa) CKSO.pdf', 1, '2020-07-20 01:26:57'),
(190, 'PLZGTTVT001TISD20', 'Garden Route Essentials_private TIS020.pdf', 1, '2020-07-20 04:11:42'),
(191, 'PLZGTTVT001TISG20', 'Garden Route Essentials_group tour TISG20.pdf', 1, '2020-07-20 04:12:10'),
(198, 'NBOPKARP001FIMMGV', 'Governors\' Camp_4 day fly-in safari FIMMGV.pdf', 1, '2020-07-30 02:34:35'),
(199, 'NBOPKARP001FIMMLG', 'Little Governors\' Camp_4 day fly-in safari FIMMLG.pdf', 1, '2020-07-30 02:35:29'),
(202, 'VFAGTJENMANJENW12', 'Wildlife Breakaway (12 days) JENW12_2021.pdf', 1, '2020-08-04 04:53:31'),
(203, 'VFAGTJENMANJENW15', 'Wildlife Breakaway (15 days) JENW15_2021.pdf', 1, '2020-08-04 04:56:28'),
(207, 'JROGTARP001SIMSO ', 'Simba Sopa JRO JRO (SIMSO).pdf', 1, '2020-08-12 11:57:34'),
(209, 'JNBGTSATOURSAJOUR', 'South African Journey 2020.pdf', 1, '2020-08-24 01:31:31'),
(210, 'NBOGTARP001EAESO ', 'East African Explorer (Sopa) 2021.pdf', 1, '2020-08-24 04:59:08'),
(211, 'JROGTSAFHQ SPICE ', 'Safari and Spice (SA HQ) 2020.pdf', 1, '2020-08-25 05:29:11'),
(212, 'WDHGTULTSAFULTNAM', 'Ultimate Namibia 2021.pdf', 1, '2020-09-01 06:26:06'),
(213, 'WDHGTSOANAMHINAMC', 'Highlights of Namibia 2021.pdf', 1, '2020-09-08 02:27:00'),
(214, 'WDHGTSOANAMEXNASP', 'Exploring Namibia 2021.pdf', 1, '2020-09-15 04:31:40'),
(215, 'WDHGTSOANAMCAPNAM', 'Captivating Namibia 2021.pdf', 1, '2020-10-12 11:16:57'),
(217, 'VFAGTNOMAD NAZZ', 'Best of Zimbabwe 2021.pdf', 1, '2020-10-25 11:59:40'),
(221, 'CPTGTNOMADNAJC', 'South African Explorer_accommodated 2021.pdf', 1, '2020-10-26 02:38:08'),
(227, 'JNBGTNOMAD NAJD  ', 'Kruger and eSwatini_accommodated 2021.pdf', 1, '2020-10-29 03:38:32'),
(228, 'JNBGTNOMAD NAJP ', 'Kruger, eSwatini & Lesotho_accommodated 2021.pdf', 1, '2020-11-01 11:32:11'),
(230, 'JNBGTNOMAD NAJPSG', 'Kruger, eSwatini & Lesotho_small group 2021.pdf', 1, '2020-11-02 03:26:04'),
(233, 'JNBGTNOMAD NJC', 'South African Explorer_camping 2021.pdf', 1, '2020-11-03 05:09:14'),
(234, 'JNBGTNOMAD NAJCSG', 'South African Explorer_small group 2021.pdf', 1, '2020-11-03 05:09:32'),
(235, 'JNBGTNOMAD NAJC', 'South African Explorer_accommodated 2021.pdf', 1, '2020-11-03 05:09:50'),
(237, 'CPTGTNOMADNDC', 'Lesotho & Garden Route_camping 2021.pdf', 1, '2020-11-03 05:54:37'),
(238, 'DURGTNOMAD NDC', 'Lesotho & Garden Route_camping 2021.pdf', 1, '2020-11-03 06:00:13'),
(241, 'DURGTNOMAD NADC', 'Lesotho & Garden Route_accommodated 2021.pdf', 1, '2020-11-08 11:31:16'),
(242, 'PLZGTNOMAD NPC   ', 'The Garden Route_camping 2021.pdf', 1, '2020-11-09 02:00:48'),
(243, 'PLZGTNOMAD NAPCSG', 'The Garden Route_small group 2021.pdf', 1, '2020-11-09 03:22:17'),
(244, 'PLZGTNOMAD NAPC', 'The Garden Route_accommodated 2021.pdf', 1, '2020-11-09 03:37:57'),
(247, 'CPTGTSUNWAYCWA13 ', 'Cape to Namibia_accommodated 2021.pdf', 1, '2020-11-16 01:50:58'),
(248, 'JROGTARP001SIMWEP', 'Private Simba Wellworth JRO JRO (SIMWE7) (not loaded).pdf', 1, '2020-11-16 03:46:40'),
(250, 'JNBGTSUNWAYSAA17 ', 'South Africa Rainbow Route.pdf', 1, '2020-11-17 03:28:02'),
(253, 'MOSGTACACIAMARNGU', 'Kilimanjaro Climb - Marangu Route 2020v2.pdf', 1, '2020-11-23 12:26:41'),
(254, 'LVIGTSUNWAYNBA15 ', 'The Falls and Namibia_accommodated 2021.pdf', 1, '2020-11-30 11:28:30'),
(256, 'LVIGTSUNWAYSUNNBA', 'Namibia, Botswana and the Falls_accommodated 2021v2.pdf', 1, '2020-11-30 11:50:07'),
(257, 'LVIGTSUNWAYSUNB21', 'Desert & Delta_camping 2021.pdf', 1, '2020-12-03 04:42:39'),
(258, 'NBOSPARP001CKSNAA', 'Classic Kenya (Sentrim) CKSM 2020.pdf', 1, '2020-12-07 12:32:03'),
(259, 'NBOGTARP001CKEKEE', 'Classic Kenya (Keekorok) - 2021.pdf', 1, '2020-12-07 12:32:36'),
(260, 'NBOSPARP001CKSEAA', 'Classic Kenya (Serena) 2020.pdf', 1, '2020-12-07 01:00:08'),
(262, 'NBOSPARP001CKKEAA', 'Classic Kenya (Keekorok) - 2021.pdf', 1, '2020-12-07 01:09:12'),
(263, 'NBOSPARP001CULTAA', 'Cultural Kenya 2019.pdf', 1, '2020-12-07 01:16:19'),
(264, 'NBOSPARP001EAKEAA', 'East African Explorer (Keekorok - Serena) 2020.pdf', 1, '2020-12-07 01:48:20'),
(265, 'NBOSPARP001EASOAA', 'East African Explorer (Sopa) 2021.pdf', 1, '2020-12-07 01:51:10'),
(266, 'NBOSPARP001TRSNAA', 'Through the Rift Valley (Sentrim) THRSM3  2020.pdf', 1, '2020-12-07 02:10:24'),
(267, 'NBOSPARP001TRSOAA', 'Through the Rift Valley (Sopa) THRSO3  2020.pdf', 1, '2020-12-07 02:32:43'),
(268, 'NBOSPARP001TRKEAA', 'Through the Rift Valley (Keekorok) THRK03.pdf', 1, '2020-12-07 03:11:49'),
(269, 'JROSPARP001SISO7A', 'Simba Sopa JRO JRO (SIMSO).pdf', 1, '2020-12-07 03:56:55'),
(274, 'JROSPARP001SITW7A', 'Simba Safari (JRO TWC).pdf', 1, '2020-12-07 10:55:38'),
(277, 'NBOGTARP001EASEAA', 'East African Explorer (Serena) 2020.pdf', 1, '2020-12-07 11:41:34'),
(278, 'ARKGTARP001SIMSO6', 'Simba Safari Sopa ARK to ARK (SIMSO6).pdf', 1, '2020-12-08 01:42:53'),
(279, 'ARKGTARP001SIMTW6', 'Simba Safari(ARK-ARK TWC).pdf', 1, '2020-12-08 01:45:43'),
(281, 'ARKSPARP001SISO6A', 'Simba Safari Sopa ARK to ARK (SIMSO6).pdf', 1, '2020-12-08 01:54:11'),
(282, 'ARKSPARP001SITW6A', 'Simba Safari(ARK-ARK TWC).pdf', 1, '2020-12-08 01:55:11'),
(283, 'ARKSPARP001SISE6A', 'Simba Safari (Serena ARK - ARK) SIMSE6.pdf', 1, '2020-12-08 01:56:16'),
(284, 'CPTGTNOMAD NOMNAM', 'Best of Namibia_accommodated 2021.pdf', 1, '2020-12-08 03:05:32'),
(285, 'JROGTARP001SISE7A', 'Simba Serena JRO JRO (SIMSE7).pdf', 1, '2020-12-08 03:45:43'),
(286, 'ARKGTARP001SIMSE6', 'Simba Safari (Serena ARK - ARK) SIMSE6.pdf', 1, '2020-12-08 03:47:49'),
(287, 'NBOSPARP001TRSEAA', 'Through the Rift Valley (Serena)THRSE3.pdf', 1, '2020-12-08 03:55:51'),
(288, 'NBOSPARP001CKSOAA', 'Classic Kenya (Sopa) CKSO.pdf', 1, '2020-12-08 03:58:56'),
(289, 'CPTGTSUNWAYSUCV21', 'Cape Town to Victoria Falls_camping 2021.pdf', 1, '2020-12-14 12:18:28'),
(290, 'CPTGTSUNWAYSUNA21', 'The Grand Explorer  (SUNA21).pdf', 1, '2020-12-14 10:44:48'),
(291, 'JNBGTNOMAD NJD   ', 'Kruger and eSwatini_camping 2021.pdf', 1, '2020-12-15 01:59:15'),
(292, 'JNBGTNOMAD NJP   ', 'Kruger, eSwatini & Lesotho_camping 2021.pdf', 1, '2020-12-15 02:09:06'),
(293, 'NBOSPARP001EASEAA', 'East African Explorer (Serena) 2020.pdf', 1, '2020-12-16 10:17:19'),
(294, 'NBOPKARP001FIMMKT', 'Kichwa Tembo Camp_4 day fly-in safari.pdf', 1, '2020-12-17 12:09:52'),
(295, 'NBOPKARP001FIMSER', 'Mara Serena Safari Lodge_4 day fly-in safari_deluxe.pdf', 1, '2020-12-17 12:25:27'),
(296, 'JNBPKTHISSASPLEN1', 'Splendid South Africa itinerary TP 2021 (standard).pdf', 1, '2020-12-17 02:40:38'),
(297, 'HDSPKMAKUTSMSSCLA', 'Classic Kruger Makutsi Safari Springs (MSSCLA).pdf', 1, '2020-12-17 02:47:34'),
(298, 'CPTPKTHISSASCENDX', 'Scenic Southern Africa (deluxe) 2021.pdf', 1, '2021-01-11 03:03:12'),
(299, 'CPTPKTHISSASCENST', 'Scenic Southern Africa (standard) 2021.pdf', 1, '2021-01-11 03:03:48'),
(302, 'CPTPKTHISSASCENLX', 'Scenic Southern Africa luxury 2021.pdf', 1, '2021-01-11 11:02:01'),
(303, 'LVIGTSUNWAYSUNB15', 'Namibia from the Falls_camping 2021.pdf', 1, '2021-01-11 11:10:45'),
(305, 'CPTGTSUNWAYSUCW14', 'Cape Town to Windhoek_camping 2021v2.pdf', 1, '2021-01-12 12:51:17'),
(306, 'KGLPKAASAFAAAPPST', 'People and Primates (standard) .pdf', 1, '2021-01-13 12:14:08'),
(308, 'NBOGTSOAEASN13124', 'Kenya and Tanzania Combo Deal - master NM131 +NM24 2021.pdf', 1, '2021-01-20 01:40:23'),
(312, 'NBOPKARP001WDD   ', 'Wildest Dreams 2021v2.pdf', 1, '2021-02-08 03:48:45'),
(313, 'NBOGTSOAEASSNM062', 'Kenya and Tanzania Combo Deal -NM062 Days 5 - 12.pdf', 1, '2021-02-09 11:45:39'),
(315, 'NBOGTSOAEASNM111', 'Kenya and Tanzania Combo Deal -NM111 12 days.pdf', 1, '2021-02-10 12:29:23'),
(316, 'NBOGTSOAEASSNM042', 'Kenya and Tanzania Combo Deal -NM042 Day 10 - 14.pdf', 1, '2021-02-10 01:13:07'),
(317, 'NBOGTSOAEASSNM111', 'Kenya and Tanzania Combo Deal -NM111 12 days.pdf', 1, '2021-02-10 01:37:10'),
(319, 'NBOGTSOAEASSNM131', 'Kenya and Tanzania Combo Deal -  NM131 2021.pdf', 1, '2021-02-10 01:43:56'),
(322, 'JROGTSOAEASSNM042', 'Kenya and Tanzania Combo Deal -NM042 Day 10 - 14.pdf', 1, '2021-02-17 02:25:27'),
(323, 'VFAPKTVT001FE3NT5', 'The Falls Experience 4 days 2020 brochure_Victoria Falls Hotel.pdf', 1, '2021-02-24 02:36:11'),
(324, 'NBOGTSOAEASSNM071', 'Kenya and Tanzania Combo Deal -  NM071 2021 Days 1-8 NBO - NBO.pdf', 1, '2021-03-07 11:26:46'),
(325, 'NBOGTSOAEASSNM091', 'Kenya and Tanzania Combo Deal -  NM091 2021 Days 1-10 NBO - NBO.pdf', 1, '2021-03-07 11:31:33'),
(326, 'NBOGTSOAEASSNM061', 'Kenya Combo - Days 1-7 NM061.pdf', 1, '2021-03-08 01:21:35'),
(327, 'NBOGTSOAEASSNM041', 'Kenya Combo - Days 3 - 7 NM041.pdf', 1, '2021-03-08 03:47:58'),
(328, 'NBOGTSOAEASSNM031', 'Kenya Combo - Days 3 - 6 NM031.pdf', 1, '2021-03-08 11:49:46'),
(329, 'NBOGTSOAEASKTNM21', 'Kenya Combo -3 Days 8-10 NM021.pdf', 1, '2021-03-09 01:20:13'),
(330, 'JROGTSOAEASSNM024', 'Tanzania Combo Deal NM024 2021.pdf', 1, '2021-03-09 01:21:20'),
(331, 'NBOGTSOAEASSNM022', 'Kenya Combo - 3 Days  5- 7 NM022.pdf', 1, '2021-03-09 03:36:48'),
(332, 'MUBGTJENMANJENBSE', 'Botswana and Zimbabwe Escape 2021.pdf', 1, '2021-03-15 01:28:38'),
(333, 'CPTPKTHISSAGRANDS', 'Grand Africa 2021 (standard accommodation).pdf', 1, '2021-03-15 03:57:22'),
(336, 'KGLPKTHISSAGGAME ', 'Gorillas and Game Parks 2021.pdf', 1, '2021-03-22 03:00:49'),
(337, 'NBOPKARP001ENCHAN', 'Enchanting Kenya (Mara Engai and Larsen\'s Tented) 2021.pdf', 1, '2021-03-22 03:01:12'),
(338, 'JNBSPTHISSAHISD', 'Highlights of Southern Africa (luxury) WEL11885.pdf', 1, '2023-04-05 10:00:31'),
(339, 'JNBSPTHISSASPLEN', 'Splendid South Africa .pdf', 1, '2023-05-13 04:56:52'),
(340, 'JNBGTSUNWAYSUNZBA', 'Zimbabwe Botswana Game Tracker 2025.pdf', 1, '2025-05-05 02:39:41');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `af_product_pdf`
--
ALTER TABLE `af_product_pdf`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `af_product_pdf`
--
ALTER TABLE `af_product_pdf`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=341;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
