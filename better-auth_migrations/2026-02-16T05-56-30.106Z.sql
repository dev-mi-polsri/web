create table `user` (`id` varchar(36) not null primary key, `name` varchar(255) not null, `email` varchar(255) not null unique, `emailVerified` boolean not null, `image` text, `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `role` text, `banned` boolean, `banReason` text, `banExpires` timestamp(3));

create table `session` (`id` varchar(36) not null primary key, `expiresAt` timestamp(3) not null, `token` varchar(255) not null unique, `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `updatedAt` timestamp(3) not null, `ipAddress` text, `userAgent` text, `userId` varchar(36) not null references `user` (`id`) on delete cascade, `impersonatedBy` text, `activeOrganizationId` text);

create table `account` (`id` varchar(36) not null primary key, `accountId` text not null, `providerId` text not null, `userId` varchar(36) not null references `user` (`id`) on delete cascade, `accessToken` text, `refreshToken` text, `idToken` text, `accessTokenExpiresAt` timestamp(3), `refreshTokenExpiresAt` timestamp(3), `scope` text, `password` text, `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `updatedAt` timestamp(3) not null);

create table `verification` (`id` varchar(36) not null primary key, `identifier` varchar(255) not null, `value` text not null, `expiresAt` timestamp(3) not null, `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `updatedAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null);

create table `organization` (`id` varchar(36) not null primary key, `name` varchar(255) not null, `slug` varchar(255) not null unique, `logo` text, `createdAt` timestamp(3) not null, `metadata` text);

create table `member` (`id` varchar(36) not null primary key, `organizationId` varchar(36) not null references `organization` (`id`) on delete cascade, `userId` varchar(36) not null references `user` (`id`) on delete cascade, `role` varchar(255) not null, `createdAt` timestamp(3) not null);

create table `invitation` (`id` varchar(36) not null primary key, `organizationId` varchar(36) not null references `organization` (`id`) on delete cascade, `email` varchar(255) not null, `role` varchar(255), `status` varchar(255) not null, `expiresAt` timestamp(3) not null, `createdAt` timestamp(3) default CURRENT_TIMESTAMP(3) not null, `inviterId` varchar(36) not null references `user` (`id`) on delete cascade);

create index `session_userId_idx` on `session` (`userId`);

create index `account_userId_idx` on `account` (`userId`);

create index `verification_identifier_idx` on `verification` (`identifier`);

create unique index `organization_slug_uidx` on `organization` (`slug`);

create index `member_organizationId_idx` on `member` (`organizationId`);

create index `member_userId_idx` on `member` (`userId`);

create index `invitation_organizationId_idx` on `invitation` (`organizationId`);

create index `invitation_email_idx` on `invitation` (`email`);