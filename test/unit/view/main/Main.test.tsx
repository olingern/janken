// src/App.test.js
import test from 'ava';
import { render } from 'ink-testing-library';
import React from 'react';

import { MainComponent } from '../../../../src/view/main/Main';

test('renders without crashing', t => {
    let err;
    let result;
    try {
        result = render(<MainComponent connectionItems={[{ label: "Test", value: "test"}]} />);
        
    } catch(e) {
        err = e; 
    }

    const lastFrame = result?.lastFrame() || "";

    t.true(lastFrame.indexOf("Connections") !== -1)
    t.true(err === undefined)

});

test('renders connection items', t => {
    let err;
    let result;
    
    const label = "Test";
    const component = <MainComponent connectionItems={[{ label, value: "fakedb://fake:fakepass@localhost/db"}]} />;
    try {
        result = render(component);
        result.rerender(component)
    } catch(e) {
        err = e; 
    }

    const lastFrame = result?.lastFrame() || "";

    // Ensure "Test" label is visible
    t.true(lastFrame.indexOf(label) !== -1)
    t.is(err, undefined)

    // Save snapshot
    t.snapshot(component)
});