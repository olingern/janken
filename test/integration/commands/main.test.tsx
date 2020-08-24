import test from 'ava';
import execa from 'execa';
import { render } from 'ink-testing-library';
import React from 'react';

import { transformConfigToItems } from '../../../src/commands/main';
import { loadConfigSync } from '../../../src/lib/init';
import { MainComponent } from '../../../src/view/main/Main';
import { cli, handleStdout, removeConfigSync, writeTestConfigSync } from './helpers';

test.beforeEach(async () => {
    removeConfigSync()
    console.clear()
})

test.afterEach(async () => {
    removeConfigSync()
    console.clear()
})


test.serial('CLI should exit when no config exists', async (t) => {
    const expected = "There doesn't appear to be a config setup yet."
    removeConfigSync();

    const { stdout, kill } = execa(cli, []);

    const output = await handleStdout(stdout);

    t.true(output === expected, `got:\n ${output}, wanted:\n ${expected}` )
    kill('SIGTERM', { forceKillAfterTimeout: 1000 })
});

test.serial('CLI shows connections screen when a valid config exists', async (t) => {
    writeTestConfigSync()
    const config = loadConfigSync()
    const main = <MainComponent connectionItems={transformConfigToItems(config)} />;
    const result = render(main)

    // TODO: figure out a better way to do this?
    //       Initial render has no connections displayed
    //       due to the dispatch of SET_CONNECTION_STRINGS. 
    //       After state updates, render is valid. This seems 
    //       to handle that.
    result.rerender(main)
});

