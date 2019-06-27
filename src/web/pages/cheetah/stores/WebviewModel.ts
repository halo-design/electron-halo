import * as qs from 'qs';
import * as uuid from 'uuid';
import { action, observable, computed } from 'mobx';
const options: any = qs.parse(location.hash.substr(1));

export default class WebviewModel {
  @observable public webviewList: any[] = [];
  @observable public directive: object = {};
  @observable public focusIndex: number = 0;
  public domList: any[] = [];

  @action
  public webviewCreater(url: string) {
    const {
      preload,
      descriptors: {
        userAgent,
        viewport: { width, height },
      },
    } = options;

    const webviewItem = {
      attr: {
        style: {
          width: width + 'px',
          height: height - 80 + 'px',
        },
        preload,
        useragent: userAgent,
        src: url,
      },
      devtools: false,
      uid: uuid.v4(),
      dom: null,
      ready: false,
    };

    return webviewItem;
  }

  @computed get webviewCount() {
    return this.webviewList.length;
  }

  @computed get maxIndex() {
    return this.webviewList.length - 1;
  }

  @computed get focusOnFisrt() {
    return this.focusIndex === 0;
  }

  @computed get focusOnLast() {
    return this.focusIndex === this.webviewList.length - 1;
  }

  @computed get focusDevtoolsState() {
    if (this.webviewCount > 0) {
      return this.webviewList[this.focusIndex].devtools;
    } else {
      return false;
    }
  }

  @action
  getDirective(name: string, params: object) {
    this.directive = { name, params };
    console.log(this.directive);
  }

  @action
  public createNewWebview(url: string): number {
    this.closeFocusDevtools();
    if (this.focusIndex !== this.maxIndex) {
      this.webviewList.splice(
        this.focusIndex + 1,
        this.maxIndex - this.focusIndex
      );
    }
    this.webviewList.push(this.webviewCreater(url));
    this.focusIndex = this.maxIndex;
    return this.focusIndex;
  }

  @action
  public replaceWebview(url: string): number {
    this.webviewList.pop();
    return this.createNewWebview(url);
  }

  @action
  public clearAllThenCreateNewWebview(url: string) {
    this.webviewList = [];
    return this.createNewWebview(url);
  }

  @action
  public getWebviewDOM(index: number, el: any) {
    if (!el) {
      return;
    }
    const currnet = this.webviewList[index];
    currnet['dom'] = el;
    el.addEventListener('dom-ready', () => {
      el.insertCSS(`
        body::-webkit-scrollbar {
          width: 4px;
        }
        
        body::-webkit-scrollbar-thumb {
          background-color: rgb(220, 220, 220);
        }
        
        body::-webkit-scrollbar-track-piece {
          background-color: transparent;
        }
      `);

      el.addEventListener('devtools-closed', () => {
        currnet['devtools'] = false;
      });

      el.send('dom-ready');
      currnet['ready'] = true;
    });

    el.addEventListener('ipc-message', (event: any, args: object) => {
      this.getDirective(event.channel, args);
    });
  }

  @action
  public focusToNextWebview() {
    if (this.focusIndex < this.maxIndex) {
      this.closeFocusDevtools();
      this.focusIndex++;
    }
  }

  @action
  public goToAnyWebview(count: number) {
    if (count < 0) {
      const num = Math.abs(count);
      if (this.focusIndex - num >= 0) {
        this.closeFocusDevtools();
        this.focusIndex = this.focusIndex - num;
      }
    } else if (this.focusIndex + count <= this.maxIndex) {
      this.closeFocusDevtools();
      this.focusIndex = this.focusIndex + count;
    }
  }

  @action
  public focusToPrevWebview() {
    if (this.focusIndex > 0) {
      this.closeFocusDevtools();
      this.focusIndex--;
    }
  }

  @action
  public closeFocusDevtools() {
    const current = this.webviewList[this.focusIndex];
    if (current && current.ready) {
      const dom = current.dom;
      dom.closeDevTools();
      current.devtools = false;
    }
  }

  @action
  public debugFocusWebview() {
    const current = this.webviewList[this.focusIndex];
    if (current && current.ready) {
      const dom = current.dom;
      current.devtools ? dom.closeDevTools() : dom.openDevTools();
      current.devtools = !current.devtools;
    }
  }
}
