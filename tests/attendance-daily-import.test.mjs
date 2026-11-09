import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
const source=readFileSync(new URL('../assets/app.js',import.meta.url),'utf8');
const start=source.indexOf('    function parseAttendanceImportDate(');
const end=source.indexOf('    async function importAttendanceDailyBosses(',start);
const context=vm.createContext({Date,crypto:webcrypto,normalizeAttendanceBasePoints:v=>Math.max(0,Number(v)||0)});
vm.runInContext(source.slice(start,end),context);
test('date parsing validates calendar dates and resolves year rollover',()=>{
 assert.equal(context.parseAttendanceImportDate('31/02/2026'),null);
 assert.equal(context.parseAttendanceImportDate('invalid'),null);
 assert.equal(context.parseAttendanceImportDate('T2 09/11',new Date(2026,10,9)).getDate(),9);
 assert.equal(context.parseAttendanceImportDate('01/01',new Date(2026,11,31)).getFullYear(),2027);
});
test('daily import deduplicates per period, doubles night points, preserves existing and excludes other days',()=>{
 const date=new Date(2026,10,9), boss={id:'b',name:'Metus',points:3};
 const item=(h,m=0)=>({boss,eventTime:new Date(2026,10,9,h,m).getTime()});
 const items=[item(0),item(6,59),item(7),item(12),{boss,eventTime:new Date(2026,10,10).getTime()}];
 const result=context.buildAttendanceDailyBossActivities(items,date,[]);
 assert.equal(result.length,2);assert.equal(result[0].points,6);assert.equal(result[1].points,3);
 assert.equal(context.buildAttendanceDailyBossActivities(items,date,result).length,0);
 const existing=[{name:' METUS ',date:'09/11/2026',timePeriod:'day',points:99}];
 assert.equal(context.buildAttendanceDailyBossActivities(items,date,existing).length,1);
 assert.equal(existing[0].points,99);
 assert.equal(context.buildAttendanceDailyBossActivities([{boss:{name:'Zero',points:0},eventTime:date.getTime()}],date,[])[0].points,0);
});


