import message from 'antd/lib/message';
import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
import { remote } from 'electron';
import createStores from '../stores';
import App from './App';
import RPC from '../bridge/rpc';

import '../../../../node_modules/antd/es/style/index.css';
import '../../../../node_modules/antd/es/message/style/index.css';
import '../../../../node_modules/antd/es/notification/style/index.css';
import '../../../../node_modules/antd/es/tooltip/style/index.css';
import '../../../../node_modules/antd/es/select/style/index.css';
import '../../../../node_modules/antd/es/cascader/style/index.css';
import '../../../../node_modules/antd/es/input/style/index.css';
import '../../../../node_modules/antd/es/icon/style/index.css';
import '../../../../node_modules/antd/es/switch/style/index.css';
import '../../../../node_modules/antd/es/button/style/index.css';
import '../../../../node_modules/antd/es/modal/style/index.css';
import '../../../../node_modules/antd/es/drawer/style/index.css';
import '../../../../node_modules/antd/es/collapse/style/index.css';
import '../../../../node_modules/antd/es/checkbox/style/index.css';
import '../../../../node_modules/xterm/css/xterm.css';

import '../assets/style/app.scss';

message.config({
  top: document.documentElement.clientHeight - 80,
  maxCount: 4,
});

if (!remote.app.isPackaged) {
  const devTools = require('mobx-react-devtools');
  devTools.configureDevtool({
    graphEnabled: false,
    logEnabled: true,
    logFilter: ({ type }: any) => type === 'action',
    updatesEnabled: false,
  });
}

document.documentElement.classList.add(process.platform);

RPC.on('ready', () => {
  ReactDOM.render(
    <Provider {...createStores()}>
      <Router basename="/">
        <App initPath="/scan" />
      </Router>
    </Provider>,
    document.getElementById('MOUNT_NODE') as HTMLElement
  );
});
