
Return all first names that begin with the letter "J". If you don't care about case sensitivity then use ILIKE

```sql
SELECT * FROM customer
WHERE first_name LIKE 'J%'
```

Return any first names that include "er"

```sql
SELECT * FROM customer
WHERE first_name LIKE '%er%'
```

Return all first names that the characters "lex"

```sql
SELECT * FROM customer
WHERE first_name LIKE '_lex%'
```


Return any first names that start with an "A" and last name does not start with a "B" and then order by last name

```sql
SELECT * FROM customer
WHERE first_name LIKE 'A%' 
AND last_name NOT LIKE 'B%'
ORDER BY last_name
```
