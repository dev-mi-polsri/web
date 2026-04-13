-- Rollback initial schema migration (PostgreSQL)

-- Drop all tables in reverse order of creation (respecting foreign keys)
DROP TRIGGER IF EXISTS "profile_updated_at_trigger" ON "profile";
DROP FUNCTION IF EXISTS update_profile_timestamp();

DROP TRIGGER IF EXISTS "prodi_updated_at_trigger" ON "prodi";
DROP FUNCTION IF EXISTS update_prodi_timestamp();

DROP TABLE IF EXISTS "post_tag" CASCADE;

DROP TRIGGER IF EXISTS "post_updated_at_trigger" ON "post";
DROP FUNCTION IF EXISTS update_post_timestamp();

DROP TABLE IF EXISTS "post" CASCADE;
DROP TABLE IF EXISTS "tag" CASCADE;
DROP TABLE IF EXISTS "tenaga_ajar" CASCADE;
DROP TABLE IF EXISTS "fasilitas" CASCADE;
DROP TABLE IF EXISTS "agenda" CASCADE;
DROP TABLE IF EXISTS "profile" CASCADE;
DROP TABLE IF EXISTS "prodi" CASCADE;
DROP TABLE IF EXISTS "media" CASCADE;

-- Drop extensions (commented out to prevent errors if other objects depend on them)
-- DROP EXTENSION IF EXISTS "uuid-ossp";
