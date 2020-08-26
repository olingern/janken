# janken

Because [rock, paper, scissors](https://jet.fandom.com/wiki/Janken) is just as serious as your database.

[![Build Status](https://github.com/olingern/janken/workflows/test/badge.svg)](https://github.com/olingern/janken/actions)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)


**Version**: 0.0.0 (_hardly usable_)

A universal database terminal client built with [Ink](https://github.com/vadimdemedes/ink).

Until this [TODO](https://github.com/olingern/janken/blob/master/src/providers/PostgresSQL.ts#L63) is solved, 
I recommend not using this. Version 0.1.0 will be a usuable release.

![janken_demo](https://user-images.githubusercontent.com/1470297/91255517-f0a5cc00-e732-11ea-9bc8-ab30b015aa40.gif)


## Installation

1. Clone this repository
2. cd to directory and `npm install`
3. Build the project: `npm run build`
4. Link compiled code to `janken` by running:`npm link`

You can now run `janken`

## Setup


<br />

![janken_init](https://user-images.githubusercontent.com/1470297/91255224-4e85e400-e732-11ea-978b-5fb6e82fa44e.png)

<br />


```
janken init
```

1. Name your connecton
2. Enter your connection string in this form:
    - `provider://username:passsword@host/database`
    - Example: `postgres://pguser:pgPA$$@localhost/mydb`

### Currently supported databases

- PostgreSQL
- MySQL

## Configuration

janken's configuration file is stored in your home directory under `.janken`. 

Example:

```
/home/user/.janken
```

An example of what is currently stored in the configuration file:

```json
[
  {
    "connectionName": "PG",
    "connectionString": "postgres://postgres:postgres@localhost/pgdb"
  }
]
```
