const packs=[
 {id:1,title:'Холимог үйлдэл ба тэгшитгэл',grade:5,topic:'Тоо бодлого',count:50,price:25000,color:'purple',symbol:'× ÷'},
 {id:2,title:'Талбай, периметр ба эзлэхүүн',grade:5,topic:'Геометр',count:50,price:25000,color:'green',symbol:'△ □'},
 {id:3,title:'Ахисан түвшний логик сорил',grade:5,topic:'Логик',count:50,price:25000,color:'orange',symbol:'? !'},
 {id:4,title:'Олон үйлдэлт илэрхийлэл',grade:4,topic:'Тоо бодлого',count:50,price:25000,color:'orange',symbol:'× ÷'},
 {id:5,title:'Бутархай ба хэсгийн бодлого',grade:4,topic:'Тоо бодлого',count:50,price:25000,color:'purple',symbol:'½ ¼'},
 {id:6,title:'Хэмжигдэхүүн ба дүрсний бодлого',grade:3,topic:'Геометр',count:50,price:25000,color:'green',symbol:'↔ cm'},
 {id:7,title:'Олон алхамт тоон бодлого',grade:3,topic:'Тоо бодлого',count:50,price:25000,color:'orange',symbol:'+ −'},
 {id:8,title:'Дарааллыг олоорой',grade:3,topic:'Логик',count:50,price:25000,color:'purple',symbol:'1 ? 3'},
 {id:9,title:'Зам, хурд, хугацааны бодлого',grade:5,topic:'Хөдөлгөөн',count:50,price:25000,color:'orange',symbol:'🚗 →'},
 {id:10,title:'Хэрчмийн урт ба хэсгүүд',grade:4,topic:'Хэрчим',count:50,price:25000,color:'green',symbol:'A—B'}
];
let balance=18500;
const transactions=[{name:'Олон оронтой тооны үйлдэл',date:'Өнөөдөр, 18:24',amount:2000},{name:'Урамшуулал авсан',date:'8-р сарын 22',amount:-10000},{name:'Сэтгэх чадварын сорил',date:'8-р сарын 21',amount:1500},{name:'7 өдрийн дарааллын бонус',date:'8-р сарын 20',amount:500}];
const childData={
 'Тэмүүлэн':{time:'38 минут',weekly:'42 бодлого',reward:'6,500₮',bars:[25,42,31,55,46,70,63],skills:[['Тоо бодлого',88],['Геометр',72],['Логик',64]],activities:[['Олон оронтой тоо','Өнөөдөр · 18 минут','9/10'],['Дүрсийн талбай','Өчигдөр · 22 минут','8/10'],['Логикийн сорил','8-р сарын 23 · 16 минут','7/10']]},
 'Ану':{time:'24 минут',weekly:'31 бодлого',reward:'4,200₮',bars:[18,35,22,40,30,52,44],skills:[['Тоо бодлого',78],['Геометр',84],['Логик',70]],activities:[['Нэмэх ба хасах','Өнөөдөр · 14 минут','10/10'],['Урт хэмжих','Өчигдөр · 19 минут','8/10'],['Дараалал','8-р сарын 23 · 12 минут','6/10']]}
};
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const problemVisuals={
  1:{scene:'equation',icons:['🔢','✖️','➗'],label:'Тоо ба тэгшитгэл'},
  2:{scene:'geometry',icons:['📐','🟦','📏'],label:'Дүрс ба талбай'},
  3:{scene:'logic',icons:['🧠','💡','❓'],label:'Логик сорил'},
  4:{scene:'operations',icons:['➕','✖️','🧮'],label:'Олон үйлдэл'},
  5:{scene:'fraction',icons:['🍕','½','¼'],label:'Бутархай хэсэг'},
  6:{scene:'measure',icons:['📏','⏰','📐'],label:'Хэмжигдэхүүн'},
  7:{scene:'story',icons:['🍎','📦','🛒'],label:'Өгүүлбэртэй бодлого'},
  8:{scene:'sequence',icons:['1️⃣','2️⃣','❓'],label:'Тоон дараалал'},
  9:{scene:'motion',icons:['🚗','🛣️','⏱️'],label:'Зам хурд хугацаа'},
  10:{scene:'segment',icons:['📍','📏','📍'],label:'Хэрчмийн урт'}
};
const workedExamples={
  1:{question:'x + 245 = 600. x хэд вэ?',steps:['Үл мэдэгдэх x-ийг ганцааранг нь үлдээнэ.','600-аас 245-ыг хасна: 600 − 245 = 355.','Шалгахдаа 355 + 245 = 600 гэж орлуулна.'],answer:'x = 355'},
  2:{question:'Урт нь 12 см, өргөн нь 5 см тэгш өнцөгтийн талбай хэд вэ?',steps:['Талбайн томьёо: урт × өргөн.','12 × 5 = 60 гэж үржүүлнэ.','Талбай учраас хариуны нэгжийг см² гэж бичнэ.'],answer:'60 см²'},
  3:{question:'3, 6, 12, 24, ? дараагийн тоог олоорой.',steps:['Тоонуудын хоорондын зүй тогтлыг ажиглана.','Тоо бүр өмнөхөөсөө 2 дахин их байна.','24 × 2 = 48 гэж дараагийн тоог олно.'],answer:'48'},
  4:{question:'24 × 3 + 36 ÷ 6 = ?',steps:['Үржих, хуваах үйлдлийг эхэлж бодно.','24 × 3 = 72, мөн 36 ÷ 6 = 6.','Дараа нь 72 + 6 = 78 гэж нэмнэ.'],answer:'78'},
  5:{question:'80-ын 3/4 нь хэд вэ?',steps:['Эхлээд 80-ыг хуваарийн 4-т хуваана: 80 ÷ 4 = 20.','Гарсан 20-ийг хүртвэрийн 3-аар үржүүлнэ.','20 × 3 = 60.'],answer:'60'},
  6:{question:'3 м 45 см нь нийт хэдэн сантиметр вэ?',steps:['1 метр = 100 сантиметр гэдгийг санана.','3 м = 3 × 100 = 300 см.','300 см + 45 см = 345 см.'],answer:'345 см'},
  7:{question:'4 хайрцагт тус бүр 18 алим байв. 15 алимыг өгвөл хэд үлдэх вэ?',steps:['Нийт алимыг олно: 4 × 18 = 72.','Өгсөн 15 алимыг нийтээс хасна.','72 − 15 = 57.'],answer:'57 алим'},
  8:{question:'2, 5, 8, 11, ? дараагийн тоог олоорой.',steps:['Зэрэгцээ тоонуудын зөрөөг олно.','5 − 2 = 3, 8 − 5 = 3 тул алхам нь +3.','11 + 3 = 14.'],answer:'14'},
  9:{question:'Машин цагт 60 км хурдтай 3 цаг явбал хэдэн км зам туулах вэ?',steps:['Зам олох томьёо: зам = хурд × хугацаа.','Хурд 60 км/цаг, хугацаа 3 цаг.','60 × 3 = 180.'],answer:'180 км'},
  10:{question:'AB хэрчим 25 см. AC хэсэг 16 см бол CB хэдэн см вэ?',steps:['Бүтэн AB хэрчим нь AC ба CB хоёр хэсгээс бүрдэнэ.','Дутуу хэсгийг олохын тулд бүтнээс мэдэгдэж буй хэсгийг хасна.','25 − 16 = 9.'],answer:'9 см'}
};
function problemIllustration(pack,compact=false){let v=problemVisuals[pack.id];return `<div class="problem-illustration ${v.scene} ${compact?'compact':''}" role="img" aria-label="${v.label}"><span>${v.icons[0]}</span><span>${v.icons[1]}</span><span>${v.icons[2]}</span><i></i></div>`}
function packCard(p){return `<article class="pack-card" data-grade="${p.grade}" data-topic="${p.topic}"><div class="pack-top ${p.color}">${problemIllustration(p)}<span class="grade-pill">${p.grade}-Р АНГИ</span><span class="pack-reward-badge">🏆 ${p.price.toLocaleString()}₮ АВНА</span></div><div class="pack-body"><small>${p.topic.toUpperCase()} · ${p.count} БОДЛОГО</small><h3>${p.title}</h3><button class="example-btn" data-example="${p.id}">💡 Жишээгээр сурах</button><div class="pack-footer"><div><small>ДУУСГААД АВАХ</small><b>${p.price.toLocaleString()}₮</b></div><button data-start="${p.id}">Шагналаа авах →</button></div></div></article>`}
$('#homePacks').innerHTML=packs.slice(1,4).map(packCard).join(''); $('#packList').innerHTML=packs.map(packCard).join('');
function navigate(id){$$('.page').forEach(p=>p.classList.toggle('active',p.id===id)); $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===id)); $('.sidebar').classList.remove('open'); window.scrollTo({top:0,behavior:'smooth'})}
$$('[data-page], [data-page-link]').forEach(b=>b.addEventListener('click',()=>navigate(b.dataset.page||b.dataset.pageLink)));
$('#menuBtn').onclick=()=>$('.sidebar').classList.toggle('open'); $('#profileBtn').onclick=()=>navigate('settings');
$$('.role').forEach(btn=>btn.onclick=()=>{$$('.role').forEach(x=>x.classList.remove('active'));btn.classList.add('active');let parent=btn.dataset.role==='parent';$('#childView').hidden=parent;$('#parentView').hidden=!parent;$('.sidebar').style.display=parent?'none':'';$('.main').style.marginLeft=parent?'0':'';});
$$('.grade-tabs button').forEach(btn=>btn.onclick=()=>{$$('.grade-tabs button').forEach(x=>x.classList.remove('active'));btn.classList.add('active');filterPacks()}); $('#topicFilter').onchange=filterPacks;
function filterPacks(){let g=$('.grade-tabs .active').dataset.grade,t=$('#topicFilter').value;$$('#packList .pack-card').forEach(c=>c.style.display=(g==='all'||c.dataset.grade===g)&&(t==='all'||c.dataset.topic===t)?'':'none')}
function renderChart(el,vals){el.innerHTML=vals.map((v,i)=>`<div class="bar-col ${i===6?'today':''}"><i style="height:${v}%"></i><small>${['Дав','Мяг','Лха','Пүр','Баа','Бям','Ням'][i]}</small></div>`).join('')}
renderChart($('#childChart'),[30,48,35,66,55,82,70]); renderChart($('#parentChart'),childData.Тэмүүлэн.bars);
function renderParent(name){let d=childData[name];$('#todayTime').textContent=d.time;$('#weeklyProblems').textContent=d.weekly;$('#parentReward').textContent=d.reward;renderChart($('#parentChart'),d.bars);$('#skillList').innerHTML=d.skills.map(s=>`<div class="skill-row"><header><span>${s[0]}</span><b>${s[1]}%</b></header><div class="progress"><i style="width:${s[1]}%"></i></div></div>`).join('');$('#activityList').innerHTML=d.activities.map((a,i)=>`<div class="activity"><div class="subject-icon">${['123','△','?'][i]}</div><div><b>${a[0]}</b><small>${a[1]}</small></div><span class="score">${a[2]}</span></div>`).join('')}
renderParent('Тэмүүлэн');
$$('#childTabs [data-child]').forEach(b=>b.onclick=()=>{$$('#childTabs [data-child]').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderParent(b.dataset.child)});
function renderTransactions(){$('#transactions').innerHTML=transactions.map(t=>`<div class="transaction"><span>${t.amount>0?'＋':'−'}</span><div><b>${t.name}</b><small>${t.date}</small></div><b class="${t.amount<0?'negative':''}">${t.amount>0?'+':''}${t.amount.toLocaleString()}₮</b></div>`).join('')}renderTransactions();
document.addEventListener('click',e=>{let example=e.target.closest('[data-example]');if(example){showWorkedExample(packs.find(p=>p.id===+example.dataset.example));return}let b=e.target.closest('[data-start]');if(b)openQuestion(packs.find(p=>p.id===+b.dataset.start))});
function showWorkedExample(pack){let example=workedExamples[pack.id];$('#modalContent').innerHTML=`<section class="worked-example">${problemIllustration(pack,true)}<p class="eyebrow">${pack.grade}-Р АНГИ · ${pack.topic.toUpperCase()}</p><h2>Жишээгээр хамтдаа бодъё</h2><div class="example-question"><span>ЖИШЭЭ БОДЛОГО</span><strong>${example.question}</strong></div><div class="example-steps"><h3>Хэрхэн бодох вэ?</h3>${example.steps.map((step,i)=>`<div><b>${i+1}</b><p>${step}</p></div>`).join('')}</div><div class="example-answer"><span>✓ ХАРИУ</span><strong>${example.answer}</strong></div><button class="primary" data-start="${pack.id}">Одоо өөрөө бодох →</button></section>`;$('#modal').hidden=false}
const questionBanks={
  3:[{text:'368 + 457 − 129 = ?',answer:696},{text:'900 − 275 + 148 = ?',answer:773},{text:'125 + 8 × 6 = ?',answer:173},{text:'720 ÷ 8 + 235 = ?',answer:325},{text:'4 хайрцагт тус бүр 28 алим байв. 35-ыг зарвал хэд үлдэх вэ?',answer:77},{text:'1,000 − 9 × 47 = ?',answer:577},{text:'3 м 45 см нь нийт хэдэн см вэ?',answer:345},{text:'Тал нь 14 см квадратын периметр хэд вэ?',answer:56},{text:'4, 8, 16, 32, ? дараагийн тоо',answer:64},{text:'1, 3, 6, 10, 15, ? дараагийн тоо',answer:21}],
  4:[{text:'36 × 8 − 144 ÷ 6 = ?',answer:264},{text:'(425 − 197) × 3 = ?',answer:684},{text:'960 ÷ 8 + 45 × 4 = ?',answer:300},{text:'1,500 − (78 × 9) = ?',answer:798},{text:'64 × 7 + 432 ÷ 9 = ?',answer:496},{text:'80-ын 3/4 нь хэд вэ?',answer:60},{text:'Тооны 2/5 нь 36 бол уг тоо хэд вэ?',answer:90},{text:'240-ийн 3/8 нь хэд вэ?',answer:90},{text:'3, 7, 13, 21, 31, ? дараагийн тоо',answer:43},{text:'Гурван дараалсан тооны нийлбэр 45 бол их тоо хэд вэ?',answer:16}],
  5:[{text:'(840 ÷ 7) + 365 = ?',answer:485},{text:'125 × 8 − 375 = ?',answer:625},{text:'2,400 ÷ (6 × 8) = ?',answer:50},{text:'x + 458 = 1,205. x = ?',answer:747},{text:'3 × (240 − 85) = ?',answer:465},{text:'Урт 18 см, өргөн 13 см тэгш өнцөгтийн талбай хэд вэ?',answer:234},{text:'Суурь 20 см, өндөр 13 см гурвалжны талбай хэд вэ?',answer:130},{text:'Ирмэг нь 6 см кубын эзлэхүүн хэд вэ?',answer:216},{text:'2, 6, 12, 20, 30, ? дараагийн тоо',answer:42},{text:'Хоёр тооны нийлбэр 84, ялгавар 18 бол их тоо хэд вэ?',answer:51}]
};
let questions=questionBanks[5];
function buildQuestionBank(pack){
 const list=[];
 for(let i=1;i<=50;i++){
  let text,answer,a,b,c;
  if(pack.id===1){a=120+i*13;b=4+i%7;c=35+i*5;if(i%2){text=`(${a*b} ÷ ${b}) + ${c} = ?`;answer=a+c}else{text=`x + ${a+c} = ${a+c+b*25}. x = ?`;answer=b*25}}
  else if(pack.id===2){a=8+i;b=5+i%12;if(i%3===1){text=`Урт ${a} см, өргөн ${b} см тэгш өнцөгтийн талбай хэд вэ?`;answer=a*b}else if(i%3===2){text=`Урт ${a} см, өргөн ${b} см тэгш өнцөгтийн периметр хэд вэ?`;answer=2*(a+b)}else{text=`Ирмэг нь ${b} см кубын эзлэхүүн хэд вэ?`;answer=b*b*b}}
  else if(pack.id===3){a=2+i%6;b=i+2;if(i%3===1){text=`${b}, ${b+a}, ${b+a*2}, ${b+a*3}, ? дараагийн тоо`;answer=b+a*4}else if(i%3===2){text=`Гурван дараалсан тооны нийлбэр ${(i+10)*3} бол их тоо хэд вэ?`;answer=i+11}else{text=`${i+2}, ${(i+2)*2}, ${(i+2)*4}, ${(i+2)*8}, ? дараагийн тоо`;answer=(i+2)*16}}
  else if(pack.id===4){a=20+i;b=3+i%7;c=12+i;if(i%2){text=`${a} × ${b} + ${c*4} ÷ 4 = ?`;answer=a*b+c}else{text=`(${a+c} − ${c}) × ${b} = ?`;answer=a*b}}
  else if(pack.id===5){const den=[2,3,4,5,6,8,10][i%7],num=1+(i%(den-1)),whole=den*(10+i);if(i%2){text=`${whole}-ын ${num}/${den} нь хэд вэ?`;answer=whole*num/den}else{text=`Тооны 1/${den} нь ${10+i} бол уг тоо хэд вэ?`;answer=(10+i)*den}}
  else if(pack.id===6){a=2+i%8;b=10+(i*7)%90;if(i%3===1){text=`${a} м ${b} см нь нийт хэдэн см вэ?`;answer=a*100+b}else if(i%3===2){text=`Тал нь ${a+b} см квадратын периметр хэд вэ?`;answer=(a+b)*4}else{text=`${a} цаг ${b%60} минут нь нийт хэдэн минут вэ?`;answer=a*60+b%60}}
  else if(pack.id===7){a=100+i*9;b=30+i*3;c=15+i;if(i%2){text=`${a} + ${b} − ${c} = ?`;answer=a+b-c}else{text=`${i+5} хайрцагт тус бүр ${b} алим байв. ${c} алим өгвөл хэд үлдэх вэ?`;answer=(i+5)*b-c}}
  else if(pack.id===8){a=2+i%7;b=1+i;if(i%3===1){text=`${b}, ${b+a}, ${b+a*2}, ${b+a*3}, ? дараагийн тоо`;answer=b+a*4}else if(i%3===2){text=`${a}, ${a*2}, ${a*4}, ${a*8}, ? дараагийн тоо`;answer=a*16}else{text=`${b}, ${b+2}, ${b+5}, ${b+9}, ? дараагийн тоо`;answer=b+14}}
  else if(pack.id===9){let speed=30+(i%7)*5,time=2+(i%4),distance=speed*time;if(i%3===1){text=`Машин цагт ${speed} км хурдтай ${time} цаг явжээ. Нийт хэдэн км зам туулсан бэ?`;answer=distance}else if(i%3===2){text=`Автобус ${distance} км замыг ${time} цагт туулсан бол цагт хэдэн км хурдтай явсан бэ?`;answer=speed}else{text=`Дугуйчин цагт ${speed} км хурдтай явж ${distance} км зам туулжээ. Хэдэн цаг явсан бэ?`;answer=time}}
  else{let first=15+i,second=8+i%12,total=first+second;if(i%3===1){text=`AB хэрчим ${total} см. AC хэсэг нь ${first} см бол CB хэсэг хэдэн см вэ?`;answer=second}else if(i%3===2){text=`Нэг хэрчим ${first} см, нөгөө нь түүнээс ${second} см урт. Хоёр дахь хэрчим хэдэн см вэ?`;answer=total}else{text=`${total*2} см урт хэрчмийг 2 тэнцүү хэсэгт хуваав. Нэг хэсэг нь хэдэн см вэ?`;answer=total}}
  list.push({text,answer});
 }
 return list;
}
let solverState={pack:null,correct:0,wrong:0,checked:false};
function openQuestion(p){$('#modal').hidden=true;questions=buildQuestionBank(p);solverState={pack:p,correct:0,wrong:0,checked:false};$('#solverTitle').textContent=p.title;$('#solverMeta').textContent=`${p.topic.toUpperCase()} · ${p.grade}-Р АНГИ`;$('#solverReward').textContent=p.price.toLocaleString()+'₮';renderQuestionList();navigate('solver');setTimeout(()=>$('.batch-answer input').focus(),250)}
function renderQuestionList(){$('#questionList').innerHTML=questions.map((q,i)=>`<article class="batch-question" data-question="${i}"><span class="batch-number">${String(i+1).padStart(2,'0')}</span>${problemIllustration(solverState.pack,true)}<h3>${q.text}</h3><label class="batch-answer"><input type="number" inputmode="numeric" placeholder="Хариу" aria-label="${i+1}-р бодлогын хариу"><small>Хариугаа бичээрэй</small></label></article>`).join('');$('#solverCount').textContent=`Нийт ${questions.length} бодлого`;$('#solverPercent').textContent=`0 / ${questions.length} бөглөсөн`;$('#solverProgressBar').style.width='0%';$('#correctCount').textContent='0';$('#wrongCount').textContent='0';$('#checkAllAnswers').textContent='Бүх хариуг шалгах →';$$('.batch-answer input').forEach(input=>input.addEventListener('input',updateFilledProgress))}
function updateFilledProgress(){let inputs=[...$$('.batch-answer input')],filled=inputs.filter(i=>i.value!=='').length;$('#solverPercent').textContent=`${filled} / ${questions.length} бөглөсөн`;$('#solverProgressBar').style.width=`${filled/questions.length*100}%`}
function checkAllAnswers(){let inputs=[...$$('.batch-answer input')],empty=inputs.find(i=>i.value==='');if(empty){showToast('Бүх бодлогын хариуг бөглөөрэй');empty.focus();return}if(solverState.checked){navigate('progress');return}solverState.checked=true;solverState.correct=0;solverState.wrong=0;inputs.forEach((input,i)=>{let card=input.closest('.batch-question'),hint=card.querySelector('small'),correct=Number(input.value)===questions[i].answer;card.classList.add(correct?'correct':'wrong');hint.textContent=correct?'Зөв байна! +500₮':`Зөв хариу: ${questions[i].answer}`;if(correct){solverState.correct++;balance+=500}else solverState.wrong++;input.disabled=true});$('#correctCount').textContent=solverState.correct;$('#wrongCount').textContent=solverState.wrong;$('#checkAllAnswers').textContent='Ахиц харах →';updateBalance();showToast(`${solverState.correct}/${questions.length} зөв — +${solverState.correct*500}₮`)}
function clearAllAnswers(){if(solverState.checked){renderQuestionList();solverState.checked=false;solverState.correct=0;solverState.wrong=0}else{$$('.batch-answer input').forEach(i=>i.value='');updateFilledProgress()}setTimeout(()=>$('.batch-answer input').focus(),50)}
$('#checkAllAnswers').onclick=checkAllAnswers;$('#clearAnswers').onclick=clearAllAnswers;$('#backToProblems').onclick=()=>navigate('problems');
$('#closeModal').onclick=()=>$('#modal').hidden=true;$('#modal').onclick=e=>{if(e.target===$('#modal'))$('#modal').hidden=true};
function updateBalance(){$('#balanceValue').textContent=balance.toLocaleString()+'₮';$('#rewardBalance').textContent=balance.toLocaleString()+'₮'}
function showToast(t){let el=$('#toast');el.textContent=t;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2400)}
$('#withdrawBtn').onclick=()=>{if(balance<5000)return showToast('Доод хэмжээ 5,000₮');$('#modalContent').innerHTML=`<div class="question-box"><span class="q-num">УРАМШУУЛАЛ АВАХ</span><h2>${balance.toLocaleString()}₮</h2><p>Эцэг эхийн баталгаажуулсан данс руу шилжүүлэх хүсэлт илгээх үү?</p><button class="primary" id="confirmWithdraw">Хүсэлт илгээх</button></div>`;$('#modal').hidden=false;$('#confirmWithdraw').onclick=()=>{$('#modal').hidden=true;showToast('Хүсэлт амжилттай илгээгдлээ')}};
$('#darkToggle').onchange=e=>document.body.classList.toggle('dark',e.target.checked);
function addChild(){showToast('Нэг бүртгэлд хамгийн ихдээ 3 хүүхэд нэмнэ')};$('#addChildBtn').onclick=addChild;$('#addSlot').onclick=addChild;

// Phone number + OTP sign in prototype
const otpInputs=[...$$('#otpFields input')];
function cleanPhone(){return $('#phoneInput').value.replace(/\D/g,'')}
$('#phoneInput').addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(0,8);$('.phone-field').classList.remove('invalid')});
$('#sendCodeBtn').onclick=()=>{let phone=cleanPhone();if(phone.length!==8){$('.phone-field').classList.add('invalid');$('#phoneInput').focus();return}$('#maskedPhone').textContent=`+976 ${phone.slice(0,2)}•• ••${phone.slice(-2)}`;$('#phoneStep').hidden=true;$('#codeStep').hidden=false;otpInputs.forEach(i=>i.value='');$('#otpFields').classList.remove('invalid');$('#otpError').textContent='';otpInputs[0].focus()};
otpInputs.forEach((input,index)=>{input.addEventListener('input',e=>{e.target.value=e.target.value.replace(/\D/g,'').slice(-1);$('#otpFields').classList.remove('invalid');$('#otpError').textContent='';if(e.target.value&&index<otpInputs.length-1)otpInputs[index+1].focus()});input.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!input.value&&index>0)otpInputs[index-1].focus()});input.addEventListener('paste',e=>{e.preventDefault();let code=e.clipboardData.getData('text').replace(/\D/g,'').slice(0,4);code.split('').forEach((n,i)=>otpInputs[i].value=n);otpInputs[Math.min(code.length,3)].focus()})});
$('#verifyCodeBtn').onclick=()=>{let code=otpInputs.map(i=>i.value).join('');if(code!=='1234'){$('#otpFields').classList.add('invalid');$('#otpError').textContent=code.length<4?'4 оронтой кодоо бүрэн оруулна уу.':'Код буруу байна. Дахин шалгана уу.';return}$('#authScreen').classList.add('auth-success');setTimeout(()=>{$('#authScreen').hidden=true;$('#appShell').hidden=false;window.scrollTo(0,0)},430)};
$('#backToPhone').onclick=()=>{$('#codeStep').hidden=true;$('#phoneStep').hidden=false;$('#phoneInput').focus()};
$('#resendCodeBtn').onclick=()=>{otpInputs.forEach(i=>i.value='');$('#otpError').textContent='Шинэ код илгээгдлээ.';$('#otpError').style.color='#46a783';setTimeout(()=>$('#otpError').style.color='',1800);otpInputs[0].focus()};

// 10-question onboarding survey shown before phone sign in
const surveyQuestions=[
 {q:'Та Okay-г хаанаас сонссон бэ?',d:'Танд илүү тохирсон суралцах туршлага бэлдэхэд тусална.',options:[['📱','Сошиал медиа'],['👨‍👩‍👧','Найз, гэр бүлээс'],['🏫','Сургууль, багшаас'],['🔎','Интернэт хайлтаас']]},
 {q:'Хүүхэд тань хэддүгээр ангид сурдаг вэ?',d:'Ангид нь тохирсон бодлогыг санал болгоно.',options:[['3','3-р анги'],['4','4-р анги'],['5','5-р анги']]},
 {q:'Okay-г хэн ашиглах вэ?',d:'Тохирох профайлыг автоматаар бэлдье.',options:[['🧒','Миний хүүхэд'],['👧','Би өөрөө'],['👨‍👩‍👧','Хэд хэдэн хүүхэд']]},
 {q:'Математикийн одоогийн түвшин ямар вэ?',d:'Хэт амархан эсвэл хэт хүнд бодлого санал болгохгүй.',options:[['🌱','Дэмжлэг хэрэгтэй'],['🙂','Дунд зэрэг'],['🚀','Сайн, ахисан']]},
 {q:'Аль төрлийн бодлогод илүү дуртай вэ?',d:'Дуртай сэдвийг нүүр хэсэгт түрүүлж харуулна.',options:[['🔢','Тоо, үйлдэл'],['📐','Геометр'],['🧩','Логик, сэтгэх чадвар'],['✨','Бүгдэд нь']]},
 {q:'Гол зорилго нь юу вэ?',d:'Зорилгод тохирсон ахицын хэмжүүр сонгоно.',options:[['📈','Дүнгээ сайжруулах'],['🧠','Сэтгэх чадвараа хөгжүүлэх'],['🏆','Олимпиадад бэлдэх'],['🔥','Өдөр бүр давтах']]},
 {q:'Өдөрт хэдэн минут суралцахад тохиромжтой вэ?',d:'Өдөр тутмын зорилгыг үүгээр тохируулна.',options:[['15','15 минут'],['30','30 минут'],['45','45 минут'],['60','60 минут']]},
 {q:'Хэзээ бодлого бодох нь тохиромжтой вэ?',d:'Сонгосон үед нь зөөлөн сануулга өгч болно.',options:[['☀️','Өглөө'],['🏫','Хичээлийн дараа'],['🌙','Орой'],['🗓','Тогтсон цаггүй']]},
 {q:'Ямар урамшуулал хамгийн их сонирхолтой вэ?',d:'Хүүхдийг урамшуулах хэлбэрийг тохируулъя.',options:[['💰','Мөнгөн урамшуулал'],['⭐','Оноо, тэмдэг'],['🎁','Бэлэг, эрх'],['🎉','Бүгд']]},
 {q:'Ахицын мэдээллийг хэр ойр харах вэ?',d:'Эцэг эхийн тайлангийн давтамжийг сонгоно.',options:[['📅','Өдөр бүр'],['📊','7 хоног бүр'],['🗓','Сар бүр'],['🔕','Хүссэн үедээ']]}
];
let surveyIndex=0;const surveyAnswers=[];
function renderSurvey(){let item=surveyQuestions[surveyIndex],step=$('#surveyStep');$('#surveyCounter').textContent=`${surveyIndex+1} / ${surveyQuestions.length}`;$('#surveyProgressBar').style.width=`${(surveyIndex+1)/surveyQuestions.length*100}%`;$('#surveyQuestion').textContent=item.q;$('#surveyDescription').textContent=item.d;$('#surveyOptions').innerHTML=item.options.map((o,i)=>`<button class="survey-option" data-option="${i}"><span>${o[0]}</span>${o[1]}</button>`).join('');$('#surveyNext').disabled=true;$('#surveyNext').innerHTML=surveyIndex===surveyQuestions.length-1?'Асуулга дуусгах <span>✓</span>':'Үргэлжлүүлэх <span>→</span>';step.classList.remove('survey-fade');void step.offsetWidth;step.classList.add('survey-fade');$$('.survey-option').forEach(btn=>btn.onclick=()=>{$$('.survey-option').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');surveyAnswers[surveyIndex]=item.options[+btn.dataset.option][1];$('#surveyNext').disabled=false})}
function finishSurvey(){$('#surveyStep').hidden=true;$('#phoneStep').hidden=false;$('#phoneInput').focus()}
$('#surveyNext').onclick=()=>{if(surveyAnswers[surveyIndex]===undefined)return;if(surveyIndex<surveyQuestions.length-1){surveyIndex++;renderSurvey()}else finishSurvey()};$('#skipSurvey').onclick=finishSurvey;renderSurvey();
