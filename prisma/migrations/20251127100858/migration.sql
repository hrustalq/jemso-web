-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "color" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "showInNav" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "NewsletterCategoryPreference" (
    "id" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsletterCategoryPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCategoryPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "notifyNews" BOOLEAN NOT NULL DEFAULT true,
    "notifyEvents" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserCategoryPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "NewsletterCategoryPreference_subscriberId_idx" ON "NewsletterCategoryPreference"("subscriberId");

-- CreateIndex
CREATE INDEX "NewsletterCategoryPreference_categoryId_idx" ON "NewsletterCategoryPreference"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "NewsletterCategoryPreference_subscriberId_categoryId_key" ON "NewsletterCategoryPreference"("subscriberId", "categoryId");

-- CreateIndex
CREATE INDEX "UserCategoryPreference_userId_idx" ON "UserCategoryPreference"("userId");

-- CreateIndex
CREATE INDEX "UserCategoryPreference_categoryId_idx" ON "UserCategoryPreference"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "UserCategoryPreference_userId_categoryId_key" ON "UserCategoryPreference"("userId", "categoryId");

-- CreateIndex
CREATE INDEX "Category_featured_idx" ON "Category"("featured");

-- CreateIndex
CREATE INDEX "Category_order_idx" ON "Category"("order");

-- CreateIndex
CREATE INDEX "Category_showInNav_idx" ON "Category"("showInNav");

-- AddForeignKey
ALTER TABLE "NewsletterCategoryPreference" ADD CONSTRAINT "NewsletterCategoryPreference_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCategoryPreference" ADD CONSTRAINT "UserCategoryPreference_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
