import { Item } from 'ink-select-input/build/SelectInput';
import { Pool } from 'pg';

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
    await this.connect();
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
    // TODO: figure out why connection is dropped
    await this.connect();
    
    
    // TODO: SQL injection problem here. In theory,
    //       tables from the database schema will only ever 
    //       reach this point, but a bad actor could exploit 
    //       stdin. Prepared statements are not an option.
    const result = await this.pool.query(`SELECT * FROM ${tableName} OFFSET ${offset} LIMIT 1000`);
    return {
      columns: result.fields.map((field) => field.name),
      records: result.rows,
    };
  }
}
