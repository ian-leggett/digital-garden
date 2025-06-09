Table: my_table

| product | amount | repair_cost |
| ------- | ------ | ----------- |
| Bus     | 7.99   | 5.99        |
| Car     | 2.99   | 8.99        |
| Car     | 2.99   | 8.99        |
| Bike    | 7.99   | 4.99        |
| Boat    | 20.99  | 15.99       |

### List all items that equal an amount

```sql
SELECT * FROM my_table WHERE amount = 7.99;
```

### Count all items that have an amount above 3

```sql
SELECT COUNT(*) FROM my_table WHERE amount > 3;
```

### List all products that are more than 5 but less than 15 to repair

```sql
SELECT * FROM my_table
WHERE amount > 5 AND repair_cost < 15;
```

### Other examples

```sql
SELECT COUNT(*) FROM film
WHERE rental_rate > 4 
AND replacement_cost < 15
AND rating='R';
```


```sql
SELECT title FROM film
WHERE rating = 'R' or rating = 'PG-13';
```

