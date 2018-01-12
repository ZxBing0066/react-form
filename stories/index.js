import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import { withReadme, withDocs } from 'storybook-readme';

import each from 'lodash/each';

import { getStoryFilename } from './utils/index';

import './style.css';

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
    each(stories, (story, name) => {
        let _stories = storiesOf(folder, module);
        const code = require(`!raw-loader!./${folder}/${name}.story.jsx`);

        const docs = `## source code\n\`\`\`jsx\n${code}\n\`\`\``;
        _stories.addDecorator(withReadme(docs)).add(name, story);
    });
});
