import { ListItem } from 'src/types/ListItem';

export interface IDatabaseGetAllFromTable {
  columns: Array<string>;
  records: Array<object>;
}

export interface IDatabaseProvider {
  connect(): Promise<string>;
  // getTableColumns(tableName: string): Promise<string[]>;
  getAllFromTable(tableName: string, offset: number): Promise<IDatabaseGetAllFromTable>;
  getTotalTableCount(tableName: string): Promise<number>;
  getTableList(): Promise<ListItem[]>;
}
