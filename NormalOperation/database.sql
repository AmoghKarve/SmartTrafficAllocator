-- phpMyAdmin SQL Dump
-- version 4.7.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Apr 09, 2018 at 07:13 PM
-- Server version: 5.6.35
-- PHP Version: 7.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `trafficDatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `junction`
--

CREATE TABLE `junction` (
  `junctionId` int(11) NOT NULL,
  `junctionName` varchar(30) COLLATE utf8_unicode_ci NOT NULL,
  `numberOfJunctions` int(11) NOT NULL,
  `totalIterations` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `junction`
--

INSERT INTO `junction` (`junctionId`, `junctionName`, `numberOfJunctions`, `totalIterations`) VALUES
(1, 'abcd', 4, 3),
(2, 'coep', 3, 2),
(3, 'xyz', 4, 2);

-- --------------------------------------------------------

--
-- Table structure for table `trafficSignal`
--

CREATE TABLE `trafficSignal` (
  `trafficSignalId` int(11) NOT NULL,
  `junctionId` int(11) NOT NULL,
  `videoFeedId` int(11) NOT NULL,
  `iteration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `trafficSignal`
--

INSERT INTO `trafficSignal` (`trafficSignalId`, `junctionId`, `videoFeedId`, `iteration`) VALUES
(1, 1, 1, 1),
(1, 1, 5, 2),
(1, 1, 9, 3),
(2, 1, 2, 1),
(2, 1, 6, 2),
(2, 1, 10, 3),
(3, 1, 3, 1),
(3, 1, 7, 2),
(3, 1, 11, 3),
(4, 1, 4, 1),
(4, 1, 8, 2),
(4, 1, 12, 3),
(5, 2, 13, 1),
(5, 2, 16, 2),
(6, 2, 14, 1),
(6, 2, 17, 2),
(7, 2, 15, 1),
(7, 2, 18, 2),
(8, 3, 19, 1),
(8, 3, 23, 2),
(9, 3, 20, 1),
(9, 3, 24, 2),
(10, 3, 21, 1),
(10, 3, 25, 2),
(11, 3, 22, 1),
(11, 3, 26, 2);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `Username` varchar(20) COLLATE utf8_unicode_ci NOT NULL,
  `Password` varchar(20) COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`Username`, `Password`) VALUES
('administrator', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `video`
--

CREATE TABLE `video` (
  `videoFeedId` int(11) NOT NULL,
  `videoFeed` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `iteration` int(11) NOT NULL,
  `density` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `video`
--

INSERT INTO `video` (`videoFeedId`, `videoFeed`, `iteration`, `density`) VALUES
(1, 'video/cctv052x2004080516x01639.mp4', 1, 0.25961538461538464),
(2, 'video/cctv052x2004080517x01654.mp4', 1, 0.5192307692307693),
(3, 'video/cctv052x2004080519x01682.mp4', 1, 0.07692307692307693),
(4, 'video/cctv052x2004080518x01672.mp4', 1, 0.14423076923076922),
(5, 'video/cctv052x2004080516x01638.mp4', 2, 0.15942028985507245),
(6, 'video/cctv052x2004080517x01653.mp4', 2, 0.6739130434782609),
(7, 'video/cctv052x2004080519x01683.mp4', 2, 0.036231884057971016),
(8, 'video/cctv052x2004080518x01670.mp4', 2, 0.13043478260869565),
(9, 'video/cctv052x2004080517x01655.mp4', 3, 0.2),
(10, 'video/cctv052x2004080516x01641.mp4', 3, 0.5391304347826087),
(11, 'video/cctv052x2004080519x01684.mp4', 3, 0.12173913043478261),
(12, 'video/cctv052x2004080518x01674.mp4', 3, 0.1391304347826087),
(13, 'video/cctv052x2004080614x00021.mp4', 1, 0.27692307692307694),
(14, 'video/cctv052x2004080612x00005.mp4', 1, 0.27692307692307694),
(15, 'video/cctv052x2004080616x00060.mp4', 1, 0.4461538461538462),
(16, 'video/cctv052x2004080613x00011.mp4', 2, 0.08771929824561403),
(17, 'video/cctv052x2004080612x00004.mp4', 2, 0.2631578947368421),
(18, 'video/cctv052x2004080616x00059.mp4', 2, 0.6491228070175439),
(19, 'video/cctv052x2004080607x01841.mp4', 1, 0.07142857142857142),
(20, 'video/cctv052x2004080607x01839.mp4', 1, 0.14285714285714285),
(21, 'video/cctv052x2004080607x01842.mp4', 1, 0.21428571428571427),
(22, 'video/cctv052x2004080607x01840.mp4', 1, 0.5714285714285714),
(23, 'video/cctv052x2004080607x01846.mp4', 2, 0.1),
(24, 'video/cctv052x2004080607x01843.mp4', 2, 0.18333333333333332),
(25, 'video/cctv052x2004080607x01844.mp4', 2, 0.3333333333333333),
(26, 'video/cctv052x2004080607x01845.mp4', 2, 0.38333333333333336);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `junction`
--
ALTER TABLE `junction`
  ADD PRIMARY KEY (`junctionId`);

--
-- Indexes for table `trafficSignal`
--
ALTER TABLE `trafficSignal`
  ADD PRIMARY KEY (`trafficSignalId`,`iteration`),
  ADD KEY `trafficsignal_ibfk_1` (`junctionId`),
  ADD KEY `videoFeedId` (`videoFeedId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`Username`);

--
-- Indexes for table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`videoFeedId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `junction`
--
ALTER TABLE `junction`
  MODIFY `junctionId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `video`
--
ALTER TABLE `video`
  MODIFY `videoFeedId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `trafficSignal`
--
ALTER TABLE `trafficSignal`
  ADD CONSTRAINT `trafficsignal_ibfk_1` FOREIGN KEY (`junctionId`) REFERENCES `junction` (`junctionId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `trafficsignal_ibfk_2` FOREIGN KEY (`videoFeedId`) REFERENCES `video` (`videoFeedId`) ON DELETE CASCADE ON UPDATE CASCADE;
