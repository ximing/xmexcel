/**
 * Created by yeanzhi on 17/4/12.
 */
'use strict';
import './index.scss';
import React, {Component} from "react";
import rab, {connect, createAction} from 'rabjs/index.js';
import {Route, routerRedux, Redirect, Switch} from 'rabjs/router';

const {ConnectedRouter: Router} = routerRedux;

import DemoContainer from './DemoContainer';
import ViewContainer from './ViewContainer';

const app = rab({
    debug: true
});

app.router(({history}) => {
    return (
        <Router history={history}>
            <div>
                <Switch>
                    <Route path="/demo.html" component={DemoContainer}/>
                    <Route path="/demo" component={DemoContainer}/>
                    <Route path="/view" component={ViewContainer}/>
                    <Route path="/" component={DemoContainer}/>
                </Switch>
            </div>
        </Router>
    );
});
app.start('#app');
