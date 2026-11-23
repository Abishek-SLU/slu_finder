/* global __dirname, Buffer */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ts = require('typescript');
const jwt = (claims) => `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify(claims)).toString('base64url')}.signature`;
const valid = () => jwt({exp: Math.floor(Date.now()/1000)+3600});
function setup(platform = 'web', stored = null) {
  const storage = new Map(stored ? [['slu_finder_access_token', stored]] : []);
  let response = {ok:true, status:200, text:async()=>'{"data":{"ok":true}}'};
  let request;
  const secure = {getItemAsync:async k=>storage.get(k)??null, setItemAsync:async(k,v)=>storage.set(k,v), deleteItemAsync:async k=>storage.delete(k)};
  const session = load('authSession', {'expo-secure-store':secure, 'react-native':{Platform:{OS:platform}}});
  const api = load('api', {'./authSession':session});
  function load(name, dependencies) {
    const exports = {};
    const source = ts.transpileModule(fs.readFileSync(path.join(__dirname,'../src/services',name+'.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
    vm.runInNewContext(source,{exports,require:n=>dependencies[n],atob,Date,Set,process:{env:{}},window:{localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k)}},fetch:async(url,options)=>{request={url,...options};return response;}});
    return exports;
  }
  return {session,api,storage,setResponse:r=>response=r,request:()=>request};
}
for (const platform of ['web','ios','android']) {
  test(`${platform}: restore, persist, notify and clear`, async()=>{
    const token=valid(); const {session,storage}=setup(platform,token);
    assert.equal(await session.getToken(),token);
    let notifications=0; const off=session.subscribeSession(()=>notifications++);
    await session.saveToken(token); assert.equal(storage.get(session.TOKEN_KEY),token);
    await session.clearToken(); assert.equal(await session.getToken(),null); assert.equal(storage.size,0);
    assert.equal(notifications,2); off();
  });
}
test('reject expired, malformed, missing expiration and future nbf tokens', async()=>{
  for(const token of ['bad',jwt({}),jwt({exp:1}),jwt({exp:Date.now()/1000+100,nbf:Date.now()/1000+50})]) {
    const {session,storage}=setup('web',token);
    assert.equal(await session.getToken(),null); assert.equal(storage.size,0);
    await assert.rejects(session.saveToken(token));
  }
});
test('cross-tab reload picks up logout', async()=>{
 const {session,storage}=setup('web',valid()); await session.getToken(); storage.clear(); await session.reloadSession(); assert.equal(await session.getToken(),null);
});
test('protected API sends JWT; 401 invalidates before parsing body', async()=>{
 const {session,api,setResponse,request}=setup(); const token=valid(); await session.saveToken(token);
 await api.apiRequest('/api/student/profile','GET',undefined,token);
 assert.equal(request().headers.Authorization,`Bearer ${token}`);
 setResponse({status:401,ok:false,text:async()=>'<html>Unauthorized</html>'});
 await assert.rejects(api.apiRequest('/api/student/profile','GET',undefined,token),/session has expired/);
 assert.equal(await session.getToken(),null);
});
test('403 keeps session and stale 401 cannot erase a newer login',async()=>{
 const {session,api,setResponse}=setup(); const old=valid(); await session.saveToken(old);
 setResponse({status:403,ok:false,text:async()=>'{}'});
 await assert.rejects(api.apiRequest('/test','GET',undefined,old)); assert.equal(await session.getToken(),old);
 const newer=jwt({exp:Date.now()/1000+7200}); await session.saveToken(newer);
 setResponse({status:401,ok:false,text:async()=>''});
 await assert.rejects(api.apiRequest('/test','GET',undefined,old)); assert.equal(await session.getToken(),newer);
});
test('public OTP request remains unauthenticated',async()=>{
 const {api,request}=setup(); await api.apiRequest('/api/register/generate-otp','POST',{email:'student@example.com'});
 assert.equal(request().headers.Authorization,undefined);
});
