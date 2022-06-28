-- DropForeignKey
ALTER TABLE `TechnologiesOnPosts` DROP FOREIGN KEY `TechnologiesOnPosts_postId_fkey`;

-- DropForeignKey
ALTER TABLE `TechnologiesOnPosts` DROP FOREIGN KEY `TechnologiesOnPosts_technologyId_fkey`;

-- AddForeignKey
ALTER TABLE `TechnologiesOnPosts` ADD CONSTRAINT `TechnologiesOnPosts_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE SET DEFAULT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TechnologiesOnPosts` ADD CONSTRAINT `TechnologiesOnPosts_technologyId_fkey` FOREIGN KEY (`technologyId`) REFERENCES `Technology`(`id`) ON DELETE SET DEFAULT ON UPDATE CASCADE;
