Note this will NOT include '2007-02-15' as it will only go up to ''2007-02-14 23:59'

```sql
SELECT * FROM payment
WHERE payment_date BETWEEN '2007-02-01' AND '2007-02-15'
```
