/*
  Warnings:

  - You are about to drop the column `text` on the `Patient` table. All the data in the column will be lost.
  - Added the required column `chartNumber` to the `Patient` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Patient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "chartNumber" TEXT NOT NULL,
    "name" TEXT NOT NULL
);
INSERT INTO "new_Patient" ("id") SELECT "id" FROM "Patient";
DROP TABLE "Patient";
ALTER TABLE "new_Patient" RENAME TO "Patient";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
