import { configure } from '@storybook/react';

// theme CSS
import "bulma/css/bulma.css";
import "../src/themes/ide/flatly.min.css";

// automatically import all files ending in *.stories.tsx
const req = require.context( "../src", true, /\.stories\.tsx$/ );

function loadStories() {
  req.keys().forEach( req) ;
}

configure( loadStories, module );