import test from 'ava';
import { render } from 'ink-testing-library';
import React from 'react';

import { TableViewRow } from '../../../../src/view/table-view/TableViewRow';

test('<TableViewRow /> snapshot', t => {
    
    const tableViewRow = render(<TableViewRow value="foo bar" />)
    t.snapshot(tableViewRow);
});