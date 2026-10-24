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
  row.append(avatar,bubble); $("chatMessages").appendChild(row); $("chatMessages").scrollTop = $("chatMessages").scrollHeight;
}
function sendChat(text) {
  const clean = text.trim(); if (!clean) return;
  document.querySelector(".quick-prompts")?.remove();
  addMessage(clean,"user"); addMessage(getTutorAnswer(clean),"bot");
}
$("chatForm").addEventListener("submit", e => {e.preventDefault(); sendChat($("chatInput").value); $("chatInput").value="";});
document.querySelectorAll("[data-prompt]").forEach(b => b.addEventListener("click", () => sendChat(b.dataset.prompt)));
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
