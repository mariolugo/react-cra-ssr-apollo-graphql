import React from 'react';
import { Route, Switch } from 'react-router-dom';
import AuthenticatedRoute from '../components/authenticated-route';
import UnauthenticatedRoute from '../components/unauthenticated-route';
import Loadable from 'react-loadable';
import Search from '../routes/homepage/Search';

import NotFound from './not-found';

const Homepage = Loadable({
  loader: () => import(/* webpackChunkName: "homepage" */ './homepage'),
  loading: () => null,
  modules: ['homepage']
});

const About = Loadable({
  loader: () => import(/* webpackChunkName: "about" */ './about'),
  loading: () => null,
  modules: ['about']
});

const Dashboard = Loadable({
  loader: () => import(/* webpackChunkName: "dashboard" */ './dashboard'),
  loading: () => null,
  modules: ['dashboard']
});

const Login = Loadable({
  loader: () => import(/* webpackChunkName: "login" */ './login'),
  loading: () => null,
  modules: ['login']
});

const Logout = Loadable({
  loader: () => import(/* webpackChunkName: "logout" */ './logout'),
  loading: () => null,
  modules: ['logout']
});

const UserEdit = Loadable({
  loader: () => import(/* webpackChunkName: "edit-profile" */ './edit-profile'),
  loading: () => null,
  modules: ['edit-profile']
});

const ListRoom = Loadable({
    loader: () => import(/* webpackChunkName: "list-room" */ './list-room'),
    loading: () => null,
    modules: ['list-room']
});

const Room = Loadable({
    loader: () => import(/* webpackChunkName: "room" */ './room'),
    loading: () => null,
    modules: ['room']
});

export default () => (
  <Switch>
    <Route exact path="/" component={Homepage} />
    <Route exact path="/about" component={About} />

    <Route exact path="/search" component={Search} />
    <Route exact path="/list" component={ListRoom} />
    <Route exact path="/room/:id" component={Room} />

    <AuthenticatedRoute path="/dashboard" component={Dashboard} />

    <UnauthenticatedRoute path="/login" component={Login} />
    <AuthenticatedRoute exact path="/logout" component={Logout} />

    <AuthenticatedRoute exact path="/user/edit" component={UserEdit} />
    <Route component={NotFound} />
  </Switch>
);
