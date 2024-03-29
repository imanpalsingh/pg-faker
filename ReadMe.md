# PGFaker

[![Linters and Tests](https://github.com/imanpalsingh/pg-faker/actions/workflows/main.yml/badge.svg?label=build)](https://github.com/imanpalsingh/pg-faker/actions/workflows/main.yml?query=branch%3Amain)
[![CodeQ](https://github.com/imanpalsingh/pg-faker/actions/workflows/codeql.yml/badge.svg)](https://github.com/imanpalsingh/pg-faker/actions/workflows/codeql.yml?query=branch%3Amain)
[![npm version](https://badge.fury.io/js/pgfaker.svg)](https://www.npmjs.com/package/pgfaker)

Tool for dumping/exporting your postgres database's table data with custom masking rules.

## Usage

```bash
pgfaker [options] <config>
```

Currently available options are

```
Options:
  -o --output <outFile>  STDOUT or name of the output sql file (default: "dump.sql")
  -v --verbose <mode> verbosity - verbose | info | silent
  -h, --help             display help for command
```

You can also use this with `npx`

```sh
$ npx pgfaker config.js --output=STDOUT
```

## Options

- `--output`: Use it to either write to file or stdout.

  Examples:

  ```
  $ npx pgfaker config.js --output=STDOUT | psql database_url
  $ npx pgfaker config.js --output=dump.sql
  ```

  Defualt: `dump.sql`

- `--verbose`: This is used to control the verbosity level of logging from `pgfaker`

  - `silent` : No output at all, only runtime errors.
  - `info`: Basic information during the dump process such as current table, start and finish prompts etc.
  - `verbose`: All possible information during the dump process. This includes, everything from `info` plus columns that were skipped, transformed and more.

  Default: `verbose`

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
    }
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
    connectionUrl: 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE',

    columns: {
      description: (value) => 'This will not be used',
    },

    tables: {
      product: {
        description: (value) => 'This will be used',
      },
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
          blogs: 'mask';
        }
      }
      ```

      will make sure that the dumped sql doesn't have data masked for blogs table. This will override any other masking rules specified for this table.

    - `output`

      ```js
      options: {
        skip: {
          users: 'output';
        }
      }
      ```

      will make sure that the dumped sql doesn't have any queries related to users table. This will override any other masking rules specified for this table.

## Advanced

If you need more flexibility with masking, such as conditional masking then you can use middleware.

### Middleware

Middleware in pgfaker allows you to access the record that is about to get transformed. You can modify the records here, or avoid the masking that is about to happen. The api looks like this

```js
export const configuration = {
  connectionUrl: 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE',

  columns: {
    description: (value) => 'This will not be used',
  },

  tables: {
    users: [checkIfAdmin, maskingRules],
  },
};
```

Where `checkIfAdmin` is your middleware function and `maskingRules` is your regular object of transformers

1. The `checkIfAdmin` function will receive the column values as first parameter and column names as the seconds

   ```js
   const checkIfAdmin = (columnValues, columnNames) => {
     adminColumnIndex = columnNames.indexOf('admin');
     isAdmin = columnValues[adminColumnIndex];

     if (isAdmin === '1') {
       return null;
     }
     return columnValues;
   };
   ```

   Returning null (or any falsy value) from this function will result in any masking defined (read next point) for it to be avoided.

2. The `maskingRules` is your regular object of transformers. This can be used if you want to regular way of defining transformers along with the middleware. Note that the `columns` transformers are also used here

   ```js
   const maskingRules = {
     users: {
       flag: (value) => 'off',
     },
   };
   ```

## TroubleShooting

Please refer and raise the issues on [github](https://github.com/imanpalsingh/pg-faker/issues).

## Why?

I was in search of a anonymizer for postgres and came across [`pg-anonymizer`](https://github.com/rap2hpoutre/pg-anonymizer). This was not suitable for my requirement as it was lacking a flexible api and additional options, so I ended up creating my own version of anonymizer with inspiration from the package.
