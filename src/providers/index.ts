import { MySQL } from './MySQL';
import { PostgreSQL } from './PostgresSQL';
import { IDatabaseProvider } from './shared';

export enum DATABASES {
  MYSQL = 'mysql',
  POSTGRESQL = 'postgres',
}

export function getConnectionStringType(connectionString: string): DATABASES {
  const uriParts = connectionString.split(':');

  switch (uriParts[0]) {
    case DATABASES.MYSQL:
      return DATABASES.MYSQL;
    case DATABASES.POSTGRESQL:
      return DATABASES.POSTGRESQL;

    default:
      throw new Error('Not yet implemented');
  }
}

export function getDatabaseProviderInstance(connectionString: string): IDatabaseProvider {
  switch (getConnectionStringType(connectionString)) {
    case DATABASES.MYSQL:
      return new MySQL(connectionString);

    case DATABASES.POSTGRESQL:
      return new PostgreSQL(connectionString);

    default:
      throw new Error('Not yet implemented');
  }
}
