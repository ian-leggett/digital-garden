Table: my_table

| name  | age |
| ----- | --- |
| Dave  | 22  |
| Jane  | 34  |
| Dave  | 27  |
| Peter | 67  |

How many unique names are there in the table?

```sql
SELECT COUNT(DISTINCT name) FROM table_name
```


