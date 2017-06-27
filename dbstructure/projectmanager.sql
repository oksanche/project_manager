-- Автор: Панфилова Оксана, oksssanche@gmail.com.
-- Время создания: Июн 27 2017 г., 22:16
-- Версия MySQL: 5.5.25
-- Кодировка сервера: UTF-8 Unicode (utf8)

SET time_zone = "+00:00";

--
-- База данных: `projectmanager`
--
CREATE DATABASE IF NOT EXISTS `projectmanager`;
-- --------------------------------------------------------

--
-- Структура таблицы `tblproject`
--

CREATE TABLE IF NOT EXISTS `tblproject` (
  `bigintProjectId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор проекта',
  `varchProjectName` varchar(255) NOT NULL COMMENT 'Имя проекта',
  `decProjectTime` decimal(18,2) NOT NULL DEFAULT '0.00' COMMENT 'Общее время в часах.',
  `decProjectPercent` decimal(3,2) NOT NULL DEFAULT '0.00' COMMENT 'Процент выполнения',
  `bigintUserId` bigint(20) NOT NULL COMMENT 'Создатель проекта',
  PRIMARY KEY (`bigintProjectId`),
  KEY `bigintUserId` (`bigintUserId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Проект'  ;

-- --------------------------------------------------------

--
-- Структура таблицы `tbltask`
--

CREATE TABLE IF NOT EXISTS `tbltask` (
  `bigintTaskId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор',
  `varchTaskName` varchar(255) NOT NULL COMMENT 'Название',
  `textTaskDescription` text COMMENT 'Описание задачи',
  `intTaskStatus` int(1) NOT NULL DEFAULT '0' COMMENT '0-нерешенная,1- в процессе выполнения, 2- выполнена',
  `bigintProjectId` bigint(20) NOT NULL COMMENT 'Какому проекту принадлежит задача',
  PRIMARY KEY (`bigintTaskId`),
  KEY `bigintProjectId` (`bigintProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Задача' ;

-- --------------------------------------------------------

--
-- Структура таблицы `tbluser`
--

CREATE TABLE IF NOT EXISTS `tbluser` (
  `bigintUserId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор пользователя',
  `varchUserEmail` varchar(255) NOT NULL COMMENT 'Адрес электронной почты',
  `varchUserFirstName` varchar(255) NOT NULL COMMENT 'Имя',
  `varchUserLastName` varchar(255) NOT NULL COMMENT 'Фамилия',
  `varchUserPassword` varchar(255) NOT NULL COMMENT 'Пароль',
  PRIMARY KEY (`bigintUserId`),
  UNIQUE KEY `varchUserEmail` (`varchUserEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Пользователь'  ;

-- --------------------------------------------------------

--
-- Структура таблицы `tbluserhastask`
--

CREATE TABLE IF NOT EXISTS `tbluserhastask` (
  `bigintUserHasTaskId` bigint(20) NOT NULL COMMENT 'Идентификатор',
  `bigintUserId` bigint(20) NOT NULL COMMENT 'Идентификатор пользователя',
  `bigintTaskId` bigint(20) NOT NULL COMMENT 'Идентификатор задачи ',
  `datetimeUserHasTaskBegin` datetime NOT NULL COMMENT 'Начало выполнения задачи.',
  `datetimeUserHasTaskEnd` datetime DEFAULT NULL COMMENT 'Дата и время окончания выполнения задачи',
  KEY `bigintUserId` (`bigintUserId`,`bigintTaskId`),
  KEY `bigintTaskId` (`bigintTaskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Задачи, выполняемые пользователем';

-- --------------------------------------------------------

--
-- Структура таблицы `tblusersinprojects`
--

CREATE TABLE IF NOT EXISTS `tblusersinprojects` (
  `bigintUsersInProjectId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор',
  `bigintUserId` bigint(20) NOT NULL COMMENT 'Пользователь',
  `bigintProjectId` bigint(20) NOT NULL COMMENT 'Проект, в котором участвует пользователь',
  PRIMARY KEY (`bigintUsersInProjectId`),
  KEY `bigintUserId` (`bigintUserId`,`bigintProjectId`),
  KEY `bigintProjectId` (`bigintProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Участие пользователей в проектах' ;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `tblproject`
--
ALTER TABLE `tblproject`
  ADD CONSTRAINT `tblproject_ibfk_1` FOREIGN KEY (`bigintUserId`) REFERENCES `tbluser` (`bigintUserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tbltask`
--
ALTER TABLE `tbltask`
  ADD CONSTRAINT `tbltask_ibfk_1` FOREIGN KEY (`bigintProjectId`) REFERENCES `tblproject` (`bigintProjectId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tbluser`
--
ALTER TABLE `tbluser`
  ADD CONSTRAINT `tbluser_ibfk_1` FOREIGN KEY (`bigintUserId`) REFERENCES `tblproject` (`bigintUserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tbluserhastask`
--
ALTER TABLE `tbluserhastask`
  ADD CONSTRAINT `tbluserhastask_ibfk_1` FOREIGN KEY (`bigintTaskId`) REFERENCES `tbltask` (`bigintTaskId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbluserhastask_ibfk_2` FOREIGN KEY (`bigintUserId`) REFERENCES `tbluser` (`bigintUserId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tblusersinprojects`
--
ALTER TABLE `tblusersinprojects`
  ADD CONSTRAINT `tblusersinprojects_ibfk_1` FOREIGN KEY (`bigintProjectId`) REFERENCES `tblproject` (`bigintProjectId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tblusersinprojects_ibfk_2` FOREIGN KEY (`bigintUserId`) REFERENCES `tbluser` (`bigintUserId`) ON DELETE CASCADE ON UPDATE CASCADE;
