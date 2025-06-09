Return all data in payment table that includes 0.99,1.98,1.99

```sql
SELECT * FROM payment
WHERE amount IN (0.99,1.98,1.99)
```
