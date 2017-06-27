-- Время создания: Июн 27 2017 г., 15:19
-- Автор: Панфилова Оксана.
-- База данных: `projectmanager`
--

--
-- Структура таблицы `tblproject`
--
-- Создание: Июн 27 2017 г., 00:51
--

CREATE TABLE IF NOT EXISTS `tblproject` (
  `bigintProjectId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор проекта',
  `varchProjectName` varchar(255) NOT NULL COMMENT 'Имя проекта',
  `decProjectTime` decimal(18,2) NOT NULL COMMENT 'Общее время ',
  `decProjectPercent` decimal(3,2) NOT NULL COMMENT 'Процент выполнения',
  PRIMARY KEY (`bigintProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Проект'  ;

-- --------------------------------------------------------

--
-- Структура таблицы `tbltask`
--
-- Создание: Июн 27 2017 г., 01:08
--

CREATE TABLE IF NOT EXISTS `tbltask` (
  `bigintTaskId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор',
  `varchTaskName` varchar(255) NOT NULL COMMENT 'Название',
  `textTaskDescription` text NOT NULL COMMENT 'Описание задачи',
  `intTaskStatus` int(1) DEFAULT NULL COMMENT '0-нерешенная,1- в процессе выполнения, 2- выполнена',
  `bigintProjectId` bigint(20) NOT NULL COMMENT 'Какому проекту принадлежит задача',
  PRIMARY KEY (`bigintTaskId`),
  KEY `bigintProjectId` (`bigintProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8  ;

--
-- СВЯЗИ ТАБЛИЦЫ `tbltask`:
--   `bigintProjectId`
--       `tblproject` -> `bigintProjectId`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tbluser`
--
-- Создание: Июн 27 2017 г., 01:04
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
-- Структура таблицы `tbluserproject`
--
-- Создание: Июн 27 2017 г., 11:02
--

CREATE TABLE IF NOT EXISTS `tbluserproject` (
  `bigintUserProjectId` bigint(20) NOT NULL AUTO_INCREMENT COMMENT 'Идентификатор',
  `bigintUserId` bigint(20) NOT NULL COMMENT 'Пользователь',
  `bigintProjectId` bigint(20) NOT NULL COMMENT 'Проект, в котором участвует пользователь',
  PRIMARY KEY (`bigintUserProjectId`),
  KEY `bigintUserId` (`bigintUserId`,`bigintProjectId`),
  KEY `bigintProjectId` (`bigintProjectId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ;

--
-- СВЯЗИ ТАБЛИЦЫ `tbluserproject`:
--   `bigintUserId`
--       `tbluser` -> `bigintUserId`
--   `bigintProjectId`
--       `tblproject` -> `bigintProjectId`
--

-- --------------------------------------------------------

--
-- Структура таблицы `tblusertask`
--
-- Создание: Июн 27 2017 г., 10:49
--

CREATE TABLE IF NOT EXISTS `tblusertask` (
  `bigintUserTaskId` bigint(20) NOT NULL COMMENT 'Идентификатор',
  `bigintUserId` bigint(20) NOT NULL COMMENT 'Идентификатор пользователя',
  `bigintTaskId` bigint(20) NOT NULL COMMENT 'Идентификатор задачи ',
  `timestUserTaskBegin` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Начало выполнения задачи.',
  `timestUserTaskEnd` datetime NOT NULL COMMENT 'Дата и время окончания выполнения задачи',
  KEY `bigintUserId` (`bigintUserId`,`bigintTaskId`),
  KEY `bigintTaskId` (`bigintTaskId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Задачи, выполняемые пользователем';

--
-- СВЯЗИ ТАБЛИЦЫ `tblusertask`:
--   `bigintUserId`
--       `tbluser` -> `bigintUserId`
--   `bigintTaskId`
--       `tbltask` -> `bigintTaskId`
--

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `tbltask`
--
ALTER TABLE `tbltask`
  ADD CONSTRAINT `tbltask_ibfk_1` FOREIGN KEY (`bigintProjectId`) REFERENCES `tblproject` (`bigintProjectId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tbluserproject`
--
ALTER TABLE `tbluserproject`
  ADD CONSTRAINT `tbluserproject_ibfk_2` FOREIGN KEY (`bigintUserId`) REFERENCES `tbluser` (`bigintUserId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tbluserproject_ibfk_1` FOREIGN KEY (`bigintProjectId`) REFERENCES `tblproject` (`bigintProjectId`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `tblusertask`
--
ALTER TABLE `tblusertask`
  ADD CONSTRAINT `tblusertask_ibfk_2` FOREIGN KEY (`bigintUserId`) REFERENCES `tbluser` (`bigintUserId`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tblusertask_ibfk_1` FOREIGN KEY (`bigintTaskId`) REFERENCES `tbltask` (`bigintTaskId`) ON DELETE CASCADE ON UPDATE CASCADE;
