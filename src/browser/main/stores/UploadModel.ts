import { action, computed, observable } from 'mobx';
import * as API from '../constants/API';
import { getData, upload } from '../utils/ajax';
import message from 'antd/lib/message';
import { dataRead, dataWrite } from '../utils/dataManage';
import { removeFile } from '../bridge/modules/file';
import { createCache } from '../bridge/modules/createImageCache';
import { appDataFullPath } from '../constants/API';
import * as uuid from 'uuid';
import * as path from 'path';

export default class UploadModel {
  @observable public postFiles: any[] = [];
  @observable public xhrQueue: any = {};
  @observable public uploadListStatus: any = {};
  @observable public uploadHistoryList: any[] = [];
  public readLocal: boolean = false;

  public writeLocalHistory() {
    dataWrite('upload_image_history', this.uploadHistoryList);
  }

  @action
  public getLocalHistory() {
    if (this.readLocal) {
      return;
    }
    this.readLocal = true;
    dataRead('upload_image_history', (data: any) => {
      if (data) {
        this.uploadHistoryList = Object.keys(data).map((key: any) => data[key]);
      }
    });
  }

  @action
  public deleteHistoryItem(order: number) {
    const item = this.uploadHistoryList[order];
    removeFile(item.localThumb);
    getData(item.delete)
      .then(param => {
        console.log(param);
      })
      .catch(() => {
        message.error('图片服务端删除失败！');
      });

    this.uploadHistoryList = this.uploadHistoryList.filter(
      (item: any, index: number) => index !== order
    );
    this.writeLocalHistory();
  }

  @action
  public deleteAllHistory() {
    this.uploadHistoryList.map((item: any) => {
      removeFile(item.localThumb);
      getData(item.delete)
        .then(param => {
          console.log(param);
        })
        .catch(() => {
          message.error('图片服务端删除失败！');
        });
    });
    this.uploadHistoryList = [];
    this.writeLocalHistory();
  }

  @action
  public resetData() {
    if (!this.isXhrQueueEmpty) {
      message.warn('上传队列尚未完成！');
      return false;
    } else {
      this.postFiles = [];
      this.xhrQueue = {};
      this.uploadListStatus = {};
      return true;
    }
  }

  @action
  public getFileList(node: HTMLInputElement) {
    const files = node.files;
    const rawFiles = Array.prototype.slice.call(files);
    this.getRawFileList(rawFiles);
    node.value = '';
  }

  @action
  public getRawFileList(rawFiles: File[]) {
    if (!this.isXhrQueueEmpty) {
      return;
    }

    const baseType = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];

    const addFiles = rawFiles.filter((file: any, index: number): boolean => {
      const fileType = file.type.split('/')[1];
      if (baseType.includes(fileType) && file.size <= 4 * Math.pow(2, 20)) {
        const uid = uuid.v4();
        file.uid = uid;
        file.addIndex = index;
        if (!file.thumbType) {
          file.thumbType = 'image';
        }

        this.uploadListStatus[uid] = {
          file,
          progress: null,
          remote: null,
          status: 'ready',
        };

        return true;
      } else {
        message.error('文件格式或大小错误（不得超过4MB）！');
        return false;
      }
    });

    this.postFiles = this.postFiles.concat(addFiles);
  }

  @action
  public deletePostFile(index: number): void {
    delete this.postFiles[index];
  }

  @computed
  get isAllEmpty(): boolean {
    const upNum = Object.keys(this.uploadListStatus).length;
    const xhrNum = Object.keys(this.xhrQueue).length;
    return upNum + xhrNum === 0;
  }

  @computed
  get isXhrQueueEmpty(): boolean {
    return Object.keys(this.xhrQueue).length === 0;
  }

  public getUploadHistory() {
    getData(API.uploadHistory).then(param => {
      console.log(param);
    });
  }

  public clearUploadHistory() {
    getData(API.clearUploadHistory).then(param => {
      message.success('上传历史清除成功！');
      console.log(param);
    });
  }

  @action
  public deleteUploadListStatusItem(uid: string, addIndex: number) {
    delete this.uploadListStatus[uid];
    if (this.xhrQueue[uid]) {
      this.xhrQueue[uid].abort();
      delete this.xhrQueue[uid];
    }
    this.deletePostFile(addIndex);
  }

  public deleteRemoteImage(
    token: string,
    onSuccess: (e: any) => void,
    onError: (e: any) => void
  ) {
    getData(token)
      .then((param: any) => {
        onSuccess(param);
      })
      .catch(e => {
        onError(e);
      });
  }

  @action
  public abort(uid?: string) {
    if (uid) {
      this.xhrQueue[uid].abort();
    } else {
      Object.keys(this.xhrQueue).forEach((id: string) => {
        this.xhrQueue[id].abort();
        delete this.xhrQueue[id];
      });
    }
  }

  @action
  public doUpload = () => {
    if (!this.isXhrQueueEmpty) {
      message.warn('上传队列尚未完成！');
      return;
    }

    if (this.postFiles.length === 0) {
      message.info('请选择上传图片文件！');
    }

    this.postFiles.forEach((file: any, index: number) => {
      if (!file) {
        return;
      }
      const uid = file.uid;
      this.xhrQueue[uid] = upload({
        action: API.upload,
        file,
        filename: 'smfile',
        onError: () => {
          this.uploadListStatus[uid].status = 'error';
          delete this.xhrQueue[uid];
        },
        onProgress: e => {
          const itemStatus = this.uploadListStatus[uid];
          if (itemStatus) {
            itemStatus.progress = e;
            itemStatus.status = 'pending';
          }
        },
        onSuccess: ({ code, data }: any) => {
          if (code === 'success') {
            const itemStatus = this.uploadListStatus[uid];
            if (!itemStatus) {
              return;
            }

            const url = file.path || file.url;
            const isSupportImg =
              file.thumbType === 'base64' ||
              /\.jpg|\.png|\.jpeg/.test(path.basename(url));

            const thumbName = isSupportImg
              ? uid + '.png'
              : uid + path.basename(url);

            const remote = data;
            remote.uid = uid;
            remote.localThumb = path.join(appDataFullPath, thumbName);
            itemStatus.remote = remote;
            itemStatus.status = 'done';

            createCache({
              url,
              thumbType: file['thumbType'],
              saveName: thumbName,
              width: 200,
              height: 200,
            });
            delete this.xhrQueue[uid];
            this.uploadHistoryList.push(remote);
            delete this.postFiles[index];
            this.writeLocalHistory();
            if (this.isXhrQueueEmpty) {
              this.postFiles = [];
            }
          } else {
            this.uploadListStatus[uid].status = 'error';
            delete this.xhrQueue[uid];
          }
        },
      });
    });
  };
}
