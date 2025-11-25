/*
  Warnings:

  - You are about to drop the column `therapyType` on the `Credential` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Credential" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_Credential" ("id", "password", "username") SELECT "id", "password", "username" FROM "Credential";
DROP TABLE "Credential";
ALTER TABLE "new_Credential" RENAME TO "Credential";
CREATE UNIQUE INDEX "Credential_username_key" ON "Credential"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
