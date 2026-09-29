-- CreateTable
CREATE TABLE "diagnostic_forms" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "chapterNumber" INTEGER NOT NULL DEFAULT 2,
    "status" TEXT NOT NULL DEFAULT 'borrador',
    "createdById" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_form_sections" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "diagnostic_form_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_form_questions" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "helpText" TEXT,
    "type" TEXT NOT NULL DEFAULT 'likert',
    "order" INTEGER NOT NULL,

    CONSTRAINT "diagnostic_form_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_submissions" (
    "id" TEXT NOT NULL,
    "formId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institution" TEXT,
    "averageScore" DOUBLE PRECISION NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diagnostic_submissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_answers" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "comment" TEXT,

    CONSTRAINT "diagnostic_answers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "diagnostic_forms_chapterNumber_status_idx" ON "diagnostic_forms"("chapterNumber", "status");

-- CreateIndex
CREATE INDEX "diagnostic_forms_createdById_idx" ON "diagnostic_forms"("createdById");

-- CreateIndex
CREATE INDEX "diagnostic_form_sections_formId_idx" ON "diagnostic_form_sections"("formId");

-- CreateIndex
CREATE INDEX "diagnostic_form_questions_sectionId_idx" ON "diagnostic_form_questions"("sectionId");

-- CreateIndex
CREATE INDEX "diagnostic_submissions_userId_idx" ON "diagnostic_submissions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_submissions_formId_userId_key" ON "diagnostic_submissions"("formId", "userId");

-- CreateIndex
CREATE INDEX "diagnostic_answers_questionId_idx" ON "diagnostic_answers"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_answers_submissionId_questionId_key" ON "diagnostic_answers"("submissionId", "questionId");

-- AddForeignKey
ALTER TABLE "diagnostic_forms" ADD CONSTRAINT "diagnostic_forms_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_form_sections" ADD CONSTRAINT "diagnostic_form_sections_formId_fkey" FOREIGN KEY ("formId") REFERENCES "diagnostic_forms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_form_questions" ADD CONSTRAINT "diagnostic_form_questions_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "diagnostic_form_sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_submissions" ADD CONSTRAINT "diagnostic_submissions_formId_fkey" FOREIGN KEY ("formId") REFERENCES "diagnostic_forms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_submissions" ADD CONSTRAINT "diagnostic_submissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "diagnostic_submissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_answers" ADD CONSTRAINT "diagnostic_answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "diagnostic_form_questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
