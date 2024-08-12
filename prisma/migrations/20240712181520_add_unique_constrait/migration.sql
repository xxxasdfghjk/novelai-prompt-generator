/*
  Warnings:

  - A unique constraint covering the columns `[name,variableTypeId]` on the table `VariableInstance` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,variableTypeId]` on the table `VariableTypeElement` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VariableInstance_name_variableTypeId_key" ON "VariableInstance"("name", "variableTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "VariableTypeElement_name_variableTypeId_key" ON "VariableTypeElement"("name", "variableTypeId");
