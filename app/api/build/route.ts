import { NextResponse } from "next/server";
import { commanderPage, EdhrecError } from "../../../lib/edhrec";
import {localize} from "../../../lib/messages";
export const runtime = "nodejs";
export const maxDuration = 60;
type Card = { name:string; oracle_id?:string; type_line:string; oracle_text?:string; color_identity:string[]; legalities:Record<string,string>; prices?:{eur?:string|null}; image_uris?:{normal?:string}; card_faces?:{type_line?:string;oracle_text?:string;image_uris?:{normal?:string}}[] };
const norm=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const image=(c:Card)=>c.image_uris?.normal||c.card_faces?.find(f=>f.image_uris?.normal)?.image_uris?.normal||null;
const cents=(c:Card)=>{const p=c.prices?.eur;return p!=null&&Number.isFinite(Number(p))&&Number(p)>=0?Math.round(Number(p)*100):null;};
const headers={"Content-Type":"application/json","User-Agent":"PreconUpgrade/1.0"};
const wait=()=>new Promise(resolve=>setTimeout(resolve,550));
async function scry(url:string,init?:RequestInit){const res=await fetch(url,{...init,headers,cache:"no-store",signal:AbortSignal.timeout(15000)});if(!res.ok)throw new Error(res.status===429?"Scryfall è temporaneamente limitato. Attendi e riprova.":"Scryfall non ha restituito le carte richieste. Controlla il nome ufficiale del comandante.");return res.json();}
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
let data:any;try{data=await commanderPage(commander.name);}catch(err){return out({error:err instanceof EdhrecError&&err.status===429?err.message:"Dati EDHREC non disponibili per questo comandante. Il generatore non può completare la lista."},{status:err instanceof EdhrecError&&err.status===429?429:502});}const stats=new Map<string,{name:string;score:number}>();
for(const list of data?.container?.json_dict?.cardlists||[])for(const v of list.cardviews||[]){if(typeof v.name!=="string")continue;const score=Number(v.synergy??0)+Number(v.inclusion??0)*0.001;const previous=stats.get(norm(v.name));if(!previous||score>previous.score)stats.set(norm(v.name),{name:v.name,score:Number.isFinite(score)?score:0});}
const names=[...stats.values()].sort((a,b)=>b.score-a.score).slice(0,300).map(s=>s.name);
const basicNames:Record<string,string>={W:"Plains",U:"Island",B:"Swamp",R:"Mountain",G:"Forest"};
const basics=identity.length?identity.map(c=>basicNames[c]):["Wastes"];
const unique=[...new Set([...names,...basics])];const all:Card[]=[];
for(let i=0;i<unique.length;i+=75){await wait();const batch=await scry("https://api.scryfall.com/cards/collection",{method:"POST",body:JSON.stringify({identifiers:unique.slice(i,i+75).map(name=>({name}))})});all.push(...(batch.data||[]));}
const pool=new Map<string,Card>();for(const c of all){if(c.legalities?.commander!=="legal"||c.color_identity.some(x=>!identity.includes(x)))continue;pool.set(norm(c.name),c);}
const spells=[...pool.values()].filter(c=>norm(c.name)!==norm(commander.name)&&!c.type_line.includes("Land")&&stats.has(norm(c.name))).filter(c=>cap===null||cents(c)!==null);
if(spells.length<62)return out({error:`Solo ${spells.length} carte non terra utilizzabili: ne servono 62. Prova un altro comandante o rimuovi il budget.`},{status:422});
const landCards=basics.map(name=>pool.get(norm(name)));if(landCards.some(c=>!c))return out({error:"Non riesco a recuperare tutte le terre base."},{status:502});
const lands=(landCards as Card[]).map((card,i)=>({card,quantity:Math.floor(37/basics.length)+(i<37%basics.length?1:0)}));
const fixed=[{card:commander,quantity:1},...lands];if(cap!==null&&fixed.some(x=>cents(x.card)===null))return out({error:"Prezzo mancante per comandante o terre: non posso verificare il budget totale."},{status:422});
const fixedCost=fixed.reduce((sum,x)=>sum+(cents(x.card)??0)*x.quantity,0);
let chosen:Card[];
if(cap===null){chosen=spells.sort((a,b)=>(stats.get(norm(b.name))?.score??0)-(stats.get(norm(a.name))?.score??0)).slice(0,62);}
else {
chosen=[...spells].sort((a,b)=>cents(a)!-cents(b)!).slice(0,62);let cost=fixedCost+chosen.reduce((n,c)=>n+cents(c)!,0);
if(cost>cap)return out({error:`Con i prezzi disponibili, questa base richiede almeno ${(cost/100).toFixed(2)} €. Non è un minimo globale: prova più budget o un altro comandante.`},{status:422});
for(const candidate of [...spells].sort((a,b)=>(stats.get(norm(b.name))?.score??0)-(stats.get(norm(a.name))?.score??0))){if(chosen.some(c=>norm(c.name)===norm(candidate.name)))continue;const order=chosen.map((c,i)=>({c,i})).sort((a,b)=>(stats.get(norm(a.c.name))?.score??0)-(stats.get(norm(b.c.name))?.score??0));const replacement=order.find(x=>(stats.get(norm(candidate.name))?.score??0)>(stats.get(norm(x.c.name))?.score??0)&&cost-cents(x.c)!+cents(candidate)!<=cap);if(replacement){cost=cost-cents(replacement.c)!+cents(candidate)!;chosen[replacement.i]=candidate;}}
}
const rows=[{card:commander,quantity:1},...chosen.map(card=>({card,quantity:1})),...lands];
if(rows.reduce((n,x)=>n+x.quantity,0)!==100)throw new Error("Controllo interno: numero carte non valido.");
return out({commander:commander.name,cards:rows.map(x=>({name:x.card.name,quantity:x.quantity,image:image(x.card),priceEUR:cents(x.card)===null?null:cents(x.card)!/100})),warnings:["Base sperimentale: 1 comandante, 62 carte non terra e 37 terre base. Non è una valutazione strategica o un mazzo competitivo.","Terre distribuite uniformemente tra i colori, non in base ai simboli di mana. Correggi la base di mana prima di giocare.","La selezione usa dati EDHREC, colori, legalità e prezzo. Non garantisce pescata, accelerazione, rimozioni o combo sufficienti.","Prezzi delle stampe restituite da Scryfall, non necessariamente le più economiche; spedizione esclusa. Nessun prezzo garantito.",...(rows.some(x=>cents(x.card)===null)?["Alcuni prezzi mancano: il totale è un subtotale."]:[])]});
}catch(error){console.error(error);return out({error:error instanceof Error?error.message:"Errore di generazione."},{status:502});}}
