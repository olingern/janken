import test from 'ava';
import execa from 'execa';
import { render } from 'ink-testing-library';
import React from 'react';

import { transformConfigToItems } from '../../../src/commands/main';
import { loadConfigSync } from '../../../src/lib/init';
import { MainComponent } from '../../../src/view/main/Main';
import { cli, handleStdout, keys, removeConfigSync, writeTestConfigSync } from './helpers';

test.beforeEach(async () => {
    removeConfigSync()
    console.clear()
})

test.afterEach(async () => {
    removeConfigSync()
    console.clear()
})


test.skip('CLI should exit when no config exists', async (t) => {
    const expected = "There doesn't appear to be a config setup yet."
    removeConfigSync();

    const { stdout, kill } = execa(cli, []);

    const output = await handleStdout(stdout);

    t.is(output, expected)
    kill('SIGTERM', { forceKillAfterTimeout: 1000 })
});

test.serial('CLI shows connections screen when a valid config exists', async (t) => {
    writeTestConfigSync()
    const config = loadConfigSync()
    if (!config || config === null) {
        t.fail("Config not loaded from loadConfigSync")
    }
    const main = <MainComponent connectionItems={transformConfigToItems(config!)} />;
    const result = render(main)

    // TODO: figure out a better way to do this?
    //       Initial render has no connections displayed
    //       due to the dispatch of SET_CONNECTION_STRINGS. 
    //       After state updates, render is valid. This seems 
    //       to handle that.
    result.rerender(main)
    t.true(result.lastFrame()?.indexOf("Connections") !== -1);
    t.snapshot(main)
});


// var stdin = require('mock-stdin').stdin();



const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

test('User is able to select a connection', async (t) => {

    writeTestConfigSync()
    const config = loadConfigSync()
    if (!config || config === null) {
        t.fail("Config not loaded from loadConfigSync")
    }
    const main = <MainComponent connectionItems={transformConfigToItems(config!)} />;
    const result = render(main)

    // Wait on render
    await delay(100)

    // Hit enter on default connection
    result.stdin.write(keys.enter)
    await delay(100)

    // Last frame should now be the database table listing
    const currentOutput = result.lastFrame();

    // Tables heading should be visible
    t.true(currentOutput?.indexOf("Tables") !== -1)

    // Posts table should be visible
    t.true(currentOutput?.indexOf("posts") !== -1)

    t.snapshot(currentOutput)
});

test('User is able to select a table', async (t) => {

    // 3 - Assert that three columns are shown
    t.plan(3)

    writeTestConfigSync()
    const config = loadConfigSync()
    if (!config || config === null) {
        t.fail("Config not loaded from loadConfigSync")
    }

    const main = <MainComponent connectionItems={transformConfigToItems(config!)} />;
    const result = render(main)

    // Wait on render
    await delay(100)

    // Hit enter on default connection
    result.stdin.write(keys.enter)
    await delay(100)

    // Select default table
    result.stdin.write(keys.enter)
    await delay(100)

    // Last frame should now be the database table listing
    const currentOutput = result.lastFrame();
    
    // fields created on posts table via docker-compose startup script
    ["id", "post_name", "post_summary"].forEach((column) => t.true(currentOutput?.indexOf(column) !== -1))
});

