-- AlterTable
ALTER TABLE "chapter_assessments" ADD COLUMN "clientRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "chapter_assessments_clientRequestId_key" ON "chapter_assessments"("clientRequestId");
