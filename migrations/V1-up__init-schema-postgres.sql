-- Initial schema migration (PostgreSQL)
-- Convert MySQL 8+ schema to PostgreSQL 12+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set timezone to UTC
SET timezone = 'UTC';

-- Disable constraints during creation
-- (PostgreSQL doesn't have an equivalent to SET FOREIGN_KEY_CHECKS)

-- -----------------------------------------------------------------------------
-- media
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "media"
(
    "id"              UUID        NOT NULL DEFAULT gen_random_uuid(),
    "type"            VARCHAR(16) NOT NULL,
    "mime"            VARCHAR(64) NOT NULL,
    "url"             VARCHAR(255) NOT NULL,
    "alt_text"        VARCHAR(255) NULL,
    "is_downloadable" BOOLEAN     NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "media_type_idx" ON "media" ("type");
CREATE INDEX IF NOT EXISTS "media_mime_idx" ON "media" ("mime");
CREATE INDEX IF NOT EXISTS "media_url_idx" ON "media" ("url");

-- Add comments for clarity
COMMENT ON TABLE "media" IS 'File and image metadata storage';

-- -----------------------------------------------------------------------------
-- agenda
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "agenda"
(
    "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
    "title"       VARCHAR(255) NOT NULL,
    "en_title"    VARCHAR(255) NOT NULL,
    "description" TEXT         NOT NULL,
    "start_date"  TIMESTAMP WITH TIME ZONE NOT NULL,
    "end_date"    TIMESTAMP WITH TIME ZONE NOT NULL,
    "location"    VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "agenda_start_date_idx" ON "agenda" ("start_date");
CREATE INDEX IF NOT EXISTS "agenda_end_date_idx" ON "agenda" ("end_date");

-- -----------------------------------------------------------------------------
-- fasilitas
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "fasilitas"
(
    "id"      UUID NOT NULL DEFAULT gen_random_uuid(),
    "image"   VARCHAR(255) NOT NULL,
    "name"    VARCHAR(255) NOT NULL,
    "en_name" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);

-- -----------------------------------------------------------------------------
-- tenaga_ajar
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "tenaga_ajar"
(
    "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
    "nama"       VARCHAR(255) NOT NULL,
    "jenis"      VARCHAR(16)  NOT NULL,
    "foto"       VARCHAR(255) NOT NULL,
    "homebase"   VARCHAR(64)  NOT NULL,
    "nip"        VARCHAR(64)  NOT NULL,
    "nidn"       VARCHAR(64)  NULL,
    "nuptk"      VARCHAR(64)  NULL,
    "is_pejabat" BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "tenaga_ajar_jenis_idx" ON "tenaga_ajar" ("jenis");
CREATE INDEX IF NOT EXISTS "tenaga_ajar_homebase_idx" ON "tenaga_ajar" ("homebase");
CREATE INDEX IF NOT EXISTS "tenaga_ajar_is_pejabat_idx" ON "tenaga_ajar" ("is_pejabat");

-- -----------------------------------------------------------------------------
-- posts + tags
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "tag"
(
    "id"   UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id"),
    CONSTRAINT "tag_slug_uq" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "tag_name_idx" ON "tag" ("name");

CREATE TABLE IF NOT EXISTS "post"
(
    "id"           UUID NOT NULL DEFAULT gen_random_uuid(),
    "thumbnail"    VARCHAR(255) NOT NULL,
    "title"        VARCHAR(255) NOT NULL,
    "content"      JSONB        NOT NULL,
    "type"         VARCHAR(32)  NOT NULL,
    "slug"         VARCHAR(255) NOT NULL,
    "is_featured"  BOOLEAN      NOT NULL DEFAULT FALSE,
    "is_published" BOOLEAN      NOT NULL DEFAULT FALSE,
    "scope"        VARCHAR(32)  NOT NULL,
    "created_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"   TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "post_slug_uq" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "post_type_idx" ON "post" ("type");
CREATE INDEX IF NOT EXISTS "post_scope_idx" ON "post" ("scope");
CREATE INDEX IF NOT EXISTS "post_is_featured_idx" ON "post" ("is_featured");
CREATE INDEX IF NOT EXISTS "post_created_at_idx" ON "post" ("created_at");

-- Trigger for updating updated_at on post table
CREATE OR REPLACE FUNCTION update_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "post_updated_at_trigger" ON "post";
CREATE TRIGGER "post_updated_at_trigger"
BEFORE UPDATE ON "post"
FOR EACH ROW
EXECUTE FUNCTION update_post_timestamp();

CREATE TABLE IF NOT EXISTS "post_tag"
(
    "post_id" UUID NOT NULL,
    "tag_id"  UUID NOT NULL,
    PRIMARY KEY ("post_id", "tag_id"),
    CONSTRAINT "postTag_post_fk" FOREIGN KEY ("post_id") REFERENCES "post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "postTag_tag_fk" FOREIGN KEY ("tag_id") REFERENCES "tag" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "post_tags_tag_id_idx" ON "post_tag" ("tag_id");

-- -----------------------------------------------------------------------------
-- prodi
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "prodi"
(
    "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
    "thumbnail"   VARCHAR(255) NOT NULL,
    "title"       VARCHAR(255) NOT NULL,
    "description" TEXT         NOT NULL,
    "content"     JSONB        NOT NULL,
    "slug"        VARCHAR(255) NOT NULL,
    "scope"       VARCHAR(32)  NOT NULL,
    "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "prodi_slug_uq" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "prodi_scope_idx" ON "prodi" ("scope");
CREATE INDEX IF NOT EXISTS "prodi_created_at_idx" ON "prodi" ("created_at");

-- Trigger for updating updated_at on prodi table
CREATE OR REPLACE FUNCTION update_prodi_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "prodi_updated_at_trigger" ON "prodi";
CREATE TRIGGER "prodi_updated_at_trigger"
BEFORE UPDATE ON "prodi"
FOR EACH ROW
EXECUTE FUNCTION update_prodi_timestamp();

-- -----------------------------------------------------------------------------
-- profile
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS "profile"
(
    "id"          UUID NOT NULL DEFAULT gen_random_uuid(),
    "thumbnail"   VARCHAR(255) NOT NULL,
    "title"       VARCHAR(255) NOT NULL,
    "description" TEXT         NOT NULL,
    "content"     JSONB        NOT NULL,
    "slug"        VARCHAR(255) NOT NULL,
    "scope"       VARCHAR(32)  NOT NULL,
    "created_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at"  TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "profile_slug_uq" UNIQUE ("slug")
);

CREATE INDEX IF NOT EXISTS "profile_scope_idx" ON "profile" ("scope");
CREATE INDEX IF NOT EXISTS "profile_created_at_idx" ON "profile" ("created_at");

-- Trigger for updating updated_at on profile table
CREATE OR REPLACE FUNCTION update_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updated_at" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS "profile_updated_at_trigger" ON "profile";
CREATE TRIGGER "profile_updated_at_trigger"
BEFORE UPDATE ON "profile"
FOR EACH ROW
EXECUTE FUNCTION update_profile_timestamp();
