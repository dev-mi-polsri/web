-- Initial schema migration (MySQL 8+)

-- Use utf8mb4 everywhere
SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- Disable FK checks during creation
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user`
(
    `id`            VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `name`          VARCHAR(255) NOT NULL,
    `email`         VARCHAR(255) NOT NULL,
    `role`          VARCHAR(32)  NOT NULL,
    `password`      VARCHAR(255) NOT NULL,
    `password_salt` VARCHAR(255) NOT NULL,
    `created_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`    DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `user_email_uq` (`email`),
    KEY `user_role_idx` (`role`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- media
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `media`
(
    `id`              VARCHAR(36)   NOT NULL DEFAULT (UUID()),
    `type`            VARCHAR(16)   NOT NULL,
    `mime`            VARCHAR(64)   NOT NULL,
    `url`             VARCHAR(2048) NOT NULL,
    `alt_text`        VARCHAR(255)  NULL,
    `is_downloadable` TINYINT(1)    NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `media_type_idx` (`type`),
    KEY `media_mime_idx` (`mime`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- agenda
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `agenda`
(
    `id`          VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `title`       VARCHAR(255) NOT NULL,
    `en_title`    VARCHAR(255) NOT NULL,
    `description` TEXT         NOT NULL,
    `start_date`  DATETIME(3)  NOT NULL,
    `end_date`    DATETIME(3)  NOT NULL,
    `location`    VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `agenda_start_date_idx` (`start_date`),
    KEY `agenda_end_date_idx` (`end_date`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- fasilitas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `fasilitas`
(
    `id`      VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `image`   TEXT         NOT NULL,
    `name`    VARCHAR(255) NOT NULL,
    `en_name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- tenaga_ajar
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tenagaAjar`
(
    `id`         VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `nama`       VARCHAR(255) NOT NULL,
    `jenis`      VARCHAR(16)  NOT NULL,
    `foto`       TEXT         NOT NULL,
    `homebase`   VARCHAR(64)  NOT NULL,
    `nip`        VARCHAR(64)  NOT NULL,
    `nidn`       VARCHAR(64)  NULL,
    `nuptk`      VARCHAR(64)  NULL,
    `is_pejabat` TINYINT(1)   NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`),
    KEY `tenaga_ajar_jenis_idx` (`jenis`),
    KEY `tenaga_ajar_homebase_idx` (`homebase`),
    KEY `tenaga_ajar_is_pejabat_idx` (`is_pejabat`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- posts + tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `tag`
(
    `id`   VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `tag_slug_uq` (`slug`),
    KEY `tag_name_idx` (`name`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `post`
(
    `id`           VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `thumbnail`    TEXT         NOT NULL,
    `title`        VARCHAR(255) NOT NULL,
    `content`      JSON         NOT NULL,
    `type`         VARCHAR(32)  NOT NULL,
    `slug`         VARCHAR(255) NOT NULL,
    `is_featured`  TINYINT(1)   NOT NULL DEFAULT 0,
    `is_published` TINYINT(1)   NOT NULL DEFAULT 0,
    `scope`        VARCHAR(32)  NOT NULL,
    `created_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`   DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `post_slug_uq` (`slug`),
    KEY `post_type_idx` (`type`),
    KEY `post_scope_idx` (`scope`),
    KEY `post_is_featured_idx` (`is_featured`),
    KEY `post_created_at_idx` (`created_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `postTag`
(
    `post_id` VARCHAR(36) NOT NULL,
    `tag_id`  VARCHAR(36) NOT NULL,
    PRIMARY KEY (`post_id`, `tag_id`),
    KEY `post_tags_tag_id_idx` (`tag_id`),
    CONSTRAINT `postTag_post_fk` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `postTag_tag_fk` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- prodi
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `prodi`
(
    `id`          VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `thumbnail`   TEXT         NOT NULL,
    `title`       VARCHAR(255) NOT NULL,
    `description` TEXT         NOT NULL,
    `content`     JSON         NOT NULL,
    `slug`        VARCHAR(255) NOT NULL,
    `scope`       VARCHAR(32)  NOT NULL,
    `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `prodi_slug_uq` (`slug`),
    KEY `prodi_scope_idx` (`scope`),
    KEY `prodi_created_at_idx` (`created_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- profile
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `profile`
(
    `id`          VARCHAR(36)  NOT NULL DEFAULT (UUID()),
    `thumbnail`   TEXT         NOT NULL,
    `title`       VARCHAR(255) NOT NULL,
    `description` TEXT         NOT NULL,
    `content`     JSON         NOT NULL,
    `slug`        VARCHAR(255) NOT NULL,
    `scope`       VARCHAR(32)  NOT NULL,
    `created_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at`  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    PRIMARY KEY (`id`),
    UNIQUE KEY `profile_slug_uq` (`slug`),
    KEY `profile_scope_idx` (`scope`),
    KEY `profile_created_at_idx` (`created_at`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
