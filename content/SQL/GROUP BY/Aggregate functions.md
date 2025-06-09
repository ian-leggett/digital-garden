
AVG() - returns average value
COUNT() - returns number of values
MAX() - returns maximum value
MIN() - returns minimum value
SUM() - returns the sum of all values


### Examples

Find the minimum replacement cost

```sql
SELECT MIN(replacement_cost) FROM film;
```

Find the maximum replacement cost

```sql
SELECT MAX(replacement_cost) FROM film;
```

Find the average replacement cost and round it to two decimal places

```sql
SELECT ROUND(AVG(replacement_cost), 2) FROM film;
```


Total cost for replacement cost

```sql
SELECT SUM(replacement_cost) FROM film;
```


