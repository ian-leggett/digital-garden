
Select customer id's and the amount from the payment table. Group by customer id, total the amount whilst only showing amounts above 100

```sql
SELECT customer_id,SUM(amount) FROM payment
GROUP BY customer_id
HAVING SUM(amount) > 100
```

Note: HAVING comes after the GROUP BY

### Get all store id's that have a count above 300

```sql
SELECT store_id,COUNT(customer_id) FROM customer
GROUP BY store_id
HAVING COUNT(customer_id) > 300
```


### What are the customer ids of customers who have spent more than $100 in payment transactions with our staff_id  member 2

```sql
SELECT customer_id,SUM(amount) FROM payment
WHERE staff_id = 2
GROUP BY customer_id
HAVING SUM(amount) > 100
```