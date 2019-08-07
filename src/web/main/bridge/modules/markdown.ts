import RPC from '../rpc';
const { dispatch } = RPC;

export const readLocalFile = (cb: (args: object) => void): void => {
  dispatch('read-local-file', '');
  RPC.once('get-local-file-content', (args: object) => {
    cb(args);
  });
};

export const mdSaveAsHtml = (
  title: string,
  content: string,
  outputPath: string,
  callback?: Function
) => {
  dispatch('markdown-save-as-html', {
    title,
    content,
    outputPath,
  });
  RPC.once('markdown-save-as-html-done', ({ outputPath }: any) => {
    callback && callback(outputPath);
  });
};

export const downloadPreviewFile = (
  url: string,
  success: Function,
  faild?: Function
) => {
  dispatch('download-preview-file', { url });
  RPC.once('download-preview-file-result', (params: any) => {
    const { result } = params;
    if (/(completed|cancelled|interrupted|timeout)/.test(result)) {
      RPC.removeListener('download-preview-file-result', () => {});
      faild && faild();
    }
    success(params);
  });
};

export const readLocalFileSync = () =>
  new Promise((resolve, reject) => {
    readLocalFile((args: object) => {
      resolve(args);
    });
  });