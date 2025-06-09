
The AS creates an alias for that column. For example, currently the column is called amount

| amount |
| ------ |
| 1.99   |
| 2.99   |

```sql
SELECT amount AS rental_price
FROM payment
```

The column is now renamed rental_price

| rental_price |
| ------------ |
| 1.99         |
| 2.99         |

**Note:  alias's gets assigned at the very end. You cannot refer to it anywhere else.**



