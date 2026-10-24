const $ = (id) => document.getElementById(id);

const lessons = {
  contabilidad: {
    title: "Fundamentos de contabilidad",
    text: "La contabilidad registra y organiza las operaciones económicas para ayudar a comprender la situación de una persona o empresa. Tres conceptos básicos son activos, pasivos y patrimonio.",
    example: "Ejemplo: si una tienda tiene C$20,000 en efectivo y una computadora de C$10,000, sus activos suman C$30,000. Si debe C$8,000, el patrimonio contable sería C$22,000, suponiendo que no hay otros activos o pasivos."
  },
  finanzas: {
    title: "Finanzas personales",
    text: "Un presupuesto compara el dinero que recibes con el que gastas. Te ayuda a planificar necesidades, establecer metas de ahorro y reconocer gastos que puedes ajustar.",
    example: "Ejemplo: si recibes C$8,000 al mes y gastas C$6,500, quedan C$1,500 antes de considerar otros gastos no registrados. Ese saldo puede destinarse a ahorro o metas."
  },
  ia: {
    title: "Tecnología e inteligencia artificial",
    text: "La IA puede apoyar tareas como clasificar documentos, detectar operaciones inusuales y resumir grandes volúmenes de información. Las personas profesionales deben revisar los resultados, proteger los datos y aplicar su criterio.",
    example: "Ejemplo: un sistema puede señalar una factura que parece duplicada. El contador debe verificarla antes de tomar una decisión; una alerta no demuestra por sí sola que exista fraude."
  }
};
document.querySelectorAll("[data-topic]").forEach(btn => btn.addEventListener("click", () => {
  const lesson = lessons[btn.dataset.topic];
  $("lessonTitle").textContent = lesson.title;
  $("lessonText").textContent = lesson.text;
  $("lessonExample").textContent = lesson.example;
  $("lessonPanel").hidden = false;
  $("lessonPanel").scrollIntoView({behavior:"smooth", block:"nearest"});
}));
$("closeLesson").addEventListener("click", () => $("lessonPanel").hidden = true);

const knowledge = [
  {keys:["activo","activos"], answer:"Un activo es un recurso que una persona o empresa posee o controla y del que espera obtener beneficios. Ejemplos: efectivo, inventario, computadoras y vehículos.\n\nEjemplo: C$10,000 en caja + una computadora de C$15,000 = C$25,000 en activos, si no hay otros recursos que incluir."},
  {keys:["pasivo","pasivos","deuda","deudas"], answer:"Un pasivo es una obligación o deuda que una persona o empresa debe pagar. Ejemplos: un préstamo, una factura pendiente o dinero que se debe a un proveedor.\n\nPista: activo = recursos; pasivo = obligaciones."},
  {keys:["patrimonio","capital"], answer:"El patrimonio representa la parte residual de los activos después de restar los pasivos.\n\nFórmula básica: Patrimonio = Activos − Pasivos.\nEjemplo: activos de C$30,000 − pasivos de C$8,000 = patrimonio de C$22,000."},
  {keys:["utilidad","ganancia","beneficio","pérdida","perdida"], answer:"Para obtener una utilidad o pérdida sencilla, resta los gastos y costos de los ingresos.\n\nFórmula: Resultado = Ingresos − Gastos − Otros costos.\nEjemplo: C$50,000 − C$30,000 − C$5,000 = C$15,000 de resultado positivo. Si el resultado es negativo, existe pérdida en este cálculo."},
  {keys:["presupuesto","presupuestar"], answer:"Un presupuesto es un plan para organizar los ingresos y gastos durante un periodo. Anota cuánto dinero esperas recibir, separa gastos necesarios y opcionales, y revisa el saldo.\n\nEjemplo: si ingresan C$8,000 y gastas C$6,500, el saldo es C$1,500."},
  {keys:["ahorro","ahorrar"], answer:"Ahorrar es reservar una parte del dinero para una meta futura o para imprevistos. Una estrategia útil es definir una meta realista, registrar gastos y apartar una cantidad cuando recibas tus ingresos."},
  {keys:["ingreso","ingresos"], answer:"Los ingresos son entradas de dinero o recursos que recibe una persona o empresa. En un negocio pueden provenir de ventas o servicios. No confundas ingresos con utilidad: la utilidad considera también los gastos y costos."},
  {keys:["gasto","gastos","costo","costos"], answer:"Los gastos y costos son recursos consumidos para vivir o realizar una actividad económica. En el simulador de esta página puedes introducir ingresos, gastos y otros costos para ver el resultado estimado."},
  {keys:["inteligencia artificial"," ia ","machine learning","automatización","automatizacion","big data"], answer:"La inteligencia artificial puede apoyar la contabilidad automatizando tareas, ayudando a analizar datos y señalando patrones inusuales. No sustituye la revisión profesional: los resultados pueden contener errores y deben verificarse. También se deben proteger los datos financieros."},
  {keys:["contador","contabilidad","contable"], answer:"La contabilidad organiza información económica para ayudar a conocer la situación de una persona o empresa. Un contador puede registrar operaciones, preparar informes, revisar documentos y apoyar decisiones. Además de conocimientos técnicos, necesita ética, pensamiento crítico y habilidades digitales."},
  {keys:["ecuación contable","ecuacion contable"], answer:"La ecuación contable básica es: Activos = Pasivos + Patrimonio. Expresa que los recursos de una entidad se financian mediante obligaciones y patrimonio."},
  {keys:["hola","buenas","buenos días","buenos dias"], answer:"¡Hola! 😊 ¿Qué tema querés aprender hoy? Puedo explicarte activos, pasivos, patrimonio, ingresos, gastos, presupuestos o el uso de IA en contabilidad."}
];
function getTutorAnswer(raw) {
  const q = " " + raw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[¿?¡!,.:;]/g," ") + " ";
  for (const item of knowledge) if (item.keys.some(k => q.includes(" " + k.normalize("NFD").replace(/[\u0300-\u036f]/g,"") + " ") || q.includes(k.normalize("NFD").replace(/[\u0300-\u036f]/g,"")))) return item.answer;
  if (q.includes("ejercicio") || q.includes("practica")) return "¡Vamos a practicar! Una empresa tiene C$12,000 en efectivo y equipo por C$8,000. ¿Cuánto suman sus activos? Pista: suma los recursos. Escribe tu respuesta y te ayudaré a revisarla.";
  return "Todavía no tengo una explicación específica para esa pregunta en mi base educativa. Probá preguntarme por activos, pasivos, patrimonio, utilidad, presupuesto, ahorro o inteligencia artificial aplicada a la contabilidad. Esta versión no consulta Internet ni utiliza una API externa.";
}
function addMessage(text, who) {
  const row = document.createElement("div"); row.className = `message ${who}`;
  const avatar = document.createElement("div"); avatar.className = "message-avatar"; avatar.textContent = who === "bot" ? "✦" : "Tú";
  const bubble = document.createElement("div"); bubble.className = "bubble"; bubble.textContent = text;
  row.append(avatar,bubble); $("chatMessages").appendChild(row);
  if (typeof window.renderMathInElement === "function") {
    window.renderMathInElement(bubble, {
      throwOnError: false,
      strict: "ignore"
    });
  }
  $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
}
function sendChat(text) {
  const clean = text.trim(); if (!clean) return;
  document.querySelector(".quick-prompts")?.remove();
  addMessage(clean,"user"); addMessage(getTutorAnswer(clean),"bot");
}
$("chatForm").addEventListener("submit", e => {e.preventDefault(); window.sendChat($("chatInput").value); $("chatInput").value="";});
document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => window.sendChat(b.dataset.prompt)));
$("clearChat").addEventListener("click", () => {
  $("chatMessages").innerHTML = '<div class="message bot"><div class="message-avatar">✦</div><div class="bubble">¡Hola de nuevo! Preguntame sobre activos, pasivos, patrimonio, presupuesto o inteligencia artificial en la contabilidad.</div></div>';
});

const questions = [
 {q:"¿Cuál de estos elementos es un activo?", options:["Un préstamo pendiente","Dinero en caja","Una factura por pagar","Una deuda con un proveedor"], correct:1, why:"El dinero en caja es un recurso disponible, por lo tanto se clasifica como activo."},
 {q:"¿Qué representa un pasivo?", options:["Una obligación o deuda","El dinero ahorrado únicamente","Los ingresos por ventas","El total de bienes propios"], correct:0, why:"Los pasivos son obligaciones que una persona o empresa debe cumplir."},
 {q:"Una empresa tiene activos de C$40,000 y pasivos de C$15,000. ¿Cuál es su patrimonio?", options:["C$55,000","C$15,000","C$25,000","C$40,000"], correct:2, why:"Patrimonio = Activos − Pasivos = C$40,000 − C$15,000 = C$25,000."},
 {q:"¿Qué permite hacer un presupuesto?", options:["Eliminar todas las obligaciones","Organizar ingresos y gastos","Garantizar ganancias","Evitar registrar operaciones"], correct:1, why:"El presupuesto permite planificar y comparar ingresos con gastos."},
 {q:"¿Cuál es una práctica responsable al usar IA en contabilidad?", options:["Aceptar siempre sus respuestas","Compartir datos confidenciales sin permiso","Verificar los resultados y proteger los datos","Dejar todas las decisiones a la IA"], correct:2, why:"La IA puede equivocarse; sus resultados deben revisarse y los datos deben protegerse."}
];
let quizIndex=0, quizScore=0, quizAnswered=false;
function renderQuestion(){
 const q=questions[quizIndex]; $("quizCounter").textContent=`PREGUNTA ${quizIndex+1} DE ${questions.length}`;
 $("quizScore").textContent=quizScore; $("quizProgress").style.width=`${((quizIndex+1)/questions.length)*100}%`;
 $("quizQuestion").textContent=q.q; $("quizOptions").innerHTML=""; $("quizFeedback").textContent=""; $("nextQuestion").disabled=true; quizAnswered=false;
 q.options.forEach((opt,i)=>{const b=document.createElement("button");b.className="quiz-option";b.textContent=String.fromCharCode(65+i)+". "+opt;b.addEventListener("click",()=>answerQuestion(i));$("quizOptions").appendChild(b);});
}
function answerQuestion(selected){
 if(quizAnswered)return; quizAnswered=true; const q=questions[quizIndex]; const buttons=[...$("quizOptions").children];
 buttons.forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add("correct");else if(i===selected)b.classList.add("incorrect");});
 if(selected===q.correct){quizScore++;$("quizFeedback").textContent="¡Correcto! "+q.why;}else $("quizFeedback").textContent="No exactamente. "+q.why;
 $("quizScore").textContent=quizScore; $("nextQuestion").disabled=false; $("nextQuestion").textContent=quizIndex===questions.length-1?"Ver resultado →":"Siguiente →";
}
$("nextQuestion").addEventListener("click",()=>{if(!quizAnswered)return;if(quizIndex<questions.length-1){quizIndex++;renderQuestion();}else{$("quizQuestion").textContent=`¡Terminaste! Tu puntuación es ${quizScore} de ${questions.length}.`; $("quizOptions").innerHTML=""; $("quizFeedback").textContent=quizScore>=4?"¡Excelente trabajo! Sigue practicando.":"Buen comienzo. Revisa las explicaciones y vuelve a intentarlo."; $("quizCounter").textContent="EVALUACIÓN COMPLETADA";$("nextQuestion").disabled=true;$("nextQuestion").textContent="Completado";}});
$("restartQuiz").addEventListener("click",()=>{quizIndex=0;quizScore=0;renderQuestion();$("nextQuestion").textContent="Siguiente →";});
renderQuestion();

function money(n){return new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO",minimumFractionDigits:2}).format(n);}
function calculate(){
 const income=Math.max(0,Number($("income").value)||0), expenses=Math.max(0,Number($("expenses").value)||0), costs=Math.max(0,Number($("otherCosts").value)||0);
 const profit=income-expenses-costs, margin=income>0?(profit/income)*100:0;
 $("profit").textContent=money(profit); $("margin").textContent=margin.toFixed(1)+"%";
 $("profitStatus").textContent=profit>0?"Superávit":profit<0?"Déficit":"Equilibrio";
 $("profitStatus").className=profit<0?"negative":"positive";
 $("simExplanation").textContent=profit>0?"Tus ingresos superan los gastos y costos registrados. Revisa si conviene reservar parte del saldo para ahorro, imprevistos o reinversión. Este cálculo no contempla todos los posibles impuestos ni obligaciones.":profit<0?"Los gastos y costos superan los ingresos. Revisa los datos registrados y analiza qué partidas podrían ajustarse. No tomes decisiones solo con este cálculo simplificado.":"Los ingresos son iguales a los gastos y costos registrados. No hay excedente en este cálculo simplificado.";
}
$("calculate").addEventListener("click",calculate);["income","expenses","otherCosts"].forEach(id=>$(id).addEventListener("input",calculate));calculate();

const careerQs=[
 {q:"¿Qué actividad te interesa más?",opts:["Organizar números y registros","Crear diseños y contenido","Investigar cómo funcionan las empresas"],scores:[2,0,2]},
 {q:"¿Cómo te sentís al resolver problemas paso a paso?",opts:["Me gusta analizar y encontrar respuestas","Prefiero actividades más espontáneas","Depende del tema"],scores:[2,0,1]},
 {q:"¿Te gustaría aprender herramientas digitales para analizar información?",opts:["Sí, me interesa","No es una prioridad para mí","Quiero conocerlas antes de decidir"],scores:[2,0,1]}
];
let careerIndex=0, careerScore=0;
function showCareerQuestion(){
 const q=careerQs[careerIndex];$("careerQuestion").textContent=`${careerIndex+1}. ${q.q}`;$("careerOptions").innerHTML="";
 q.opts.forEach((opt,i)=>{const b=document.createElement("button");b.textContent=opt;b.addEventListener("click",()=>{careerScore+=q.scores[i];careerIndex++;if(careerIndex<careerQs.length)showCareerQuestion();else showCareerResult();});$("careerOptions").appendChild(b);});
}
function showCareerResult(){
 $("careerQuestion").textContent="Tu exploración de intereses";$("careerOptions").innerHTML="";$("careerResult").hidden=false;
 const result=careerScore>=5?"Tus respuestas muestran afinidad con algunas actividades relacionadas con Contabilidad y Finanzas, como organizar información, analizar datos y utilizar herramientas digitales.":"Tus respuestas muestran que aún puedes explorar distintas áreas. Te recomendamos conocer más sobre Contabilidad, Administración, Economía y otras carreras antes de decidir.";
 $("careerResult").textContent=result+" Esta actividad es orientativa, no un diagnóstico ni una recomendación definitiva. Conversa también con docentes, orientadores y profesionales.";
}
$("startCareer").addEventListener("click",()=>{$("careerQuiz").hidden=false;careerIndex=0;careerScore=0;$("careerResult").hidden=true;showCareerQuestion();$("careerQuiz").scrollIntoView({behavior:"smooth",block:"nearest"});});
$("menuToggle").addEventListener("click",()=>{const nav=$("mainNav");nav.classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",nav.classList.contains("open"));});
document.querySelectorAll("#mainNav a").forEach(a=>a.addEventListener("click",()=>{$("mainNav").classList.remove("open");$("menuToggle").setAttribute("aria-expanded","false");}));


/* Mejoras: finanzas personales, progreso y ejercicios guardados en el navegador. */
(function(){
 const KEY="mf_personal_v1";
 const defaults={moves:[],goal:10000,lessons:[],attempts:[]};
 let data;try{data=Object.assign({},defaults,JSON.parse(localStorage.getItem(KEY)||"{}"));}catch(e){data=Object.assign({},defaults);}
 const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}};
 const money=n=>new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO"}).format(n);
 const el=id=>document.getElementById(id);
 const style=document.createElement("style");
 style.textContent=".mf-extra{max-width:1160px;margin:auto;padding:65px 24px}.mf-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.mf-box{border:1px solid #e3e9e3;border-radius:15px;padding:22px;background:#fff;min-width:0}.mf-box h3{font-size:19px;margin:0 0 8px}.mf-box p{font-size:12px}.mf-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}.mf-form label{font-size:11px;font-weight:700;color:#52675e}.mf-form input,.mf-form select{display:block;width:100%;padding:10px;border:1px solid #dce6dc;border-radius:8px;margin-top:5px}.mf-btn{margin-top:12px;border:1px solid #dce6dc;background:#f5f8f3;padding:9px 12px;border-radius:8px;cursor:pointer;font-weight:700;font-size:11px}.mf-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:15px 0}.mf-metric{padding:11px;background:#f5f8f3;border-radius:9px}.mf-metric small,.mf-metric b{display:block}.mf-metric small{font-size:10px;color:#718078}.mf-metric b{font-size:14px;margin-top:4px;overflow-wrap:anywhere}.mf-table-wrap{overflow:auto}.mf-table{width:100%;border-collapse:collapse;font-size:11px}.mf-table td,.mf-table th{padding:8px 5px;border-bottom:1px solid #edf1eb;text-align:left}.mf-del{border:0;background:#fff0ed;color:#a9433a;padding:5px;border-radius:5px;cursor:pointer}.mf-track{height:9px;background:#e7eee6;border-radius:20px;overflow:hidden;margin:12px 0}.mf-track span{display:block;height:100%;background:#248b70}.mf-row{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:10px;background:#f5f8f3;border-radius:9px;margin:8px 0;font-size:12px}.mf-chart{height:100px;display:flex;align-items:end;gap:10px;margin:15px 0}.mf-bar{flex:1;background:#78c4a0;border-radius:5px 5px 0 0;min-height:3px}.mf-options{display:grid;gap:8px}.mf-options button{text-align:left;padding:10px;border:1px solid #dce6dc;background:white;border-radius:8px;cursor:pointer}.mf-options button:disabled{cursor:default}.mf-note{font-size:10px!important;color:#7b8981!important}@media(max-width:760px){.mf-grid{grid-template-columns:1fr}.mf-extra{padding:45px 18px}}@media(max-width:440px){.mf-form{grid-template-columns:1fr}.mf-metrics{grid-template-columns:1fr}.mf-metric{display:flex;justify-content:space-between;gap:8px}}";
 document.head.appendChild(style);
 const section=document.createElement("section");section.id="mis-finanzas";section.className="mf-extra";
 section.innerHTML=[
 '<div class="section-heading"><div><span class="eyebrow">TUS HÁBITOS, TUS METAS</span><h2>Organiza tus <span>finanzas personales</span></h2></div><p>Registra ingresos y gastos, revisa tu saldo y avanza hacia una meta. Tus datos se guardan en este navegador.</p></div>',
 '<div class="mf-grid"><div class="mf-box"><h3>Ingresos y gastos</h3><p>Agrega movimientos para conocer tu balance personal.</p>',
 '<form id="mfForm" class="mf-form"><label>Descripción<input id="mfDesc" maxlength="70" required placeholder="Ej. Transporte"></label><label>Tipo<select id="mfType"><option value="income">Ingreso</option><option value="expense">Gasto</option></select></label><label>Monto (C$)<input id="mfAmount" type="number" min=".01" max="100000000" step=".01" required></label><label>Fecha<input id="mfDate" type="date" required></label><button class="mf-btn" type="submit">+ Agregar movimiento</button><button class="mf-btn" id="mfCsv" type="button">Exportar CSV</button></form>',
 '<div class="mf-metrics"><div class="mf-metric"><small>Ingresos</small><b id="mfInc">C$ 0.00</b></div><div class="mf-metric"><small>Gastos</small><b id="mfExp">C$ 0.00</b></div><div class="mf-metric"><small>Saldo</small><b id="mfBal">C$ 0.00</b></div></div><div id="mfChart" class="mf-chart" aria-label="Gráfica de movimientos recientes"></div>',
 '<div class="mf-table-wrap"><table class="mf-table"><thead><tr><th>Fecha</th><th>Descripción</th><th>Tipo</th><th>Monto</th><th></th></tr></thead><tbody id="mfRows"></tbody></table></div><p id="mfEmpty" class="mf-note">Aún no hay movimientos.</p></div>',
 '<div><div class="mf-box"><h3>Meta de ahorro</h3><p>El progreso se calcula con el saldo neto que registres aquí.</p><label style="font-size:11px;font-weight:700">Meta en córdobas<input id="mfGoal" type="number" min="1" max="100000000" style="display:block;width:100%;padding:10px;border:1px solid #dce6dc;border-radius:8px;margin-top:6px"></label><button class="mf-btn" id="mfSaveGoal" type="button">Guardar meta</button><div class="mf-track"><span id="mfGoalBar" style="width:0%"></span></div><p id="mfGoalText"></p><p class="mf-note">No se conecta a una cuenta bancaria ni confirma dinero real.</p></div>',
 '<div class="mf-box" style="margin-top:18px"><h3>Progreso de aprendizaje</h3><p>Marca los módulos que has revisado; el progreso se conserva en este navegador.</p><div class="mf-track"><span id="mfLearnBar" style="width:0%"></span></div><b id="mfLearnText">0 de 3 módulos</b><div id="mfLessons"></div><p id="mfBest" class="mf-note"></p></div></div></div>',
 '<div class="section-heading" style="margin-top:50px"><div><span class="eyebrow">PRACTICA UN POCO MÁS</span><h2>Ejercicios de <span>contabilidad</span></h2></div><p>Comprueba tu respuesta y aprende del procedimiento.</p></div>',
 '<div class="mf-grid"><div class="mf-box"><h3>Reto: patrimonio</h3><p>Una tienda tiene C$18,500 en efectivo, inventario de C$12,000 y debe C$7,500 a proveedores.</p><p><b>¿Cuál es su patrimonio?</b></p><div id="mfExercise" class="mf-options"></div><p id="mfFeedback" aria-live="polite"></p></div><div class="mf-box"><h3>Resultados de aprendizaje</h3><div class="mf-metrics"><div class="mf-metric"><small>Intentos</small><b id="mfAttempts">0</b></div><div class="mf-metric"><small>Correctas</small><b id="mfCorrect">0</b></div><div class="mf-metric"><small>Precisión</small><b id="mfAccuracy">0%</b></div></div><button id="mfReset" class="mf-btn" type="button">Borrar mis datos locales</button><p class="mf-note">Solo elimina los registros de estas mejoras, no los datos del resto del sitio.</p></div></div>'
 ].join("");
 const cta=document.querySelector(".cta-section");if(cta)cta.parentNode.insertBefore(section,cta);else document.querySelector("main")?.appendChild(section);
 const nav=document.getElementById("mainNav");if(nav&&!nav.querySelector('a[href="#mis-finanzas"]')){const a=document.createElement("a");a.href="#mis-finanzas";a.textContent="Mis finanzas";nav.insertBefore(a,nav.querySelector('a[href="#tutor"]')||null);}
 const set=(id,v)=>{if(el(id))el(id).textContent=v;};
 const today=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10);};
 el("mfDate").value=today();el("mfGoal").value=data.goal;
 function render(){
  let inc=0,exp=0;const rows=el("mfRows");rows.replaceChildren();
  data.moves.slice().sort((a,b)=>b.date.localeCompare(a.date)).forEach(m=>{
   if(m.type==="income")inc+=m.amount;else exp+=m.amount;
   const tr=document.createElement("tr");
   [m.date,m.desc,m.type==="income"?"Ingreso":"Gasto",money(m.amount)].forEach(v=>{const td=document.createElement("td");td.textContent=v;tr.appendChild(td);});
   const td=document.createElement("td"),btn=document.createElement("button");btn.className="mf-del";btn.textContent="×";btn.title="Eliminar movimiento";btn.addEventListener("click",()=>{data.moves=data.moves.filter(x=>x.id!==m.id);save();render();});td.appendChild(btn);tr.appendChild(td);rows.appendChild(tr);
  });
  set("mfInc",money(inc));set("mfExp",money(exp));set("mfBal",money(inc-exp));set("mfEmpty",data.moves.length?"":"Aún no hay movimientos.");
  const chart=el("mfChart");chart.replaceChildren();const recent=[];const now=new Date();for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);recent.push({key:d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"),label:d.toLocaleDateString("es-NI",{month:"short"}),value:0});}
  data.moves.forEach(m=>{const x=recent.find(z=>z.key===m.date.slice(0,7));if(x)x.value+=m.type==="income"?m.amount:-m.amount;});const max=Math.max(1,...recent.map(x=>Math.abs(x.value)));
  recent.forEach(x=>{const wrap=document.createElement("div");wrap.style.cssText="flex:1;height:100%;display:flex;flex-direction:column;justify-content:end;align-items:center;gap:4px";const bar=document.createElement("div");bar.className="mf-bar";bar.style.height=Math.max(3,Math.abs(x.value)/max*78)+"%";bar.style.background=x.value<0?"#e8a19a":"#78c4a0";bar.title=money(x.value);const label=document.createElement("small");label.style.fontSize="9px";label.textContent=x.label;wrap.append(bar,label);chart.appendChild(wrap);});
  const pct=Math.max(0,Math.min(100,(inc-exp)/Math.max(1,Number(data.goal))*100));el("mfGoalBar").style.width=pct+"%";set("mfGoalText",money(Math.max(0,inc-exp))+" de "+money(data.goal)+" · "+pct.toFixed(1)+"%");
  const modules=[["contabilidad","Fundamentos contables"],["finanzas","Finanzas personales"],["ia","Tecnología e IA"]];const list=el("mfLessons");list.replaceChildren();
  modules.forEach(([id,title])=>{const row=document.createElement("div");row.className="mf-row";const span=document.createElement("span");span.textContent=title;const btn=document.createElement("button");btn.className="mf-btn";btn.style.marginTop="0";btn.textContent=data.lessons.includes(id)?"✓ Revisado":"Marcar revisado";btn.addEventListener("click",()=>{data.lessons=data.lessons.includes(id)?data.lessons.filter(x=>x!==id):data.lessons.concat(id);save();render();});row.append(span,btn);list.appendChild(row);});
  set("mfLearnText",data.lessons.length+" de 3 módulos revisados");el("mfLearnBar").style.width=(data.lessons.length/3*100)+"%";set("mfBest","Mejor puntuación del cuestionario principal: "+(data.best==null?"sin registro":data.best+" de 5")+".");
  const correct=data.attempts.filter(x=>x).length;set("mfAttempts",data.attempts.length);set("mfCorrect",correct);set("mfAccuracy",data.attempts.length?Math.round(correct/data.attempts.length*100)+"%":"0%");
 }
 el("mfForm").addEventListener("submit",e=>{e.preventDefault();const desc=el("mfDesc").value.trim(),amount=Number(el("mfAmount").value),date=el("mfDate").value;if(!desc||!Number.isFinite(amount)||amount<=0||amount>100000000||!date){alert("Revisa la descripción, el monto y la fecha.");return;}data.moves.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2),desc,amount,type:el("mfType").value,date});save();e.target.reset();el("mfDate").value=today();render();});
 el("mfSaveGoal").addEventListener("click",()=>{const v=Number(el("mfGoal").value);if(!Number.isFinite(v)||v<=0||v>100000000){alert("Introduce una meta válida.");return;}data.goal=v;save();render();});
 el("mfCsv").addEventListener("click",()=>{if(!data.moves.length){alert("Agrega un movimiento primero.");return;}const esc=s=>'"'+String(s).replace(/"/g,'""')+'"';const csv=["Fecha,Descripción,Tipo,Monto",...data.moves.map(m=>[m.date,esc(m.desc),m.type==="income"?"Ingreso":"Gasto",m.amount.toFixed(2)].join(","))].join("\r\n");const url=URL.createObjectURL(new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="mundo-finanzas-movimientos.csv";a.click();URL.revokeObjectURL(url);});
 [["C$23,000",true],["C$30,500",false],["C$38,000",false],["C$7,500",false]].forEach(([answer,correct])=>{const b=document.createElement("button");b.type="button";b.textContent=answer;b.addEventListener("click",()=>{[...el("mfExercise").children].forEach(x=>x.disabled=true);b.style.background=correct?"#e0f4eb":"#fff0ed";data.attempts.push(correct);save();set("mfFeedback",correct?"¡Correcto! Activos = C$18,500 + C$12,000 = C$30,500. Patrimonio = C$30,500 − C$7,500 = C$23,000.":"La fórmula es Patrimonio = Activos − Pasivos. Activos: C$18,500 + C$12,000 = C$30,500; menos C$7,500 = C$23,000.");render();});el("mfExercise").appendChild(b);});
 el("mfReset").addEventListener("click",()=>{if(!confirm("¿Borrar movimientos, meta, progreso y resultados de estas mejoras en este navegador?"))return;data=Object.assign({},defaults,{moves:[],lessons:[],attempts:[]});save();el("mfGoal").value=data.goal;render();});
 render();
 const next=el("nextQuestion");if(next)next.addEventListener("click",()=>{if(el("quizCounter")?.textContent==="EVALUACIÓN COMPLETADA"){const score=Number(el("quizScore").textContent)||0;data.best=Math.max(score,Number(data.best)||0);save();render();}});
 // API opcional: en Vercel usa el backend y conserva el historial reciente para preguntas de seguimiento.
 const configuredApi=document.querySelector('meta[name="ai-api-url"]')?.content?.trim();
 const api=configuredApi||(location.hostname.endsWith(".vercel.app")?"/api/chat":"");
 const chatHistory=[];

 function buildBudgetAnswer(prompt){
  const asksRule=/50\s*%[\s\S]*30\s*%[\s\S]*20\s*%|50\s*\/\s*30\s*\/\s*20/i.test(prompt);
  const asksYear=/12\s*mes(?:es)?|un año|un anio/i.test(prompt);
  const salaryMatch=prompt.match(/salario(?:\s+mensual)?(?:\s+de)?\s*(?:C\s*\$?\s*)?([\d,]+(?:\.\d{1,2})?)/i)||prompt.match(/C\s*\$\s*([\d,]+(?:\.\d{1,2})?)/i);
  if(!asksRule||!asksYear||!salaryMatch)return null;
  const income=Number(salaryMatch[1].replace(/,/g,""));
  if(!Number.isFinite(income)||income<=0)return null;
  const fmt=n=>new Intl.NumberFormat("es-NI",{minimumFractionDigits:2,maximumFractionDigits:2}).format(n);
  const needs=income*.5, personal=income*.3, savings=income*.2;
  const rows=Array.from({length:12},(_,i)=>"| "+(i+1)+" | C$ "+fmt(savings)+" | C$ "+fmt(savings*(i+1))+" |").join("\n");
  return "### Distribución mensual del salario\n\n"+
   "- **Necesidades (50 %):** C$ "+fmt(needs)+"\n"+
   "- **Gastos personales (30 %):** C$ "+fmt(personal)+"\n"+
   "- **Ahorro (20 %):** C$ "+fmt(savings)+"\n\n"+
   "### Tabla resumen\n\n"+
   "| Categoría | Porcentaje | Monto mensual |\n|---|---:|---:|\n"+
   "| Necesidades | 50 % | C$ "+fmt(needs)+" |\n"+
   "| Gastos personales | 30 % | C$ "+fmt(personal)+" |\n"+
   "| Ahorro | 20 % | C$ "+fmt(savings)+" |\n"+
   "| **Total** | **100 %** | **C$ "+fmt(income)+" |\n\n"+
   "### Proyección del ahorro durante 12 meses\n\n"+
   "| Mes | Ahorro del mes | Ahorro acumulado |\n|---:|---:|---:|\n"+rows+"\n\n"+
   "**Ahorro acumulado al finalizar los 12 meses: C$ "+fmt(savings*12)+".**\n\n"+
   "La proyección supone que apartás el mismo monto cada mes, sin retiros ni intereses.";
 }

 function addAssistantMessage(text,sources,meta){
  const row=document.createElement("div");row.className="message bot";
  const avatar=document.createElement("div");avatar.className="message-avatar";avatar.textContent="✦";
  const bubble=document.createElement("div");bubble.className="bubble assistant-rich";
  // Render common Markdown elements safely without interpreting arbitrary HTML.
  const lines=String(text||"").replace(/\r/g,"").split("\n");
  let list=null, table=null;
  const flushList=()=>{if(list){bubble.appendChild(list);list=null;}};
  const flushTable=()=>{if(table){bubble.appendChild(table);table=null;}};
  const inline=(parent,value)=>{
   const token=/\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+/g;
   let last=0,match;
   while((match=token.exec(String(value)))){
    parent.appendChild(document.createTextNode(String(value).slice(last,match.index)));
    const part=match[0];
    if(part.startsWith("**")&&part.endsWith("**")){const strong=document.createElement("strong");strong.textContent=part.slice(2,-2);parent.appendChild(strong);}
    else{
     const md=part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
     const url=(md?md[2]:part).replace(/[.,;!?]+$/,"");
     if(/^https?:\/\//i.test(url)){const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";a.className="inline-source-link";a.textContent=md?md[1]:url;parent.appendChild(a);}
     else parent.appendChild(document.createTextNode(part));
    }
    last=token.lastIndex;
   }
   parent.appendChild(document.createTextNode(String(value).slice(last)));
  };
  for(let i=0;i<lines.length;i++){
   const line=lines[i], trimmed=line.trim();
   if(/^\|.*\|$/.test(trimmed)){
    flushList();
    if(/^\|[\s:|-]+\|$/.test(trimmed))continue;
    if(!table){table=document.createElement("div");table.className="answer-table-wrap";const t=document.createElement("table");t.className="answer-table";table.appendChild(t);}
    const t=table.querySelector("table"),tr=document.createElement("tr");
    trimmed.replace(/^\||\|$/g,"").split("|").forEach(cell=>{const el=document.createElement(t.rows.length===0?"th":"td");inline(el,cell.trim());tr.appendChild(el);});
    t.appendChild(tr);continue;
   } else flushTable();
   if(/^\s*[-*•]\s+/.test(line)){
    if(!list){list=document.createElement("ul");list.className="answer-list";}
    const li=document.createElement("li");inline(li,line.replace(/^\s*[-*•]\s+/,""));list.appendChild(li);continue;
   } else flushList();
   if(!trimmed){continue;}
   const heading=trimmed.match(/^#{1,3}\s+(.+)$/);
   const p=document.createElement(heading?"h4":"p");p.className=heading?"answer-heading":"answer-paragraph";
   inline(p,heading?heading[1]:trimmed);bubble.appendChild(p);
  }
  flushList();flushTable();
  const budget=String(text).match(/(?:necesidades|gastos personales|deseos|ahorro)[^\n]{0,100}?(?:C\$|C\\\$)\s*([\d,]+(?:\.\d+)?)/ig);
  if(/presupuesto|distribuci[oó]n del salario|regla 50\/30\/20/i.test(text)&&budget&&budget.length>=2){
   const values=[];
   budget.forEach((match)=>{const label=match.match(/^(?:\d+[.)]\s*)?(?:\*\*)?(necesidades|gastos personales|deseos|ahorro)/i)?.[1];const amount=match.match(/(?:C\$|C\\\$)\s*([\d,]+(?:\.\d+)?)/i)?.[1];if(label&&amount&&!values.some(v=>v.label.toLowerCase()===label.toLowerCase()))values.push({label:label.charAt(0).toUpperCase()+label.slice(1),amount:amount.replace(/,/g,"")});});
   if(values.length>=2){const total=values.reduce((sum,v)=>sum+Number(v.amount),0);const grid=document.createElement("div");grid.className="budget-visual";values.slice(0,4).forEach(v=>{const card=document.createElement("div");card.className="budget-visual-card";const label=document.createElement("span");label.textContent=v.label;const amount=document.createElement("strong");amount.textContent=new Intl.NumberFormat("es-NI",{style:"currency",currency:"NIO",maximumFractionDigits:0}).format(Number(v.amount));const meter=document.createElement("div");meter.className="budget-meter";const fill=document.createElement("div");fill.className="budget-meter-fill";fill.style.width=(total>0?Math.max(0,Math.min(100,Number(v.amount)/total*100)):0)+"%";meter.appendChild(fill);const pct=document.createElement("small");pct.textContent=(total>0?Number(v.amount)/total*100:0).toFixed(0)+"% del total mostrado";card.append(label,amount,meter,pct);grid.appendChild(card);});bubble.appendChild(grid);}
  }
  row.append(avatar,bubble);
  const apiSources=(Array.isArray(sources)?sources:[]).filter(s=>s&&/^https?:\/\//i.test(s.url||""));
  const linked=[...String(text||"").matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g)].map(m=>({title:m[1],url:m[2].replace(/[.,;!?]+$/,"")}));
  const plain=[...String(text||"").matchAll(/https?:\/\/[^\s)\]]+/g)].map(m=>({title:m[0],url:m[0].replace(/[.,;!?]+$/,"")}));
  const valid=[...apiSources,...linked,...plain].filter(s=>/^https?:\/\//i.test(s.url||"")).filter((s,i,a)=>a.findIndex(x=>x.url===s.url)===i).slice(0,5);
  if(valid.length){const sourceBox=document.createElement("div");sourceBox.className="source-cards";const heading=document.createElement("h4");heading.textContent=apiSources.length?"Fuentes consultadas": "Enlaces incluidos en la respuesta";sourceBox.appendChild(heading);if(apiSources.length&&meta?.checkedAt){const checked=document.createElement("span");checked.className="source-checked-at";checked.textContent="Consulta realizada: "+new Date(meta.checkedAt).toLocaleString("es-NI",{dateStyle:"medium",timeStyle:"short"});sourceBox.appendChild(checked);}if(!apiSources.length){const caveat=document.createElement("span");caveat.className="source-checked-at";caveat.textContent="Estos enlaces proceden del texto de la respuesta y no se han validado automáticamente.";sourceBox.appendChild(caveat);}valid.forEach(s=>{const a=document.createElement("a");a.className="source-card";a.href=s.url;a.target="_blank";a.rel="noopener noreferrer";const title=document.createElement("strong");title.textContent=s.title||s.url;const url=document.createElement("span");try{url.textContent=new URL(s.url).hostname;}catch{url.textContent=s.url;}const arrow=document.createElement("span");arrow.className="source-arrow";arrow.textContent="↗";a.append(title,url,arrow);sourceBox.appendChild(a);});row.appendChild(sourceBox);}
  if(meta?.searchStatus==="no_sources"||meta?.searchStatus==="unavailable"){const note=document.createElement("p");note.className="search-note";note.textContent=meta.searchStatus==="unavailable"?"El servicio de búsqueda web no está disponible temporalmente. No se pudo comprobar la actualidad de los datos.":"No pude validar automáticamente las fuentes de la búsqueda. Los enlaces mencionados arriba no se consideran verificados; intentá otra vez o consultá el sitio oficial.";row.appendChild(note);}
  el("chatMessages").appendChild(row);el("chatMessages").scrollTop=el("chatMessages").scrollHeight;
 }
 window.sendChat=async function(raw){
  const clean=String(raw||"").trim();
  if(!clean)return;
  document.querySelector(".quick-prompts")?.remove();
  addMessage(clean,"user");
  const budgetAnswer=buildBudgetAnswer(clean);
  if(budgetAnswer){chatHistory.push({role:"user",content:clean},{role:"assistant",content:budgetAnswer});addAssistantMessage(budgetAnswer,[],{searchStatus:"not_requested"});set("chatFootnote","Presupuesto calculado automáticamente; revisa los montos antes de tomar decisiones.");return;}
  if(!api){addMessage(getTutorAnswer(clean),"bot");return;}
  chatHistory.push({role:"user",content:clean});
  const pending=document.createElement("div");
  pending.className="message bot";
  pending.innerHTML='<div class="message-avatar">✦</div><div class="bubble">Preparando una explicación…</div>';
  el("chatMessages").appendChild(pending);
  let timer;
  try{
   const controller=new AbortController();
   timer=setTimeout(()=>controller.abort(),25000);
   const response=await fetch(api,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({messages:(()=>{const recent=chatHistory.slice(-10);while(recent.length&&recent[0].role!=="user")recent.shift();return recent;})()}),
    signal:controller.signal
   });
   const result=await response.json().catch(()=>({}));
   if(!response.ok)throw new Error(result.error||"La API respondió con error HTTP "+response.status);
   const answer=String(result.reply||result.answer||result.text||"").trim();
   if(!answer)throw new Error("La IA devolvió una respuesta vacía.");
   chatHistory.push({role:"assistant",content:answer});
   pending.remove();
   addAssistantMessage(answer,result.sources||[],{searchStatus:result.searchStatus,checkedAt:result.checkedAt});
   const providerName=result.provider==="groq"?"Groq (respaldo)":"Gemini";
   const searchNote=result.searchStatus==="success"?" · fuentes web disponibles":result.searchStatus==="no_sources"?" · sin fuentes web verificables":"";
   set("chatFootnote","Tutor conectado: "+providerName+searchNote+". Verifica cálculos y protege tus datos.");
  }catch(e){
   pending.remove();
   console.warn("[Mundo Finanzas] Falló la solicitud al tutor:", {
    message: e?.message || "Error desconocido",
    name: e?.name || "Error"
   });
   const normalized = clean.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
   let fallback = getTutorAnswer(clean);
   const previousUser = [...chatHistory].reverse().find(m => m.role === "user" && m.content !== clean);
   const previousTopic = previousUser?.content.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
   if (/clasific|tipos|cuales son|cuales existen/.test(normalized) && /pasiv|deuda|obligacion/.test(previousTopic)) {
    fallback = "Los pasivos se suelen clasificar, según el plazo de pago, en:\n\n• Pasivos corrientes o de corto plazo: obligaciones que normalmente vencen dentro de un año, como facturas pendientes con proveedores o cuotas próximas de un préstamo.\n• Pasivos no corrientes o de largo plazo: obligaciones cuyo vencimiento supera un año, como la parte a largo plazo de un préstamo bancario.\n\nEjemplo de una pulpería: si debe C$3,000 a un proveedor para pagar este mes, sería un pasivo corriente; si tiene un préstamo cuyo saldo se pagará durante tres años, la parte que vence después de un año sería pasivo no corriente. La clasificación exacta depende de las condiciones de cada obligación.";
   } else if (/clasific|tipos|cuales son|cuales existen/.test(normalized) && /activ|recurso|bien/.test(previousTopic)) {
    fallback = "Los activos suelen clasificarse en:\n\n• Activos corrientes: recursos que se espera convertir en efectivo, vender o consumir en el ciclo normal del negocio o, por lo general, dentro de un año; por ejemplo, caja e inventario de una pulpería.\n• Activos no corrientes: recursos de uso más duradero, como estantes, refrigeradores, mobiliario o vehículos.\n\nLa clasificación ayuda a conocer qué recursos están disponibles a corto plazo y cuáles se utilizan durante más tiempo.";
   }
   const fallbackMessage="La IA generativa no está disponible en este momento. Te comparto una explicación de respaldo.\n\n"+fallback;
   addMessage(fallbackMessage,"bot");
   set("chatFootnote","Servicio temporalmente limitado. Se mostró una explicación de respaldo local; probá de nuevo en unos minutos.");
  }finally{
   if(timer)clearTimeout(timer);
  }
 };
})();
