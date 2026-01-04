// API response types matching Laravel backend
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Company {
  employee_id: number;
  company_id: number;
  company_name: string;
  company_code: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  is_red_list: boolean;
  is_owner: boolean;
}

export interface ProfileData {
  user: User;
  companies: Company[];
}

export interface AuthTokenData {
  user: User;
  token: string;
}

export interface Attendance {
  id: number;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  status: 'ON_TIME' | 'LATE' | 'ABSENT';
  late_minutes: number;
  early_leave_minutes: number;
  overtime_minutes: number;
}

export interface TimeDebt {
  id: number;
  debt_date: string;
  due_date: string;
  owed_minutes: number;
  minutes: number;
  created_from_date: string;
  from_date: string;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export interface DebtAlert {
  has_debt: boolean;
  pending_count: number;
  total_minutes: number;
  next_due_date: string | null;
  alert_message: string;
  debts: TimeDebt[];
}

export interface PerformanceData {
  period_start: string;
  period_end: string;
  period_display: string;
  scores: {
    rajin: number;
    rapi: number;
    teliti: number;
    total: number;
    evaluation_count: number;
  };
  bonus_tier: 'PLATINUM' | 'GOLD' | 'SILVER' | null;
  bonus_percentage: number;
  at_risk: boolean;
}

export interface AttendanceSummary {
  total_days: number;
  on_time: number;
  late: number;
  absent: number;
  total_late_minutes: number;
  total_overtime_minutes: number;
}

export interface EmployeeDashboard {
  employee: {
    id: number;
    name: string;
    email: string;
    company: string;
    company_code: string;
    position: string;
    department: string;
    status: string;
    is_red_list: boolean;
    red_list_warning: string | null;
  };
  today: {
    date: string;
    day_name: string;
    check_in: string | null;
    check_out: string | null;
    status: string;
    late_minutes: number;
  };
  debt_alert: DebtAlert;
  performance: PerformanceData;
  attendance_summary: AttendanceSummary;
}

export interface TodayStatus {
  date: string;
  has_checked_in: boolean;
  has_checked_out: boolean;
  attendance: Attendance | null;
  pending_debts: TimeDebt[];
}

export interface CheckInOutPayload {
  employee_id: number;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface JoinCompanyPayload {
  short_code: string;
}
