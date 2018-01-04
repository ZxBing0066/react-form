import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withConsole } from '@storybook/addon-console';
import { withInfo } from '@storybook/addon-info';
import { withKnobs, text, boolean, number, object } from '@storybook/addon-knobs';
import { withReadme, withDocs } from 'storybook-readme';

import App from './App';
import SetterGetter from './SetterGetter';
import SetterGetterReadme from './SetterGetter/README.md';
import FormSample from './FormSample';
import ItemStory from './ItemStory';

import './style.css';

storiesOf('Welcome', module).add('to Storybook', () => (
    <div>
        <h1>React form storybook</h1>
        <p>Hi there, thanks for using react form.</p>
        <p>Just jump to the story demo</p>
        <button onClick={linkTo('SetterGetter')}>Click here</button>
    </div>
));

let simpleStories = storiesOf('Simple', module);

simpleStories.addDecorator((story, context) => withInfo()(story)(context));
simpleStories.addDecorator(withReadme(SetterGetterReadme)).add('SetterGetter', () => <SetterGetter />);
simpleStories.add('ItemStory', () => <ItemStory />);

let advanceStories = storiesOf('Advance', module);
advanceStories.addDecorator(withKnobs);
advanceStories.add('FormSample', () => (
    <FormSample
        useCheckMap={boolean('useCheckMap', false)}
        autoCheck={boolean('autoCheck', false)}
        autoCheckController={boolean('autoCheckController', false)}
    />
));

storiesOf('Advance', module).add('all', () => <App />);
