/**
 * 
 */
import test from 'ava';

import { PostgreSQL } from '../../../src/providers/PostgresSQL';

/**
 * Integration: Get Postgres table listing
 */
test('Can connect and get table listing', async (t) => {
  const postgres = new PostgreSQL(process.env.test_pg);
  await postgres.connect()
  const tables = await postgres.getTableList()
  
  let postsExists = false;

  for (let i = 0; i < tables.length; i++) {
    const table = tables[i];

    if (table.value === "posts") {
      postsExists = true;
    }
  }
  // The table created in /test/docker/postgres/init/init.sql
  // should exist
  t.true(postsExists)
});
