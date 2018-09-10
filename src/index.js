import React from 'react';
import { render, hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import Loadable from 'react-loadable';
import { Frontload } from 'react-frontload';
import { ConnectedRouter } from 'connected-react-router';
import createStore from './store';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { AUTH_TOKEN } from './constants'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import cookies from 'js-cookie';
const HOSTNAME = process.env.HOSTNAME;
console.log('HOSTNAME',HOSTNAME);

import App from './app/app';
import './index.css';

// Create a store and get back itself and its history object
const { store, history } = createStore();

const httpLink = createHttpLink({
  uri: `http://${HOSTNAME}:4000`
});

const wsLink = new WebSocketLink({
  uri: `ws://${HOSTNAME}:4000`,
  options: {
    reconnect: true,
    connectionParams: {
      authToken: cookies.get(AUTH_TOKEN),
    }
  }
})

const authLink = setContext((_, { headers }) => {
  const token = cookies.get(AUTH_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
});

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  authLink.concat(httpLink)
)

const client = new ApolloClient({
  link,
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__)
});

// Running locally, we should run on a <ConnectedRouter /> rather than on a <StaticRouter /> like on the server
// Let's also let React Frontload explicitly know we're not rendering on the server here
const Application = (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ConnectedRouter history={history}>
          <Frontload noServerRender>
            <App />
          </Frontload>
      </ConnectedRouter>
    </ApolloProvider>
  </Provider>
);

const root = document.querySelector('#root');

if (process.env.NODE_ENV === 'production') {
  // If we're running in production, we use hydrate to get fast page loads by just
  // attaching event listeners after the initial render
  Loadable.preloadReady().then(() => {
    hydrate(Application, root);
  });
} else {
  // If we're not running on the server, just render like normal
  render(Application, root);
}
