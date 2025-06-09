
```sql
SELECT COUNT(*) FROM payment
WHERE amount IN (0.99,1.98,1.99)
```

How many payments do NOT include

```sql
SELECT COUNT(*) FROM payment
WHERE amount NOT IN (0.99,1.98,1.99)
```

Find the names John and Julie in a table

```sql
SELECT * FROM customer
WHERE first_name IN ('John', 'Julie')
```

