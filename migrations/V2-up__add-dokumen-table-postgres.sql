-- Add dokumen table (PostgreSQL)

CREATE TABLE IF NOT EXISTS "dokumen"
(
    "id"      UUID NOT NULL DEFAULT gen_random_uuid(),
    "url"     VARCHAR(255) NOT NULL,
    "name"    VARCHAR(255) NOT NULL,
    "en_name" VARCHAR(255) NOT NULL,
    PRIMARY KEY ("id")
);

COMMENT ON TABLE "dokumen" IS 'Documents storage and metadata';
