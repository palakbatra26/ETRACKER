# API Documentation

Base URL: `/api`

## Auth
| Method | Endpoint            | Body                           | Description                    |
|--------|---------------------|--------------------------------|--------------------------------|
| POST   | /auth/register      | {name,email,password}          | Create account                 |
| POST   | /auth/login         | {email,password}               | Returns accessToken + sets refresh cookie |
| POST   | /auth/refresh       | -                              | Issues new accessToken         |
| POST   | /auth/logout        | -                              | Clears refresh cookie          |
| GET    | /auth/me            | (auth)                         | Current user                   |

## Transactions (auth required)
| Method | Endpoint                  | Description |
|--------|---------------------------|-------------|
| GET    | /transactions             | List with `?page=&limit=&type=&category=&from=&to=&q=` |
| POST   | /transactions             | Create |
| PUT    | /transactions/:id         | Update |
| DELETE | /transactions/:id         | Delete |
| GET    | /transactions/summary     | totals (income, expense, balance) |
| GET    | /transactions/insights    | monthly insights `?month=YYYY-MM` |
| GET    | /transactions/charts      | bar/pie/line series `?month=YYYY-MM` |

## Budgets (auth)
| Method | Endpoint           | Body                | Description |
|--------|--------------------|---------------------|-------------|
| GET    | /budgets/current   |                     | Current month budget + usage |
| PUT    | /budgets           | {amount,month}      | Upsert budget |

## Recurring (auth)
| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| GET    | /recurring         | List |
| POST   | /recurring         | Create {amount,type,category,frequency,startDate,notes} |
| DELETE | /recurring/:id     | Delete |

All authenticated endpoints expect: `Authorization: Bearer <accessToken>`.
