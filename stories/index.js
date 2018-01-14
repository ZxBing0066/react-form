import React from 'react';

import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import { withConsole } from '@storybook/addon-console';

import each from 'lodash/each';

import { getStoryFilename } from './utils/index';

import './style.css';

storiesOf('Welcome', module)
    .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
    .add('to Storybook', () => (
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
    each(stories, (Story, name) => {
        let _stories = storiesOf(folder, module);
        const code = require(`!raw-loader!./${folder}/${name}.story.jsx`);

        const docs = `## source code\n\`\`\`jsx\n${code}\n\`\`\``;
        _stories.addDecorator(withReadme(docs)).add(name, () => <Story />);
    });
});
