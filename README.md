# yaba

Short for yabai, "whoa" in Japanese. Name will change one day. 

[![Build Status](https://github.com/olingern/yaba/workflows/test/badge.svg)](https://github.com/olingern/yaba/actions)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://lbesson.mit-license.org/)


**Version**: 0.0.0 (_hardly usable_)

A universal database terminal client built with [Ink](https://github.com/vadimdemedes/ink).

Until this [TODO](https://github.com/olingern/yaba/blob/master/src/providers/PostgresSQL.ts#L63) is solved, 
I recommend not using this. Version 0.1.0 will be a usuable release.

<img height="500" src="https://user-images.githubusercontent.com/1470297/91042907-8f6de380-e5e0-11ea-9a34-e4a9500f9378.gif" />


## Installation

1. Clone this repository
2. cd to directory and `npm install`
3. Build the project: `npm run build`
4. Link compiled code to `yaba` by running:`npm link`

You can now run `yaba`

## Setup


<br />

![yaba_init2_000](https://user-images.githubusercontent.com/1470297/91254373-4167f580-e730-11ea-9037-30f6d22db2a6.png)

<br />


```
yaba init
```

1. Name your connecton
2. Enter your connection string in this form:
  - `provider://username:passsword@host/database`
  - Example: `postgres://pguser:pgPA$$@localhost/mydb`

### Currently supported databases

- PostgreSQL
- MySQL

## Configuration

Yaba's configuration file is stored in your home directory under `.yaba`. 

Example:

```
/home/user/.yaba
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
