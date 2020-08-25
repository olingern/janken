import { Item } from 'ink-select-input/build/SelectInput';
import { Pool } from 'pg';

import { formatPostgresQuery } from './format';
import { IDatabaseGetAllFromTable, IDatabaseProvider } from './shared';

interface IPostgresTableList {
  table_name: string;
}

export class PostgreSQL implements IDatabaseProvider {
  private pool!: Pool;
  private connectionString: string;

  constructor(connectionString: string) {
    this.connectionString = connectionString;
  }

  connect(): Promise<string> {
    return new Promise((res, rej) => {
      this.pool = new Pool({
        connectionString: this.connectionString,
        connectionTimeoutMillis: 1000,
        keepAlive: true
      });
      this.pool
        .connect()
        .then((client) => {
          res('connected');
        })
        .catch((e) => {
          rej(e.message);
        });
    });
  }

  async getTableList(): Promise<Item[]> {
    const s = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_type = 'BASE TABLE' AND table_schema = 'public' 
        ORDER BY table_type, table_name
        `;
    const results = await this.pool.query<IPostgresTableList>(s);

    return results.rows.map((row) => {
      return {
        label: row.table_name,
        value: row.table_name,
      };
    });
  }

  async getTotalTableCount(tableName: string): Promise<number> {
    throw new Error('Not yet implemented');
    return 1;
  }

  async getAllFromTable(tableName: string, offset: number): Promise<IDatabaseGetAllFromTable> {
    const query = formatPostgresQuery(`SELECT * FROM %I OFFSET ${offset} LIMIT 1000`, [tableName])
    const result = await this.pool.query(query);
    return {
      columns: result.fields.map((field) => field.name),
      records: result.rows,
    };
  }
}
