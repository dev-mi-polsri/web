-- -------------------------------------
-- Dokumen Table
-- -------------------------------------
CREATE TABLE IF NOT EXISTS `dokumen`
(
    `id`      VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `url`     VARCHAR(255) NOT NULL,
    `name`    VARCHAR(255) NOT NULL,
    `en_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;