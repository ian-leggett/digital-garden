Table: my_table

| Company | Name   | Sales |
| ------- | ------ | ----- |
| Apple   | Andrew | 100   |
| Apple   | Zach   | 300   |
| Google  | Claire | 200   |
| Google  | David  | 500   |
| Xerox   | Steven | 100   |

As there are duplicate companies we may want to order by company and by sales. The sql below orders by company and then sales.

```sql
SELECT * from my_table
ORDER BY company,sales
```

You can also order one column by ASC and the other DESC


```sql
SELECT * from my_table
ORDER BY company DESC,sales ASC
```