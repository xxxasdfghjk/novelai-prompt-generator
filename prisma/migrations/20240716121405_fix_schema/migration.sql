/*
  Warnings:

  - Added the required column `variableTypeId` to the `TemplateVariableRelation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TemplateVariableRelation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "templateId" INTEGER NOT NULL,
    "variableTypeId" INTEGER NOT NULL,
    CONSTRAINT "TemplateVariableRelation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "Template" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TemplateVariableRelation_variableTypeId_fkey" FOREIGN KEY ("variableTypeId") REFERENCES "VariableType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TemplateVariableRelation" ("id", "templateId") SELECT "id", "templateId" FROM "TemplateVariableRelation";
DROP TABLE "TemplateVariableRelation";
ALTER TABLE "new_TemplateVariableRelation" RENAME TO "TemplateVariableRelation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
