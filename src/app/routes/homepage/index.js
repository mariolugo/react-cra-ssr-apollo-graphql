import React from 'react';
import Page from '../../components/page';

import LinkList from './LinkList';
import CreateLink from './CreateLink';

export default () => (
  <Page id="homepage">
    <p>Here's our homepage. All are welcome.</p>
    <LinkList />
    <CreateLink />
  </Page>
);
