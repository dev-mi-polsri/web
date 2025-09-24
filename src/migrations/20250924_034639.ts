import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
  await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
  await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`alt\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
  await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
  await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
  await db.run(sql`CREATE TABLE \`partner\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`partner_logo_idx\` ON \`partner\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`partner_updated_at_idx\` ON \`partner\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`partner_created_at_idx\` ON \`partner\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`facility\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`logo_id\` integer NOT NULL,
  	\`name\` text NOT NULL,
  	\`en_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`facility_logo_idx\` ON \`facility\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`facility_updated_at_idx\` ON \`facility\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`facility_created_at_idx\` ON \`facility\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`news_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`news_tags_order_idx\` ON \`news_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`news_tags_parent_id_idx\` ON \`news_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`news\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`thumbnail_id\` integer,
  	\`global\` integer DEFAULT false,
  	\`featured\` integer DEFAULT false,
  	\`tipe\` text DEFAULT 'news',
  	\`name\` text,
  	\`content\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`news_thumbnail_idx\` ON \`news\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`news_updated_at_idx\` ON \`news\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`news_created_at_idx\` ON \`news\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`news__status_idx\` ON \`news\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_news_v_version_tags\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`tag\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_news_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_version_tags_order_idx\` ON \`_news_v_version_tags\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_tags_parent_id_idx\` ON \`_news_v_version_tags\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_news_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_thumbnail_id\` integer,
  	\`version_global\` integer DEFAULT false,
  	\`version_featured\` integer DEFAULT false,
  	\`version_tipe\` text DEFAULT 'news',
  	\`version_name\` text,
  	\`version_content\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_news_v_parent_idx\` ON \`_news_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_thumbnail_idx\` ON \`_news_v\` (\`version_thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_updated_at_idx\` ON \`_news_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version_created_at_idx\` ON \`_news_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_version_version__status_idx\` ON \`_news_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_created_at_idx\` ON \`_news_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_updated_at_idx\` ON \`_news_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_news_v_latest_idx\` ON \`_news_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`agenda\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`en_name\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`start_date\` text NOT NULL,
  	\`end_date\` text NOT NULL,
  	\`location\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`agenda_updated_at_idx\` ON \`agenda\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`agenda_created_at_idx\` ON \`agenda\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`profile\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`thumbnail_id\` integer,
  	\`global\` integer DEFAULT false,
  	\`name\` text,
  	\`description\` text,
  	\`content\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`profile_thumbnail_idx\` ON \`profile\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`profile_updated_at_idx\` ON \`profile\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`profile_created_at_idx\` ON \`profile\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`profile__status_idx\` ON \`profile\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_profile_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_thumbnail_id\` integer,
  	\`version_global\` integer DEFAULT false,
  	\`version_name\` text,
  	\`version_description\` text,
  	\`version_content\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`profile\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_profile_v_parent_idx\` ON \`_profile_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_version_version_thumbnail_idx\` ON \`_profile_v\` (\`version_thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_version_version_updated_at_idx\` ON \`_profile_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_version_version_created_at_idx\` ON \`_profile_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_version_version__status_idx\` ON \`_profile_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_created_at_idx\` ON \`_profile_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_updated_at_idx\` ON \`_profile_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_profile_v_latest_idx\` ON \`_profile_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`studyprogram\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`thumbnail_id\` integer,
  	\`global\` integer DEFAULT false,
  	\`name\` text,
  	\`description\` text,
  	\`content\` text,
  	\`slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`studyprogram_thumbnail_idx\` ON \`studyprogram\` (\`thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`studyprogram_updated_at_idx\` ON \`studyprogram\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`studyprogram_created_at_idx\` ON \`studyprogram\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`studyprogram__status_idx\` ON \`studyprogram\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`_studyprogram_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_thumbnail_id\` integer,
  	\`version_global\` integer DEFAULT false,
  	\`version_name\` text,
  	\`version_description\` text,
  	\`version_content\` text,
  	\`version_slug\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`studyprogram\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_thumbnail_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_parent_idx\` ON \`_studyprogram_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_version_version_thumbnail_idx\` ON \`_studyprogram_v\` (\`version_thumbnail_id\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_version_version_updated_at_idx\` ON \`_studyprogram_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_version_version_created_at_idx\` ON \`_studyprogram_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_version_version__status_idx\` ON \`_studyprogram_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_created_at_idx\` ON \`_studyprogram_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_updated_at_idx\` ON \`_studyprogram_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_studyprogram_v_latest_idx\` ON \`_studyprogram_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`dosentendik\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	\`tipe\` text DEFAULT 'dosen' NOT NULL,
  	\`pejabat\` integer,
  	\`homebase\` text DEFAULT 'd4' NOT NULL,
  	\`name\` text NOT NULL,
  	\`nip\` text NOT NULL,
  	\`nidn\` text,
  	\`nuptk\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE INDEX \`dosentendik_image_idx\` ON \`dosentendik\` (\`image_id\`);`)
  await db.run(sql`CREATE INDEX \`dosentendik_updated_at_idx\` ON \`dosentendik\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`dosentendik_created_at_idx\` ON \`dosentendik\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`partner_id\` integer,
  	\`facility_id\` integer,
  	\`news_id\` integer,
  	\`agenda_id\` integer,
  	\`profile_id\` integer,
  	\`studyprogram_id\` integer,
  	\`dosentendik_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`partner_id\`) REFERENCES \`partner\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`facility_id\`) REFERENCES \`facility\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`news_id\`) REFERENCES \`news\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`agenda_id\`) REFERENCES \`agenda\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`profile_id\`) REFERENCES \`profile\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`studyprogram_id\`) REFERENCES \`studyprogram\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`dosentendik_id\`) REFERENCES \`dosentendik\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_partner_id_idx\` ON \`payload_locked_documents_rels\` (\`partner_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_facility_id_idx\` ON \`payload_locked_documents_rels\` (\`facility_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_news_id_idx\` ON \`payload_locked_documents_rels\` (\`news_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_agenda_id_idx\` ON \`payload_locked_documents_rels\` (\`agenda_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_profile_id_idx\` ON \`payload_locked_documents_rels\` (\`profile_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_studyprogram_id_idx\` ON \`payload_locked_documents_rels\` (\`studyprogram_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_dosentendik_id_idx\` ON \`payload_locked_documents_rels\` (\`dosentendik_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`users\`;`)
  await db.run(sql`DROP TABLE \`media\`;`)
  await db.run(sql`DROP TABLE \`partner\`;`)
  await db.run(sql`DROP TABLE \`facility\`;`)
  await db.run(sql`DROP TABLE \`news_tags\`;`)
  await db.run(sql`DROP TABLE \`news\`;`)
  await db.run(sql`DROP TABLE \`_news_v_version_tags\`;`)
  await db.run(sql`DROP TABLE \`_news_v\`;`)
  await db.run(sql`DROP TABLE \`agenda\`;`)
  await db.run(sql`DROP TABLE \`profile\`;`)
  await db.run(sql`DROP TABLE \`_profile_v\`;`)
  await db.run(sql`DROP TABLE \`studyprogram\`;`)
  await db.run(sql`DROP TABLE \`_studyprogram_v\`;`)
  await db.run(sql`DROP TABLE \`dosentendik\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences\`;`)
  await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
