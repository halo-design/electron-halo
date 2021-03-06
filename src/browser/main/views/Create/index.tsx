import * as React from 'react';
import { inject, observer } from 'mobx-react';
import { remote } from 'electron';
import { action, observable } from 'mobx';
import { selectFile } from '../../bridge/modules/file';
import * as project from '../../bridge/modules/project';
import LineProgress from '../../components/LineProgress';
import Cascader from 'antd/lib/cascader';
import Input from 'antd/lib/input';
import Icon from 'antd/lib/icon';
import message from 'antd/lib/message';
import Modal from 'antd/lib/modal';
import Switch from 'antd/lib/switch';
import { isMac } from '../../bridge/modules/env';

const InputGroup = Input.Group;
const nameReg = /^[0-9a-zA-Z_-]{1,}$/;

const { confirm } = Modal;

import './index.scss';

@inject((stores: any) => {
  const {
    systemEnvObject,
    userPassword,
    adminAuthorizationModalVisible,
    npmPreSettings,
    defaultProject,
    scaffold,
  } = stores.workBench;

  return {
    systemEnvObject,
    userPassword,
    adminAuthorizationModalVisible,
    npmPreSettings,
    defaultProject,
    scaffold,
    shell: (str: string) => stores.terminal.shell(str),
    setUserDefaultProjerctPath: (str: string) =>
      stores.workBench.setUserDefaultProjerctPath(str),
    setExecPath: (str: string, force: boolean) =>
      stores.terminal.setExecPath(str, force),
  };
})
@observer
class CreatehView extends React.Component<any, any> {
  @observable public projectName: string = '';
  @observable public projectPath: string = '';
  @observable public projectDir: string = '';
  @observable public installPackages: boolean = true;
  @observable public setMirror: boolean = true;
  @observable public isYarn: boolean = true;
  @observable public creating: boolean = false;
  @observable public createInfo: string = '';
  @observable public scaffoldTemplateLink: string = '';

  @action
  public handleChangeProjectName(val: string) {
    this.projectName = val;
  }

  @action
  public getScaffoldTemplateLink(val: string[]) {
    const { scaffold } = this.props;
    if (scaffold.length === 0) {
      return;
    }
    const matchScaffold = scaffold.filter((item: any) => item.value === val[0]);

    if (matchScaffold.length === 0) {
      return;
    }

    const tpl = matchScaffold[0]['children'];
    const link = tpl.filter((item: any) => item.value === val[1])[0]['link'];
    this.scaffoldTemplateLink = link;
  }

  @action
  public installConfirm() {
    confirm({
      title: '是否立即安装该项目依赖包？',
      content: '若取消该次安装，可下次手动进行安装。安装过程中请勿重复操作！',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        const sudo = isMac ? 'sudo ' : '';
        const cmd = this.isYarn ? 'yarn' : 'npm';
        const install = () => this.props.shell(`${sudo}${cmd} install`);

        if (this.setMirror) {
          this.setMirrorConfig(install);
        } else {
          install();
        }
        remote.shell.showItemInFolder(this.projectDir);
        remote.getCurrentWindow().focus();
      },
      onCancel: () => {
        remote.shell.showItemInFolder(this.projectDir);
      },
    });
  }

  @action
  public handleSelectDir(el: HTMLInputElement) {
    selectFile(
      {
        message: '选择工程导出目录',
        properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      },
      (res: string[] | undefined) => {
        if (res && res[0]) {
          this.projectPath = res[0];
          el.value = res[0];
        }
      }
    );
  }

  @action
  public createProjectHandle() {
    if (!nameReg.test(this.projectName)) {
      message.error('请输入正确的工程名(大小写字母、数字、下划线、横线)！');
    } else if (!this.projectPath) {
      message.warn('请选择生成目录！');
    } else if (!this.scaffoldTemplateLink) {
      message.warn('请选择脚手架！');
    } else {
      const params = {
        projectName: this.projectName,
        projectPath: this.projectPath,
        installPackages: this.installPackages,
        scaffoldTemplateLink: this.scaffoldTemplateLink,
      };
      this.creating = true;
      this.createInfo = '开始创建工程';
      project.create(
        params,
        (data: any) => {
          const { step, state, status } = data;
          if (step === 'download') {
            if (status === 'running') {
              this.createInfo = `正在下载工程...(${~~(state.progress * 100)}%)`;
            } else if (status === 'error') {
              this.creating = false;
              this.createInfo = '工程下载出错！';
            } else if (status === 'finished') {
              this.createInfo = '工程下载完成！';
            }
          } else if (step === 'unzip') {
            if (status === 'running') {
              this.createInfo = `正在解压工程...(${~~(
                (state.fileIndex / state.fileCount) *
                100
              )}%)`;
            } else if (status === 'finished') {
              this.createInfo = `工程解压完毕！`;
              this.creating = false;
              this.props.setUserDefaultProjerctPath(state.optputDir);

              if (this.installPackages) {
                this.props.setExecPath(state.optputDir, false);
                this.installConfirm();
                this.projectDir = state.optputDir;
              } else {
                remote.shell.showItemInFolder(state.optputDir);
              }
            }
          }
        },
        (errTxt: string) => {
          message.error(errTxt);
          this.creating = false;
        }
      );
    }
  }

  public setMirrorConfig(cb?: (e: any) => void) {
    this.props.npmPreSettings.forEach((cmd: string, index: number) => {
      setTimeout(() => {
        this.props.shell(cmd);
      }, index * 60);
    });

    if (cb) {
      setTimeout(cb, this.props.npmPreSettings.length * 60);
    }
  }

  public componentDidMount() {
    this.isYarn = this.props.systemEnvObject['Yarn'].version;
    this.getScaffoldTemplateLink(this.props.defaultProject);
  }

  public render() {
    const { scaffold, defaultProject } = this.props;

    return (
      <div className="sub-page-create">
        <div className="form-table">
          <div className="form-item project-type-selection">
            <div className="label">选择脚手架</div>
            <Cascader
              style={{ width: '340px' }}
              options={scaffold}
              defaultValue={defaultProject}
              placeholder="请选择脚手架"
              size="large"
              onChange={(val: string[]) => {
                this.getScaffoldTemplateLink(val);
              }}
            />
          </div>
          <div className="form-item">
            <div className="label">工程创建导出</div>
            <div className="form">
              <InputGroup size="large" compact={true}>
                <Input
                  style={{ width: '34%' }}
                  placeholder="请输入工程名"
                  onChange={(e: any) => {
                    this.handleChangeProjectName(e.target.value);
                  }}
                />
                <Input
                  style={{ width: '66%' }}
                  placeholder="点击选择生成目录"
                  readOnly={true}
                  value={this.projectPath}
                  onClick={(e: any) => {
                    this.handleSelectDir(e.target);
                  }}
                  suffix={<Icon type="folder" />}
                />
              </InputGroup>
            </div>
          </div>
          <div className="form-item install-packages">
            <div className="label">自动设置镜像源</div>
            <Switch
              onChange={(e: boolean) => {
                this.setMirror = e;
              }}
              disabled={!this.installPackages}
              defaultChecked={this.setMirror}
            />
          </div>
          <div className="tips">
            <div className="info">为防止安装失败，请安装前设置镜像源</div>
            <div
              className="btn-default env-set-btn"
              onClick={() => {
                this.setMirrorConfig();
              }}
            >
              一键设置
            </div>
          </div>
          <div className="form-item install-packages">
            <div className="label">自动安装依赖包</div>
            <Switch
              onChange={(e: boolean) => {
                this.installPackages = e;
              }}
              defaultChecked={this.installPackages}
            />
          </div>
          <div
            className="btn-large create-btn"
            onClick={() => {
              this.createProjectHandle();
            }}
          >
            创建项目
          </div>
        </div>
        <LineProgress
          hide={!this.creating}
          title={this.createInfo}
          mask={true}
        />
      </div>
    );
  }
}

export default CreatehView;
