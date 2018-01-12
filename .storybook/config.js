import { configure, setAddon } from '@storybook/react';

import { setOptions } from '@storybook/addon-options';

import infoAddon from '@storybook/addon-info';

setAddon(infoAddon);

setOptions({
    name: 'Z-React-Form StoryBook',
    url: '',
    downPanelInRight: true,
    selectedAddonPanel: 'REACT_STORYBOOK/readme/panel'
});

function loadStories() {
    require('../stories');
}

configure(loadStories, module);
