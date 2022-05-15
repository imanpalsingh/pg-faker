<table>
  <thead>
    <tr>
      <td align="left">
        :information_source: Version 2.0 with additional features is now in beta! <a href="https://www.npmjs.com/package/pgfaker/v/2.0.0-beta.1"> Try here </a>
      </td>
    </tr>
  </thead>
  </tbody>
</table>

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

  options:{
    skip:{
      tableName: 'output' | 'mask'
    }
  }

  defaultTransformer: (value) => value,
};
```

### Properties

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

- `options`: Additional options for the parser

   - `skip`: This property defines which table to either exclude from being masked or from being written to the output. This option accepts either 'mask' or 'output'

      - `mask`

        ```js
        options: {
          skip: {
            blogs: 'mask'
          }
        }
        ```
         will make sure that the dumped sql doesn't have data masked for blogs table. This will override any other masking rules specified for this table.

      - `output`

        ```js
          options: {
            skip: {
              users: 'output'
            }
          }
        ```
        will make sure that the dumped sql doesn't have any queries related to users table. This will override any other masking rules specified for this table.

## TroubleShooting
Please refer and raise the issues on [github](https://github.com/imanpalsingh/pg-faker/issues).

## Why?

I was in search of a anonymizer for postgres and came across [`pg-anonymizer`](https://github.com/rap2hpoutre/pg-anonymizer). This was not suitable for my requirement as it was lacking a flexible api and additional options, so I ended up creating my own version of anonymizer with inspiration from the package.
