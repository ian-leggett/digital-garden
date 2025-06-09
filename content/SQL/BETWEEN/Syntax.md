
How many payments do I have between 8 and 9

```sql
SELECT COUNT(*) FROM payment
WHERE amount BETWEEN 8 AND 9
```


How many payments do I have NOT between 8 and 9

```sql
SELECT COUNT(*) FROM payment
WHERE amount NOT BETWEEN 8 AND 9
```
