import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withConsole } from '@storybook/addon-console';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import { withReadme, withDocs } from 'storybook-readme';
import JSXAddon from 'storybook-addon-jsx';

import each from 'lodash/each';

import { getStoryFilename } from './utils/index';

// import addItemStories from './ItemStory';

setAddon(JSXAddon);
// import App from './App';
// import SetterGetter from './SetterGetter';
// import SetterGetterReadme from './SetterGetter/README.md';
// import FormSample from './FormSample';
// import ItemStory from './ItemStory';

import './style.css';

storiesOf('Welcome', module).add('to Storybook', () => (
    <div>
        <h1>React form storybook</h1>
        <p>Hi there, thanks for using react form.</p>
        <p>Just jump to the story demo</p>
        {/* <button onClick={linkTo('SetterGetter')}>Click here</button> */}
    </div>
));

// let simpleStories = storiesOf('Simple', module);

// simpleStories.addDecorator((story, context) => withInfo()(story)(context));

// simpleStories.addDecorator(withReadme(SetterGetterReadme)).add('SetterGetter', () => <SetterGetter />);
// simpleStories.add('ItemStory', () => <ItemStory />);

// let itemStories = storiesOf('Item', module);
// itemStories.addDecorator((story, context) => withInfo()(story)(context));
// addItemStories(itemStories);

// let advanceStories = storiesOf('Advance', module);
// advanceStories.addDecorator((story, context) => withInfo()(story)(context));
// advanceStories.addDecorator(withKnobs);
// advanceStories.addWithJSX('FormSample', () => <FormSample />);

// storiesOf('Advance', module).add('all', () => <App />);

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
