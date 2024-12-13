(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var V,Ue;class ct extends Error{}ct.prototype.name="InvalidTokenError";function ti(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function ei(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return ti(t)}catch{return atob(t)}}function ls(r,t){if(typeof r!="string")throw new ct("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new ct(`Invalid token specified: missing part #${e+1}`);let i;try{i=ei(s)}catch(n){throw new ct(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new ct(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const si="mu:context",se=`${si}:change`;class ii{constructor(t,e){this._proxy=ri(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ce extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ii(t,this),this.style.display="contents"}attach(t){return this.addEventListener(se,t),t}detach(t){this.removeEventListener(se,t)}}function ri(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(se,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ni(r,t){const e=cs(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function cs(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return cs(r,i.host)}class oi extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function hs(r="mu:message"){return(t,...e)=>t.dispatchEvent(new oi(e,r))}class he{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ai(r){return t=>({...t,...r})}const ie="mu:auth:jwt",us=class ds extends he{constructor(t,e){super((s,i)=>this.update(s,i),t,ds.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ci(s)),Jt(i);case"auth/signout":return e(hi()),Jt(this._redirectForLogin);case"auth/redirect":return Jt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};us.EVENT_TYPE="auth:message";let ps=us;const gs=hs(ps.EVENT_TYPE);function Jt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class li extends ce{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=Z.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new ps(this.context,this.redirect).attach(this)}}class J{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ie),t}}class Z extends J{constructor(t){super();const e=ls(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new Z(t);return localStorage.setItem(ie,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ie);return t?Z.authenticate(t):new J}}function ci(r){return ai({user:Z.authenticate(r),token:r})}function hi(){return r=>{const t=r.user;return{user:t&&t.authenticated?J.deauthenticate(t):t,token:""}}}function ui(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function di(r){return r.authenticated?ls(r.token||""):{}}const fs=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:Z,Provider:li,User:J,dispatch:gs,headers:ui,payload:di},Symbol.toStringTag,{value:"Module"}));function Ot(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function re(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const pi=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:re,relay:Ot},Symbol.toStringTag,{value:"Module"}));function ms(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const gi=new DOMParser;function z(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const g=e[d-1];return g instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[g,a]}).flat().join(""),i=gi.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const g=o.querySelector(`ins#mu-html-${d}`);if(g){const u=g.parentNode;u==null||u.replaceChild(a,g)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ie(a);case"bigint":case"boolean":case"number":case"symbol":return Ie(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const g=new DocumentFragment,u=a.map(l);return g.replaceChildren(...u),g}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ie(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Dt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let fi=(V=class extends HTMLElement{constructor(){super(),this._state={},Dt(this).template(V.template).styles(V.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Ot(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},mi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},V.template=z`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,V.styles=ms`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,V);function mi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const vi=Object.freeze(Object.defineProperty({__proto__:null,Element:fi},Symbol.toStringTag,{value:"Module"})),vs=class ys extends he{constructor(t){super((e,s)=>this.update(e,s),t,ys.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(_i(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e($i(s,i));break}}}};vs.EVENT_TYPE="history:message";let ue=vs;class Ne extends ce{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=yi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),de(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ue(this.context).attach(this)}}function yi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function _i(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function $i(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const de=hs(ue.EVENT_TYPE),pe=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Ne,Provider:Ne,Service:ue,dispatch:de},Symbol.toStringTag,{value:"Module"}));class pt{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Me(this._provider,t);this._effects.push(i),e(i)}else ni(this._target,this._contextLabel).then(i=>{const n=new Me(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const _s=class $s extends HTMLElement{constructor(){super(),this._state={},this._user=new J,this._authObserver=new pt(this,"blazing:auth"),Dt(this).template($s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;bi(i,this._state,e,this.authorization).then(n=>nt(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},nt(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Le(this.src,this.authorization).then(e=>{this._state=e,nt(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Le(this.src,this.authorization).then(i=>{this._state=i,nt(i,this)});break;case"new":s&&(this._state={},nt({},this));break}}};_s.observedAttributes=["src","new","action"];_s.template=z`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Le(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function nt(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function bi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const bs=class ws extends he{constructor(t,e){super(e,t,ws.EVENT_TYPE,!1)}};bs.EVENT_TYPE="mu:message";let As=bs;class wi extends ce{constructor(t,e,s){super(e),this._user=new J,this._updateFn=t,this._authObserver=new pt(this,s)}connectedCallback(){const t=new As(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const Ai=Object.freeze(Object.defineProperty({__proto__:null,Provider:wi,Service:As},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,ge=kt.ShadowRoot&&(kt.ShadyCSS===void 0||kt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,fe=Symbol(),je=new WeakMap;let Es=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==fe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ge&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&je.set(e,t))}return t}toString(){return this.cssText}};const Ei=r=>new Es(typeof r=="string"?r:r+"",void 0,fe),Si=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Es(e,r,fe)},xi=(r,t)=>{if(ge)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=kt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},ze=ge?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Ei(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Pi,defineProperty:ki,getOwnPropertyDescriptor:Ci,getOwnPropertyNames:Oi,getOwnPropertySymbols:Ti,getPrototypeOf:Ri}=Object,Q=globalThis,He=Q.trustedTypes,Ui=He?He.emptyScript:"",De=Q.reactiveElementPolyfillSupport,ht=(r,t)=>r,Tt={toAttribute(r,t){switch(t){case Boolean:r=r?Ui:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},me=(r,t)=>!Pi(r,t),Fe={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:me};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Fe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&ki(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Ci(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Fe}static _$Ei(){if(this.hasOwnProperty(ht("elementProperties")))return;const t=Ri(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ht("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ht("properties"))){const e=this.properties,s=[...Oi(e),...Ti(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(ze(i))}else t!==void 0&&e.push(ze(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xi(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:Tt).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Tt;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??me)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[ht("elementProperties")]=new Map,W[ht("finalized")]=new Map,De==null||De({ReactiveElement:W}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Rt=globalThis,Ut=Rt.trustedTypes,Be=Ut?Ut.createPolicy("lit-html",{createHTML:r=>r}):void 0,Ss="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,xs="?"+P,Ii=`<${xs}>`,H=document,gt=()=>H.createComment(""),ft=r=>r===null||typeof r!="object"&&typeof r!="function",ve=Array.isArray,Ni=r=>ve(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Zt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,qe=/-->/g,Ve=/>/g,N=RegExp(`>|${Zt}(?:([^\\s"'>=/]+)(${Zt}*=${Zt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,We=/"/g,Ps=/^(?:script|style|textarea|title)$/i,Mi=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),at=Mi(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ye=new WeakMap,L=H.createTreeWalker(H,129);function ks(r,t){if(!ve(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Be!==void 0?Be.createHTML(t):t}const Li=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=r[l];let d,g,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,g=o.exec(a),g!==null);)c=o.lastIndex,o===ot?g[1]==="!--"?o=qe:g[1]!==void 0?o=Ve:g[2]!==void 0?(Ps.test(g[2])&&(i=RegExp("</"+g[2],"g")),o=N):g[3]!==void 0&&(o=N):o===N?g[0]===">"?(o=i??ot,u=-1):g[1]===void 0?u=-2:(u=o.lastIndex-g[2].length,d=g[1],o=g[3]===void 0?N:g[3]==='"'?We:Ge):o===We||o===Ge?o=N:o===qe||o===Ve?o=ot:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===ot?a+Ii:u>=0?(s.push(d),a.slice(0,u)+Ss+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[ks(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ne=class Cs{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,g]=Li(t,e);if(this.el=Cs.createElement(d,s),L.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=L.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Ss)){const c=g[o++],h=i.getAttribute(u).split(P),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?zi:p[1]==="?"?Hi:p[1]==="@"?Di:Ft}),i.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Ps.test(i.tagName)){const u=i.textContent.split(P),c=u.length-1;if(c>0){i.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],gt()),L.nextNode(),a.push({type:2,index:++n});i.append(u[c],gt())}}}else if(i.nodeType===8)if(i.data===xs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=H.createElement("template");return s.innerHTML=t,s}};function tt(r,t,e=r,s){var i,n;if(t===X)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=ft(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=tt(r,o._$AS(r,t.values),o,s)),t}class ji{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??H).importNode(e,!0);L.currentNode=i;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new wt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Fi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=H,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class wt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),ft(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ni(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(H.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ne.createElement(ks(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new ji(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ye.get(t.strings);return e===void 0&&Ye.set(t.strings,e=new ne(t)),e}k(t){ve(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new wt(this.O(gt()),this.O(gt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Ft{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class zi extends Ft{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Hi extends Ft{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Di extends Ft{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Fi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Ke=Rt.litHtmlPolyfillSupport;Ke==null||Ke(ne,wt),(Rt.litHtmlVersions??(Rt.litHtmlVersions=[])).push("3.2.0");const Bi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new wt(t.insertBefore(gt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let K=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Bi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return X}};K._$litElement$=!0,K.finalized=!0,(Ue=globalThis.litElementHydrateSupport)==null||Ue.call(globalThis,{LitElement:K});const Je=globalThis.litElementPolyfillSupport;Je==null||Je({LitElement:K});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qi={attribute:!0,type:String,converter:Tt,reflect:!1,hasChanged:me},Vi=(r=qi,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Os(r){return(t,e)=>typeof e=="object"?Vi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Ts(r){return Os({...r,state:!0,attribute:!1})}function Gi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function Wi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Rs={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,m,f,v,Vt){var A=v.length-1;switch(f){case 1:return new m.Root({},[v[A-1]]);case 2:return new m.Root({},[new m.Literal({value:""})]);case 3:this.$=new m.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new m.Literal({value:v[A]});break;case 7:this.$=new m.Splat({name:v[A]});break;case 8:this.$=new m.Param({name:v[A]});break;case 9:this.$=new m.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(m,f){this.message=m,this.hash=f};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],m=[null],f=[],v=this.table,Vt="",A=0,Oe=0,Js=2,Te=1,Zs=f.slice.call(arguments,1),_=Object.create(this.lexer),U={yy:{}};for(var Gt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Gt)&&(U.yy[Gt]=this.yy[Gt]);_.setInput(c,U.yy),U.yy.lexer=_,U.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Wt=_.yylloc;f.push(Wt);var Qs=_.options&&_.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Xs=function(){var q;return q=_.lex()||Te,typeof q!="number"&&(q=h.symbols_[q]||q),q},w,I,E,Yt,B={},xt,S,Re,Pt;;){if(I=p[p.length-1],this.defaultActions[I]?E=this.defaultActions[I]:((w===null||typeof w>"u")&&(w=Xs()),E=v[I]&&v[I][w]),typeof E>"u"||!E.length||!E[0]){var Kt="";Pt=[];for(xt in v[I])this.terminals_[xt]&&xt>Js&&Pt.push("'"+this.terminals_[xt]+"'");_.showPosition?Kt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+Pt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Kt="Parse error on line "+(A+1)+": Unexpected "+(w==Te?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Kt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Wt,expected:Pt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+I+", token: "+w);switch(E[0]){case 1:p.push(w),m.push(_.yytext),f.push(_.yylloc),p.push(E[1]),w=null,Oe=_.yyleng,Vt=_.yytext,A=_.yylineno,Wt=_.yylloc;break;case 2:if(S=this.productions_[E[1]][1],B.$=m[m.length-S],B._$={first_line:f[f.length-(S||1)].first_line,last_line:f[f.length-1].last_line,first_column:f[f.length-(S||1)].first_column,last_column:f[f.length-1].last_column},Qs&&(B._$.range=[f[f.length-(S||1)].range[0],f[f.length-1].range[1]]),Yt=this.performAction.apply(B,[Vt,Oe,A,U.yy,E[1],m,f].concat(Zs)),typeof Yt<"u")return Yt;S&&(p=p.slice(0,-1*S*2),m=m.slice(0,-1*S),f=f.slice(0,-1*S)),p.push(this.productions_[E[1]][0]),m.push(B.$),f.push(B._$),Re=v[p[p.length-2]][p[p.length-1]],p.push(Re);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var m=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var f=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===m.length?this.yylloc.first_column:0)+m[m.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[f[0],f[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,m,f;if(this.options.backtrack_lexer&&(f={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(f.yylloc.range=this.yylloc.range.slice(0))),m=c[0].match(/(?:\r\n?|\n).*/g),m&&(this.yylineno+=m.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:m?m[m.length-1].length-m[m.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in f)this[v]=f[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,m;this._more||(this.yytext="",this.match="");for(var f=this._currentRules(),v=0;v<f.length;v++)if(p=this._input.match(this.rules[f[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,m=v,this.options.backtrack_lexer){if(c=this.test_match(p,f[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,f[m]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,m,f){switch(m){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function g(){this.yy={}}return g.prototype=a,a.Parser=g,new g}();typeof Wi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Rs);function G(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Us={Root:G("Root"),Concat:G("Concat"),Literal:G("Literal"),Splat:G("Splat"),Param:G("Param"),Optional:G("Optional")},Is=Rs.parser;Is.yy=Us;var Yi=Is,Ki=Object.keys(Us);function Ji(r){return Ki.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ns=Ji,Zi=Ns,Qi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ms(r){this.captures=r.captures,this.re=r.re}Ms.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Xi=Zi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Qi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ms({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),tr=Xi,er=Ns,sr=er({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),ir=sr,rr=Yi,nr=tr,or=ir;At.prototype=Object.create(null);At.prototype.match=function(r){var t=nr.visit(this.ast),e=t.match(r);return e||!1};At.prototype.reverse=function(r){return or.visit(this.ast,r)};function At(r){var t;if(this?t=this:t=Object.create(At.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=rr.parse(r),t}var ar=At,lr=ar,cr=lr;const hr=Gi(cr);var ur=Object.defineProperty,Ls=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&ur(t,e,i),i};const js=class extends K{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>at` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new hr(i.path)})),this._historyObserver=new pt(this,e),this._authObserver=new pt(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),at` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(gs(this,"auth/redirect"),at` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):at` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),at` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){de(this,"history/redirect",{href:t})}};js.styles=Si`
    :host,
    main {
      display: contents;
    }
  `;let It=js;Ls([Ts()],It.prototype,"_user");Ls([Ts()],It.prototype,"_match");const dr=Object.freeze(Object.defineProperty({__proto__:null,Element:It,Switch:It},Symbol.toStringTag,{value:"Module"})),pr=class zs extends HTMLElement{constructor(){if(super(),Dt(this).template(zs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};pr.template=z`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;const Hs=class oe extends HTMLElement{constructor(){super(),this._array=[],Dt(this).template(oe.template).styles(oe.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ds("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{re(t,"button.add")?Ot(t,"input-array:add"):re(t,"button.remove")&&Ot(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],gr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Hs.template=z`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Hs.styles=ms`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;function gr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ds(e)))}function Ds(r,t){const e=r===void 0?z`<input />`:z`<input value="${r}" />`;return z`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function Bt(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var fr=Object.defineProperty,mr=Object.getOwnPropertyDescriptor,vr=(r,t,e,s)=>{for(var i=mr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&fr(t,e,i),i};class rt extends K{constructor(t){super(),this._pending=[],this._observer=new pt(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}vr([Os()],rt.prototype,"model");const yr={};function _r(r,t,e){switch(r[0]){case"game/save":Er(r[1]).then(i=>t(n=>({...n,game:i}))).then(()=>{const{onSuccess:i}=r[1];i&&i()}).catch(i=>{const{onFailure:n}=r[1];n&&n(i)});break;case"game/select":Ar(r[1]).then(i=>t(n=>({...n,game:i})));break;case"account/select":wr(r[1],e).then(i=>t(n=>({...n,account:i})));break;case"rating/select":br().then(()=>t(i=>({...i})));break;case"recommendation/select":$r().then(()=>t(i=>({...i})));break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function $r(){return fetch("/api/games").then(r=>{if(r.status===200)return r.json()}).then(r=>{if(r)return r})}function br(){return fetch("/api/games").then(r=>{if(r.status===200)return r.json()}).then(r=>{if(r)return r})}function wr(r,t){return fetch(`/api/accounts/${r.userId}`,{headers:fs.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log("Account:",e),e})}function Ar(r){return fetch(`/api/games/${r.gameId}`).then(t=>{if(t.status===200)return t.json()}).then(t=>{if(t)return console.log("Game:",t),t})}function Er(r){return fetch(`/api/games/${r.gameId}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(r.game)}).then(t=>{if(t.status===200)return t.json();throw new Error(`Failed to save game for ${r.gameId}`)}).then(t=>{if(t)return console.log("Game: ",t),t})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ct=globalThis,ye=Ct.ShadowRoot&&(Ct.ShadyCSS===void 0||Ct.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,_e=Symbol(),Ze=new WeakMap;let Fs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==_e)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ye&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ze.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ze.set(e,t))}return t}toString(){return this.cssText}};const Sr=r=>new Fs(typeof r=="string"?r:r+"",void 0,_e),R=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Fs(e,r,_e)},xr=(r,t)=>{if(ye)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=Ct.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Qe=ye?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return Sr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Pr,defineProperty:kr,getOwnPropertyDescriptor:Cr,getOwnPropertyNames:Or,getOwnPropertySymbols:Tr,getPrototypeOf:Rr}=Object,C=globalThis,Xe=C.trustedTypes,Ur=Xe?Xe.emptyScript:"",Qt=C.reactiveElementPolyfillSupport,ut=(r,t)=>r,Nt={toAttribute(r,t){switch(t){case Boolean:r=r?Ur:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},$e=(r,t)=>!Pr(r,t),ts={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:$e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),C.litPropertyMetadata??(C.litPropertyMetadata=new WeakMap);class Y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ts){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&kr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=Cr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ts}static _$Ei(){if(this.hasOwnProperty(ut("elementProperties")))return;const t=Rr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ut("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ut("properties"))){const e=this.properties,s=[...Or(e),...Tr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Qe(i))}else t!==void 0&&e.push(Qe(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return xr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Nt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Nt;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??$e)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[ut("elementProperties")]=new Map,Y[ut("finalized")]=new Map,Qt==null||Qt({ReactiveElement:Y}),(C.reactiveElementVersions??(C.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const dt=globalThis,Mt=dt.trustedTypes,es=Mt?Mt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Bs="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,qs="?"+k,Ir=`<${qs}>`,D=document,mt=()=>D.createComment(""),vt=r=>r===null||typeof r!="object"&&typeof r!="function",be=Array.isArray,Nr=r=>be(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Xt=`[ 	
\f\r]`,lt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ss=/-->/g,is=/>/g,M=RegExp(`>|${Xt}(?:([^\\s"'>=/]+)(${Xt}*=${Xt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rs=/'/g,ns=/"/g,Vs=/^(?:script|style|textarea|title)$/i,Mr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=Mr(1),et=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),os=new WeakMap,j=D.createTreeWalker(D,129);function Gs(r,t){if(!be(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return es!==void 0?es.createHTML(t):t}const Lr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=lt;for(let l=0;l<e;l++){const a=r[l];let d,g,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,g=o.exec(a),g!==null);)c=o.lastIndex,o===lt?g[1]==="!--"?o=ss:g[1]!==void 0?o=is:g[2]!==void 0?(Vs.test(g[2])&&(i=RegExp("</"+g[2],"g")),o=M):g[3]!==void 0&&(o=M):o===M?g[0]===">"?(o=i??lt,u=-1):g[1]===void 0?u=-2:(u=o.lastIndex-g[2].length,d=g[1],o=g[3]===void 0?M:g[3]==='"'?ns:rs):o===ns||o===rs?o=M:o===ss||o===is?o=lt:(o=M,i=void 0);const h=o===M&&r[l+1].startsWith("/>")?" ":"";n+=o===lt?a+Ir:u>=0?(s.push(d),a.slice(0,u)+Bs+a.slice(u)+k+h):a+k+(u===-2?l:h)}return[Gs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class yt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,g]=Lr(t,e);if(this.el=yt.createElement(d,s),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=j.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Bs)){const c=g[o++],h=i.getAttribute(u).split(k),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?zr:p[1]==="?"?Hr:p[1]==="@"?Dr:qt}),i.removeAttribute(u)}else u.startsWith(k)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(Vs.test(i.tagName)){const u=i.textContent.split(k),c=u.length-1;if(c>0){i.textContent=Mt?Mt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],mt()),j.nextNode(),a.push({type:2,index:++n});i.append(u[c],mt())}}}else if(i.nodeType===8)if(i.data===qs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(k,u+1))!==-1;)a.push({type:7,index:n}),u+=k.length-1}n++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function st(r,t,e=r,s){var o,l;if(t===et)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=vt(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=st(r,i._$AS(r,t.values),i,s)),t}class jr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??D).importNode(e,!0);j.currentNode=i;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new Et(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Fr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=D,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Et{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),vt(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Nr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&vt(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=yt.createElement(Gs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new jr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=os.get(t.strings);return e===void 0&&os.set(t.strings,e=new yt(t)),e}k(t){be(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new Et(this.O(mt()),this.O(mt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!vt(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[s+a],e,a),d===et&&(d=this._$AH[a]),o||(o=!vt(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class zr extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Hr extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Dr extends qt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??b)===et)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Fr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const te=dt.litHtmlPolyfillSupport;te==null||te(yt,Et),(dt.litHtmlVersions??(dt.litHtmlVersions=[])).push("3.2.1");const Br=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new Et(t.insertBefore(mt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let O=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Br(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return et}};var as;O._$litElement$=!0,O.finalized=!0,(as=globalThis.litElementHydrateSupport)==null||as.call(globalThis,{LitElement:O});const ee=globalThis.litElementPolyfillSupport;ee==null||ee({LitElement:O});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const qr={attribute:!0,type:String,converter:Nt,reflect:!1,hasChanged:$e},Vr=(r=qr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function F(r){return(t,e)=>typeof e=="object"?Vr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function x(r){return F({...r,state:!0,attribute:!1})}const Ae=class Ae extends O{render(){return y`
      <header>
        <slot name="game-name">
          <h1><a href="./game.html"> Game </a></h1>
        </slot>
      </header>
      <ul>
        <li><slot name="price"> Price </slot></li>
        <li><slot name="genre"> Genre </slot></li>
        <li><slot name="rating"> Rating </slot></li>
        <li><slot name="player-count"> Players playing </slot></li>
      </ul>
    `}};Ae.styles=R`
    header {
      color: var(--color-text);
      display: flex;
      align-items: center;
      justify-content: space-evenly;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    li {
      display: flex;
      align-items: center;
    }
  `;let ae=Ae;const Ee=class Ee extends O{render(){return y`
      <header>
        <h1>Steam Games Essentials</h1>
        <div>
          <a href="/app/ratings"> Games Rated </a>
          <svg class="icon"><use href="./icons/game.svg#icon-rate" /></svg>
        </div>
        <div>
          <a href="/app/recommendations"> Recommended Games </a>
          <svg class="icon"><use href="./icons/game.svg#icon-rec" /></svg>
        </div>
        <label @change=${Gr}>
          <input type="checkbox" autocomplete="off" />
          Dark mode
        </label>
        <h3>
          <a href="/app/accounts/1">
            <svg class="icon">
              <use href="./icons/game.svg#icon-user" />
            </svg>
            Account
          </a>
        </h3>
      </header>
    `}static initializeOnce(){function t(e,s){e.classList.toggle("dark-mode",s)}document.body.addEventListener("dark-mode",e=>{var s;return t(e.currentTarget,(s=e.detail)==null?void 0:s.checked)})}};Ee.styles=R`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    header h3,
    header div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    a {
      color: var(--color-link);
    }
  `;let Lt=Ee;function Gr(r){const e=r.target.checked;pi.relay(r,"dark-mode",{checked:e})}var Wr=Object.defineProperty,Yr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Wr(t,e,i),i};const zt=class zt extends O{constructor(){super(...arguments),this.src="/api/games",this.gameIndex=new Array}render(){const t=this.gameIndex.map(this.renderItem);return y`
      <page-header></page-header>
      <div class="game-layout">${t}</div>
    `}renderItem(t){const{gameId:e,name:s,price:i,genre:n,rating:o,playerCount:l}=t;return y` <a href="/app/games/${e}"
      ><game-card>
        <h1 slot="game-name">${s}</h1>
        <li slot="price">Price: ${i}</li>
        <li slot="genre">Genre: ${n}</li>
        <li slot="rating">Rating: ${o}</li>
        <li slot="player-count">Current Players: ${l}</li>
      </game-card></a
    >`}hydrate(t){fetch(t).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{if(e){const s=e;this.gameIndex=s}}).catch(e=>console.log("Failed to game data:",e))}connectedCallback(){super.connectedCallback(),this.src&&this.hydrate(this.src),Lt.initializeOnce()}};zt.uses=Bt({"game-card":ae,"page-header":Lt}),zt.styles=R`
    body {
      background-color: var(--color-background-page);
      color: var(--color-text);
      font-family: var(--font-family-serif);
      font-weight: var(--font-weight-normal);
    }
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      align-items: center;
    }
    .review {
      display: flex;
      justify-content: center;
      margin: 1vh auto;
    }
    .review-text {
      width: 90vw;
      height: 50vh;
    }
    .rating {
      margin: 1vh auto;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    p {
      padding: var(--padding-normal);
    }
    .game-layout {
      --page-grids: 6;
      display: grid;
      grid-template-columns: repeat(var(--page-grids), 1fr);
      row-gap: 5em;
      width: 100%;
    }
    .game-layout a {
      text-decoration: none;
    }
    @media screen and (max-width: 50rem) {
      .game-layout {
        --page-grids: 4;
        display: grid;
        grid-template-columns: repeat(var(--page-grids), 1fr);
        row-gap: 5em;
        width: 100%;
      }
    }
    @media screen and (max-width: 30rem) {
      .game-layout {
        --page-grids: 3;
        display: grid;
        grid-template-columns: repeat(var(--page-grids), 1fr);
        row-gap: 5em;
        width: 100%;
      }
    }
    @media screen and (min-width: 100rem) {
      .game-layout {
        --page-grids: 12;
        display: grid;
        grid-template-columns: repeat(var(--page-grids), 1fr);
        row-gap: 5em;
        width: 100%;
      }
    }
  `;let jt=zt;Yr([x()],jt.prototype,"gameIndex");var Kr=Object.defineProperty,Jr=Object.getOwnPropertyDescriptor,St=(r,t,e,s)=>{for(var i=s>1?void 0:s?Jr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Kr(t,e,i),i};const Se=class Se extends rt{constructor(){super("stats:model"),this.url=`/api/games/${this.gameId}`}get game(){return this.model.game}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),this.mode="view",t==="gameid"&&e!==s&&s&&this.dispatchMessage(["game/select",{gameId:s}])}render(){const{name:t,price:e,genre:s,rating:i,playerCount:n,userRating:o}=this.game||{};return y`
      <header>
        <h1>${t}</h1>
        <div>
          <a href="../ratings"> Games Rated </a>
          <svg class="icon"><use href="../../icons/game.svg#icon-rate" /></svg>
        </div>
        <div>
          <a href="../recommendations"> Recommended Games </a>
          <svg class="icon"><use href="../../icons/game.svg#icon-rec" /></svg>
        </div>
        <h3>
          <a href="../accounts/1"
            ><svg class="icon">
              <use href="../../icons/game.svg#icon-user" />
            </svg>
            Account
          </a>
        </h3>
      </header>
      <a href="../../">Back to Main</a>
      <section class="view">
        <div
          id="game-content"
          style="background-image: url('../../image/video-game-background.png')"
        >
          <ul>
            <li><slot name="price"> ${e} </slot></li>
            <li><slot name="genre"> ${s} </slot></li>
            <li><slot name="rating"> ${i} </slot></li>
            <li><slot name="player-count"> ${n} </slot></li>
          </ul>
        </div>
        <span
          ><slot name="user-rating"> ${o||"No Rating"} </slot></span
        >
        <button
          id="edit"
          @click="${()=>pe.dispatch(this,"history/navigate",{href:`/app/games/${this.gameId}/edit`})}"
        >
          Edit
        </button>
      </section>
      <mu-form class="edit" .init=${this.game}> </mu-form>
    `}};Se.styles=R`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    header h3,
    header div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      flex-direction: column;
      color: black;
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    span {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    #game-content {
      height: 100vh;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 50% 0%;
    }
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }
    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form.edit {
      display: var(--display-editor-none, grid);
    }
  `;let T=Se;St([F()],T.prototype,"gameId",2);St([x()],T.prototype,"game",1);St([F({reflect:!0})],T.prototype,"mode",2);St([F()],T.prototype,"url",2);St([x()],T.prototype,"form",2);var Zr=Object.defineProperty,Qr=Object.getOwnPropertyDescriptor,Ws=(r,t,e,s)=>{for(var i=s>1?void 0:s?Qr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Zr(t,e,i),i};const Ht=class Ht extends rt{get game(){return this.model.game}handleSubmit(t){if(this.game&&this.gameid){const e=t.detail,s=this.shadowRoot.querySelector("input[id='like']"),i=this.shadowRoot.querySelector("input[id='dislike']");let n=null;s!=null&&s.checked&&(n="I Recommend This Game!"),i!=null&&i.checked&&(n="I Do Not Recommend This Game!"),e.userRating=n,delete e["user-rating"],this.dispatchMessage(["game/save",{gameId:this.gameid,game:e,onSuccess:()=>pe.dispatch(this,"history/navigate",{href:`/app/games/${this.gameid}`}),onFailure:o=>console.log("error: ",o)}])}}constructor(){super("stats:model")}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="gameid"&&e!==s&&s&&this.dispatchMessage(["game/select",{gameId:s}])}render(){const{name:t}=this.game||{};return y`
      <main class="edit">
        <header>
          <h1>${t}</h1>
          <div>
            <a href="../ratings"> Games Rated </a>
            <svg class="icon">
              <use href="../../icons/game.svg#icon-rate" />
            </svg>
          </div>
          <div>
            <a href="../recommendations"> Recommended Games </a>
            <svg class="icon"><use href="../../icons/game.svg#icon-rec" /></svg>
          </div>
          <h3>
            <a href="../accounts/1"
              ><svg class="icon">
                <use href="../../icons/game.svg#icon-user" />
              </svg>
              Account
            </a>
          </h3>
        </header>
        <mu-form .init=${this.game} @mu-form:submit=${this.handleSubmit}>
          <span> Played this game? Rate it! </span>
          <div id="rating">
            <label class="rating-option">
              <svg class="icon">
                <use href="../../../icons/game.svg#icon-like" />
              </svg>
              <input type="radio" id="like" name="user-rating" value="like" />
            </label>
            <label class="rating-option">
              <svg class="icon">
                <use href="../../../icons/game.svg#icon-dislike" />
              </svg>
              <input
                type="radio"
                id="dislike"
                name="user-rating"
                value="dislike"
              />
            </label>
          </div>
        </mu-form>
      </main>
    `}};Ht.uses=Bt({"mu-form":vi.Element}),Ht.styles=R`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    header h3,
    header div {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      flex-direction: column;
      color: black;
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    span {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    svg.icon {
      display: inline;
      height: var(--svg-icon-size-small);
      width: var(--svg-icon-size-small);
      vertical-align: top;
      fill: currentColor;
    }
    #rating {
      display: flex;
      justify-content: space-around;
    }
    .rating-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
    }
    #rating svg {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
    }
    :host {
      display: contents;
    }
    :host([mode="edit"]),
    :host([mode="new"]) {
      --display-view-none: none;
    }
    :host([mode="view"]) {
      --display-editor-none: none;
    }
    section.view {
      display: var(--display-view-none, grid);
    }
    mu-form {
      display: var(--display-editor-none, grid);
    }
  `;let _t=Ht;Ws([F()],_t.prototype,"gameid",2);Ws([x()],_t.prototype,"game",1);var Xr=Object.defineProperty,tn=Object.getOwnPropertyDescriptor,we=(r,t,e,s)=>{for(var i=s>1?void 0:s?tn(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Xr(t,e,i),i};const xe=class xe extends rt{constructor(){super("stats:model"),this.gameIndex=new Array}get account(){return{userId:"1",username:"Admin",ratedGames:[{gameId:"5",name:"Cats",price:"Free",genre:"Clicker",rating:7.4,playerCount:21841}]}}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["account/select",{userId:s}])}renderItem(t){const{gameId:e,name:s,price:i,genre:n,rating:o,playerCount:l}=t;return y` <a href="/app/games/${e}"
      ><game-card>
        <h1 slot="game-name">${s}</h1>
        <li slot="price">Price: ${i}</li>
        <li slot="genre">Genre: ${n}</li>
        <li slot="rating">Rating: ${o}</li>
        <li slot="player-count">Current Players: ${l}</li>
      </game-card></a
    >`}render(){const{username:t,ratedGames:e}=this.account||{},s=e==null?void 0:e.map(this.renderItem);return y`
      <header>
        <div id="account-logo">
          <slot name="name"><h1>${t}</h1></slot>
          <slot name="profile-pic"
            ><svg class="icon" id="account-icon">
              <use href="../icons/game.svg#icon-user" /></svg
          ></slot>
        </div>
        <div id="right-header-elements">
          <label
            onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)"
          >
            <input type="checkbox" />
            Dark mode
          </label>
          <a id="signout">Sign Out</a>
        </div>
      </header>
      <a href="../../">Back to Main</a>

      <div id="games-rated">
        <h1>Games you Rated</h1>
        <div class="game-layout">${s}</div>
      </div>
    `}};xe.styles=R`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      align-items: center;
    }
    #account-logo {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    #account-icon {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
    }
    #right-header-elements {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    ::slotted(a) {
      text-decoration: none;
    }
    .game-layout {
      --page-grids: 6;
      display: grid;
      grid-template-columns: repeat(var(--page-grids), 1fr);
      row-gap: 5em;
      width: 100%;
    }
    .game-layout a {
      text-decoration: none;
    }
  `;let it=xe;we([F()],it.prototype,"userid",2);we([x()],it.prototype,"account",1);we([x()],it.prototype,"gameIndex",2);var en=Object.defineProperty,sn=Object.getOwnPropertyDescriptor,Ys=(r,t,e,s)=>{for(var i=s>1?void 0:s?sn(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&en(t,e,i),i};const Pe=class Pe extends rt{get rating(){return{games:[{gameId:"2",name:"Stardew Valley",price:"$14.99",genre:"Farming Sim",rating:9.8,playerCount:77436},{gameId:"8",name:"Baldur's Gate 3",price:"$59.99",genre:"RPG",rating:9.6,playerCount:36927}]}}constructor(){super("stats:model")}renderItem(t){const{gameId:e,name:s,price:i,genre:n,rating:o,playerCount:l}=t;return y` <a href="/app/games/${e}"
      ><game-card>
        <h1 slot="game-name">${s}</h1>
        <li slot="price">Price: ${i}</li>
        <li slot="genre">Genre: ${n}</li>
        <li slot="rating">Rating: ${o}</li>
        <li slot="player-count">Current Players: ${l}</li>
      </game-card></a
    >`}render(){const{games:t}=this.rating||{},e=t==null?void 0:t.map(this.renderItem);return y`
      <header id="rate-head">
        <div id="rate-logo">
          <h1>Rating</h1>
          <svg class="icon" id="rate-icon">
            <use href="../icons/game.svg#icon-rate" />
          </svg>
        </div>
        <label
          onchange="event.stopPropagation();
                toggleDarkMode(document.body, event.target.checked)"
        >
          <input type="checkbox" />
          Dark mode
        </label>
      </header>
      <a href="../../">Back to Main</a>
      <div class="game-layout">${e}</div>
    `}};Pe.styles=R`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      align-items: center;
    }
    #rate-head {
      justify-content: space-between;
    }
    #rate-logo {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    #rate-icon {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
    }
    .game-layout {
      --page-grids: 6;
      display: grid;
      grid-template-columns: repeat(var(--page-grids), 1fr);
      row-gap: 5em;
      width: 100%;
    }
    .game-layout a {
      text-decoration: none;
    }
  `;let $t=Pe;Ys([F()],$t.prototype,"gameList",2);Ys([x()],$t.prototype,"rating",1);var rn=Object.defineProperty,nn=Object.getOwnPropertyDescriptor,Ks=(r,t,e,s)=>{for(var i=s>1?void 0:s?nn(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&rn(t,e,i),i};const ke=class ke extends rt{constructor(){super("stats:model"),this.selectedGenre=""}get recommendation(){return{games:[{gameId:"2",name:"Stardew Valley",price:"$14.99",genre:"Farming Sim",rating:9.8,playerCount:77436},{gameId:"8",name:"Baldur's Gate 3",price:"$59.99",genre:"RPG",rating:9.6,playerCount:36927}]}}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["recommendation/select"])}renderItem(t){const{gameId:e,name:s,price:i,genre:n,rating:o,playerCount:l}=t;return y` <a href="/app/games/${e}"
      ><game-card>
        <h1 slot="game-name">${s}</h1>
        <li slot="price">Price: ${i}</li>
        <li slot="genre">Genre: ${n}</li>
        <li slot="rating">Rating: ${o}</li>
        <li slot="player-count">Current Players: ${l}</li>
      </game-card></a
    >`}render(){const{games:t}=this.recommendation||{},e=t==null?void 0:t.map(this.renderItem);return y`
      <header id="rec-head">
        <h1>Recommendations</h1>
        <svg class="icon" id="rec-icon">
          <use href="./icons/game.svg#icon-rec" />
        </svg>
      </header>
      <a href="../">Back to Main</a>
        <dl>
          <dt><h2>Based on Genre</h2></dt>
          <div class="game-layout">${e}</div>
          <dt><h2>Based on Price</h2></dt>
          <div class="game-layout">${e}</div>
          <dt><h2>Based on Rating</h2></dt>
          <div class="game-layout">${e}</div>
        </dl>
      </select>
    `}};ke.styles=R`
    header {
      color: var(--color-header);
      background-color: var(--color-background-header);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-normal);
    }
    h1 {
      font-family: var(--font-family-san-serif);
      font-weight: var(--font-weight-strong);
      font-size: x-large;
    }
    a {
      color: var(--color-link);
    }
    li {
      display: flex;
      align-items: center;
    }
    dl {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    #rec-head {
      justify-content: flex-start;
    }
    #rec-icon {
      width: var(--svg-icon-size-med);
      height: var(--svg-icon-size-med);
    }
    .game-layout {
      --page-grids: 6;
      display: grid;
      grid-template-columns: repeat(var(--page-grids), 1fr);
      row-gap: 5em;
      width: 100%;
    }
    .game-layout a {
      text-decoration: none;
    }
  `;let bt=ke;Ks([x()],bt.prototype,"recommendation",1);Ks([x()],bt.prototype,"selectedGenre",2);const Ce=class Ce extends O{render(){return y` <home-view></home-view> `}connectedCallback(){super.connectedCallback()}};Ce.uses=Bt({"home-view":jt,"game-view":T,"game-edit":_t,"account-view":it,"rating-view":$t,"recommendation-view":bt});let le=Ce;const on=[{path:"/app",view:()=>y` <home-view></home-view> `},{path:"/",redirect:"/app"},{path:"/app/games/:gameId",view:r=>y`<game-view gameId=${r.gameId}></game-view>`},{path:"/app/games/:gameId/edit",view:r=>y`<game-edit gameId=${r.gameId}></game-edit>`},{path:"/app/accounts/:userId",view:r=>y`<account-view userId=${r.userId}></account-view>`},{path:"/app/ratings",view:r=>y`<rating-view gameList=${r.gameList}></rating-view>`},{path:"/app/recommendations",view:()=>y`<recommendation-view></recommendation-view>`}];Bt({"stats-app":le,"mu-auth":fs.Provider,"mu-history":pe.Provider,"mu-store":class extends Ai.Provider{constructor(){super(_r,yr,"stats:auth")}},"mu-switch":class extends dr.Element{constructor(){super(on,"stats:history","stats:auth")}}});
