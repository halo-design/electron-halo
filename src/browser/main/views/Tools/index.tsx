import * as React from 'react';
import { action, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Drawer from 'antd/lib/drawer';
import Upload from '../../layouts/Upload';
import CreateServer from '../../layouts/CreateServer';
import {
  scrollbarStyleString,
  cheetahSimulatorIndex,
} from '../../constants/API';
import {
  deviceSimulator,
  cheetahSimulator,
  markdownViewer,
  mockProxyServer,
} from '../../bridge/modules/createWindow';

import './index.scss';

@inject((stores: any) => {
  const {
    terminal: { deviceConfig },
    createServer: { createServerDrawerVisible },
  } = stores;

  return {
    deviceConfig,
    createServerDrawerVisible,
    setMonitorVisible: (state: boolean) =>
      stores.workBench.setMonitorVisible(state),
    setCreateServerDrawerVisible: (state: boolean) =>
      stores.createServer.setCreateServerDrawerVisible(state),
  };
})
@observer
class ToolsView extends React.Component<any> {
  @observable public uploadDrawerVisible: boolean = false;

  @action
  public handleUploadDrawerVisible(state: boolean): void {
    this.uploadDrawerVisible = state;
  }

  public openDeviceSimulator() {
    deviceSimulator({
      target: 'about:blank',
      descriptors: this.props.deviceConfig,
      insertCSS: scrollbarStyleString,
    });
  }

  public openCheetahDevice() {
    cheetahSimulator({
      target: cheetahSimulatorIndex,
      descriptors: this.props.deviceConfig,
    });
  }

  public componentDidMount() {
    this.props.setMonitorVisible(false);
  }

  public componentWillUnmount() {
    this.props.setMonitorVisible(true);
  }

  public render() {
    return (
      <div className="page-tools">
        <h1 className="title">开发工具</h1>
        <div className="tools-list">
          <div
            className="item"
            onClick={() => {
              this.openCheetahDevice();
            }}
          >
            <i className="cheetah" />
            <div className="tit">猎豹调试器</div>
          </div>
          <div
            className="item"
            onClick={() => {
              mockProxyServer();
            }}
          >
            <i className="api" />
            <div className="tit">猎豹Mock模拟工具</div>
          </div>
          <div
            className="item"
            onClick={() => {
              this.openDeviceSimulator();
            }}
          >
            <i className="debug" />
            <div className="tit">WebApp调试器</div>
          </div>
          <div
            className="item"
            onClick={() => {
              markdownViewer();
            }}
          >
            <i className="markdown" />
            <div className="tit">MD文档预览器</div>
          </div>
          <div
            className="item"
            onClick={() => {
              this.handleUploadDrawerVisible(true);
            }}
          >
            <i className="imgupload" />
            <div className="tit">文档配图工具</div>
          </div>
          <div
            className="item"
            onClick={() => {
              this.props.setCreateServerDrawerVisible(true);
            }}
          >
            <i className="server" />
            <div className="tit">Web Server服务器</div>
          </div>
        </div>
        <Drawer
          title="图片图床"
          placement="right"
          closable={true}
          width={500}
          onClose={() => {
            this.handleUploadDrawerVisible(false);
          }}
          visible={this.uploadDrawerVisible}
        >
          <Upload />
        </Drawer>
        <Drawer
          title="Web本地服务器"
          placement="right"
          closable={true}
          onClose={() => {
            this.props.setCreateServerDrawerVisible(false);
          }}
          width={440}
          visible={this.props.createServerDrawerVisible}
        >
          <CreateServer />
        </Drawer>
      </div>
    );
  }
}

export default ToolsView;
