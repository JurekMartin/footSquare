import { domManager } from './domManager.js';
import { gameManager } from './gameManager.js';

domManager.loadTemplates()
    .then(() => {
        domManager.toggleElementById("menu", false);
    })

