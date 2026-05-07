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
| GET    | /transactions             | List with `?page=&limit=&type=&category=&paymentMethod=&tag=&from=&to=&q=` |
| POST   | /transactions             | Create |
| PUT    | /transactions/:id         | Update |
| DELETE | /transactions/:id         | Delete |
| GET    | /transactions/summary     | totals (income, expense, balance), optional `?from=&to=` |
| GET    | /transactions/insights    | monthly insights `?month=YYYY-MM` |
| GET    | /transactions/charts      | bar/pie/line series `?month=YYYY-MM` |

Transaction create/update body: `{amount,type,category,paymentMethod,tags,date,notes}`.

## Budgets (auth)
| Method | Endpoint           | Body                | Description |
|--------|--------------------|---------------------|-------------|
| GET    | /budgets/current   |                     | Current month budget + usage, optional `?month=YYYY-MM` |
| GET    | /budgets/history   |                     | Recent budgets |
| PUT    | /budgets           | {amount,month,categories} | Upsert overall and category budgets |

Category budget item: `{category,amount}`. Budget alerts return `notice` at 50%, `warning` at 80%, and `exceeded` when over budget.

## Savings Goals (auth)
| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| GET    | /savings-goals     | List |
| POST   | /savings-goals     | Create `{name,targetAmount,currentAmount,targetDate,notes}` |
| PUT    | /savings-goals/:id | Update |
| DELETE | /savings-goals/:id | Delete |

## Recurring (auth)
| Method | Endpoint           | Description |
|--------|--------------------|-------------|
| GET    | /recurring         | List |
| POST   | /recurring         | Create {amount,type,category,frequency,startDate,notes} |
| DELETE | /recurring/:id     | Delete |

All authenticated endpoints expect: `Authorization: Bearer <accessToken>`.
