
**Registrations**

| reg_id | name    |
| ------ | ------- |
| 1      | Andrew  |
| 2      | Bob     |
| 3      | Charlie |
| 4      | David   |

**Logins**

| log_id | name    |
| ------ | ------- |
| 1      | Xavier  |
| 2      | Andrew  |
| 3      | Yolanda |
| 4      | Bob     |

### Select all the names that registered and logged in 

```sql
SELECT * FROM Registrations
INNER JOIN Logins
ON Registrations.name = Logins.name
```

### Join the payment and customer table where customer ids match

```sql
SELECT payment_id,payment.customer_id, first_name FROM payment
INNER JOIN customer
ON payment.customer_id = customer.customer_id
```
