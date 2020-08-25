import { Item } from 'ink-select-input/build/SelectInput';
import { createPool, Pool, PoolConnection } from 'mysql';

import { IDatabaseGetAllFromTable, IDatabaseProvider } from './shared';

export class MySQL implements IDatabaseProvider {
  private pool: Pool;
  public connection: PoolConnection | undefined;

  private dbName: string;

  constructor(connectionString: string) {
    this.pool = createPool(connectionString);

    // TODO: validate connection string

    const parts = connectionString.split('/');

    this.dbName = parts[parts.length - 1];
    this.connection = undefined;
  }

  connect(): Promise<string> {
    return new Promise((res, rej) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          rej(err);
        }

        this.connection = connection;

        res('connected');
      });
    });
  }

  async getTableColumns(tableName: string): Promise<string[]> {
    // TODO: figure out why connection is being destroyed
    if (!this.connection) {
      await this.connect();
    }

    const query =
      'SELECT `COLUMN_NAME` FROM `INFORMATION_SCHEMA`.`COLUMNS`' +
      ' WHERE `TABLE_SCHEMA`= ?' +
      ' AND `TABLE_NAME`= ?' +
      ' order by table_name, ordinal_position;';

    return new Promise((res, rej) => {
      this.connection?.query(query, [`${this.dbName}`, `${tableName}`], function (err, results, _fields) {
        if (err) {
          rej(err);
        }

        const items = results.map((result: any) => {
          return result.COLUMN_NAME;
        });

        res(items);
      });
    });
  }

  async getTableList(): Promise<Item[]> {
    const s = `
        SELECT TABLE_NAME FROM information_schema.tables WHERE table_schema = '${this.dbName}';
        `;

    return new Promise((res, rej) => {
      this.connection?.query(s, function (err, results, _fields) {
        if (err) {
          rej(err);
        }

        const items = results.map((row: any) => {
          return {
            label: row.TABLE_NAME,
            value: row.TABLE_NAME,
          };
        });

        res(items);
      });
    });
  }

  async getTotalTableCount(tableName: string): Promise<number> {
    // TODO: escaping / prepared statement prevents query from working. Figure
    //       out how to make this more secure.

    const query = `SELECT COUNT(*) as count FROM ${tableName};`;

    return new Promise((res, rej) => {
      this.connection?.query(query, function (err, results, _fields) {
        if (err) {
          rej(err);
        }

        res(results[0] ? results[0].count : 0);
      });
    });
  }

  async getAllFromTable(tableName: string): Promise<IDatabaseGetAllFromTable> {
    if (!this.connection) {
      await this.connect();
    }

    // TODO: SQL injection problem here. In theory,
    //       tables from the database schema will only ever
    //       reach this point, but a bad actor could exploit
    //       stdin. Prepared statements are not an option.
    const query = `SELECT * FROM ${tableName};`;

    return new Promise((res, rej) => {
      this.connection?.query(query, async (err, results: Array<object>, _fields) => {
        if (err) {
          rej(err);
        }

        let columns = [];
        let response: IDatabaseGetAllFromTable = { columns: [], records: [] };

        if (results && results.length > 0) {
          response = { records: results, columns: Object.keys(results[0]) };
        } else {
          columns = await this.getTableColumns(tableName);
          response = { records: [], columns };
        }

        return res(response);
      });
    });
  }
}
