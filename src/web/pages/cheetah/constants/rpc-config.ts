export const rpcData = {
  header: {
    appVersion: '1.0.0.0',
    srcIP: '10.120.120.215',
    systemID: 'MB',
    locationInfo: {
      cityName: '杭州',
      districtName: '拱墅区',
      latitude: 30.327835237159707,
      provinceName: '浙江省',
      roadName: '科园路',
      longitude: 120.15469266602992,
    },
    srcSystemID: 'MB',
    clientMac: '02:00:00:00:00:00',
    mp_sId: 'FAGVBNCNCPBMHYAGIRIVDIBIFIDDBYDS',
    netWorkType: '4G',
    deviceId: 'XSPxEIPddioDAOkAe05YBWoa',
    systemVersion: '12.3.1',
    deviceName: '01',
    resolution: '1125*2436',
    platform: 'simulator',
    deviceSystem: 'iOS',
    screenSize: '1125*2436',
    carrierName: 'simulator',
    osVersion: '12.3.1',
    channelSort: 'MB',
    macValue: '02:00:00:00:00:00',
    transDate: '20190823',
    globalReqSerialNO: '',
    transCode: '',
    networkType: '4G',
    isCrack: '0',
    transTime: '171836889',
    reqSerialNO: '',
    mobileType: 'iPhone X',
    srcDeviceID: 'XSPxEIPddioDAOkAe05YBWoa',
    version: '1.0,0',
    channelScene: 'MB',
    eventCode: '',
    bizChannel: 'MB',
    productCode: '',
    deviceModel: 'iPhone X',
    operationSystem: 'iOS',
    deviceBrand: 'iOS',
  },
};

export const rpcLogin = {
  body: {
    loginId: '15111111161',
    loginPassword: 'qwer1234',
    mobileNo: '15111111161',
  },
};

export const rpcSettings = {
  rpcRemoteUrl: 'http://flameapp.cn/chee-mpaasService/',
  rpcOperationTypeReg: '([^.]*).([^.]*).([^.]*)',
  rpcOperationTypeReplaceString: '$3.do',
  rpcOperationLoginInterface: 'com.IFP.UR0010',
  rpcOperationLoginSuccessCode: '0',
  rpcOperationLoginErrorMsgPosition: 'data.header.errorMsg',
  rpcOperationLoginErrorCodePosition: 'data.header.errorCode',
  rpcOperationSessionIDPosition: 'data.header.mp_sId',
};
