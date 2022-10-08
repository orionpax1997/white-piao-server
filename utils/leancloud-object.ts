import AV from 'leancloud-storage';
const { LEAN_ID, LEAN_KEY } = process.env;
// import proxy from 'node-global-proxy';

// proxy.setConfig('http://127.0.0.1:7890');
// proxy.start();
// AV.debug.enable();

AV.init({
  appId: LEAN_ID as string,
  appKey: LEAN_KEY as string,
});

const SourceObject = AV.Object.extend('Source');
export { AV, SourceObject };
