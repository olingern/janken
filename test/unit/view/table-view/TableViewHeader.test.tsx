import test from 'ava';
import { render } from 'ink-testing-library';
import React from 'react';

import { TableViewHeader } from '../../../../src/view/table-view/TableViewHeader';

test('<TableViewHeader /> snapshot', t => {
    
    const tableViewHeader = render(<TableViewHeader headings={["heading 1", "heading 2"]} />)
    t.snapshot(tableViewHeader);
});