/*
  Warnings:

  - A unique constraint covering the columns `[chartNumber,name]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[value,type]` on the table `Price` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Patient_chartNumber_name_key" ON "Patient"("chartNumber", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Price_value_type_key" ON "Price"("value", "type");
