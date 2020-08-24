// src/App.test.js
import test from 'ava';
import React from 'react';

import { getNewBounds } from '../../../../src/view/database-view/DatabaseView';



test('getNewBounds', t => {

    const belowZeroLower = getNewBounds(5, -1, 3)
    t.true(belowZeroLower.lower === 0)
    t.true(belowZeroLower.upper === 3)

    const aboveHeadingLen = getNewBounds(5, 0, 6)
    t.true(aboveHeadingLen.lower === 0)
    t.true(aboveHeadingLen.upper === 5)

});