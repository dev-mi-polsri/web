-- Down migration for V1 init schema (MySQL 8+)
SET FOREIGN_KEY_CHECKS = 0;

-- Drop dependents first
DROP TABLE IF EXISTS `post_tags`;

-- Drop main tables
DROP TABLE IF EXISTS `posts`;
DROP TABLE IF EXISTS `tags`;
DROP TABLE IF EXISTS `prodi`;
DROP TABLE IF EXISTS `profile`;
DROP TABLE IF EXISTS `fasilitas`;
DROP TABLE IF EXISTS `tenaga_ajar`;
DROP TABLE IF EXISTS `agenda`;
DROP TABLE IF EXISTS `media`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

