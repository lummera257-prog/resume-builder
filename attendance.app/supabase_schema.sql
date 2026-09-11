-- ============================================================
-- PAYCLOCK — COMPLETE SUPABASE DATABASE SCHEMA
-- ============================================================

-- ============================================================
-- SECTION 1: Extensions
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SECTION 2: Tables (create in this exact order — FK dependencies)
-- ============================================================

-- Table 1: companies
CREATE TABLE IF NOT EXISTS companies (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  timezone        TEXT DEFAULT 'Asia/Kolkata',
  currency        TEXT DEFAULT 'INR',
  currency_symbol TEXT DEFAULT '₹',
  work_days       TEXT DEFAULT '[1,2,3,4,5,6]', -- JSON array
  shift_start     TEXT DEFAULT '09:00',
  shift_end       TEXT DEFAULT '18:00',
  city            TEXT,
  business_type   TEXT,
  team_size_range TEXT,
  paid_leaves_per_year INT DEFAULT 12,
  sick_leaves_per_year INT DEFAULT 12,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Table 2: employees
CREATE TABLE IF NOT EXISTS employees (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  phone               TEXT,
  email               TEXT,
  designation         TEXT,
  employee_code       TEXT NOT NULL,
  salary_type         TEXT NOT NULL DEFAULT 'monthly',
  base_salary         NUMERIC(12,2) NOT NULL DEFAULT 0,
  work_days_per_week  INT DEFAULT 6,
  shift_start         TEXT,
  shift_end           TEXT,
  joined_at           TIMESTAMPTZ,
  status              TEXT DEFAULT 'active',
  paid_leaves_per_year INT,
  sick_leaves_per_year INT,
  use_company_leave_policy BOOLEAN DEFAULT true,
  use_company_shift   BOOLEAN DEFAULT true,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Table 3: attendance_records
CREATE TABLE IF NOT EXISTS attendance_records (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id       UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id        UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  date              DATE NOT NULL,
  status            TEXT NOT NULL DEFAULT 'absent',
  check_in          TEXT,
  check_out         TEXT,
  overtime_hours    NUMERIC(5,2) DEFAULT 0,
  device_timestamp  TIMESTAMPTZ,
  server_timestamp  TIMESTAMPTZ DEFAULT NOW(),
  marked_by         UUID REFERENCES auth.users(id),
  UNIQUE(employee_id, date)                        -- Prevents duplicates
);

-- Table 4: leave_requests
CREATE TABLE IF NOT EXISTS leave_requests (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id      UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id       UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  type             TEXT NOT NULL DEFAULT 'casual',
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  reason           TEXT,
  status           TEXT DEFAULT 'pending',
  approved_by      UUID REFERENCES auth.users(id),
  rejection_reason TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Table 5: payroll_records
CREATE TABLE IF NOT EXISTS payroll_records (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employee_id         UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  company_id          UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  month               INT NOT NULL,
  year                INT NOT NULL,
  total_working_days  NUMERIC(5,2) DEFAULT 0,
  days_present        NUMERIC(5,2) DEFAULT 0,
  half_days           NUMERIC(5,2) DEFAULT 0,
  paid_leave_days     NUMERIC(5,2) DEFAULT 0,
  unpaid_leave_days   NUMERIC(5,2) DEFAULT 0,
  overtime_hours      NUMERIC(6,2) DEFAULT 0,
  base_salary         NUMERIC(12,2) DEFAULT 0,
  overtime_pay        NUMERIC(12,2) DEFAULT 0,
  manual_bonus        NUMERIC(12,2) DEFAULT 0,
  gross_salary        NUMERIC(12,2) DEFAULT 0,
  unpaid_deduction    NUMERIC(12,2) DEFAULT 0,
  net_salary          NUMERIC(12,2) DEFAULT 0,
  payslip_url         TEXT,
  status              TEXT DEFAULT 'draft',
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employee_id, month, year)                  -- One record per employee per month
);

-- ============================================================
-- SECTION 3: Row Level Security (CRITICAL — without this anyone can see all data)
-- ============================================================
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;

-- Companies policy
CREATE POLICY "Owner accesses own company" ON companies
  FOR ALL USING (owner_id = auth.uid());

-- Employees policy
CREATE POLICY "Access employees of own company" ON employees
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- Attendance policy
CREATE POLICY "Access attendance of own company" ON attendance_records
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- Leave policy
CREATE POLICY "Access leaves of own company" ON leave_requests
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- Payroll policy
CREATE POLICY "Access payroll of own company" ON payroll_records
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE owner_id = auth.uid())
  );

-- ============================================================
-- SECTION 4: Performance Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_status ON employees(company_id, status);
CREATE INDEX IF NOT EXISTS idx_attendance_company_date ON attendance_records(company_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON attendance_records(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leaves_company_status ON leave_requests(company_id, status);
CREATE INDEX IF NOT EXISTS idx_payroll_company_month_year ON payroll_records(company_id, month, year);

-- ============================================================
-- SECTION 5: Employee Code Auto-Generator
-- ============================================================
CREATE OR REPLACE FUNCTION generate_employee_code(p_company_id UUID)
RETURNS TEXT AS $$
DECLARE
  v_count INT;
BEGIN
  SELECT COUNT(*) INTO v_count FROM employees WHERE company_id = p_company_id;
  RETURN 'EMP' || LPAD((v_count + 1)::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- SECTION 6: Account Deletion (REQUIRED by Play Store & App Store)
-- ============================================================
CREATE OR REPLACE FUNCTION delete_user_data(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  DELETE FROM payroll_records
    WHERE company_id IN (SELECT id FROM companies WHERE owner_id = p_user_id);
  DELETE FROM attendance_records
    WHERE company_id IN (SELECT id FROM companies WHERE owner_id = p_user_id);
  DELETE FROM leave_requests
    WHERE company_id IN (SELECT id FROM companies WHERE owner_id = p_user_id);
  DELETE FROM employees
    WHERE company_id IN (SELECT id FROM companies WHERE owner_id = p_user_id);
  DELETE FROM companies WHERE owner_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
