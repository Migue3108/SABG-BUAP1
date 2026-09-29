-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'student';

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "institution" TEXT,
ADD COLUMN     "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "title" TEXT;

-- CreateTable
CREATE TABLE "microregions" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "microregions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalities" (
    "id" TEXT NOT NULL,
    "code" TEXT,
    "name" TEXT NOT NULL,
    "microregionId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'demo',
    "currentProgress" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "municipalities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipal_assignments" (
    "id" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "studentId" TEXT,
    "teacherId" TEXT,
    "period" TEXT NOT NULL DEFAULT '2026-I',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "municipal_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapters" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'activo',
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "annexes" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "code" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileRef" TEXT,
    "type" TEXT NOT NULL DEFAULT 'formato',
    "status" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annexes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practical_cases" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "situation" TEXT NOT NULL,
    "solution" TEXT,
    "lessonsLearned" TEXT,
    "status" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practical_cases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutional_prompts" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "promptText" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL DEFAULT 'todos',
    "riskLevel" TEXT NOT NULL DEFAULT 'bajo',
    "status" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "institutional_prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "implementation_routes" (
    "id" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "declaredProblem" TEXT NOT NULL,
    "area" TEXT NOT NULL DEFAULT 'Contraloría Municipal',
    "stage" TEXT NOT NULL DEFAULT 'diagnostico_inicial',
    "status" TEXT NOT NULL DEFAULT 'activa',
    "productExpected" TEXT,
    "indicatorMinimum" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "implementation_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_instruments" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "appliedById" TEXT,
    "area" TEXT NOT NULL,
    "responsibleName" TEXT NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "situation" TEXT,
    "institutionalCapacity" TEXT,
    "mainProblem" TEXT,
    "availableEvidence" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'Media',
    "initialRecommendation" TEXT,
    "status" TEXT NOT NULL DEFAULT 'borrador',
    "dataJson" JSONB,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_instruments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidences" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "instrumentId" TEXT,
    "uploadedById" TEXT,
    "reviewerId" TEXT,
    "type" TEXT NOT NULL DEFAULT 'pdf',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "classification" TEXT NOT NULL DEFAULT 'municipal_restringida',
    "status" TEXT NOT NULL DEFAULT 'pendiente',
    "currentVersion" INTEGER NOT NULL DEFAULT 1,
    "fileUrl" TEXT,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "reviewComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evidences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_versions" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER,
    "changeNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "evidenceId" TEXT NOT NULL,
    "reviewerId" TEXT,
    "previousStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observations" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "observationText" TEXT NOT NULL,
    "requiresCorrection" BOOLEAN NOT NULL DEFAULT true,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "observations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_logbooks" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT,
    "studentId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "activityType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hoursSpent" DOUBLE PRECISION,
    "commitments" TEXT,
    "status" TEXT NOT NULL DEFAULT 'borrador',
    "teacherComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_logbooks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicators" (
    "id" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'numerico',
    "formula" TEXT,
    "unit" TEXT,
    "status" TEXT NOT NULL DEFAULT 'activo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "indicators_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "indicator_records" (
    "id" TEXT NOT NULL,
    "indicatorId" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "routeId" TEXT,
    "valueNumeric" DOUBLE PRECISION,
    "valueQualitative" TEXT,
    "valueChoice" TEXT,
    "period" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "indicator_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executive_reports" (
    "id" TEXT NOT NULL,
    "municipalityId" TEXT NOT NULL,
    "routeId" TEXT,
    "generatedById" TEXT,
    "reportType" TEXT NOT NULL DEFAULT 'diagnostico_institucional',
    "period" TEXT NOT NULL DEFAULT '2026',
    "title" TEXT NOT NULL,
    "contentJson" JSONB NOT NULL,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "executive_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "detailsJson" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chapter_assessments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chapterNumber" INTEGER NOT NULL DEFAULT 1,
    "responses" JSONB NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "hasWarning" BOOLEAN NOT NULL DEFAULT false,
    "warningNotes" TEXT,
    "reflectionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "shortcuts" JSONB,
    "currentStep" TEXT NOT NULL DEFAULT 'not-started',
    "activeChapter" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "microregions_code_key" ON "microregions"("code");

-- CreateIndex
CREATE UNIQUE INDEX "municipalities_code_key" ON "municipalities"("code");

-- CreateIndex
CREATE INDEX "municipalities_microregionId_idx" ON "municipalities"("microregionId");

-- CreateIndex
CREATE INDEX "municipal_assignments_municipalityId_idx" ON "municipal_assignments"("municipalityId");

-- CreateIndex
CREATE INDEX "municipal_assignments_studentId_idx" ON "municipal_assignments"("studentId");

-- CreateIndex
CREATE INDEX "municipal_assignments_teacherId_idx" ON "municipal_assignments"("teacherId");

-- CreateIndex
CREATE UNIQUE INDEX "chapters_number_key" ON "chapters"("number");

-- CreateIndex
CREATE INDEX "annexes_chapterId_idx" ON "annexes"("chapterId");

-- CreateIndex
CREATE INDEX "practical_cases_chapterId_idx" ON "practical_cases"("chapterId");

-- CreateIndex
CREATE INDEX "institutional_prompts_chapterId_idx" ON "institutional_prompts"("chapterId");

-- CreateIndex
CREATE INDEX "implementation_routes_municipalityId_idx" ON "implementation_routes"("municipalityId");

-- CreateIndex
CREATE INDEX "implementation_routes_chapterId_idx" ON "implementation_routes"("chapterId");

-- CreateIndex
CREATE INDEX "implementation_routes_createdById_idx" ON "implementation_routes"("createdById");

-- CreateIndex
CREATE INDEX "diagnostic_instruments_routeId_idx" ON "diagnostic_instruments"("routeId");

-- CreateIndex
CREATE INDEX "diagnostic_instruments_municipalityId_idx" ON "diagnostic_instruments"("municipalityId");

-- CreateIndex
CREATE INDEX "diagnostic_instruments_chapterId_idx" ON "diagnostic_instruments"("chapterId");

-- CreateIndex
CREATE INDEX "diagnostic_instruments_appliedById_idx" ON "diagnostic_instruments"("appliedById");

-- CreateIndex
CREATE INDEX "evidences_routeId_idx" ON "evidences"("routeId");

-- CreateIndex
CREATE INDEX "evidences_municipalityId_idx" ON "evidences"("municipalityId");

-- CreateIndex
CREATE INDEX "evidences_chapterId_idx" ON "evidences"("chapterId");

-- CreateIndex
CREATE INDEX "evidences_instrumentId_idx" ON "evidences"("instrumentId");

-- CreateIndex
CREATE INDEX "evidences_uploadedById_idx" ON "evidences"("uploadedById");

-- CreateIndex
CREATE INDEX "evidences_reviewerId_idx" ON "evidences"("reviewerId");

-- CreateIndex
CREATE INDEX "evidence_versions_evidenceId_idx" ON "evidence_versions"("evidenceId");

-- CreateIndex
CREATE UNIQUE INDEX "evidence_versions_evidenceId_versionNumber_key" ON "evidence_versions"("evidenceId", "versionNumber");

-- CreateIndex
CREATE INDEX "reviews_evidenceId_idx" ON "reviews"("evidenceId");

-- CreateIndex
CREATE INDEX "reviews_reviewerId_idx" ON "reviews"("reviewerId");

-- CreateIndex
CREATE INDEX "observations_reviewId_idx" ON "observations"("reviewId");

-- CreateIndex
CREATE INDEX "student_logbooks_assignmentId_idx" ON "student_logbooks"("assignmentId");

-- CreateIndex
CREATE INDEX "student_logbooks_studentId_idx" ON "student_logbooks"("studentId");

-- CreateIndex
CREATE INDEX "student_logbooks_municipalityId_idx" ON "student_logbooks"("municipalityId");

-- CreateIndex
CREATE UNIQUE INDEX "indicators_code_key" ON "indicators"("code");

-- CreateIndex
CREATE INDEX "indicators_chapterId_idx" ON "indicators"("chapterId");

-- CreateIndex
CREATE INDEX "indicator_records_indicatorId_idx" ON "indicator_records"("indicatorId");

-- CreateIndex
CREATE INDEX "indicator_records_municipalityId_idx" ON "indicator_records"("municipalityId");

-- CreateIndex
CREATE INDEX "indicator_records_routeId_idx" ON "indicator_records"("routeId");

-- CreateIndex
CREATE INDEX "executive_reports_municipalityId_idx" ON "executive_reports"("municipalityId");

-- CreateIndex
CREATE INDEX "executive_reports_routeId_idx" ON "executive_reports"("routeId");

-- CreateIndex
CREATE INDEX "executive_reports_generatedById_idx" ON "executive_reports"("generatedById");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_module_idx" ON "audit_logs"("module");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "chapter_assessments_userId_idx" ON "chapter_assessments"("userId");

-- CreateIndex
CREATE INDEX "chapter_assessments_chapterNumber_idx" ON "chapter_assessments"("chapterNumber");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_userId_key" ON "user_preferences"("userId");

-- AddForeignKey
ALTER TABLE "municipalities" ADD CONSTRAINT "municipalities_microregionId_fkey" FOREIGN KEY ("microregionId") REFERENCES "microregions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipal_assignments" ADD CONSTRAINT "municipal_assignments_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipal_assignments" ADD CONSTRAINT "municipal_assignments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "municipal_assignments" ADD CONSTRAINT "municipal_assignments_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annexes" ADD CONSTRAINT "annexes_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practical_cases" ADD CONSTRAINT "practical_cases_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "institutional_prompts" ADD CONSTRAINT "institutional_prompts_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "implementation_routes" ADD CONSTRAINT "implementation_routes_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "implementation_routes" ADD CONSTRAINT "implementation_routes_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "implementation_routes" ADD CONSTRAINT "implementation_routes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_instruments" ADD CONSTRAINT "diagnostic_instruments_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "implementation_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_instruments" ADD CONSTRAINT "diagnostic_instruments_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_instruments" ADD CONSTRAINT "diagnostic_instruments_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_instruments" ADD CONSTRAINT "diagnostic_instruments_appliedById_fkey" FOREIGN KEY ("appliedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "implementation_routes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "diagnostic_instruments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidences" ADD CONSTRAINT "evidences_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_versions" ADD CONSTRAINT "evidence_versions_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "evidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "evidences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observations" ADD CONSTRAINT "observations_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_logbooks" ADD CONSTRAINT "student_logbooks_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "municipal_assignments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_logbooks" ADD CONSTRAINT "student_logbooks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_logbooks" ADD CONSTRAINT "student_logbooks_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_records" ADD CONSTRAINT "indicator_records_indicatorId_fkey" FOREIGN KEY ("indicatorId") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_records" ADD CONSTRAINT "indicator_records_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "indicator_records" ADD CONSTRAINT "indicator_records_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "implementation_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_reports" ADD CONSTRAINT "executive_reports_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "municipalities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_reports" ADD CONSTRAINT "executive_reports_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "implementation_routes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_reports" ADD CONSTRAINT "executive_reports_generatedById_fkey" FOREIGN KEY ("generatedById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chapter_assessments" ADD CONSTRAINT "chapter_assessments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

