import {NextResponse} from "next/server";
import {commanderPage,EdhrecError} from "../../../lib/edhrec";
import {localize} from "../../../lib/messages";
import {edhrecStats,cheapestPrices,centsOf,role,isBasic,ROLE_IT,frontType,type Stat,type Role} from "../../../lib/cards";
export const runtime="nodejs";
export const maxDuration=60;
const ua={"Content-Type":"application/json","User-Agent":"PreconUpgradeResearch/1.0 (Commander deck helper)"};
const normalize=(s:any)=>String(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const slug=(s:string)=>normalize(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const headersRe=/^(commanders?|comandanti?|creatures?|creature|planeswalkers?|instants?|istantanei|sorceries|stregonerie|enchantments?|incantesimi|artifacts?|artefatti|lands?|terre|other spells|altre magie|sideboard|maybeboard)\s*:?[ ]*$/i;
function parseDeck(text:string){return text.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).flatMap(line=>{const m=line.match(/^(\d+)\s*[xX]?\s+(.+)$/);const name=(m?m[2]:line).trim();if(!m&&headersRe.test(name))return[];return[{name,quantity:m?Number(m[1]):1}]})}
async function collection(names:string[]){const cards:any[]=[];const missing:any[]=[];for(let i=0;i<names.length;i+=75){const r=await fetch("https://api.scryfall.com/cards/collection",{method:"POST",headers:ua,body:JSON.stringify({identifiers:names.slice(i,i+75).map(name=>({name}))}),cache:"no-store"});if(!r.ok)throw new Error("Scryfall non è disponibile. Riprova tra poco.");const d=await r.json();cards.push(...(d.data||[]));missing.push(...(d.not_found||[]));}return{cards,missing}}
export async function POST(req:Request){const out=(d:any,init?:ResponseInit)=>NextResponse.json(localize(d,req.headers.get("x-lang")==="en"),init);try{const{deck,commander,budget="",count=5}=await req.json();if(!commander?.trim()||!deck?.trim())return out({error:"Inserisci il comandante e la lista del precon."},{status:400});const entries=parseDeck(deck);if(!entries.length)return out({error:"Lista vuota o non riconosciuta."},{status:400});const base=await collection([...new Set(entries.map(x=>x.name)),commander.trim()]);const commanderCard=base.cards.find(c=>normalize(c.name)===normalize(commander))||base.cards.find(c=>c.type_line?.includes("Legendary Creature")&&normalize(c.name).includes(normalize(commander)));if(!commanderCard)return out({error:`Scryfall non riconosce il comandante “${commander}”. Inserisci il nome ufficiale della carta.`},{status:400});const deckCards=base.cards.filter(c=>entries.some(e=>normalize(e.name)===normalize(c.name))).map(c=>({...c,quantity:entries.find(e=>normalize(e.name)===normalize(c.name))?.quantity||1}));if(!deckCards.length)return out({error:"Nessuna carta del mazzo riconosciuta da Scryfall."},{status:400});let payload:any;try{payload=await commanderPage(commanderCard.name);}catch(err){return out({error:err instanceof EdhrecError&&err.status===429?err.message:"Non riesco a leggere i dati EDHREC ora. Puoi comunque aprire i link di confronto qui sotto."},{status:err instanceof EdhrecError&&err.status===429?429:502});}const stats=edhrecStats(payload);if(!stats.size)return out({error:"EDHREC non ha restituito dati leggibili per questo comandante."},{status:502});const deckSet=new Set(deckCards.map(c=>normalize(c.name)));const identity=commanderCard.color_identity||[];const max=Math.min(10,Math.max(1,Math.floor(Number(count)||5)));
const raw=String(budget??"").trim();const limit=raw?Number(raw.replace(/€/g,"").replace(/\s/g,"").replace(",",".")):null;
if(limit!==null&&(!Number.isFinite(limit)||limit<0))return out({error:"Budget non valido."},{status:400});
const cap=limit===null?null:Math.floor(limit*100);
const group=(c:any)=>["Land","Creature","Artifact","Enchantment","Instant","Sorcery","Planeswalker","Battle"].find(t=>String(c?.card_faces?.[0]?.type_line||c?.type_line||"").includes(t))||"Other";
const img=(c:any)=>c?.image_uris?.normal||c?.card_faces?.find((f:any)=>f.image_uris?.normal)?.image_uris?.normal||null;
// con budget alto aggiunge anche le carte costose più giocate in Commander in generale (classifica EDHREC di Scryfall)
const staples=new Set<string>();let minStaple=0;
if(cap!==null&&cap>=15000){const minEur=Math.max(5,Math.floor(cap/100/Math.max(1,max)/4));minStaple=minEur*100;const id=identity.length?identity.join("").toLowerCase():"c";
  try{const r=await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(`id<=${id} legal:commander game:paper -t:basic`)}&order=edhrec`,{headers:ua,cache:"no-store",signal:AbortSignal.timeout(15000)});
    if(r.ok){const d=await r.json();for(const c of (d.data||[])){const k=normalize(c.name);if(deckSet.has(k))continue;if(/^(mox opal|mox amber|urza.s saga|cavern of souls)$/.test(k))continue;if(!stats.has(k)){stats.set(k,{name:c.name,synergy:0,inclusion:0,score:0.2});staples.add(k);}}}}catch{}}
const possible=[...stats.values()].filter(s=>!deckSet.has(normalize(s.name))).sort((a,b)=>b.score-a.score).slice(0,cap!==null&&cap>=15000?300:180);
const verified=await collection(possible.map(x=>x.name));const byName=new Map(verified.cards.map(c=>[normalize(c.name),c]));
const cheap=await cheapestPrices(verified.cards.map(c=>c.name));
const priceOf=(c:any)=>{const v=cheap.get(normalize(c.name));const own=centsOf(c);return v!==undefined&&(own===null||v<own)?v:own;};
type Cand={card:any;stat:Stat;cents:number|null;role:Role};
const cands:Cand[]=[];for(const stat of possible){const card=byName.get(normalize(stat.name));
if(!card||card.legalities?.commander!=="legal"||!(card.color_identity||[]).every((c:string)=>identity.includes(c))||deckSet.has(normalize(card.name))||isBasic(card.name))continue;
const cents=priceOf(card);if(cap!==null&&cents===null)continue;if(staples.has(normalize(card.name))&&(cents??0)<minStaple)continue;if(staples.has(normalize(card.name))&&frontType(card).includes("Land")){const t=String(card.oracle_text||"");const types:Record<string,string>={Plains:"W",Island:"U",Swamp:"B",Mountain:"R",Forest:"G"};const off=Object.entries(types).some(([b,col])=>new RegExp(`\\b${b}\\b`).test(t)&&!identity.includes(col));if(off||(identity.length<=1&&/any color/i.test(t)))continue;}cands.push({card,stat,cents,role:role(card)});}
// carte del mazzo che si possono togliere: punteggio EDHREC (0 se il comandante non le gioca quasi mai)
const cuts=deckCards.filter(c=>normalize(c.name)!==normalize(commanderCard.name)).flatMap(c=>Array.from({length:isBasic(c.name)?Math.min(c.quantity,8):1},()=>c)).map(c=>{const st=stats.get(normalize(c.name));return{card:c,name:c.name,score:st?.score??0,synergy:st?.synergy??null,inclusion:st?.inclusion??null,role:role(c),known:!!st};});
const MARGIN=0.08;const mv=(x:any)=>Number.isFinite(Number(x?.cmc))?Number(x.cmc):0;
// sceglie il taglio: stessa funzione, poi stesso tipo; le terre si scambiano solo con terre; preferisce le terre base per le terre non base
function pair(c:Cand,taken:Set<number>){const ok=(x:any,i:number)=>!taken.has(i)&&x.score+MARGIN<=c.stat.score;
const pool=cuts.map((x,i)=>({x,i})).filter(({x,i})=>ok(x,i));
const sameRole=pool.filter(({x})=>x.role===c.role&&(c.role!=="land"||true));
const sameType=pool.filter(({x})=>c.role!=="land"&&x.role!=="land"&&group(x.card)===group(c.card));
const anySpell=pool.filter(({x})=>c.role!=="land"&&x.role==="synergy"&&x.score<=0.05);
const mvA=mv(c.card);
// costo di mana: preferisce togliere carte che costano di più (es. creatura da 6 → creatura da 3 con la stessa funzione)
const weight=(x:any)=>x.score+(group(x.card)===group(c.card)?0:0.06)-0.06*Math.max(0,mv(x.card)-mvA)+0.12*Math.max(0,mvA-mv(x.card));
const order=(l:typeof pool)=>l.filter(({x})=>c.role==="land"||mvA<=mv(x.card)+1).sort((a,b)=>(c.role==="land"?(Number(isBasic(b.x.name))-Number(isBasic(a.x.name))):0)||weight(a.x)-weight(b.x))[0];
const p=order(sameRole)||order(sameType)||(c.role!=="land"?order(anySpell):undefined);return p?{...p,how:p.x.role===c.role?"role":"type"}:null;}
type Pick={c:Cand;cutIndex:number;how:string};
function build(list:Cand[]){const taken=new Set<number>();const res:Pick[]=[];for(const c of list){const p=pair(c,taken);if(!p)continue;taken.add(p.i);res.push({c,cutIndex:p.i,how:p.how});}return res;}
const cost=(l:Pick[])=>l.reduce((n,p)=>n+(p.c.cents??0),0);
const byScore=[...cands].sort((a,b)=>b.stat.score-a.stat.score);
let picks:Pick[]=[];let extra=0;
if(cap===null){picks=build(byScore).slice(0,max);}
else{
  // 1) i migliori cambi che stanno nel budget
  const taken=new Set<number>();let spent=0;
  for(const c of byScore){if(picks.length>=max)break;if(spent+(c.cents??0)>cap)continue;const p=pair(c,taken);if(!p)continue;taken.add(p.i);picks.push({c,cutIndex:p.i,how:p.how});spent+=c.cents??0;}
  const target=Math.floor(cap*0.8);
  // 2) se resta budget: sostituisce i cambi meno costosi con carte migliori o comunque più forti e più care, finché si arriva almeno all'80%
  for(let guard=0;guard<200&&spent<target;guard++){let best:{k:number;c:Cand;p:any;delta:number}|null=null;
    for(let k=0;k<picks.length;k++){const old=picks[k];const t2=new Set(picks.filter((_,j)=>j!==k).map(x=>x.cutIndex));
      for(const c of byScore){if(picks.some(x=>x.c===c))continue;const delta=(c.cents??0)-(old.c.cents??0);if(delta<=0||spent+delta>cap)continue;if(c.stat.score<old.c.stat.score-0.15)continue;const p=pair(c,t2);if(!p)continue;
        const value=c.stat.score+Math.min(delta,cap-spent)/Math.max(1,cap)*2;if(!best||value>best.c.stat.score+Math.min(best.delta,cap-spent)/Math.max(1,cap)*2)best={k,c,p,delta};}}
    if(!best)break;picks[best.k]={c:best.c,cutIndex:best.p.i,how:best.p.how};spent+=best.delta;}
  // 3) se non basta ancora: aggiunge cambi in più (fino a 30), dai più forti
  while(spent<target&&picks.length<30){const taken2=new Set(picks.map(x=>x.cutIndex));const next=byScore.filter(c=>!picks.some(x=>x.c===c)&&spent+(c.cents??0)<=cap).map(c=>({c,p:pair(c,taken2)})).filter(x=>x.p).sort((a,b)=>(b.c.cents??0)*(b.c.stat.score)-(a.c.cents??0)*(a.c.stat.score))[0];if(!next)break;picks.push({c:next.c,cutIndex:next.p!.i,how:next.p!.how});spent+=next.c.cents??0;extra++;}
}
const pc=(v:number|null)=>v===null?"n/d":`${Math.round(v*100)}%`;
const swaps=picks.sort((a,b)=>b.c.stat.score-a.c.stat.score).map(({c,cutIndex,how})=>{const cut=cuts[cutIndex];const r=ROLE_IT[c.role];
const why=how==="role"?`Stessa funzione (${r})`:`Stesso tipo di carta (${group(c.card)}), funzione: ${r}`;
const reason=staples.has(normalize(c.card.name))?`${why}: ${c.card.name} è tra le carte più giocate in Commander in generale (classifica EDHREC), adatta a un budget alto. ${cut.name} è giocata poco con questo comandante.`:cut.known?`${why}: ${c.card.name} è giocata nel ${pc(c.stat.inclusion)} dei mazzi con questo comandante, ${cut.name} nel ${pc(cut.inclusion)}.`:`${why}: ${c.card.name} è giocata nel ${pc(c.stat.inclusion)} dei mazzi con questo comandante; ${cut.name} quasi mai.`;
const ma=mv(c.card),mc=mv(cut.card);const manaNote=c.role==="land"?"":ma<mc?`Costa meno: ${ma} mana invece di ${mc}.`:ma===mc?`Stesso costo: ${ma} mana.`:`Costa un po' di più: ${ma} mana invece di ${mc}.`;
return{add:c.card.name,cut:cut.name,manaNote,addImage:img(c.card),cutImage:img(cut.card),priceEUR:c.cents===null?null:c.cents/100,addSynergy:c.stat.synergy,addInclusion:c.stat.inclusion,cutSynergy:cut.synergy,role:r,reason};});
const spent=cost(picks);
const commanderImage=img(commanderCard);const totalPriceEUR=spent/100;const priceComplete=swaps.every(s=>s.priceEUR!==null);const selectionNotice=[extra>0?`Per usare il budget ho aggiunto ${extra} cambi oltre ai ${max} richiesti.`:"",swaps.length<max?`Trovati ${swaps.length} cambi su ${max} richiesti nei limiti di budget e dati disponibili.`:"",cap!==null&&spent<cap*0.8?`Speso ${(spent/100).toFixed(2)} € su ${(cap/100).toFixed(2)} €: per questo comandante non ci sono abbastanza carte utili più care che migliorino il mazzo.`:""].filter(Boolean).join(" ");
const siteSlug=slug(commanderCard.name);return out({commander:commanderCard.name,deckCount:deckCards.length,total:deckCards.reduce((n,c)=>n+c.quantity,0),missing:base.missing.filter(x=>normalize(x.name)!==normalize(commanderCard.name)).map(x=>x.name),swaps,commanderImage,totalPriceEUR,priceComplete,selectionNotice,edhrecDecks:payload?.container?.json_dict?.header||null,links:[{name:"EDHREC — raccomandazioni comandante",url:`https://edhrec.com/commanders/${siteSlug}`},{name:"EDHREC — guide upgrade precon",url:"https://edhrec.com/precon"},{name:"Guide precon su MTGGoldfish",url:`https://www.google.com/search?q=${encodeURIComponent(`site:mtggoldfish.com/articles ${commanderCard.name} precon upgrade`)}`},{name:"Guide precon su TCGplayer",url:`https://www.google.com/search?q=${encodeURIComponent(`site:tcgplayer.com ${commanderCard.name} precon upgrade`)}`},{name:"Mazzi pubblici su Archidekt",url:`https://archidekt.com/commanders/${siteSlug}`},{name:"Scryfall — controlla le carte",url:`https://scryfall.com/search?q=${encodeURIComponent(`commander:${commanderCard.name}`)}`}],warning:"I tagli sono una stima meccanica basata su statistiche EDHREC: non equivalgono a una valutazione strategica umana. Controlla ogni sostituzione prima di acquistare."});}catch(e){console.error(e);return out({error:e instanceof Error?e.message:"Errore durante il confronto."},{status:500})}}
