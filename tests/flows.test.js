// Flow and language tests for the Mẹ Hẹn Giờ prototype.
// Runs the prototype's own logic (the script inside design/Main.dc.html) in Node, without a browser.
// Usage: node tests/flows.test.js
const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'design', 'Main.dc.html'), 'utf8');
const js = html.match(/data-dc-script[^>]*>([\s\S]*?)<\/script>/)[1];
class DCLogic { constructor(p) { this.props = p || {}; } setState(u) { this.state = Object.assign({}, this.state, typeof u === 'function' ? u(this.state) : u); } }
eval(js + ';global.C=Component;');
let failed = 0;
const ok = (c, m) => { if (!c) failed++; console.log((c ? 'PASS' : 'FAIL') + '  ' + m); };
const keys = [...new Set([...html.matchAll(/\{\{t\.(\w+)\}\}/g)].map(m => m[1]))];
let a, v = () => a.renderVals();

console.log("— User flows (Vietnamese) —");
{
a=new C({demoSpeed:true}); a.props={demoSpeed:true};
// 1 pump flow
v().grid[0].pick(); ok(a.state.screen==='set','Hút sữa → Set');
v().start(); ok(a.state.screen==='run'&&a.state.runCat==='pump','Start → Run');
// open another category while running
v().goHome(); v().grid[3].pick(); ok(v().showReplace && /Hút sữa/.test(v().replaceText),'Set shows "Đang chạy Hút sữa…" warning');
v().goHome(); ok(v().runTitle==='Hút sữa' && v().catKey==='pump','Home chip still shows the running Hút sữa timer');
for(let i=0;i<25;i++) a.tick(); ok(a.state.screen==='side','Pump ends → choose side');
v().sideLeft(); ok(a.state.screen==='next'&&a.state.lastPump.side==='L','Side saved → Next reminder');
v().nextYes(); ok(a.state.screen==='home'&&a.state.nextAt!==null&&/Lần trước/.test(v().lastPumpText),'Reminder set → Home shows last pump');
// stop + undo
v().grid[2].pick(); v().start(); v().stop(); ok(v().hasUndo && /Đã dừng Rã đông đồ ăn/.test(v().undoText),'Stop shows undo toast');
v().doUndo(); ok(a.state.running && a.state.runCat==='food','Undo restores the stopped timer');
v().stop(); for(let i=0;i<9;i++) a.tick(); ok(!a.state.undo,'Undo toast disappears after 8 s');
// milk flow
v().grid[1].pick(); v().start(); for(let i=0;i<31;i++) a.tick(); ok(a.state.screen==='done'&&a.state.safeRunning,'Thaw ends → Done + use-by starts');
v().dismiss(); ok(a.state.screen==='safe','Tắt → use-by screen');
v().goHome(); for(let i=0;i<125;i++) a.tick(); ok(a.state.screen==='safe'&&v().safeExpired&&!v().safeOk,'Expiry jumps to use-by screen and hides "Bé đã bú"');
ok(v().safeChipText==='Sữa đã quá hạn','Home chip warns milk expired');
v().milkTossed(); ok(a.state.screen==='home'&&v().hasUndo,'Đổ bỏ → Home with undo');
v().doUndo(); ok(a.state.safeRunning,'Undo restores the milk timer');
// chao steps
let b=new C({demoSpeed:true}); a=b; v().grid[3].pick(); ok(v().bigValue==='90'&&/3 bước/.test(v().bigUnit),'Cháo shows 90 phút · 3 bước');
v().start(); ok(v().timerPhase==='soak','Step 1 = soak');
v().nextStep(); ok(v().timerPhase==='cook','Step 2 = cook'); v().nextStep(); ok(v().timerPhase==='cool'&&!v().canSkip,'Step 3 = cool, no skip');
for(let i=0;i<16;i++) a.tick(); ok(a.state.screen==='done','Cháo done');
// labels
let c2=new C({}); a=c2; v().grid[4].pick(); for(let i=0;i<3;i++) v().dec(); ok(v().bigValue==='4'&&v().decLabel==='Bớt 1 phút'&&v().incLabel==='Thêm 1 phút','± label matches 1-minute steps at small values');
v().setAlarm(); ok(/giờ báo/.test(v().bigUnit),'Alarm mode unit: '+v().bigUnit);

}
console.log("— Language setting —");
{
a=new C({}); const D=a.dict();
const viK=Object.keys(D.vi), enK=Object.keys(D.en);
ok(viK.length===enK.length && viK.every(k=>enK.includes(k)),'vi and en have the same '+viK.length+' keys');
const miss=keys.filter(k=>!(k in D.vi)); ok(miss.length===0,'every on-screen text key exists'+(miss.length?': '+miss:''));
v().openSettings(); ok(a.state.screen==='settings','Gear → Settings');
v().langOptions[1].pick(); ok(a.state.lang==='en' && v().t.homeTitle==='What are you timing?' && v().langCode==='en','Pick English → app switches');
ok(v().grid.map(g=>g.label).join('|')==='Pumping|Thaw milk|Thaw food|Rice porridge|Baby biscuits|Other','Home labels in English');
ok(v().logShown[0].title==='Pumping · Left' && v().logShown[1].detail==='90 min · Gran','History re-translated: '+v().logShown[1].title+' / '+v().logShown[1].detail);
ok(/^Last · 2 h ago · Left$/.test(v().lastPumpText),'Home pill: '+v().lastPumpText);
v().grid[0].pick(); v().start(); for(let i=0;i<25;i++) a.tick(); ok(a.state.screen==='side' && v().t.sideTitle==='Pumping done','Pump flow in English');
v().sideBoth(); ok(/Saved · Both · 20 min/.test(v().savedText) && /^in /.test(v().nextInText),'Next screen: '+v().savedText+' / '+v().nextInText);
v().nextYes(); v().grid[3].pick(); ok(v().bigUnit==='min · 3 steps','Porridge: '+v().bigUnit); v().start();
ok(v().steps.map(x=>x.name).join(',')==='Soak rice,Cook,Cool down' && v().endText==='Next: cook','Steps in English');
v().stop(); ok(v().undoText==='Stopped Rice porridge','Undo text: '+v().undoText);
v().openSettings(); v().langOptions[0].pick(); ok(v().undoText==='Đã dừng Nấu cháo' && v().t.homeTitle==='Nhắc mẹ việc gì?','Back to Vietnamese, undo re-translated');
ok(v().langOptions[0].checked==='true' && v().langOptions[1].checked==='false','Radio state correct');
let b=new C({lang:'en'}); a=b; ok(v().t.start==='Start','Tweak "lang: en" starts in English');

}
console.log(failed ? failed + " check(s) failed" : "All checks passed");
process.exit(failed ? 1 : 0);
