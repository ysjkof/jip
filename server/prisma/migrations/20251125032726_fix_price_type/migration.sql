/*
  Warnings:

  - Added the required column `type` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Credential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "therapyType" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_Price" ("id", "value") SELECT "id", "value" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
