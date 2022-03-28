# PG-Faker

Tool for dumping/exporting your postgres database's table data with custom masking rules.

## Usage

```bash
pgfaker [options] <config>
```

Currently available options are

```
Options:
  -o --output <outFile>  Name of the output sql file (default: "dump.sql")
  -h, --help             display help for command
```

You can also use this with `npx`

```
npx pgfaker config.js --output=dump.sql
```

## Configuration

The `config.js` (or any js file) will contain the configuration for masking the data.

```js
export const configuration = {

  connectionUrl: "postgresql://USER:PASSWORD@HOST:PORT/DATABASE",

  columns: {
    columnName: (value) => /* do something */ return value
  },

  tables: {
    tableName: {
      columnName: (value) => /* do something */ return value
  },

  defaultTransformer: (value) => value,
};
```

### Options

- `connectionUrl`: The connection to your db

- `columns`: The columns to replace values of. If a column doesn't exist it is ignored (currently)

- `tables`: Use this to specify table specific column transformers. These transformers will take precedence over `columns` transformers.

  ```js
  export const configuration = {

    connectionUrl: "postgresql://USER:PASSWORD@HOST:PORT/DATABASE",

    columns: {
      description: (value) => "This will not be used"
    },

    tables: {
      product: {
        description: (value) => "This will be used"
    },
  };

  ```

  For `product` table, `description `column will get `This will be used`, and all other tables having `description` column will get `This will not be used`

- `defaultTransformer`: if this is specified, then all of the columns not mentioned in the `columns` and `tables` will get this transformer. If this isn't specified, all of the undefined columns are left unchanged.

You can go ahead and use something like [faker](https://www.npmjs.com/package/@faker-js/faker) or your own custom maskers for complex use cases.

## TroubleShooting

If you are facing errors from `internal/process/esm_loader.js`. Do `npm install pgfaker` and then `npx pgfaker`.
For other issues, please raise an issue on [github](https://github.com/imanpalsingh/pg-faker/issues).

## Why?

I was in search of a pg-anonymizer and found this nice package [`pg-anonymizer`](https://github.com/rap2hpoutre/pg-anonymizer). However, I found the api of the package not very useful for my specific use case. Also, I required some additional features such as more flexibility in choosing data-maskers, skipping tables, skipping columns and also dumping just the data.
