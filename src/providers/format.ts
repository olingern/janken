import pgFormat from 'pg-format';

export function formatPostgresQuery(query: string, values: any[]) {
  return pgFormat(query, ...values);
}
