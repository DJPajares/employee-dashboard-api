-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "salary" DECIMAL(9,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_key" ON "Employee"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_login_key" ON "Employee"("login");
