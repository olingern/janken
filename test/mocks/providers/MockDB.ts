import { Item } from 'ink-select-input/build/SelectInput';

import { IDatabaseGetAllFromTable, IDatabaseProvider } from '../../../src/providers/shared';


export class MockDB implements IDatabaseProvider {


    constructor() {
    }

    connect(): Promise<string> {
        return new Promise((res, rej) => {
            res("connected")
        })
    }

    async getTableList(): Promise<Item[]> {
        const rows = [
            { table_name: "test" }
        ]
        return rows.map((row) => {
            return {
                label: row.table_name,
                value: row.table_name
            }
        })
    }

    async getTotalTableCount(tableName: string): Promise<number> {
        return 1;
    }

    async getAllFromTable(tableName: string): Promise<IDatabaseGetAllFromTable> {

        const fields = ["a", "b", "c"]
        const rows = [
            {
                a: "foo-a-0",
                b: "foo-b-0",
                c: "foo-c-0",
            },
            {
                a: "foo-a-1",
                b: "foo-b-1",
                c: "foo-c-1",
            }
        ]

        return {
            columns: fields,
            records: rows
        }
    }
}
