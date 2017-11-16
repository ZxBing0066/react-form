import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { linkTo } from '@storybook/addon-links';
import { withConsole } from '@storybook/addon-console';

import App from './App';

storiesOf('Welcome', module)
    .addDecorator((storyFn, context) => withConsole()(storyFn)(context))
    .add('to Storybook', () => (
        <div>
            <h1>React form storybook</h1>
            <p>Hi there, thanks for using react form.</p>
            <p>Just jump to the story demo</p>
            <button onClick={linkTo('App')}>Click here</button>
        </div>
    ));

storiesOf('App', module).add('simple', () => <App />);
