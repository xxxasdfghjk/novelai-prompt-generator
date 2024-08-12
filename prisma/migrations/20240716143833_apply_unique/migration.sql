/*
  Warnings:

  - A unique constraint covering the columns `[variableTypeId,templateId]` on the table `TemplateVariableRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TemplateVariableRelation_variableTypeId_templateId_key" ON "TemplateVariableRelation"("variableTypeId", "templateId");
