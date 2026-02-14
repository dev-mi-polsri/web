alter table `user` add column `role` text;

alter table `user` add column `banned` boolean;

alter table `user` add column `banReason` text;

alter table `user` add column `banExpires` timestamp(3);

alter table `session` add column `impersonatedBy` text;

alter table `session` add column `activeOrganizationId` text;

create table `organization` (`id` varchar(36) not null primary key, `name` varchar(255) not null, `slug` varchar(255) not null unique, `logo` text, `createdAt` timestamp(3) not null, `metadata` text);

create table `member` (`id` varchar(36) not null primary key, `organizationId` varchar(36) not null references `organization` (`id`) on delete cascade, `userId` varchar(36) not null references `user` (`id`) on delete cascade, `role` varchar(255) not null, `createdAt` timestamp(3) not null);

create table `invitation` (`id` varchar(36) not null primary key, `organizationId` varchar(36) not null references `organization` (`id`) on delete cascade, `email` varchar(255) not null, `role` varchar(255), `status` varchar(255) not null, `expiresAt` timestamp(3) not null, `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `inviterId` varchar(36) not null references `user` (`id`) on delete cascade);

create unique index `organization_slug_uidx` on `organization` (`slug`);

create index `member_organizationId_idx` on `member` (`organizationId`);

create index `member_userId_idx` on `member` (`userId`);

create index `invitation_organizationId_idx` on `invitation` (`organizationId`);

create index `invitation_email_idx` on `invitation` (`email`);