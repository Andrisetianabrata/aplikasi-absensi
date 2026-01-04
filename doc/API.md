# 📋 Attendance System API

A comprehensive multi-tenant attendance system backend built with **Laravel 12** featuring Time Debt tracking, employee scoring, and dynamic Red List evaluation.

## 🚀 Features

- **Multi-Tenant Architecture** - Companies with unique short codes
- **Time Debt System** - Automatic late tracking with payback mechanism
- **Employee Scoring** - Daily evaluations with Rajin, Rapi, Teliti scores
- **Red List Management** - Automatic performance-based flagging
- **Sanctum Authentication** - Secure token-based API authentication

---

## 📦 Installation

### Prerequisites

- PHP 8.2+
- Composer
- MySQL 5.7+ or 8.0+

### Setup Steps

```bash
# Clone repository
git clone <repository-url>
cd Backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your MySQL database in .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=absensi
# DB_USERNAME=root
# DB_PASSWORD=your_password

# Run migrations
php artisan migrate

# Start development server
php artisan serve
```

### Scheduler Setup (Production)

Add this cron entry to your server:

```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {your_token}
```

---

## 📚 API Endpoints

### Base URL
```
http://localhost:8000/api
```

---

## 🔓 Public Endpoints

### Register User
Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "1|abc123xyz..."
  }
}
```

---

### Login
Authenticate and receive access token.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "2|def456xyz..."
  }
}
```

---

## 🔒 Protected Endpoints

> ⚠️ All endpoints below require `Authorization: Bearer {token}` header

---

### Logout
Invalidate current access token.

```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully."
}
```

---

### Get Profile
Get current user information with company memberships.

```http
GET /api/auth/profile
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "companies": [
      {
        "employee_id": 1,
        "company_id": 1,
        "company_name": "Acme Corp",
        "company_code": "WRG-88",
        "status": "APPROVED",
        "is_red_list": false,
        "is_owner": true
      }
    ]
  }
}
```

---

### Register Company
Create a new company and become the owner.

```http
POST /api/auth/register-company
```

**Request Body:**
```json
{
  "name": "Acme Corporation",
  "cut_off_date": 25,
  "address": "123 Business St",
  "phone": "+62812345678",
  "work_start_time": "08:00",
  "work_end_time": "17:00",
  "late_tolerance_minutes": 15
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | ✅ | Company name |
| cut_off_date | int | ❌ | Day of month for evaluation cut-off (1-28), default: 25 |
| address | string | ❌ | Company address |
| phone | string | ❌ | Contact phone |
| work_start_time | string | ❌ | Format HH:mm, default: 08:00 |
| work_end_time | string | ❌ | Format HH:mm, default: 17:00 |
| late_tolerance_minutes | int | ❌ | Minutes before marked late, default: 15 |

**Response (201):**
```json
{
  "success": true,
  "message": "Company created successfully. Share code: WRG-88",
  "data": {
    "company": {
      "id": 1,
      "name": "Acme Corporation",
      "short_code": "WRG-88",
      "cut_off_date": 25
    }
  }
}
```

---

### Join Company
Join a company using the short code.

```http
POST /api/auth/join-company
```

**Request Body:**
```json
{
  "short_code": "WRG-88"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Registration submitted. Waiting for owner approval.",
  "data": {
    "employee": {
      "id": 2,
      "status": "PENDING",
      "company": {
        "id": 1,
        "name": "Acme Corporation"
      }
    }
  }
}
```

---

## ⏰ Attendance Endpoints

### Check In
Record employee check-in with optional location.

```http
POST /api/attendance/check-in
```

**Request Body:**
```json
{
  "employee_id": 1,
  "latitude": -6.2088,
  "longitude": 106.8456,
  "notes": "Working from office"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Checked in on time.",
  "data": {
    "attendance": {
      "id": 1,
      "date": "2026-01-05",
      "check_in_time": "07:55:00",
      "check_out_time": null,
      "status": "ON_TIME",
      "late_minutes": 0,
      "early_leave_minutes": 0,
      "overtime_minutes": 0
    },
    "debt_status": null
  }
}
```

**Late Check-In Response:**
```json
{
  "success": true,
  "message": "Checked in late (23 minutes). Time debt created for tomorrow. Yesterday's debt status: PAID.",
  "data": {
    "attendance": {
      "id": 2,
      "date": "2026-01-05",
      "check_in_time": "08:38:00",
      "status": "LATE",
      "late_minutes": 23
    },
    "debt_status": "PAID"
  }
}
```

---

### Check Out
Record employee check-out.

```http
POST /api/attendance/check-out
```

**Request Body:**
```json
{
  "employee_id": 1,
  "latitude": -6.2088,
  "longitude": 106.8456,
  "notes": "Finished for the day"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Checked out successfully.",
  "data": {
    "attendance": {
      "id": 1,
      "date": "2026-01-05",
      "check_in_time": "07:55:00",
      "check_out_time": "17:30:00",
      "status": "ON_TIME",
      "overtime_minutes": 30
    }
  }
}
```

---

### Today's Status
Get today's attendance and debt status.

```http
GET /api/attendance/today?employee_id=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "date": "2026-01-05",
    "has_checked_in": true,
    "has_checked_out": false,
    "attendance": {
      "id": 1,
      "date": "2026-01-05",
      "check_in_time": "08:05:00",
      "status": "ON_TIME"
    },
    "pending_debts": [
      {
        "id": 3,
        "debt_date": "2026-01-06",
        "owed_minutes": 15,
        "created_from_date": "2026-01-04"
      }
    ]
  }
}
```

---

### Attendance History
Get attendance history for an employee.

```http
GET /api/attendance/history?employee_id=1&days=30
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": 1,
      "name": "John Doe"
    },
    "attendances": [
      {
        "id": 10,
        "date": "2026-01-05",
        "check_in_time": "08:00:00",
        "check_out_time": "17:00:00",
        "status": "ON_TIME"
      }
    ]
  }
}
```

---

## 📊 Dashboard Endpoints

### Employee Dashboard
Get comprehensive dashboard data for an employee.

```http
GET /api/dashboard/employee?employee_id=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "employee": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "company": "Acme Corp",
      "company_code": "WRG-88",
      "position": "Developer",
      "department": "Engineering",
      "status": "APPROVED",
      "is_red_list": false,
      "red_list_warning": null
    },
    "today": {
      "date": "2026-01-05",
      "day_name": "Sunday",
      "check_in": "08:05:00",
      "check_out": null,
      "status": "ON_TIME",
      "late_minutes": 0
    },
    "debt_alert": {
      "has_debt": true,
      "pending_count": 1,
      "total_minutes": 15,
      "next_due_date": "2026-01-06",
      "alert_message": "⏰ You have 1 pending time debt(s) totaling 15 minutes.",
      "debts": [
        {
          "id": 3,
          "due_date": "2026-01-06",
          "minutes": 15,
          "from_date": "2026-01-04"
        }
      ]
    },
    "performance": {
      "period_start": "2025-12-26",
      "period_end": "2026-01-25",
      "period_display": "Dec 26 - Jan 25, 2026",
      "scores": {
        "rajin": 12.5,
        "rapi": 11.0,
        "teliti": 10.5,
        "total": 34.0,
        "evaluation_count": 20
      },
      "bonus_tier": "PLATINUM",
      "bonus_percentage": 20,
      "at_risk": false
    },
    "attendance_summary": {
      "total_days": 22,
      "on_time": 18,
      "late": 4,
      "absent": 0,
      "total_late_minutes": 45,
      "total_overtime_minutes": 120
    }
  }
}
```

---

### Owner Dashboard
Get company overview for the owner.

```http
GET /api/dashboard/owner?company_id=1
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "company": {
      "id": 1,
      "name": "Acme Corp",
      "short_code": "WRG-88",
      "cut_off_date": 25
    },
    "summary": {
      "total_employees": 15,
      "pending_approvals": 2,
      "red_list_count": 1,
      "checked_in_today": 12,
      "late_today": 3
    },
    "evaluation_period": {
      "start": "2025-12-26",
      "end": "2026-01-25"
    },
    "employees": [
      {
        "id": 1,
        "name": "John Doe",
        "position": "Developer",
        "is_red_list": false,
        "today_status": "ON_TIME",
        "today_check_in": "08:05",
        "period_score": 34.0
      }
    ]
  }
}
```

---

## 🏢 Company Management

### Get Company Details
```http
GET /api/companies/{company_id}
```

### Update Company Settings (Owner Only)
```http
PUT /api/companies/{company_id}
```

**Request Body:**
```json
{
  "name": "Acme Corporation Updated",
  "cut_off_date": 20,
  "work_start_time": "09:00",
  "late_tolerance_minutes": 10
}
```

### Get All Employees
```http
GET /api/companies/{company_id}/employees?status=APPROVED&is_red_list=false
```

### Get Pending Employees
```http
GET /api/companies/{company_id}/pending-employees
```

---

## 👥 Employee Management

### Approve Employee
```http
POST /api/employees/{employee_id}/approve
```

### Reject Employee
```http
POST /api/employees/{employee_id}/reject
```

### Create Daily Evaluation
```http
POST /api/employees/{employee_id}/evaluation
```

**Request Body:**
```json
{
  "rajin_score": 5,
  "rapi_score": 4,
  "teliti_score": 5,
  "date": "2026-01-05",
  "notes": "Excellent performance today"
}
```

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| rajin_score | int | 1-5 | Diligence score |
| rapi_score | int | 1-5 | Neatness score |
| teliti_score | int | 1-5 | Accuracy score |

---

## 🎯 Scoring System

### Score Formula
```
Category Score = SUM(daily_scores) / 6
Total Score = (rajin_sum + rapi_sum + teliti_sum) / 6
```

### Bonus Tiers

| Total Score | Tier | Bonus |
|-------------|------|-------|
| ≥ 15 | PLATINUM | 20% |
| ≥ 12 | GOLD | 15% |
| ≥ 10 | SILVER | 10% |
| < 10 | None | 0% |

### Red List
Employees with `Total Score < 10` are automatically flagged as red list.

---

## ⏱️ Time Debt System

### How It Works

1. **Late Arrival**: When an employee arrives late (after work_start_time + tolerance), a time debt is created for the next day.

2. **Debt Payment**: On the next check-in:
   - **On Time**: Yesterday's debt is marked as `PAID`
   - **Late Again**: Yesterday's debt is marked as `FAILED`, new debt created

### Debt Statuses
- `PENDING` - Debt awaiting payment
- `PAID` - Successfully arrived on time
- `FAILED` - Was late again

---

## 🔄 Scheduler

The `app:evaluate-performance` command runs daily at 00:01:

1. Finds companies where `cut_off_date` matches today's day
2. Calculates evaluation period (last month's cut-off + 1 → today)
3. Computes total scores using SUM/6 formula
4. Updates `is_red_list` if total < 10

### Manual Run
```bash
php artisan app:evaluate-performance

# Dry run (no changes)
php artisan app:evaluate-performance --dry-run

# Specific company
php artisan app:evaluate-performance --company=1
```

---

## ❌ Error Responses

### Validation Error (422)
```json
{
  "message": "The email field must be a valid email address.",
  "errors": {
    "email": ["The email field must be a valid email address."]
  }
}
```

### Unauthorized (401)
```json
{
  "message": "Unauthenticated."
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Unauthorized. This employee does not belong to you."
}
```

### Bad Request (400)
```json
{
  "success": false,
  "message": "Already checked in today."
}
```

---

## 🔍 Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-05T02:30:00.000000Z",
  "version": "1.0.0"
}
```

---

## 📝 License

MIT License - See LICENSE file for details.
