-- phpMyAdmin SQL Dump
-- version 4.2.12deb2+deb8u2
-- http://www.phpmyadmin.net
--
-- Servidor: 158.109.200.243:3306
-- Tiempo de generación: 31-07-2019 a las 11:48:16
-- Versión del servidor: 5.5.59-0+deb8u1-log
-- Versión de PHP: 5.6.33-0+deb8u1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de datos: `prod_paqueteria`
--


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paquets_buida`
--

CREATE TABLE IF NOT EXISTS `paquets_buida` (
`id` int(11) NOT NULL,
  `data_arribada` varchar(50) DEFAULT NULL,
  `remitent` varchar(50) DEFAULT NULL,
  `procedencia` varchar(100) DEFAULT NULL,
  `quantitat` int(11) NOT NULL DEFAULT '1',
  `mitja_arribada` varchar(50) DEFAULT NULL,
  `referencia` varchar(50) DEFAULT NULL,
  `destinatari` varchar(50) DEFAULT NULL,
  `departament` varchar(100) DEFAULT NULL,
  `data_lliurament` varchar(50) DEFAULT NULL,
  `dipositari` varchar(50) DEFAULT NULL,
  `signatura` mediumtext,
  `qrcode` int(11) DEFAULT NULL,
  `email` varchar(50) DEFAULT '',
  `emailremitent` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuaris`
--

CREATE TABLE IF NOT EXISTS `usuaris` (
`id` int(11) NOT NULL,
  `niu` varchar(10) NOT NULL,
  `displayname` varchar(50) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `tablename` varchar(20) NOT NULL,
  `ldapuri` varchar(50) NOT NULL,
  `uidbasedn` varchar(100) NOT NULL,
  `ubicacioemail` varchar(100) NOT NULL,
  `gestoremail` varchar(50) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `usuaris`
--

INSERT INTO `usuaris` (`id`, `niu`, `displayname`, `rol_id`, `tablename`, `ldapuri`, `uidbasedn`, `ubicacioemail`, `gestoremail`) VALUES
(1, '1234567', 'Adolfo', 1, 'testvet', 'ldaps://testserver.uab.es', 'ou=test,ou=Users,o=sids', 'l''Slipi de la teva Facultat', 'slipi.test@uab.cat')

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `paquets_buida`
--
ALTER TABLE `paquets_buida`
 ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuaris`
--
ALTER TABLE `usuaris`
 ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `usuaris_nia_unique` (`niu`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `paquets_buida`
--
ALTER TABLE `paquets_buida`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuaris`
--
ALTER TABLE `usuaris`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=2;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
