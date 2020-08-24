import test from 'ava';
import { render } from 'ink-testing-library';
import React from 'react';

import { TableView } from '../../../../src/view/table-view/TableView';

test('<TableView /> renders with no rows', t => {

    const tableView = render(<TableView headings={["heading 1", "heading 2"]} rows={[]} borderColor="white" />)
    t.snapshot(tableView);
});

test('<TableView /> renders with no columns', t => {

    const tableView = render(<TableView headings={[]} rows={[]} borderColor="white" />)
    t.snapshot(tableView);
});

test('<TableView /> renders with columns and rows', t => {
    const rows = [
        {
            prop_1: "foo",
            prop_2: "bar",
            prop_3: "baz",
        },
        {
            prop_1: "foo",
            prop_2: "bar",
            prop_3: "baz",
        }
    ]
    const headings = Object.keys(rows[0])
    const tableView = render(<TableView headings={headings} rows={rows} borderColor="white" />)
    t.snapshot(tableView);
});