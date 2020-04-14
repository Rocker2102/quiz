-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2020 at 08:51 PM
-- Server version: 10.4.8-MariaDB
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quiz`
--

-- --------------------------------------------------------

--
-- Table structure for table `data`
--

CREATE TABLE `data` (
  `quiz_id` int(4) NOT NULL,
  `uid` int(4) NOT NULL DEFAULT -1,
  `quiz_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `unique_identifier` varchar(256) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp(),
  `last_modified` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `data`
--

INSERT INTO `data` (`quiz_id`, `uid`, `quiz_data`, `unique_identifier`, `created_on`, `last_modified`) VALUES
(1, -1, '[{\"index\":0,\"answerType\":\"2\",\"question\":\"sagqw\",\"options\":[{\"value\":\"dbs\",\"answer\":\"1\"}]}]', '9178bc549d94c3f1', '2020-04-12 15:33:26', '2020-04-12 15:33:26'),
(2, 1, '[{\"index\":0,\"answerType\":\"1\",\"question\":\"Question 1\",\"options\":[{\"value\":\"Option1\",\"answer\":\"0\"},{\"value\":\"Option 2\",\"answer\":\"1\"}]},{\"index\":1,\"answerType\":\"2\",\"question\":\"Question 2\",\"options\":[{\"value\":\"Solo\",\"answer\":\"0\"},{\"value\":\"Duo\",\"answer\":\"1\"},{\"value\":\"Trio\",\"answer\":\"0\"},{\"value\":\"Squad\",\"answer\":\"1\"}]}]', 'dd63c00f0a7b9861', '2020-04-12 15:34:48', '2020-04-12 15:34:48'),
(3, -1, '[{\"index\":0,\"answerType\":\"1\",\"question\":\"Question 1\",\"options\":[{\"value\":\"faf\",\"answer\":\"0\"},{\"value\":\"fawf\",\"answer\":\"1\"},{\"value\":\"asfa\",\"answer\":\"0\"}]},{\"index\":1,\"answerType\":\"2\",\"question\":\"Second question!\",\"options\":[{\"value\":\"dvsd\",\"answer\":\"1\"},{\"value\":\"fasf\",\"answer\":\"1\"},{\"value\":\"asfa\",\"answer\":\"1\"}]},{\"index\":2,\"answerType\":\"2\",\"question\":\"Question 3\",\"options\":[{\"value\":\"saf\",\"answer\":\"0\"},{\"value\":\"facazv\",\"answer\":\"1\"},{\"value\":\"vsagas\",\"answer\":\"1\"},{\"value\":\"dsvse\",\"answer\":\"0\"},{\"value\":\"vwef\",\"answer\":\"0\"}]},{\"index\":3,\"answerType\":\"1\",\"question\":\"4th Question!\",\"options\":[{\"value\":\"fawf\",\"answer\":\"0\"},{\"value\":\"afa\",\"answer\":\"1\"},{\"value\":\"cf\",\"answer\":\"0\"},{\"value\":\"cawf\",\"answer\":\"0\"}]}]', '3715ffe8c569bee7', '2020-04-13 13:47:26', '2020-04-13 13:47:26');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `uid` int(4) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT '[unknown]',
  `email` varchar(256) NOT NULL,
  `created_on` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `submissions`
--

CREATE TABLE `submissions` (
  `sid` int(11) NOT NULL,
  `identifier` varchar(256) NOT NULL,
  `name` varchar(128) NOT NULL DEFAULT 'Anonymous',
  `answers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `data`
--
ALTER TABLE `data`
  ADD PRIMARY KEY (`quiz_id`),
  ADD UNIQUE KEY `unique_identifier` (`unique_identifier`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`uid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `data`
--
ALTER TABLE `data`
  MODIFY `quiz_id` int(4) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `uid` int(4) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
