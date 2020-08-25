import test from 'ava';

import { formatPostgresQuery } from '../../../src/providers/format';

/**
 * Not much testing is need to be done here since we would just be retesting
 * the pg-format library
 */
test('formatPostgresQuery: basic replace', t => {
    const want = "SELECT * FROM test_table"
    const got = formatPostgresQuery("SELECT * FROM %I", ['test_table'])

    t.true(want === got)
});