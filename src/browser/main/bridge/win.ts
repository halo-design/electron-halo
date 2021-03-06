import { remote } from 'electron';
const { app, getCurrentWindow } = remote;

const win: any = {
  close: () => {
    getCurrentWindow().close();
  },
  isMax: () => getCurrentWindow().isMaximized(),
  maximize: () => {
    getCurrentWindow().maximize();
  },
  minimize: () => {
    getCurrentWindow().minimize();
  },
  quit: () => {
    app.quit();
  },
  restore: () => {
    getCurrentWindow().restore();
  },
  unmaximize: () => {
    getCurrentWindow().unmaximize();
  },
  setAlwaysOnTop: (flag: boolean) => {
    getCurrentWindow().setAlwaysOnTop(flag);
  },
};

export default win;
