
Allows us to use the aggregate result as a filter along with a GROUP BY

```sql
SELECT company, SUM(sales)
FROM finance_table
WHERE company != 'Google'
GROUP BY company 
HAVING SUM(sales) > 1000
```

