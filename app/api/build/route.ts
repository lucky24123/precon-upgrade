import { NextResponse } from "next/server";
import { commanderPage, EdhrecError } from "../../../lib/edhrec";
import {localize} from "../../../lib/messages";
import {edhrecStats,role as roleOf,isBasic,type Role} from "../../../lib/cards";
export const runtime = "nodejs";
export const maxDuration = 60;
type Card = { name:string; oracle_id?:string; mana_cost?:string; type_line:string; oracle_text?:string; color_identity:string[]; legalities:Record<string,string>; prices?:{eur?:string|null}; image_uris?:{normal?:string}; card_faces?:{mana_cost?:string;type_line?:string;oracle_text?:string;image_uris?:{normal?:string}}[] };
const norm=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const image=(c:Card)=>c.image_uris?.normal||c.card_faces?.find(f=>f.image_uris?.normal)?.image_uris?.normal||null;
const cents=(c:Card)=>{const p=c.prices?.eur;return p!=null&&Number.isFinite(Number(p))&&Number(p)>=0?Math.round(Number(p)*100):null;};
const headers={"Content-Type":"application/json","User-Agent":"PreconUpgrade/1.0"};
const wait=()=>new Promise(resolve=>setTimeout(resolve,550));
async function scry(url:string,init?:RequestInit){const res=await fetch(url,{...init,headers,cache:"no-store",signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error(res.status===429?"Scryfall è temporaneamente limitato. Attendi e riprova.":"Scryfall non ha restituito le carte richieste. Controlla il nome ufficiale del comandante.");return res.json();}
const pause=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
// Prezzo in centesimi della stampa più economica con prezzo in euro (Scryfall prefer:eur-low), in blocchi di nomi.
async function cheapestPrices(names:string[]):Promise<Map<string,number>>{
  const prices=new Map<string,number>();
  const usable=names.filter(n=>!n.includes('"'));
  const chunks:string[][]=[];let current:string[]=[];let len=0;
  for(const n of usable){const term=`!"${n}"`;if(current.length&&(len+term.length>700||current.length>=25)){chunks.push(current);current=[];len=0;}current.push(term);len+=term.length+4;}
  if(current.length)chunks.push(current);
  for(const chunk of chunks){
    let url:string|null=`https://api.scryfall.com/cards/search?q=${encodeURIComponent(`(${chunk.join(" or ")}) game:paper -set:sum -is:oversized -set_type:memorabilia -set_type:funny prefer:eur-low`)}`; // esclude stampe rare con prezzi anomali (es. Summer Magic)
    while(url){
      await pause(550); // Scryfall: max ~2 richieste/s su /cards/search
      let res:Response;
      try{res=await fetch(url,{headers,cache:"no-store",signal:AbortSignal.timeout(15000)});}catch{break;}
      if(!res.ok)break; // 404 = nessuna carta trovata nel blocco; altri errori: si tengono i prezzi originali
      const page:any=await res.json();
      for(const c of (page.data||[]) as Card[]){const v=cents(c);if(v!==null)prices.set(norm(c.name),v);}
      url=page.has_more&&typeof page.next_page==="string"?page.next_page:null;
    }
  }
  return prices;
}
const BASIC_ESTIMATE_CENTS=10;
export async function POST(req:Request){const out=(d:any,init?:ResponseInit)=>NextResponse.json(localize(d,req.headers.get("x-lang")==="en"),init);try{
const body=await req.json();if(typeof body.commander!=="string"||!body.commander.trim()||!Array.isArray(body.colors))return out({error:"Inserisci comandante e colori."},{status:400});
const selected=[...new Set<string>(body.colors)];if(selected.some(c=>!["W","U","B","R","G"].includes(c)))return out({error:"Colori non validi."},{status:400});
const budget=body.budgetEUR??null;if(budget!==null&&(typeof budget!=="number"||!Number.isFinite(budget)||budget<0))return out({error:"Budget non valido."},{status:400});
const cap=budget===null?null:Math.floor(budget*100);
const commander:Card=await scry(`https://api.scryfall.com/cards/named?exact=${encodeURIComponent(body.commander.trim())}`);
if(commander.legalities?.commander!=="legal")return out({error:"Questa carta non è legale in Commander."},{status:400});
const eligible=(commander.type_line.includes("Legendary")&&commander.type_line.includes("Creature"))||/can be your commander/i.test(commander.oracle_text||"");
if(!eligible)return out({error:"Questa prima versione supporta un solo comandante: creatura leggendaria o carta che dichiara di poter essere comandante."},{status:400});
const identity=commander.color_identity||[];if(identity.length!==selected.length||identity.some(c=>!selected.includes(c)))return out({error:`I colori selezionati non corrispondono al comandante. Identità richiesta: ${identity.join(", ")||"incolore"}.`},{status:400});
let data:any;try{data=await commanderPage(commander.name);}catch(err){return out({error:err instanceof EdhrecError&&err.status===429?err.message:"Dati EDHREC non disponibili per questo comandante. Il generatore non può completare la lista."},{status:err instanceof EdhrecError&&err.status===429?429:502});}const stats=edhrecStats(data);
const names=[...stats.values()].sort((a,b)=>b.score-a.score).slice(0,300).map(s=>s.name);
const basicNames:Record<string,string>={W:"Plains",U:"Island",B:"Swamp",R:"Mountain",G:"Forest"};
const basics=identity.length?identity.map(c=>basicNames[c]):["Wastes"];
const unique=[...new Set([...names,...basics])];const all:Card[]=[];
for(let i=0;i<unique.length;i+=75){await wait();const batch=await scry("https://api.scryfall.com/cards/collection",{method:"POST",body:JSON.stringify({identifiers:unique.slice(i,i+75).map(name=>({name}))})});all.push(...(batch.data||[]));}
const pool=new Map<string,Card>();for(const c of all){if(c.legalities?.commander!=="legal"||c.color_identity.some(x=>!identity.includes(x)))continue;pool.set(norm(c.name),c);}
const cheapest=await cheapestPrices([commander.name,...pool.values()].map(c=>typeof c==="string"?c:c.name));
const withPrice=(c:Card):Card=>{const v=cheapest.get(norm(c.name));const own=cents(c);return v!==undefined&&(own===null||v<own)?{...c,prices:{...c.prices,eur:(v/100).toFixed(2)}}:c;};
for(const [k,c] of pool)pool.set(k,withPrice(c));
const commanderPriced=withPrice(commander);
const score=(c:Card)=>stats.get(norm(c.name))?.score??0;
const spells=[...pool.values()].filter(c=>norm(c.name)!==norm(commander.name)&&!c.type_line.includes("Land")&&stats.has(norm(c.name))).filter(c=>cap===null||cents(c)!==null);
// terre non base consigliate da EDHREC per questo comandante (es. Command Tower, dual, terre utili)
const nonbasicPool=[...pool.values()].filter(c=>c.type_line.includes("Land")&&!isBasic(c.name)&&stats.has(norm(c.name))).filter(c=>cap===null||cents(c)!==null).sort((a,b)=>score(b)-score(a));
const LANDS=37;const wantNonbasic=identity.length<=1?8:identity.length===2?12:15;
const NONLAND=62;
if(spells.length<NONLAND)return out({error:`Solo ${spells.length} carte non terra utilizzabili: ne servono 62. Prova un altro comandante o rimuovi il budget.`},{status:422});
if(cap!==null&&cents(commander)===null&&cheapest.get(norm(commander.name))===undefined)return out({error:"Prezzo del comandante non disponibile su Scryfall: non posso verificare il budget totale. Riprova senza budget."},{status:422});
// quote minime per funzione: un mazzo Commander giocabile ha bisogno di mana, pescata e rimozioni
const QUOTA:Partial<Record<Role,number>>={ramp:10,draw:9,removal:7,wipe:2};
const roles=new Map(spells.map(c=>[norm(c.name),roleOf(c)]));
const rl=(c:Card)=>roles.get(norm(c.name))||"synergy";
function pickWithQuota(list:Card[],n:number){const chosen:Card[]=[];const seen=new Set<string>();
  for(const [r,q] of Object.entries(QUOTA) as [Role,number][]){for(const c of list.filter(c=>rl(c)===r).slice(0,q)){if(chosen.length<n&&!seen.has(norm(c.name))){chosen.push(c);seen.add(norm(c.name));}}}
  for(const c of list){if(chosen.length>=n)break;if(!seen.has(norm(c.name))){chosen.push(c);seen.add(norm(c.name));}}return chosen;}
const count=(l:Card[],r:Role)=>l.filter(c=>rl(c)===r).length;
let chosen:Card[];let nonbasics:Card[];
let estimatedBasics=false;
const basicCard=(name:string)=>{const c=pool.get(norm(name));if(!c)return null;if(cents(c)===null){estimatedBasics=true;return {...c,prices:{...c.prices,eur:(BASIC_ESTIMATE_CENTS/100).toFixed(2)}} as Card;}return c;};
const basicCards=basics.map(basicCard);if(basicCards.some(c=>!c))return out({error:"Non riesco a recuperare tutte le terre base."},{status:502});
const basicCost=Math.max(...(basicCards as Card[]).map(c=>cents(c)??BASIC_ESTIMATE_CENTS));
if(cap===null){
  chosen=pickWithQuota([...spells].sort((a,b)=>score(b)-score(a)),NONLAND);
  nonbasics=nonbasicPool.slice(0,wantNonbasic);
}else{
  // parte dalle carte più economiche (rispettando le quote), poi migliora finché il budget lo consente
  chosen=pickWithQuota([...spells].sort((a,b)=>cents(a)!-cents(b)!),NONLAND);
  nonbasics=[];
  const fixedCost=cents(commanderPriced)??0;
  let cost=fixedCost+chosen.reduce((n,c)=>n+cents(c)!,0)+LANDS*basicCost;
  if(cost>cap)return out({error:`Con i prezzi disponibili, questa base richiede almeno ${(cost/100).toFixed(2)} €. Non è un minimo globale: prova più budget o un altro comandante.`},{status:422});
  // terre non base: fino al 15% del budget, al posto di terre base
  const landShare=Math.floor(cap*0.15);let landSpent=0;
  for(const l of nonbasicPool){if(nonbasics.length>=wantNonbasic)break;const extra=cents(l)!-basicCost;if(landSpent+extra>landShare||cost+extra>cap)continue;nonbasics.push(l);landSpent+=extra;cost+=extra;}
  for(const candidate of [...spells].sort((a,b)=>score(b)-score(a))){if(chosen.some(c=>norm(c.name)===norm(candidate.name)))continue;
    const order=chosen.map((c,i)=>({c,i})).sort((a,b)=>score(a.c)-score(b.c));
    const replacement=order.find(x=>score(candidate)>score(x.c)&&cost-cents(x.c)!+cents(candidate)!<=cap&&(rl(x.c)===rl(candidate)||count(chosen,rl(x.c))>(QUOTA[rl(x.c)]??0)));
    if(replacement){cost=cost-cents(replacement.c)!+cents(candidate)!;chosen[replacement.i]=candidate;}}
}
// terre base divise in proporzione ai simboli di mana delle carte scelte (almeno 1 per colore)
const nBasic=LANDS-nonbasics.length;
const pips:Record<string,number>={};for(const c of basics)pips[c]=0;
const symbols=(c:Card)=>[c.mana_cost,...(c.card_faces||[]).map(f=>f.mana_cost)].filter(Boolean).join("");
const colorOfBasic:Record<string,string>={Plains:"W",Island:"U",Swamp:"B",Mountain:"R",Forest:"G",Wastes:"C"};
for(const c of [commanderPriced,...chosen])for(const m of symbols(c).matchAll(/\{([^}]+)\}/g)){for(const b of basics){const col=colorOfBasic[b];if(col&&m[1].split("/").includes(col))pips[b]+=m[1].includes("/")?0.5:1;}}
const totalPips=Object.values(pips).reduce((a,b)=>a+b,0);
let alloc=basics.map(b=>Math.max(1,totalPips>0?Math.round(nBasic*pips[b]/totalPips):Math.round(nBasic/basics.length)));
while(alloc.reduce((a,b)=>a+b,0)>nBasic){const i=alloc.indexOf(Math.max(...alloc));alloc[i]--;}
while(alloc.reduce((a,b)=>a+b,0)<nBasic){const i=basics.map((b,i)=>({i,r:(pips[b]||1)/alloc[i]})).sort((a,b)=>b.r-a.r)[0].i;alloc[i]++;}
const lands=[...nonbasics.map(card=>({card,quantity:1})),...(basicCards as Card[]).map((card,i)=>({card,quantity:alloc[i]})).filter(x=>x.quantity>0)];
const rows=[{card:commanderPriced,quantity:1},...chosen.map(card=>({card,quantity:1})),...lands];
if(rows.reduce((n,x)=>n+x.quantity,0)!==100)throw new Error("Controllo interno: numero carte non valido.");
return out({commander:commander.name,cards:rows.map(x=>({name:x.card.name,quantity:x.quantity,image:image(x.card),priceEUR:cents(x.card)===null?null:cents(x.card)!/100})),warnings:[`Base sperimentale: 1 comandante, 62 carte non terra e 37 terre (${nonbasics.length} non base, ${nBasic} base). Non è un mazzo competitivo.`,`Funzioni nel mazzo: ${count(chosen,"ramp")} rampa, ${count(chosen,"draw")} pescata, ${count(chosen,"removal")} rimozioni, ${count(chosen,"wipe")} rimozioni di massa (stima dal testo delle carte).`,"Terre base divise in proporzione ai simboli di mana delle carte. La selezione usa dati EDHREC, colori, legalità e prezzo.","Prezzi della stampa più economica con prezzo in euro su Scryfall; spedizione esclusa. Nessun prezzo garantito.",...(estimatedBasics?["Prezzo delle terre base stimato a 0,10 € ciascuna."]:[]),...(rows.some(x=>cents(x.card)===null)?["Alcuni prezzi mancano: il totale è un subtotale."]:[])]});
}catch(error){console.error(error);return out({error:error instanceof Error?error.message:"Errore di generazione."},{status:502});}}
