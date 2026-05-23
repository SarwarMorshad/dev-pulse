# DevPulse — Internal Tech Issue & Feature Tracker

A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

## 🔗 Live URL

> Coming soon

## ✨ Features

- User registration & login with JWT authentication
- Role-based access control (contributor / maintainer)
- Create, read, update and delete issues
- Filter issues by type and status
- Sort issues by newest or oldest
- Password hashing with bcrypt
- Raw PostgreSQL queries — no ORM

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| Node.js | Runtime |
| TypeScript | Language |
| Express.js | Web framework |
| PostgreSQL (NeonDB) | Database |
| pg | Database driver |
| bcrypt | Password hashing |
| jsonwebtoken | Authentication |

## ⚙️ Setup

```bash
# 1. Clone the repo
git clone https://github.com/SarwarMorshad/dev-pulse.git
cd dev-pulse

# 2. Install dependencies
npm install

# 3. Create .env file
PORT=3000
CONNECTION_STRING=your_neon_db_connection_string
JWT_SECRET_KEY=your_jwt_secret

# 4. Run in development
npm run dev
```

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and get JWT |

### Issues
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/issues` | Authenticated | Create a new issue |
| GET | `/api/issues` | Public | Get all issues |
| GET | `/api/issues/:id` | Public | Get a single issue |
| PATCH | `/api/issues/:id` | Authenticated | Update an issue |
| DELETE | `/api/issues/:id` | Maintainer only | Delete an issue |

### Query Params for `GET /api/issues`
| Param | Values | Default |
|---|---|---|
| `sort` | `newest`, `oldest` | `newest` |
| `type` | `bug`, `feature_request` | — |
| `status` | `open`, `in_progress`, `resolved` | — |

## 🗄 Database Schema

### users
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| name | VARCHAR(100) | Required |
| email | VARCHAR(150) | Unique, required |
| password | VARCHAR(255) | Hashed, never returned |
| role | VARCHAR(20) | `contributor` or `maintainer` |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated |

### issues
| Column | Type | Notes |
|---|---|---|
| id | SERIAL | Primary key |
| title | VARCHAR(150) | Required |
| description | TEXT | Required |
| type | VARCHAR(20) | `bug` or `feature_request` |
| status | VARCHAR(20) | `open`, `in_progress`, `resolved` |
| reporter_id | INT | References users.id |
| created_at | TIMESTAMP | Auto generated |
| updated_at | TIMESTAMP | Auto updated |

## 👥 User Roles

| Role | Permissions |
|---|---|
| `contributor` | Register, login, create issues, view issues, update own open issues |
| `maintainer` | All contributor permissions + update any issue + change status + delete issues |
