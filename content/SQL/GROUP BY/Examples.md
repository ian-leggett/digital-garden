
[[#Group by rating and sum the rental cost]]
[[#Group by the total amount per customer id]]
[[#Group by the count of how many transactions where made per customer]]
[[#Group by the total amounts on each date]]
[[#Group by the top five customer id's that spent the most]]


**Syntax**

```sql
SELECT category_col, AGG(data_col)
FROM table
GROUP BY category_col
```


### Group by rating and sum the rental cost

```sql
SELECT rating, SUM(rental_rate)
FROM film
GROUP BY rating
```

### Group by the total amount per customer id

Note that when you order you have to use the SUM(amount)

```sql
SELECT customer_id,SUM(amount) FROM payment
GROUP BY customer_id
ORDER BY SUM(amount) DESC
```


### Group by the count of how many transactions where made per customer

```sql
SELECT customer_id,COUNT(amount) FROM payment
GROUP BY customer_id
ORDER BY COUNT(amount) DESC
```


### Group by the total amounts on each date

Note: DATE removed the timestamp

```sql
SELECT DATE(payment_date), SUM(amount) FROM payment
GROUP BY DATE(payment_date)
ORDER BY SUM(amount) DESC
```

### Group by the top five customer id's that spent the most

```sql
SELECT customer_id, SUM(amount) FROM payment
GROUP BY customer_id
ORDER BY SUM(amount) DESC
LIMIT 5
```

