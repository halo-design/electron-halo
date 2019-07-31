import * as fs from 'fs';
import * as path from 'path';
import log from 'electron-log';
import * as http from 'http';
import { ipcMain } from 'electron';
const WebSocket = require('faye-websocket');
import file from '../../../utils/file';
import { BrowserWindow } from 'electron';
import mime from '../../../constants/mime';
import * as ip from 'ip';

const traversalAllWindows = (fn: (win: Electron.BrowserWindow) => void) => {
  BrowserWindow.getAllWindows().forEach((win: Electron.BrowserWindow) => {
    fn(win);
  });
};

const sendToAllWindows = (key: string, data: object) => {
  traversalAllWindows((win: Electron.BrowserWindow) => {
    win.webContents.send(key, data);
  });
};

export default (RPC: any) => {
  let wsGlobal: any = null;

  const wsSender = (event: any, args: any) => {
    if (wsGlobal) {
      RPC.dispatch('mock-proxy-ws-send-global', args);
      wsGlobal.send(
        JSON.stringify({
          ...args,
          resCode: 201,
        })
      );
    }
  };

  RPC.on('create-mock-proxy-server', ({ port }: any) => {
    ipcMain.on('mock-proxy-ws-send-global', wsSender);

    let usePort: number = port;
    const getHost = () => ({
      port: usePort,
      ip: ip.address(),
    });

    let server: any = http.createServer(({ url }: any, res) => {
      if (url === '/') {
        const page = fs.readFileSync(
          file.path('renderer/public/html/takeover.html'),
          'utf8'
        );
        res.setHeader('Content-Type', mime.html);
        res.write(page);
      } else if (url === '/favicon.ico') {
        const favicon = fs.readFileSync(file.path('renderer/favicon.ico'));
        res.setHeader('Content-Type', mime.ico);
        res.write(favicon);
      } else if (url.indexOf('/static/') === 0) {
        const filePath = file.path(url.replace('/static/', 'renderer/public/'));
        let ext = path.extname(url);
        ext = ext ? ext.slice(1) : 'unknown';
        const contentType = mime[ext] || 'text/plain';
        res.setHeader('Content-Type', contentType);

        const img = fs.readFileSync(filePath);
        res.write(img);
      }
      res.end();
    });

    server.on('upgrade', (request: any, socket: any, body: any) => {
      const ws = new WebSocket(request, socket, body);
      wsGlobal = ws;

      sendToAllWindows('mock-proxy-ws-connect-global', getHost());

      RPC.dispatch('mock-proxy-ws-connect', getHost());

      ws.on('message', ({ data }: any) => {
        log.info('Recieve:', data);
        const formatData = JSON.parse(data);

        if (formatData['resCode'] === 200) {
          wsSender(null, {
            resCode: 200,
            data: 'Server Connected.',
          });
        }

        sendToAllWindows('mock-proxy-ws-recieve-global', formatData);
      });

      ws.on('close', (event: any) => {
        log.info('Websocket close:', event.code, event.reason);

        sendToAllWindows('mock-proxy-ws-disconnected-global', getHost());

        RPC.dispatch('mock-proxy-ws-disconnected', getHost());
      });
    });

    server.on('close', () => {
      wsGlobal = null;
      ipcMain.removeListener('mock-proxy-ws-send-global', wsSender);
      // RPC.dispatch('mock-proxy-server-disconnected', { port: usePort });
      log.info('Server close:', usePort);
    });

    server.on('error', (e: any) => {
      if (e.code === 'EADDRINUSE') {
        log.info('Port is already in use.');

        setTimeout(() => {
          usePort++;
          server.close();
          server.listen(usePort);
        }, 1000);
      } else {
        log.error(e.toString());
        server.close();
        wsGlobal = null;
      }
    });

    server.listen(port, () => {
      log.info('Server listening:', usePort);

      sendToAllWindows('mock-proxy-server-connect-global', getHost());

      RPC.dispatch('mock-proxy-server-connect', getHost());
    });

    RPC.on('dispose-mock-proxy-server', () => {
      if (wsGlobal) {
        wsGlobal.close();
      }
      if (server) {
        server.close();
      }

      sendToAllWindows('mock-proxy-server-disconnected-global', getHost());

      RPC.dispatch('mock-proxy-server-disconnected', getHost());
      server = null;
      wsGlobal = null;
    });
  });
};