import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withConsole } from '@storybook/addon-console';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import JSXAddon from 'storybook-addon-jsx';
import { withReadme, withDocs } from 'storybook-readme';

import each from 'lodash/each';

import { getStoryFilename } from './utils/index';

import './style.css';

setAddon(JSXAddon);

storiesOf('Welcome', module).add('to Storybook', () => (
    <div>
        <h1>React form storybook</h1>
        <p>Hi there, thanks for using react form.</p>
        <p>Just jump to the demos</p>
    </div>
));

const context = require.context('.', true, /.*\/.*\/.*\.story\.jsx$/);

const allStories = {};
const keys = context.keys();

keys.forEach(key => {
    const [folder, filename] = getStoryFilename(key) || [];
    if (!folder) return;
    if (!allStories[folder]) {
        allStories[folder] = {};
    }
    allStories[folder][filename] = context(key).default;
});

each(allStories, (stories, folder) => {
    let _stories = storiesOf(folder, module);
    each(stories, (story, name) => {
        _stories.addWithJSX(name, story);
    });
});
