(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();const B={companyName:"WAVE VI",supplierName:"SGS Printing Services",currency:"TND",defaultVat:0,theme:"light",categories:["Tickets","Flyers","Posters","Brochures","Badges","Labels","Packaging","Signage","Other"]};let x=null;const $={product:0,purchaseOrder:0,delivery:0,payment:0,document:0,poNumber:0};function Te(t){return`./data/${t}?v=${Date.now()}`}async function T(t){const e=await fetch(Te(t));if(!e.ok)throw new Error(`Failed to load data/${t} (${e.status})`);return e.json()}async function Ce(){return T("products.json")}async function Me(){return T("purchase-orders.json")}async function Ae(){return T("deliveries.json")}async function Ne(){return T("payments.json")}async function Fe(){return T("documents.json")}async function je(){const t=await T("settings.json"),{categories:e,...a}=t||{};return{settings:{...B,...a},categories:e!=null&&e.length?e:[...B.categories]}}async function qe(){const[t,e,a,s,i,n]=await Promise.all([Ce(),Me(),Ae(),Ne(),Fe(),je()]);return x={products:Array.isArray(t)?t:[],purchaseOrders:Array.isArray(e)?e:[],deliveries:Array.isArray(a)?a:[],payments:Array.isArray(s)?s:[],documents:Array.isArray(i)?i:[],settings:n.settings,categories:n.categories},be(x),ge(x.purchaseOrders),x}function O(){return x||(x={products:[],purchaseOrders:[],deliveries:[],payments:[],documents:[],settings:{...B},categories:[...B.categories]}),x}async function Re(){return!1}async function k(t){t(),await Re()}async function He(t){await k(()=>{const e=O(),a=e.products.findIndex(s=>s.id===t.id);a>=0?e.products[a]=t:e.products.push(t)})}async function Ue(t){await k(()=>{const e=O();e.products=(e.products||[]).filter(a=>a.id!==t)})}async function j(t){await k(()=>{const e=O(),a=e.purchaseOrders.findIndex(s=>s.id===t.id);a>=0?e.purchaseOrders[a]=t:e.purchaseOrders.push(t)})}async function A(t){await k(()=>{const e=O(),a=e.deliveries.findIndex(s=>s.id===t.id);a>=0?e.deliveries[a]=t:e.deliveries.push(t)})}async function fe(t){await k(()=>{const e=O(),a=e.payments.findIndex(s=>s.id===t.id);a>=0?e.payments[a]=t:e.payments.push(t)})}async function ze(t){await k(()=>{const e=O(),a=e.documents.findIndex(s=>s.id===t.id);a>=0?e.documents[a]=t:e.documents.push(t)})}async function ye(t){await k(()=>{const e=O();e.settings={...e.settings,...t},t.categories&&(e.categories=t.categories)})}function Ve(){const t=O();return{version:2,exportedAt:new Date().toISOString(),products:t.products,purchase_orders:t.purchaseOrders,deliveries:t.deliveries,payments:t.payments,documents:t.documents,settings:t.settings,categories:t.categories}}function Ge(){const t=O(),{categories:e,...a}=t.settings;return{"products.json":t.products,"purchase-orders.json":t.purchaseOrders,"deliveries.json":t.deliveries,"payments.json":t.payments,"documents.json":t.documents,"settings.json":{...a,categories:t.categories}}}function We(t){var a,s,i;const e=typeof t=="string"?JSON.parse(t):t;return x={products:e.products||[],purchaseOrders:e.purchase_orders||e.purchaseOrders||[],deliveries:e.deliveries||[],payments:e.payments||[],documents:e.documents||[],settings:{...B,...e.settings||{}},categories:(a=e.categories)!=null&&a.length?e.categories:(i=(s=e.settings)==null?void 0:s.categories)!=null&&i.length?e.settings.categories:[...B.categories]},x.settings.categories=x.categories,be(x),ge(x.purchaseOrders),x}function N(t,e){return $[e]=($[e]||0)+1,`${t}-${String($[e]).padStart(3,"0")}`}function Je(){const t=($.poNumber||0)+1;return`PO-SGS-${String(t).padStart(3,"0")}`}function Qe(){return $.poNumber=($.poNumber||0)+1,`PO-SGS-${String($.poNumber).padStart(3,"0")}`}function ge(t){if(!(t!=null&&t.length))return;const e=t.reduce((a,s)=>{const i=(s.po_number||"").match(/^PO-SGS-(\d+)$/);return i?Math.max(a,parseInt(i[1],10)):a},0);e>0&&($.poNumber=e)}function be(t){$.product=M(t.products,"PRD-"),$.purchaseOrder=M(t.purchase_orders||t.purchaseOrders,"PO-"),$.delivery=M(t.deliveries,"DEL-"),$.payment=M(t.payments,"PAY-"),$.document=M(t.documents,"DOC-")}function M(t,e){return t!=null&&t.length?t.reduce((a,s)=>{const i=s.id||"";if(!i.startsWith(e))return a;const n=parseInt(i.slice(e.length),10);return Number.isNaN(n)?a:Math.max(a,n)},0):0}function he(t,e){const a=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download=e,s.click(),URL.revokeObjectURL(s.href)}function Ye(){const t=Ge();for(const[e,a]of Object.entries(t))he(a,e)}const X="wavevi_session",Ke={wavevi:{password:"waveiovi",role:"admin",displayName:"WAVE VI",roleLabel:"Administrator",initials:"WV"},sgs:{password:"sgs",role:"supplier",displayName:"SGS Printing Services",roleLabel:"Supplier",initials:"SG"}};function Xe(t,e){const a=Ke[t.trim().toLowerCase()];if(!a||a.password!==e)return null;const s={username:t.trim().toLowerCase(),role:a.role,displayName:a.displayName,roleLabel:a.roleLabel,initials:a.initials,loggedInAt:new Date().toISOString()};return sessionStorage.setItem(X,JSON.stringify(s)),s}function Ze(){sessionStorage.removeItem(X)}function Z(){try{const t=sessionStorage.getItem(X);return t?JSON.parse(t):null}catch{return null}}function et(){return!!Z()}function q(){var t;return((t=Z())==null?void 0:t.role)==="admin"}function b(){return q()}function we(t){return!(t==="settings"&&!q())}const l={data:{products:[],purchaseOrders:[],deliveries:[],payments:[],documents:[],categories:[],settings:{}},currentPage:"dashboard",charts:{},theme:"light"};document.addEventListener("DOMContentLoaded",()=>{tt()});function tt(){var a,s;const t=document.getElementById("loginForm");t==null||t.addEventListener("submit",i=>{i.preventDefault();const n=document.getElementById("loginUser").value,o=document.getElementById("loginPass").value,r=document.getElementById("loginError");if(!Xe(n,o)){r.textContent="Invalid username or password.",r.classList.remove("d-none");const d=document.querySelector(".login-card");d&&(d.style.animation="none",d.offsetHeight,d.style.animation="");return}r.classList.add("d-none"),de()});const e=()=>{confirm("Sign out?")&&(Ze(),location.reload())};(a=document.getElementById("logoutBtn"))==null||a.addEventListener("click",e),(s=document.getElementById("logoutTrigger"))==null||s.addEventListener("click",e),et()&&de()}async function de(){var e,a;(e=document.getElementById("loginScreen"))==null||e.classList.add("d-none"),(a=document.getElementById("appShell"))==null||a.classList.remove("d-none"),at(),await ae(),se(),lt(),ct(),rt(),ut(),xe(l.currentPage);const t=window.location.hash.slice(1)||"dashboard";E(we(t)?t:"dashboard")}function at(){const t=Z();t&&(document.getElementById("profileName").textContent=t.displayName,document.getElementById("profileRole").textContent=t.roleLabel,document.getElementById("profileInitials").textContent=t.initials,document.getElementById("sidebarUserName").textContent=t.displayName,document.getElementById("sidebarUserRole").textContent=t.roleLabel,document.querySelectorAll(".admin-only").forEach(e=>{e.classList.toggle("hidden-role",!q())}))}function st(){return""}function R(){return b()?st():'<div class="readonly-banner"><i class="fa-solid fa-eye"></i> Read-only access — contact WAVE VI admin to make changes.</div>'}const le={dashboard:{icon:"fa-gauge-high",label:"Dashboard"},products:{icon:"fa-box-open",label:"Product Catalog"},"purchase-orders":{icon:"fa-file-invoice",label:"Purchase Orders"},deliveries:{icon:"fa-truck",label:"Deliveries"},payments:{icon:"fa-credit-card",label:"Payments"},documents:{icon:"fa-folder-open",label:"Documents"},settings:{icon:"fa-gear",label:"Settings"}};function xe(t){const e=le[t]||le.dashboard,a=document.getElementById("topnavBreadcrumb");a&&(a.innerHTML=`<i class="fa-solid ${e.icon} me-2 text-primary-brand"></i><span>${e.label}</span>`)}function h(t){return t==="preparing"?"pending":t==="partially-delivered"?"partial":t}function it(t){if(!t)return"Unknown";const e=String(t).toLowerCase().trim();return e==="draft"||e==="created"?"Draft":e==="pending"||e==="preparing"?"Pending":e==="approved"?"Approved":e==="in_production"||e==="in production"||e==="in-production"||e==="production"?"In Production":e==="completed"||e==="delivered"||e==="done"?"Completed":e==="cancelled"||e==="canceled"?"Cancelled":e.split(/[-_ ]+/).map(a=>a.charAt(0).toUpperCase()+a.slice(1)).join(" ")}function nt(){for(const t of l.data.purchaseOrders)for(const e of t.lines)e.received_qty==null&&(e.received_qty=0);for(const t of l.data.purchaseOrders){if(t.lines.some(s=>s.received_qty>0))continue;const a=l.data.deliveries.filter(s=>s.related_po===t.id&&["partial","delivered"].includes(h(s.status)));for(const s of a)for(const i of s.lines){const n=t.lines.find(o=>o.product_id===i.product_id);n&&(n.received_qty=(n.received_qty||0)+(i.delivered_qty||i.receive_qty||0))}}for(const t of l.data.payments)t.amount_paid==null&&(t.amount_paid=t.status==="paid"?t.amount:0)}function S(t){const e=t.lines.map(r=>{const c=r.quantity,d=r.received_qty||0,u=Math.max(0,c-d);return{product_id:r.product_id,product_name:r.product_name,ordered:c,received:d,remaining:u,unit_price_ht:r.unit_price_ht,surface_mm2:r.surface_mm2}}),a=e.reduce((r,c)=>r+c.ordered,0),s=e.reduce((r,c)=>r+c.received,0),i=e.reduce((r,c)=>r+c.remaining,0),n=t.lines.reduce((r,c)=>r+(c.received_qty||0)*c.unit_price_ht,0),o=t.total_ht||0;return{lines:e,totalOrdered:a,totalReceived:s,totalRemaining:i,receivedAmount:n,orderedAmount:o,pct:a>0?Math.round(s/a*100):0,isComplete:i===0,hasPartial:s>0&&i>0}}function Q(t){return(t.delivered_qty||t.receive_qty||0)*(t.unit_price_ht||0)}function I(t){return["partial","delivered"].includes(h(t.status))?t.amount!=null?t.amount:(t.lines||[]).reduce((e,a)=>e+Q(a),0):(t.lines||[]).reduce((e,a)=>e+Q(a),0)}function ee(t){return Math.max(0,(t.amount||0)-(t.amount_paid||0))}function $e(t,e="Fulfillment"){return`
    <div class="fulfillment-block">
      <div class="d-flex justify-content-between mb-1">
        <small class="text-muted">${e}</small>
        <small class="fw-semibold">${t}%</small>
      </div>
      <div class="progress-custom">
        <div class="progress-bar-custom" style="width:${t}%;background:var(--brand-primary)"></div>
      </div>
    </div>
  `}function _e(t){const e=l.data.deliveries.find(o=>o.related_po===t.id&&h(o.status)==="pending");if(e)return e;const a=S(t);if(a.totalRemaining===0)return null;const s=l.data.deliveries.filter(o=>o.related_po===t.id).length+1,i=s>1?`-${String(s).padStart(2,"0")}`:"",n=a.lines.filter(o=>o.remaining>0).map(o=>({product_id:o.product_id,product_name:o.product_name,ordered_qty:o.ordered,remaining_qty:o.remaining,receive_qty:o.remaining,delivered_qty:0,unit_price_ht:o.unit_price_ht,surface_mm2:o.surface_mm2||0,line_total:o.remaining*o.unit_price_ht}));return{id:N("DEL","delivery"),delivery_number:`DEL-${t.po_number}${i}`,related_po:t.id,po_number:t.po_number,status:"pending",delivery_date:null,amount:0,lines:n,documents:[],notes:`Auto-created from ${t.po_number}`,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}}async function ot(t){const e=l.data.payments.find(i=>i.related_delivery===t.id);if(e)return e;const a=I(t),s={id:N("PAY","payment"),payment_reference:`PAY-${t.delivery_number}`,related_po:t.related_po,related_delivery:t.id,delivery_number:t.delivery_number,po_number:t.po_number,payment_method:"bank-transfer",amount:a,amount_paid:0,payment_date:null,status:"pending",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return await fe(s),s}async function te(t){var s;if(!b())return;const e=l.data.purchaseOrders.find(i=>i.id===t);if(!e)return;const a=S(e);if(a.totalReceived===0){y("Receive at least one delivery before closing partially","warning");return}if(confirm(`Close PO ${e.po_number} with ${a.pct}% received? Remaining qty will not be delivered.`)){e.status="completed-partial",e.updated_at=new Date().toISOString(),e.actual_delivery_date=new Date().toISOString().split("T")[0];for(const i of l.data.deliveries.filter(n=>n.related_po===t&&h(n.status)==="pending"))i.status="cancelled",i.updated_at=new Date().toISOString(),await A(i);await j(e),z(),(s=bootstrap.Modal.getInstance(document.getElementById("poModal")))==null||s.hide(),P("purchase-orders"),y("PO closed with partial fulfillment","success")}}function re(t){const e=l.data.deliveries.find(i=>i.id===t);if(!e)return 0;let a=0;e.lines.forEach((i,n)=>{const o=document.getElementById(`receiveQty_${t}_${n}`),r=parseInt(o==null?void 0:o.value)||0;a+=r*(i.unit_price_ht||0);const c=document.getElementById(`lineAmount_${t}_${n}`);c&&(c.textContent=f(r*(i.unit_price_ht||0)))});const s=document.getElementById(`deliveryPreviewTotal_${t}`);return s&&(s.textContent=f(a)),a}async function ae(){try{const t=await qe();l.data.products=t.products,l.data.purchaseOrders=t.purchaseOrders,l.data.deliveries=t.deliveries,l.data.payments=t.payments,l.data.documents=t.documents,l.data.categories=t.categories,l.data.settings=t.settings,l.data.settings.currency==="MAD"&&(l.data.settings.currency="TND"),l.theme=t.settings.theme||"light",nt(),z()}catch(t){console.error("Error loading data:",t),y("Error loading data. Please refresh the page.","danger")}}function se(){document.documentElement.setAttribute("data-theme",l.theme),Pe()}async function dt(){l.theme=l.theme==="light"?"dark":"light",document.documentElement.setAttribute("data-theme",l.theme),q()&&(l.data.settings.theme=l.theme,await ye(l.data.settings)),Pe()}function Pe(){const t=document.getElementById("themeIcon")||document.querySelector("#themeToggle i");t&&(t.className=l.theme==="light"?"fa-solid fa-moon":"fa-solid fa-sun")}function lt(){window.addEventListener("hashchange",()=>{E(window.location.hash.slice(1)||"dashboard")})}function E(t){we(t)||(y("You do not have access to this page.","warning"),t="dashboard"),l.currentPage=t,window.location.hash=t,document.querySelectorAll(".nav-link").forEach(e=>{e.classList.toggle("active",e.dataset.page===t)}),xe(t),P(t)}function rt(){var a,s,i,n,o;(a=document.getElementById("themeToggle"))==null||a.addEventListener("click",dt);const t=document.getElementById("sidebar"),e=document.getElementById("sidebarOverlay");(s=document.getElementById("sidebarToggle"))==null||s.addEventListener("click",()=>{t==null||t.classList.add("mobile-open"),e==null||e.classList.add("show")}),(i=document.getElementById("sidebarClose"))==null||i.addEventListener("click",W),e==null||e.addEventListener("click",W),(n=document.getElementById("notificationBtn"))==null||n.addEventListener("click",r=>{var c;r.stopPropagation(),(c=document.getElementById("notifDropdown"))==null||c.classList.toggle("show")}),document.addEventListener("click",r=>{var c;!r.target.closest("#notificationBtn")&&!r.target.closest("#notifDropdown")&&((c=document.getElementById("notifDropdown"))==null||c.classList.remove("show"))}),(o=document.getElementById("refreshData"))==null||o.addEventListener("click",async()=>{y("Refreshing data...","info"),await ae(),P(l.currentPage),y("Data refreshed successfully","success")}),document.querySelectorAll(".nav-link").forEach(r=>{r.addEventListener("click",c=>{c.preventDefault();const d=r.dataset.page;d&&(E(d),W())})})}function W(){var t,e;(t=document.getElementById("sidebar"))==null||t.classList.remove("mobile-open","active"),(e=document.getElementById("sidebarOverlay"))==null||e.classList.remove("show")}function ct(){const t=document.getElementById("commandPaletteOverlay"),e=document.getElementById("commandInput"),a=document.getElementById("commandResults");if(!t||!e||!a)return;let s=[],i=-1;const n=d=>{d?(t.classList.remove("d-none"),setTimeout(()=>{t.classList.add("active"),e.value="",c(""),e.focus()},10)):(t.classList.remove("active"),setTimeout(()=>t.classList.add("d-none"),200))};document.addEventListener("keydown",d=>{(d.ctrlKey||d.metaKey)&&d.key==="k"&&(d.preventDefault(),n(!t.classList.contains("active"))),d.key==="Escape"&&t.classList.contains("active")&&n(!1)}),t.addEventListener("click",d=>{d.target===t&&n(!1)});const o=d=>{if(d<0||d>=s.length)return;const u=s[d];n(!1),u.action==="page"?E(u.target):u.action==="product"?(E("products"),setTimeout(()=>F(u.id),100)):u.action==="po"&&(E("purchase-orders"),setTimeout(()=>ie(u.id),100))};e.addEventListener("keydown",d=>{d.key==="ArrowDown"?(d.preventDefault(),i=(i+1)%s.length,r()):d.key==="ArrowUp"?(d.preventDefault(),i=(i-1+s.length)%s.length,r()):d.key==="Enter"&&(d.preventDefault(),o(i))}),e.addEventListener("input",d=>{c(d.target.value.toLowerCase().trim())});const r=()=>{a.querySelectorAll(".command-item").forEach((u,v)=>{v===i?(u.classList.add("selected"),u.scrollIntoView({block:"nearest"})):u.classList.remove("selected")})},c=d=>{if(s=[],i=0,[{name:"Go to Dashboard",target:"dashboard",icon:"fa-gauge-high"},{name:"Go to Products",target:"products",icon:"fa-box-open"},{name:"Go to Purchase Orders",target:"purchase-orders",icon:"fa-file-invoice"},{name:"Go to Deliveries",target:"deliveries",icon:"fa-truck"}].forEach(v=>{(!d||v.name.toLowerCase().includes(d))&&s.push({...v,action:"page"})}),d.length>=2&&(l.data.products.forEach(v=>{(v.name.toLowerCase().includes(d)||v.reference.toLowerCase().includes(d))&&s.push({name:`Product: ${v.name}`,target:v.reference,icon:"fa-box",action:"product",id:v.id})}),l.data.purchaseOrders.forEach(v=>{(v.po_number.toLowerCase().includes(d)||v.status.includes(d))&&s.push({name:`PO: ${v.po_number}`,target:v.status,icon:"fa-file-invoice",action:"po",id:p.id})})),s.length===0){a.innerHTML='<div class="p-4 text-center text-muted">No matching results</div>';return}a.innerHTML=s.map((v,m)=>`
      <div class="command-item ${m===0?"selected":""}" data-index="${m}">
        <i class="fas ${v.icon}"></i>
        <div>
          <div class="fw-medium">${v.name}</div>
          ${v.target!==v.name&&!v.target.startsWith("dashboard")&&!v.target.startsWith("products")?`<div class="small text-muted">${v.target}</div>`:""}
        </div>
      </div>
    `).join(""),a.querySelectorAll(".command-item").forEach(v=>{v.addEventListener("mouseover",()=>{i=parseInt(v.dataset.index,10),r()}),v.addEventListener("click",()=>{o(parseInt(v.dataset.index,10))})})}}function ut(){const t=document.getElementById("lastUpdate");t&&(t.textContent=new Date().toLocaleString("en-US",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}))}async function P(t){const e=document.getElementById("mainContent");e&&(e.innerHTML=`
    <div class="skeleton-container" style="padding: var(--sp-8); display: flex; flex-direction: column; gap: var(--sp-4); opacity: 0; animation: fadeIn 0.2s ease forwards;">
      <div class="skeleton" style="height: 40px; width: 30%; border-radius: var(--radius);"></div>
      <div class="skeleton" style="height: 20px; width: 50%; border-radius: var(--radius); margin-bottom: var(--sp-4);"></div>
      <div style="display: flex; gap: var(--sp-4);">
        <div class="skeleton" style="height: 120px; flex: 1; border-radius: var(--radius-lg);"></div>
        <div class="skeleton" style="height: 120px; flex: 1; border-radius: var(--radius-lg);"></div>
        <div class="skeleton" style="height: 120px; flex: 1; border-radius: var(--radius-lg);"></div>
      </div>
      <div class="skeleton" style="height: 400px; width: 100%; border-radius: var(--radius-lg); margin-top: var(--sp-2);"></div>
    </div>
  `,await new Promise(a=>setTimeout(a,120)),e.style.opacity="0",setTimeout(()=>{switch(t){case"dashboard":ce(e);break;case"products":vt(e);break;case"purchase-orders":wt(e);break;case"deliveries":Tt(e);break;case"payments":Nt(e);break;case"documents":Ht(e);break;case"settings":Wt(e);break;default:ce(e)}e.style.transition="opacity 0.15s ease-in-out",e.style.opacity="1"},50))}function ce(t){const e=mt();t.innerHTML=`
    ${R()}
    <div class="split-pane-layout">
      
      <!-- Left Pane: Operational Activity Stream -->
      <div class="split-pane-detail" style="border-right: 1px solid var(--border-color); max-width: 65%;">
        <div style="padding: var(--sp-6) var(--sp-8) var(--sp-4);">
          <h1 class="page-title" style="font-size: var(--text-2xl); margin-bottom: 4px;">Activity Stream</h1>
          <p style="font-size: var(--text-sm); color: var(--text-secondary); margin: 0;">Recent events across your supply chain</p>
        </div>
        
        <div class="activity-stream">
          ${pt()}
        </div>
      </div>

      <!-- Right Pane: Command Panel -->
      <div class="split-pane-list" style="width: 35%; flex: auto; background: var(--bg-page);">
        <div class="split-pane-list-header" style="border-bottom: 1px solid var(--border-color); background: var(--bg-page);">
          <div class="split-pane-list-title" style="margin-bottom: 0;">Overview</div>
        </div>
        <div class="split-pane-list-content" style="padding: var(--sp-4);">
          
          <!-- Key Metrics -->
          <div style="display: flex; flex-direction: column; gap: var(--sp-2); margin-bottom: var(--sp-5);">
            <div class="command-panel-tile" onclick="navigateTo('deliveries')" style="cursor:pointer;">
              <div>
                <div class="cpt-label">Pending Deliveries</div>
                <div class="cpt-value" style="color: var(--c-amber-500);">${e.pendingDeliveries}</div>
              </div>
              <div style="color: var(--text-muted); font-size: 20px;"><i class="fa-solid fa-truck"></i></div>
            </div>
            <div class="command-panel-tile" onclick="navigateTo('payments')" style="cursor:pointer;">
              <div>
                <div class="cpt-label">Outstanding Balance</div>
                <div class="cpt-value metric-value-md" style="color: var(--c-rose-500);">${f(e.remainingBalance)}</div>
              </div>
              <div style="color: var(--text-muted); font-size: 20px;"><i class="fa-solid fa-credit-card"></i></div>
            </div>
            <div class="command-panel-tile" onclick="navigateTo('purchase-orders')" style="cursor:pointer;">
              <div>
                <div class="cpt-label">Total Orders</div>
                <div class="cpt-value">${e.totalPOs}</div>
              </div>
              <div style="color: var(--text-muted); font-size: 20px;"><i class="fa-solid fa-file-invoice"></i></div>
            </div>
          </div>

          <!-- Order Status Breakdown -->
          <div class="card" style="margin-bottom: var(--sp-4);">
            <div class="card-header">
              <span class="section-title" style="margin: 0;">Order Status</span>
            </div>
            <div class="card-body" style="padding: var(--sp-4);">
              <div style="display: flex; flex-direction: column; gap: 10px;">
                ${e.orderStatusItems.map(a=>`
                  <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span class="status-indicator ${a.colorClass}"></span>
                      <span style="font-size: var(--text-sm); font-weight: 500; color: var(--text-primary);">${a.label}</span>
                    </div>
                    <span style="font-size: var(--text-sm); font-weight: 700; color: var(--text-primary);">${a.count}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          </div>

          <!-- Payment Progress -->
          <div class="card">
            <div class="card-header">
              <span class="section-title" style="margin: 0;">Payment Collection</span>
              <span style="font-size: var(--text-xs); font-weight: 700; color: var(--c-emerald-500);">${e.paymentProgress}%</span>
            </div>
            <div class="card-body" style="padding: var(--sp-4);">
              <div class="progress-custom">
                <div class="progress-bar-custom" style="width: ${e.paymentProgress}%; background: var(--c-emerald-500);"></div>
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: var(--sp-3); font-size: var(--text-xs); color: var(--text-muted);">
                <span>Collected</span>
                <span style="color: var(--text-primary); font-weight: 600;">${e.paymentProgress}% of delivered value</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  `}function mt(){const t=l.data.purchaseOrders.filter(d=>d.status!=="cancelled"),e=t.reduce((d,u)=>d+(u.total_ht||0),0),a=l.data.deliveries.filter(d=>["partial","delivered"].includes(h(d.status))),s=l.data.deliveries.filter(d=>h(d.status)==="pending"),i=a.reduce((d,u)=>d+I(u),0),n=l.data.payments.reduce((d,u)=>d+(u.amount_paid||0),0),o=t.reduce((d,u)=>{const v=it(u.status)||"Unknown";return d[v]=(d[v]||0)+1,d},{}),c=["Draft","Pending","Approved","In Production","Completed","Cancelled"].map(d=>({label:d,count:o[d]||0,colorClass:d==="Draft"?"status-secondary":d==="Pending"?"status-warning":d==="Approved"?"status-info":d==="In Production"?"status-primary":d==="Completed"?"status-success":d==="Cancelled"?"status-danger":"status-secondary"}));return{totalPOs:t.length,totalHT:e,totalPaid:n,remainingBalance:Math.max(0,i-n),pendingDeliveries:s.length,deliveredOrders:a.length,paymentProgress:i>0?Math.round(n/i*100):0,partialPayments:0,orderStatusItems:c}}function pt(){const t=[],e={draft:{icon:"fa-file",color:"var(--c-slate-400)",bg:"rgba(100,116,139,.12)"},pending:{icon:"fa-hourglass-half",color:"var(--c-amber-500)",bg:"rgba(245,158,11,.12)"},approved:{icon:"fa-circle-check",color:"var(--c-blue-500)",bg:"rgba(59,130,246,.12)"},"in-production":{icon:"fa-gear",color:"var(--c-violet-500)",bg:"rgba(139,92,246,.12)"},completed:{icon:"fa-check-double",color:"var(--c-emerald-500)",bg:"rgba(16,185,129,.12)"},"completed-partial":{icon:"fa-flag-checkered",color:"var(--c-cyan-500)",bg:"rgba(6,182,212,.12)"},cancelled:{icon:"fa-xmark",color:"var(--c-rose-500)",bg:"rgba(239,68,68,.12)"},delivered:{icon:"fa-truck-ramp-box",color:"var(--c-emerald-500)",bg:"rgba(16,185,129,.12)"},partial:{icon:"fa-truck",color:"var(--c-violet-500)",bg:"rgba(139,92,246,.12)"},payment:{icon:"fa-credit-card",color:"var(--c-cyan-500)",bg:"rgba(6,182,212,.12)"}};l.data.purchaseOrders.slice().sort((s,i)=>new Date(i.created_at||0)-new Date(s.created_at||0)).slice(0,4).forEach(s=>{t.push({date:s.updated_at||s.created_at,action:"Purchase Order",subAction:w(s.status),reference:s.po_number,detail:f(s.total_ht),type:s.status,page:"purchase-orders",id:s.id})}),l.data.deliveries.slice().sort((s,i)=>new Date(i.updated_at||0)-new Date(s.updated_at||0)).slice(0,3).forEach(s=>{const i=h(s.status);t.push({date:s.updated_at||s.created_at,action:"Delivery",subAction:w(i),reference:s.delivery_number,detail:f(I(s)),type:i==="delivered"?"delivered":i==="partial"?"partial":"pending",page:"deliveries",id:s.id})}),l.data.payments.slice().sort((s,i)=>new Date(i.updated_at||0)-new Date(s.updated_at||0)).slice(0,2).forEach(s=>{s.amount_paid>0&&t.push({date:s.updated_at||s.payment_date,action:"Payment",subAction:w(s.status),reference:s.payment_reference,detail:f(s.amount_paid),type:"payment",page:"payments",id:s.id})}),t.sort((s,i)=>new Date(i.date||0)-new Date(s.date||0));const a=t.slice(0,8);return a.length===0?`<div class="empty-state">
      <div class="empty-state-icon"><i class="fa-solid fa-bolt-lightning"></i></div>
      <h3>No activity yet</h3>
      <p>Create your first purchase order to get started</p>
    </div>`:a.map((s,i)=>{const n=e[s.type]||e.draft;return`
    <div class="activity-item" style="animation-delay: ${i*40}ms;">
      <div style="padding-top: 2px; flex-shrink: 0;">
        <div style="width: 32px; height: 32px; border-radius: var(--radius); background: ${n.bg}; display: flex; align-items: center; justify-content: center; color: ${n.color}; font-size: 13px; flex-shrink: 0;">
          <i class="fa-solid ${n.icon}"></i>
        </div>
      </div>
      <div class="activity-body">
        <div class="activity-action">${s.action} <span style="color: var(--text-secondary); font-weight: 500;">·</span> <span style="color: ${n.color}; font-weight: 600; font-size: var(--text-xs);">${s.subAction}</span></div>
        <div style="display: flex; align-items: center; gap: var(--sp-3); margin-top: 2px;">
          <span class="activity-ref" onclick="navigateTo('${s.page}')">${s.reference}</span>
          <span style="font-size: var(--text-xs); color: var(--text-secondary); font-weight: 600;">${s.detail}</span>
        </div>
        <div class="activity-time" style="margin-top: 2px;">${_(s.date)}</div>
      </div>
    </div>
  `}).join("")}function vt(t){const e=l.data.products;t.innerHTML=`
    <div class="split-pane-layout">
      
      <!-- List Pane -->
      <div class="split-pane-list" style="width: 340px;">
        <div class="split-pane-list-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-3);">
            <h1 class="split-pane-list-title" style="margin: 0;">Product Catalog</h1>
            ${b()?'<button class="btn-primary-custom" onclick="showProductModal()" title="New Product" style="padding: 6px 12px; font-size: 12px;"><i class="fas fa-plus"></i> New</button>':""}
          </div>
          
          <div style="display: flex; gap: var(--sp-2);">
            <input type="text" class="filter-search" id="productSearch" placeholder="Search products…" oninput="filterProductList()" style="padding-left: 12px;">
            <select class="filter-select" id="categoryFilter" onchange="filterProductList()" style="min-width: 120px;">
              <option value="">All Categories</option>
              ${l.data.categories.map(a=>`<option value="${a}">${a}</option>`).join("")}
            </select>
          </div>
        </div>
        
        <div class="split-pane-list-content" id="productListContainer">
          ${De(e)}
        </div>
      </div>

      <!-- Detail Pane -->
      <div class="split-pane-detail" id="productDetailContainer">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div>
          <h3>No product selected</h3>
          <p>Select a product from the list to view details</p>
        </div>
      </div>
      
    </div>
  `,window.filterProductList=ft,window.renderProductDetails=ue,window.showProductModal=F,e.length>0&&setTimeout(()=>ue(e[0].id),80)}function De(t){return t.length===0?'<div class="empty-state" style="padding: var(--sp-8);"><div class="empty-state-icon"><i class="fa-solid fa-box-open"></i></div><h3>No products</h3><p>No products match your filter</p></div>':t.map(e=>`
    <div class="list-item-card" id="product-list-item-${e.id}" onclick="renderProductDetails('${e.id}')">
      <div class="list-item-title">
        <span class="list-item-ref" style="color: var(--text-primary); font-size: var(--text-md);">${e.name}</span>
        <span class="list-item-amount">${f(e.price_ht,3)}</span>
      </div>
      <div class="list-item-sub">
        <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${e.reference}</span>
        <span style="font-size: 10px; font-weight: 700; color: var(--brand-primary); text-transform: uppercase; letter-spacing: .3px;">${e.category}</span>
      </div>
    </div>
  `).join("")}function ft(){var i,n;const t=((i=document.getElementById("categoryFilter"))==null?void 0:i.value)||"",e=((n=document.getElementById("productSearch"))==null?void 0:n.value.toLowerCase())||"";let a=l.data.products;t&&(a=a.filter(o=>o.category===t)),e&&(a=a.filter(o=>o.name.toLowerCase().includes(e)||o.reference.toLowerCase().includes(e)));const s=document.getElementById("productListContainer");s&&(s.innerHTML=De(a))}function ue(t){document.querySelectorAll("#productListContainer .list-item-card").forEach(i=>i.classList.remove("active"));const e=document.getElementById(`product-list-item-${t}`);e&&e.classList.add("active");const a=l.data.products.find(i=>i.id===t),s=document.getElementById("productDetailContainer");!a||!s||(s.innerHTML=`
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div class="d-flex gap-4 w-100">
        <div class="product-detail-img-box" style="width: 120px; height: 120px;">
          ${a.product_image?`<img src="${a.product_image}" style="width:100%; height:100%; object-fit:contain; border-radius:var(--radius-md);">`:'<i class="fa-solid fa-image fs-1 text-muted opacity-25"></i>'}
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start w-100">
            <div>
              <span class="badge bg-primary text-white mb-2">${a.category}</span>
              <h2 class="m-0 fs-3 fw-bold lh-sm mb-1">${a.name}</h2>
              <p class="text-muted m-0 font-monospace small">${a.reference}</p>
            </div>
            <div class="d-flex gap-2">
              ${b()?`<button class="btn btn-primary-custom btn-sm" onclick="showProductModal('${a.id}', 'view')"><i class="fas fa-eye me-1"></i> Full Details</button>`:""}
              ${b()?`<button class="btn btn-outline-secondary btn-sm" onclick="showProductModal('${a.id}', 'edit')"><i class="fas fa-pen me-1"></i> Edit</button>`:""}
              ${b()?`<button class="btn btn-outline-danger btn-sm" onclick="deleteProduct('${a.id}')"><i class="fas fa-trash me-1"></i> Delete</button>`:""}
            </div>
          </div>
        </div>
      </div>
    </div>

    ${a.description?`
      <div class="mb-5 text-secondary">${a.description}</div>
    `:""}

    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Pricing & Units</h6>
          <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
            <span class="text-secondary">Base Price (HT)</span>
            <span class="fw-bold text-primary fs-5">${f(a.price_ht,3)}</span>
          </div>
          <div class="d-flex justify-content-between mb-3 border-bottom pb-2">
            <span class="text-secondary">Unit of Measure</span>
            <span class="fw-medium text-body text-capitalize">${a.unit}</span>
          </div>
          ${a.surface_mm2?`
            <div class="d-flex justify-content-between">
              <span class="text-secondary">Surface Area</span>
              <span class="fw-medium font-monospace small">${C(a.surface_mm2)}</span>
            </div>
          `:""}
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Specifications</h6>
          
          <div class="row g-3">
            <div class="col-6">
              <small class="text-muted d-block mb-1">Print Support</small>
              <span class="fw-medium text-capitalize">${a.print_support||"-"}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Print Method</small>
              <span class="fw-medium text-capitalize">${a.print_method||"-"}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Material</small>
              <span class="fw-medium text-capitalize">${a.material||"-"}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Finish</small>
              <span class="fw-medium text-capitalize">${a.finish||"-"}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Format</small>
              <span class="fw-medium text-capitalize">${bt(a.format)}</span>
            </div>
            <div class="col-6">
              <small class="text-muted d-block mb-1">Dimensions</small>
              <span class="fw-medium">${ht(a)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    ${a.source_file_id||a.delivery_image?`
      <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Linked Resources</h6>
      <div class="row g-3">
        ${a.source_file_id?`
          <div class="col-md-6">
            <div class="doc-card cursor-pointer" onclick="downloadDocument('${a.source_file_id}')">
              <div class="doc-icon doc-icon-pdf">
                <i class="fa-solid fa-file-pdf"></i>
              </div>
              <div class="doc-info">
                <div class="doc-name">Source Artwork</div>
                <div class="doc-meta text-primary">Download Source</div>
              </div>
            </div>
          </div>
        `:""}
        ${a.delivery_image?`
          <div class="col-md-6">
            <div class="doc-card cursor-pointer" onclick="previewDataUrl('${a.delivery_image}', 'Delivery Guide')">
              <div class="doc-icon doc-icon-img" style="background: transparent; border: 1px solid var(--border-color); overflow: hidden; padding: 2px;">
                <img src="${a.delivery_image}" style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius-sm);">
              </div>
              <div class="doc-info">
                <div class="doc-name">Delivery/Pack Guide</div>
                <div class="doc-meta text-primary">View Image</div>
              </div>
            </div>
          </div>
        `:""}
      </div>
    `:""}
  `)}function F(t=null,e="edit"){var c;if(!t&&!b()){y("You have read-only access.","warning");return}const a=t?l.data.products.find(d=>d.id===t):null,s=e==="view"&&!!a,i=e==="edit"&&!!a,n=`
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${s?"Product Details":i?"Edit Product":"New Product"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${s?`
              <div class="row g-4 mb-4">
                ${a.product_image?`
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Product Image</label>
                    <img src="${a.product_image}" alt="${a.name}" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                `:""}
                ${a.delivery_image?`
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Delivery Image</label>
                    <img src="${a.delivery_image}" alt="Delivery format" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                `:""}
              </div>

              <div class="mb-4">
                <h6>Description</h6>
                <p class="text-secondary">${a.description}</p>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-4"><strong>Reference:</strong> ${a.reference}</div>
                <div class="col-md-4"><strong>Unit:</strong> ${a.unit}</div>
                <div class="col-md-4"><strong>Category:</strong> ${a.category}</div>
                  <div class="col-md-4"><strong>Price HT:</strong> ${f(a.price_ht,3)}</div>
                  <div class="col-md-4"><strong>Print Support:</strong> ${a.print_support||"-"}</div>
                  <div class="col-md-4"><strong>Print Method:</strong> ${a.print_method||"-"}</div>
                  <div class="col-md-4"><strong>Material:</strong> ${a.material||"-"}</div>
                  <div class="col-md-4"><strong>Finish:</strong> ${a.finish||"-"}</div>

              ${a.source_file?`
                <h6 class="mb-2">Source Print File</h6>
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="badge bg-primary-light text-primary">
                    <i class="fas fa-file me-1"></i>${a.source_file_name||"Source file"}
                  </span>
                  <button type="button" class="btn btn-sm btn-primary" id="downloadSourceFileBtn">
                    <i class="fas fa-download me-1"></i>Download
                  </button>
                </div>
              `:""}
            `:`
              <form id="productForm">
                <input type="hidden" id="productIdHidden">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Reference *</label>
                    <input type="text" class="form-control" id="productRef" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Name *</label>
                    <input type="text" class="form-control" id="productName" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Category *</label>
                    <select class="form-select" id="productCategory" required>
                      ${l.data.categories.map(d=>`<option value="${d}">${d}</option>`).join("")}
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Unit</label>
                    <select class="form-select" id="productUnit">
                      <option value="piece">Piece</option>
                      <option value="pack">Pack</option>
                      <option value="set">Set</option>
                      <option value="unit">Unit</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Description</label>
                    <textarea class="form-control" id="productDesc" rows="3"></textarea>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Price HT *</label>
                    <input type="number" step="0.001" class="form-control" id="productPrice" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Print Support</label>
                    <select class="form-select" id="productPrintSupport">
                      <option value="">Select support</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor-outdoor">Indoor / Outdoor</option>
                      <option value="vinyl">Vinyl</option>
                      <option value="paper">Paper</option>
                      <option value="film">Backlit Film</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Print Method</label>
                    <select class="form-select" id="productPrintMethod">
                      <option value="">Select method</option>
                      <option value="digital">Digital</option>
                      <option value="offset">Offset</option>
                      <option value="uv">UV</option>
                      <option value="screen">Screen Print</option>
                      <option value="flexo">Flexography</option>
                      <option value="sublimation">Sublimation</option>
                      <option value="letterpress">Letterpress</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Format</label>
                    <select class="form-select" id="productFormat" onchange="updateProductSurfacePreview()">
                      <option value="">Select format</option>
                      <option value="circle">Circle</option>
                      <option value="square">Square (Carré)</option>
                      <option value="rectangle">Rectangle</option>
                      <option value="oval">Oval</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div class="col-md-4" id="dimWidthGroup">
                    <label class="form-label" id="dimWidthLabel">Width / Diameter (mm)</label>
                    <input type="number" step="0.1" min="0" class="form-control" id="productDimWidth" oninput="updateProductSurfacePreview()">
                  </div>
                  <div class="col-md-4" id="dimHeightGroup" style="display:none">
                    <label class="form-label">Height (mm)</label>
                    <input type="number" step="0.1" min="0" class="form-control" id="productDimHeight" oninput="updateProductSurfacePreview()">
                  </div>
                  <div class="col-md-4">
                    <label class="form-label">Surface (mm²)</label>
                    <input type="text" class="form-control" id="productSurface" readonly placeholder="Auto-calculated">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Material</label>
                    <select class="form-select" id="productMaterial">
                      <option value="">Select material</option>
                      <option value="paper">Paper</option>
                      <option value="vinyl">Vinyl</option>
                      <option value="polypropylene">Polypropylene</option>
                      <option value="cardboard">Cardboard</option>
                      <option value="pvc">PVC</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Finish</label>
                    <select class="form-select" id="productFinish">
                      <option value="">Select finish</option>
                      <option value="gloss">Gloss</option>
                      <option value="matte">Matte</option>
                      <option value="varnish">Varnish</option>
                      <option value="laminate">Lamination</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Product Image</label>
                    <input type="file" class="form-control" id="productImageFile" accept="image/*">
                    <small class="text-muted">Stored locally in this project</small>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Delivery Image</label>
                    <input type="file" class="form-control" id="deliveryImageFile" accept="image/*">
                    <small class="text-muted">Stored locally in this project</small>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Source Print File</label>
                    <input type="file" class="form-control" id="sourceFile" accept=".ai,.eps,.svg,.psd,.png,.pdf,.jpg,.jpeg,.webp">
                    <small class="text-muted">AI, EPS, SVG, PSD, PNG, PDF, etc. — stored locally</small>
                  </div>
                </div>
              </form>
            `}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${s?"":`
              <button type="button" class="btn btn-primary" onclick="saveProduct()">
                <i class="fas fa-save me-1"></i>Save Product
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;(c=document.getElementById("productModal"))==null||c.remove(),document.body.insertAdjacentHTML("beforeend",n),i&&a&&(document.getElementById("productIdHidden").value=a.id,document.getElementById("productRef").value=a.reference||"",document.getElementById("productName").value=a.name||"",document.getElementById("productCategory").value=a.category||"",document.getElementById("productUnit").value=a.unit||"",document.getElementById("productDesc").value=a.description||"",document.getElementById("productPrice").value=a.price_ht||"",document.getElementById("productPrintSupport").value=a.print_support||"",document.getElementById("productPrintMethod").value=a.print_method||"",document.getElementById("productMaterial").value=a.material||"",document.getElementById("productFinish").value=a.finish||"",document.getElementById("productFormat").value=a.format||"",document.getElementById("productDimWidth").value=a.dimension_width||"",document.getElementById("productDimHeight").value=a.dimension_height||"",document.getElementById("productSurface").value=a.surface_mm2||"",me()),new bootstrap.Modal(document.getElementById("productModal")).show();const r=document.getElementById("downloadSourceFileBtn");r&&(a!=null&&a.source_file)&&r.addEventListener("click",()=>V(a.source_file,a.source_file_name||"source-file")),document.getElementById("productModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.saveProduct=yt,window.updateProductSurfacePreview=me,window.previewDataUrl=oe,window.deleteProduct=gt}function me(){var o,r,c;const t=(o=document.getElementById("productFormat"))==null?void 0:o.value,e=(r=document.getElementById("productDimWidth"))==null?void 0:r.value,a=(c=document.getElementById("productDimHeight"))==null?void 0:c.value,s=document.getElementById("dimHeightGroup"),i=document.getElementById("dimWidthLabel"),n=document.getElementById("productSurface");if(s&&(s.style.display=t==="rectangle"?"":"none"),i&&(i.textContent=t==="circle"?"Diameter (mm)":t==="square"?"Side (mm)":"Width (mm)"),n){const d=Le(t,e,a);n.value=d>0?C(d):""}}async function yt(){var u,v,m;if(!b())return;const t=(u=document.getElementById("productIdHidden"))==null?void 0:u.value,e=t?l.data.products.find(D=>D.id===t):null,a=document.getElementById("productFormat").value,s=parseFloat(document.getElementById("productDimWidth").value)||0,i=parseFloat(document.getElementById("productDimHeight").value)||0,n=Le(a,s,i),o=document.getElementById("productImageFile").files[0],r=document.getElementById("deliveryImageFile").files[0],c=document.getElementById("sourceFile").files[0],d={id:t||N("PRD","product"),reference:document.getElementById("productRef").value,name:document.getElementById("productName").value,category:document.getElementById("productCategory").value,unit:document.getElementById("productUnit").value,description:document.getElementById("productDesc").value,price_ht:parseFloat(document.getElementById("productPrice").value),print_support:document.getElementById("productPrintSupport").value,print_method:document.getElementById("productPrintMethod").value,material:((v=document.getElementById("productMaterial"))==null?void 0:v.value)||null,finish:((m=document.getElementById("productFinish"))==null?void 0:m.value)||null,format:a,dimension_width:s,dimension_height:a==="rectangle"?i:null,surface_mm2:n,product_image:o?await J(o):e?e.product_image:null,delivery_image:r?await J(r):e?e.delivery_image:null,source_file:c?await J(c):e?e.source_file:null,source_file_name:c?c.name:e?e.source_file_name:null,created_at:e?e.created_at:new Date().toISOString(),updated_at:new Date().toISOString()};if(await He(d),c){const D={id:N("DOC","document"),name:c.name,type:c.name.split(".").pop().toLowerCase(),category:"artwork-files",size:Zt(d.source_file),data:d.source_file,url:d.source_file,related_product:d.id,created_at:new Date().toISOString().split("T")[0]};await ze(D)}bootstrap.Modal.getInstance(document.getElementById("productModal")).hide(),P("products"),y("Product created successfully","success")}async function gt(t){if(b()&&confirm("Delete this product? This action cannot be undone."))try{await Ue(t),P("products"),y("Product deleted","success")}catch(e){console.error("Delete product failed",e),y("Failed to delete product","danger")}}function bt(t){return{circle:"Circle",square:"Square (Carré)",rectangle:"Rectangle",oval:"Oval",custom:"Custom"}[t]||"-"}function ht(t){return!t.format||!t.dimension_width?"-":t.format==="rectangle"?`${t.dimension_width} × ${t.dimension_height||0} mm`:t.format==="circle"?`Ø ${t.dimension_width} mm`:t.format==="oval"?`Oval ${t.dimension_width} x ${t.dimension_height||"N/A"} mm`:`${t.dimension_width} mm`}function wt(t){const e=l.data.purchaseOrders;t.innerHTML=`
    <div class="split-pane-layout">
      
      <!-- List Pane -->
      <div class="split-pane-list" style="width: 340px;">
        <div class="split-pane-list-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-3);">
            <h1 class="split-pane-list-title" style="margin: 0;">Purchase Orders</h1>
            ${b()?'<button class="btn-primary-custom" onclick="showPOModal()" title="New PO" style="padding: 6px 12px; font-size: 12px;"><i class="fas fa-plus"></i> New</button>':""}
          </div>
          
          <div style="display: flex; gap: var(--sp-2);">
            <input type="text" class="filter-search" placeholder="Search POs…" oninput="filterPOList(this.value)" style="padding-left: 12px;">
            <select class="filter-select" id="poStatusFilter" onchange="filterPOList()" style="min-width: 100px;">
              <option value="">All</option>
              ${["draft","pending","approved","in-production","completed","cancelled"].map(a=>`<option value="${a}">${w(a)}</option>`).join("")}
            </select>
          </div>
        </div>
        
        <div class="split-pane-list-content" id="poListContainer">
          ${Ie(e)}
        </div>
      </div>

      <!-- Detail Pane -->
      <div class="split-pane-detail" id="poDetailContainer">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-file-invoice"></i></div>
          <h3>No order selected</h3>
          <p>Select a purchase order from the list to view details</p>
        </div>
      </div>
      
    </div>
  `,window.showPOModal=ie,window.filterPOList=xt,window.renderPODetails=pe,window.exportPOs=Bt,e.length>0&&setTimeout(()=>pe(e[0].id),50)}function Ie(t){return t.length===0?'<div class="empty-state" style="padding: var(--sp-8);"><div class="empty-state-icon"><i class="fa-solid fa-file-invoice"></i></div><h3>No orders</h3><p>No purchase orders match your filter</p></div>':t.sort((e,a)=>new Date(a.date)-new Date(e.date)).map(e=>{const a=e.status==="completed"||e.status==="completed-partial"?"status-success":e.status==="cancelled"?"status-danger":e.status==="in-production"?"status-primary":e.status==="approved"?"status-info":e.status==="pending"?"status-warning":"status-secondary";return`
    <div class="list-item-card" id="po-list-item-${e.id}" onclick="renderPODetails('${e.id}')">
      <div class="list-item-title">
        <span class="list-item-ref">${e.po_number}</span>
        <span class="list-item-amount">${f(e.total_ht,0)}</span>
      </div>
      <div class="list-item-sub">
        <span>${_(e.date)}</span>
        <span class="status-indicator ${a}" title="${e.status}"></span>
      </div>
    </div>
  `}).join("")}function xt(t=""){var n;const e=((n=document.getElementById("poStatusFilter"))==null?void 0:n.value)||"";let a=typeof t=="string"?t.toLowerCase():"",s=l.data.purchaseOrders;e&&(s=s.filter(o=>o.status===e)),a&&(s=s.filter(o=>o.po_number.toLowerCase().includes(a)||(o.supplier_reference||"").toLowerCase().includes(a)));const i=document.getElementById("poListContainer");i&&(i.innerHTML=Ie(s))}function pe(t){var o;document.querySelectorAll("#poListContainer .list-item-card").forEach(r=>r.classList.remove("active"));const e=document.getElementById(`po-list-item-${t}`);e&&e.classList.add("active");const a=l.data.purchaseOrders.find(r=>r.id===t),s=document.getElementById("poDetailContainer");if(!a||!s)return;const i=l.data.deliveries.filter(r=>r.related_po===t),n=S(a);s.innerHTML=`
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <div class="d-flex align-items-center gap-3 mb-2">
          <h2 class="m-0 fs-3 fw-bold">${a.po_number}</h2>
          <span class="badge rounded-pill border" style="background: var(--bg-page); color: var(--text-primary);">${w(a.status)}</span>
        </div>
        <p class="text-muted m-0">Ordered ${_(a.date)} ${a.supplier_reference?`• Ref: ${a.supplier_reference}`:""}</p>
      </div>
      <div class="d-flex gap-2">
        ${b()?`<button class="btn btn-outline-secondary btn-sm" onclick="showPOModal('${a.id}', {editMode: true})"><i class="fas fa-pen me-1"></i> Edit</button>`:""}
        <button class="btn btn-outline-secondary btn-sm" onclick="printPO('${a.id}')"><i class="fas fa-print me-1"></i> Print</button>
      </div>
    </div>

    ${Oe(a.status)}

    <div class="row g-4 mb-4 mt-2">
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Financial Summary</h6>
          <div class="d-flex justify-content-between mb-2">
            <span class="text-secondary">Total HT</span>
            <span class="fw-bold">${f(a.total_ht)}</span>
          </div>
          <div class="d-flex justify-content-between mb-3">
            <span class="text-secondary">Received HT</span>
            <span class="fw-bold text-success">${f(n.receivedAmount)}</span>
          </div>
          <hr class="border-light opacity-50">
          <div class="d-flex justify-content-between mt-2">
            <span class="fw-bold">Total TTC (estimated)</span>
            <span class="fw-bold">${f(a.total_ht*1.19)}</span>
          </div>
        </div>
      </div>
      
      <div class="col-md-6">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Fulfillment Progress</h6>
          <div class="d-flex justify-content-between mb-2 small fw-bold">
            <span>${n.totalReceived} / ${n.totalOrdered} pcs</span>
            <span class="text-primary">${n.pct}%</span>
          </div>
          <div class="progress mb-3" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${n.pct}%"></div>
          </div>
          <div class="d-flex justify-content-between text-secondary small">
            <span>Expected Delivery:</span>
            <span class="fw-medium text-body">${a.expected_delivery_date?_(a.expected_delivery_date):"Not set"}</span>
          </div>
        </div>
      </div>
    </div>

    <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Order Lines (${((o=a.lines)==null?void 0:o.length)||0})</h6>
    <div class="table-responsive rounded border mb-4 lines-scroll-container">
      <table class="data-table mb-0 align-middle">
        <thead style="background: var(--bg-page); border-bottom: 1px solid var(--border-color);">
          <tr>
            <th class="py-3 px-3 text-secondary small text-uppercase">Product</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Ordered</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Received</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-end">Line HT</th>
          </tr>
        </thead>
        <tbody>
          ${(a.lines||[]).map(r=>`
            <tr class="border-bottom">
              <td class="p-3">
                <a href="#" class="text-primary fw-medium text-decoration-none d-block mb-1" onclick="showProductModal('${r.product_id}', 'view'); return false;">${r.product_name}</a>
                <span class="badge border" style="background: var(--bg-page); color: var(--text-primary);">${f(r.unit_price_ht,3)} / u</span>
              </td>
              <td class="p-3 text-center fw-medium">${r.quantity}</td>
              <td class="p-3 text-center ${r.received_qty>=r.quantity?"text-success":"text-warning"} fw-medium">${r.received_qty||0}</td>
              <td class="p-3 text-end fw-bold">${f((r.quantity||0)*(r.unit_price_ht||0),3)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    ${a.notes?`
      <h6 class="fw-bold mb-2 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Notes</h6>
      <div class="p-3 rounded border mb-4 text-secondary" style="background: var(--bg-page);">${a.notes}</div>
    `:""}
    
    ${i.length>0?`
      <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Related Deliveries</h6>
      <div class="d-flex flex-column gap-2 mb-4">
        ${i.map(r=>`
          <div class="d-flex justify-content-between align-items-center p-3 rounded border shadow-sm cursor-pointer" style="background: var(--bg-card);" onclick="navigateTo('deliveries');setTimeout(()=>renderDeliveryDetails('${r.id}'),100);">
            <div>
              <div class="fw-bold text-primary mb-1">${r.delivery_number}</div>
              <small class="text-muted">${r.delivery_date?_(r.delivery_date):"Pending"}</small>
            </div>
            <div class="text-end">
              <div class="fw-bold">${f(I(r))}</div>
              <span class="badge ${r.status==="delivered"?"bg-success":"bg-warning"} mt-1">${w(h(r.status))}</span>
            </div>
          </div>
        `).join("")}
      </div>
    `:""}
  `}function ie(t=null,e={}){var d,u,v;if(!t&&!b()){y("You have read-only access.","warning");return}const a=t?l.data.purchaseOrders.find(m=>m.id===t):null,s=a&&e.editMode&&b(),i=a&&!s;if(!a&&t)return;const n=a?l.data.deliveries.filter(m=>m.related_po===a.id):[],o=a?l.data.payments.filter(m=>m.related_po===a.id):[],r=`
    <div class="modal fade" id="poModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${a?s?`Edit ${a.po_number}`:a.po_number:"New Purchase Order"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${a&&!s?`
              <!-- Status Timeline -->
              <div class="mb-4">
                <h6 class="mb-3">Order Status</h6>
                <div class="d-flex justify-content-between">
                  ${Oe(a.status)}
                </div>
              </div>

              <!-- PO Details -->
              <div class="row g-4 mb-4">
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header"><h6 class="mb-0">Order Information</h6></div>
                    <div class="card-body">
                      <div class="row g-3">
                        <div class="col-6">
                          <small class="text-muted">PO Number</small>
                          <div class="fw-medium">${a.po_number}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Order Date</small>
                          <div class="fw-medium">${_(a.date)}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Expected Delivery</small>
                          <div class="fw-medium">${a.expected_delivery_date?_(a.expected_delivery_date):"-"}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Supplier Ref</small>
                          <div class="fw-medium">${a.supplier_reference||"-"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header"><h6 class="mb-0">Financial Summary</h6></div>
                    <div class="card-body">
                      ${(()=>{const m=S(a);return`
                          <div class="d-flex justify-content-between mb-2">
                            <span>Ordered HT</span>
                            <span class="fw-medium">${f(m.orderedAmount)}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <span>Received HT</span>
                            <span class="fw-medium text-success">${f(m.receivedAmount)}</span>
                          </div>
                          ${$e(m.pct,"PO Fulfillment")}
                          <div class="small text-muted mt-2">${m.totalReceived} / ${m.totalOrdered} pcs received</div>
                        `})()}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Lines -->
              <div class="mb-4">
                <h6 class="mb-3">Order Lines</h6>
                <div class="table-responsive lines-scroll-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Ordered</th>
                        <th>Received</th>
                        <th>Remaining</th>
                        <th>Unit Price</th>
                        <th>Line HT</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${S(a).lines.map(m=>`
                        <tr>
                          <td>
                            <a href="#" class="text-primary fw-medium" onclick="showProductModal('${m.product_id}', 'view'); return false;">
                              ${m.product_name}
                            </a>
                          </td>
                          <td>${m.ordered}</td>
                          <td class="text-success fw-medium">${m.received}</td>
                          <td>${m.remaining}</td>
                          <td>${f(m.unit_price_ht,3)}</td>
                          <td>${f(m.ordered*m.unit_price_ht,3)}</td>
                        </tr>
                      `).join("")}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="5" class="text-end fw-bold">Total HT</td>
                        <td class="fw-bold">${f(a.total_ht,3)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              ${a.notes?`
                <div class="mb-4">
                  <h6 class="mb-2">Notes</h6>
                  <p class="text-secondary">${a.notes}</p>
                </div>
              `:""}

              ${n.length>0?`
                <div class="mb-4">
                  <h6 class="mb-3">Deliveries</h6>
                  ${n.map(m=>`
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <a href="#" class="fw-medium text-primary" onclick="navigateToDeliveriesAndShow('${m.id}'); return false;">${m.delivery_number}</a>
                            <span class="status-badge ${h(m.status)} ms-2">${w(h(m.status))}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-medium">${f(I(m))}</div>
                            <small class="text-muted">${m.delivery_date?_(m.delivery_date):"Pending"}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              `:""}

              ${o.length>0?`
                <div class="mb-4">
                  <h6 class="mb-3">Payments</h6>
                  ${o.map(m=>`
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span class="fw-medium">${m.payment_reference}</span>
                            <span class="status-badge ${m.status} ms-2">${w(m.status)}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-bold">${f(m.amount_paid||0)} / ${f(m.amount)}</div>
                            <small class="text-muted">${m.payment_date?_(m.payment_date):"Pending"}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              `:""}

            `:`
              <form id="poForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">PO Number *</label>
                    <input type="text" class="form-control" id="poNumber" value="${a?a.po_number:Je()}" readonly required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Order Date *</label>
                    <input type="date" class="form-control" id="poDate" value="${a?a.date:new Date().toISOString().split("T")[0]}" required>
                  </div>
                  ${a?`<input type="hidden" id="poId" value="${a.id}">`:""}
                  <div class="col-md-6">
                    <label class="form-label">Supplier Reference</label>
                    <input type="text" class="form-control" id="poRef" value="${(a==null?void 0:a.supplier_reference)||""}">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Expected Delivery Date</label>
                    <input type="date" class="form-control" id="poDeliveryDate" value="${(a==null?void 0:a.expected_delivery_date)||""}">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Status</label>
                    <select class="form-select" id="poStatusEdit">
                      ${["draft","pending","approved","in-production","completed","completed-partial","cancelled"].map(m=>`<option value="${m}" ${a&&a.status===m||!a&&m==="draft"?"selected":""}>${w(m)}</option>`).join("")}
                    </select>
                  </div>
                  <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="poNotes" rows="2">${(a==null?void 0:a.notes)||""}</textarea>
                  </div>
                </div>

                <h6 class="mt-4 mb-3">Order Lines</h6>
                <div id="poLines">
                  ${(d=a==null?void 0:a.lines)!=null&&d.length?a.lines.map((m,D)=>Y(m,D)).join(""):Y(null,0)}
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3 mt-3">
                  <div>
                    <div class="text-muted small">Total Surface</div>
                    <div id="poLinesSurfaceTotal" class="fw-semibold">${a?C(Dt(a)):"-"} </div>
                  </div>
                  <div>
                    <div class="text-muted small">Total Commande HT</div>
                    <div id="poLinesHTTotal" class="fw-semibold">${f(a?a.total_ht:0,3)}</div>
                  </div>
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2" onclick="addPOLine()">
                  <i class="fas fa-plus me-1"></i>Add Line
                </button>
              </form>
            `}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${i?`
              <button type="button" class="btn btn-outline-primary" onclick="printPO('${a.id}')">
                <i class="fas fa-print me-1"></i>Print PO
              </button>
              ${b()?`
                <button type="button" class="btn btn-outline-secondary" onclick="showPOModal('${a.id}', { editMode: true })">
                  <i class="fas fa-pen me-1"></i>Edit PO
                </button>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <select class="form-select form-select-sm" id="poStatusSelect" style="width: auto;">
                    ${["draft","pending","approved","in-production","completed","completed-partial","cancelled"].map(m=>`<option value="${m}" ${a.status===m?"selected":""}>${w(m)}</option>`).join("")}
                  </select>
                  <button type="button" class="btn btn-primary" onclick="updatePOStatus('${a.id}')">
                    <i class="fas fa-save me-1"></i>Update Status
                  </button>
                  ${S(a).hasPartial&&!["completed","completed-partial","cancelled"].includes(a.status)?`
                      <button type="button" class="btn btn-outline-warning" onclick="closePOPartial('${a.id}')">
                        <i class="fas fa-flag-checkered me-1"></i>Close PO (Partial)
                      </button>
                    `:""}
                </div>
              `:""}
            `:`
              <button type="button" class="btn btn-primary" onclick="savePO()">
                <i class="fas fa-save me-1"></i>${a?"Update PO":"Create PO"}
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;(u=document.getElementById("poModal"))==null||u.remove(),document.body.insertAdjacentHTML("beforeend",r),K=a&&s?((v=a.lines)==null?void 0:v.length)||0:1,new bootstrap.Modal(document.getElementById("poModal")).show(),H(),document.getElementById("poModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.savePO=Ot,window.addPOLine=$t,window.updatePOLineTotal=_t,window.viewPOLineProduct=Pt,window.removePOLine=Et,window.printPO=Lt,window.updatePOStatus=kt,window.editPO=m=>ie(m,{editMode:!0}),window.navigateToProductsAndShow=F,window.closePOPartial=te,window.navigateToDeliveriesAndShow=m=>{bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),E("deliveries"),setTimeout(()=>U(m),200)}}function Y(t,e){const a=(t==null?void 0:t.product_id)||"",s=l.data.products.find(c=>c.id===a),i=(t==null?void 0:t.quantity)||1,n=(t==null?void 0:t.unit_price_ht)!=null?t.unit_price_ht.toFixed(3):((s==null?void 0:s.price_ht)||"").toString(),o=(t==null?void 0:t.surface_mm2)!=null?C(t.surface_mm2):"",r=t?(t.line_total_ht||t.quantity*t.unit_price_ht).toFixed(3):"";return`
    <div class="row g-2 mb-2 align-items-end po-line" data-index="${e}">
      <div class="col-md-4">
        <label class="form-label small mb-1">Product</label>
        <div class="input-group">
          <select class="form-select" id="poProduct${e}" onchange="updatePOLineTotal(${e})" required>
            <option value="">Select Product</option>
            ${l.data.products.map(c=>`
              <option value="${c.id}" data-price="${c.price_ht}" data-surface="${c.surface_mm2||0}" ${c.id===a?"selected":""}>
                ${c.name} (${c.reference})
              </option>
            `).join("")}
          </select>
          <button type="button" class="btn btn-outline-secondary" id="poViewProduct${e}" onclick="viewPOLineProduct(${e})" title="View product" ${a?"":"disabled"}>
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">Qty</label>
        <input type="number" class="form-control" id="poQty${e}" placeholder="Qty" min="1" value="${i}" oninput="updatePOLineTotal(${e})" required>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Surface</label>
        <input type="text" class="form-control" id="poSurface${e}" placeholder="mm²" readonly value="${o}">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Unit Price</label>
        <input type="text" class="form-control" id="poUnitPrice${e}" placeholder="Price" readonly value="${n}">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Total HT</label>
        <input type="text" class="form-control" id="poLineTotal${e}" placeholder="Total" readonly value="${r}">
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">&nbsp;</label>
        <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removePOLine(${e})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `}let K=1;function $t(){document.getElementById("poLines").insertAdjacentHTML("beforeend",Y(null,K)),K++,H()}function _t(t){const e=document.getElementById(`poProduct${t}`),a=document.getElementById(`poQty${t}`),s=document.getElementById(`poUnitPrice${t}`),i=document.getElementById(`poSurface${t}`),n=document.getElementById(`poLineTotal${t}`),o=document.getElementById(`poViewProduct${t}`);if(e&&e.value){const r=e.options[e.selectedIndex],c=parseFloat(r.dataset.price)||0,d=parseFloat(r.dataset.surface)||0,u=parseInt(a.value)||0;s.value=c.toFixed(3),i.value=d>0?C(d):"-",n.value=(c*u).toFixed(3),o&&(o.disabled=!1)}else s&&(s.value=""),i&&(i.value=""),n&&(n.value=""),o&&(o.disabled=!0);H()}function Pt(t){var a;const e=(a=document.getElementById(`poProduct${t}`))==null?void 0:a.value;if(e){const s=bootstrap.Modal.getInstance(document.getElementById("poModal"));s&&s.hide(),F(e)}}function Dt(t){return(t.lines||[]).reduce((e,a)=>{const s=parseFloat(a.surface_mm2)||0,i=parseInt(a.quantity)||0;return e+s*i},0)}function It(){const t=document.querySelectorAll(".po-line");let e=0;return t.forEach(a=>{const s=document.getElementById(`poProduct${a.dataset.index}`),i=document.getElementById(`poQty${a.dataset.index}`);document.getElementById(`poSurface${a.dataset.index}`);const n=parseInt(i==null?void 0:i.value)||0,o=s!=null&&s.value&&parseFloat(s.options[s.selectedIndex].dataset.surface)||0;e+=o*n}),e}function St(){const t=document.querySelectorAll(".po-line");let e=0;return t.forEach(a=>{const s=document.getElementById(`poLineTotal${a.dataset.index}`),i=parseFloat(s==null?void 0:s.value)||0;e+=i}),e}function H(){const t=document.getElementById("poLinesSurfaceTotal"),e=document.getElementById("poLinesHTTotal");t&&(t.textContent=C(It())),e&&(e.textContent=f(St(),3))}function Et(t){const e=document.querySelector(`.po-line[data-index="${t}"]`);e&&(e.remove(),H())}async function Ot(){var r,c;if(!b())return;const t=[];if(document.querySelectorAll(".po-line").forEach(d=>{var g;const u=d.dataset.index,v=document.getElementById(`poProduct${u}`),m=document.getElementById(`poQty${u}`),D=document.getElementById(`poUnitPrice${u}`);if(v.value&&m.value){const L=l.data.products.find(Be=>Be.id===v.value),G=document.getElementById(`poSurface${u}`),ke=L.surface_mm2||parseFloat(((g=G==null?void 0:G.dataset)==null?void 0:g.raw)||0)||0;t.push({product_id:v.value,product_name:L.name,quantity:parseInt(m.value),unit_price_ht:parseFloat(D.value),surface_mm2:ke,line_total_ht:parseFloat(D.value)*parseInt(m.value),received_qty:0})}}),t.length===0){y("Please add at least one product line","warning");return}const a=(r=document.getElementById("poId"))==null?void 0:r.value,s=a?l.data.purchaseOrders.find(d=>d.id===a):null,i=t.reduce((d,u)=>d+u.line_total_ht,0),n=((c=document.getElementById("poStatusEdit"))==null?void 0:c.value)||"draft",o=s?{...s,status:n,date:document.getElementById("poDate").value,supplier_reference:document.getElementById("poRef").value,expected_delivery_date:document.getElementById("poDeliveryDate").value,actual_delivery_date:s.actual_delivery_date,lines:t.map(d=>{var u;return{...d,received_qty:Math.min(((u=s.lines.find(v=>v.product_id===d.product_id))==null?void 0:u.received_qty)||0,d.quantity)}}),total_ht:i,total_ttc:i,notes:document.getElementById("poNotes").value,updated_at:new Date().toISOString()}:{id:N("PO","purchaseOrder"),po_number:Qe(),date:document.getElementById("poDate").value,status:n,supplier_reference:document.getElementById("poRef").value,expected_delivery_date:document.getElementById("poDeliveryDate").value,actual_delivery_date:null,lines:t,total_ht:i,total_ttc:i,notes:document.getElementById("poNotes").value,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};await j(o),bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),P("purchase-orders"),y(s?"Purchase Order updated successfully":"Purchase Order created successfully","success")}function Lt(t){const e=l.data.purchaseOrders.find(s=>s.id===t);if(!e)return;const a=window.open("","_blank");a.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PO ${e.po_number}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .company-name { font-size: 24px; font-weight: bold; }
        .po-info { text-align: right; }
        table { width: 100%; border-collapse: collapse; margin-top: 30px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background: #f5f5f5; }
        .totals { margin-top: 20px; text-align: right; }
        .total-row { font-weight: bold; font-size: 18px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <img src="/logo-wave-vi.png" alt="WAVE VI" style="width: 90px; height: auto; margin-bottom: 12px; display: block;" />
          <div class="company-name">${l.data.settings.companyName}</div>
          <div>Supplier: SGS Printing Services</div>
        </div>
        <div class="po-info">
          <h1>PURCHASE ORDER</h1>
          <div><strong>${e.po_number}</strong></div>
          <div>Date: ${_(e.date)}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${e.lines.map(s=>`
            <tr>
              <td>${s.product_name}</td>
              <td>${s.quantity}</td>
              <td>${f(s.unit_price_ht)}</td>
              <td>${f((s.quantity||0)*(s.unit_price_ht||0))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="totals">
        <p class="total-row">Total HT: ${f(e.total_ht,3)}</p>

      ${e.notes?`<p style="margin-top: 30px;"><strong>Notes:</strong> ${e.notes}</p>`:""}
    </body>
    </html>
  `),a.document.close(),a.print()}async function kt(t){var s;if(!b())return;const e=l.data.purchaseOrders.find(i=>i.id===t);if(!e)return;const a=(s=document.getElementById("poStatusSelect"))==null?void 0:s.value;if(!a||a===e.status){y("Please select a different status","warning");return}if(a==="completed-partial"){await te(t);return}if(a==="completed"&&!S(e).isComplete){y("PO is not fully received. Use Close PO (Partial) or receive remaining qty.","warning");return}if(e.status=a,e.updated_at=new Date().toISOString(),a==="in-production"){const i=_e(e);i&&(l.data.deliveries.some(o=>o.id===i.id)||(await A(i),y(`Delivery ${i.delivery_number} created`,"info")))}a==="completed"&&(e.actual_delivery_date=e.actual_delivery_date||new Date().toISOString().split("T")[0]),await j(e),z(),bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),P("purchase-orders"),y(`PO status updated to ${w(e.status)}`,"success")}function Bt(){const t=[["PO Number","Date","Status","Amount HT","Delivery Date"].join(","),...l.data.purchaseOrders.map(e=>[e.po_number,e.date,e.status,e.total_ht,e.actual_delivery_date||e.expected_delivery_date||""].join(","))].join(`
`);ta(t,"purchase-orders.csv")}function Tt(t){const e=l.data.deliveries;e.filter(a=>h(a.status)==="pending").length,e.filter(a=>h(a.status)==="partial").length,e.filter(a=>h(a.status)==="delivered").length,e.filter(a=>["partial","delivered"].includes(h(a.status))).reduce((a,s)=>a+I(s),0),t.innerHTML=`
    <div class="split-pane-layout">
      
      <!-- List Pane -->
      <div class="split-pane-list" style="width: 340px;">
        <div class="split-pane-list-header">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--sp-3);">
            <h1 class="split-pane-list-title" style="margin: 0;">Deliveries</h1>
          </div>
          
          <div style="display: flex; gap: var(--sp-2);">
            <input type="text" class="filter-search" placeholder="Search deliveries…" oninput="filterDeliveryList(this.value)" style="padding-left: 12px;">
            <select class="filter-select" id="deliveryStatusFilter" onchange="filterDeliveryList()" style="min-width: 100px;">
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="partial">Partial</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        
        <div class="split-pane-list-content" id="deliveryListContainer">
          ${Se(e)}
        </div>
      </div>

      <!-- Detail Pane -->
      <div class="split-pane-detail" id="deliveryDetailContainer">
        <div class="empty-state">
          <div class="empty-state-icon"><i class="fa-solid fa-truck"></i></div>
          <h3>No delivery selected</h3>
          <p>Select a delivery from the list to view details</p>
        </div>
      </div>
      
    </div>
  `,window.filterDeliveryList=Ct,window.renderDeliveryDetails=ve,window.showDeliveryModal=U,e.length>0&&setTimeout(()=>ve(e[0].id),50)}function Se(t){return t.length===0?'<div class="empty-state" style="padding: var(--sp-8);"><div class="empty-state-icon"><i class="fa-solid fa-truck"></i></div><h3>No deliveries</h3><p>No deliveries match your filter</p></div>':t.sort((e,a)=>new Date(a.created_at||0)-new Date(e.created_at||0)).map(e=>{const a=h(e.status),s=a==="delivered"?"status-success":a==="cancelled"?"status-danger":a==="partial"?"status-primary":"status-warning";return`
    <div class="list-item-card" id="delivery-list-item-${e.id}" onclick="renderDeliveryDetails('${e.id}')">
      <div class="list-item-title">
        <span class="list-item-ref">${e.delivery_number}</span>
        <span class="list-item-amount">${f(I(e),0)}</span>
      </div>
      <div class="list-item-sub">
        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;" title="${e.po_number}">${e.po_number}</span>
        <span class="status-indicator ${s}" title="${a}"></span>
      </div>
    </div>
  `}).join("")}function Ct(t=""){var n;const e=((n=document.getElementById("deliveryStatusFilter"))==null?void 0:n.value)||"";let a=typeof t=="string"?t.toLowerCase():"",s=l.data.deliveries;e&&(s=s.filter(o=>h(o.status)===e)),a&&(s=s.filter(o=>o.delivery_number.toLowerCase().includes(a)||o.po_number.toLowerCase().includes(a)));const i=document.getElementById("deliveryListContainer");i&&(i.innerHTML=Se(s))}function ve(t){var D;document.querySelectorAll("#deliveryListContainer .list-item-card").forEach(g=>g.classList.remove("active"));const e=document.getElementById(`delivery-list-item-${t}`);e&&e.classList.add("active");const a=l.data.deliveries.find(g=>g.id===t),s=document.getElementById("deliveryDetailContainer");if(!a||!s)return;const i=h(a.status),n=l.data.payments.find(g=>g.related_delivery===a.id),o=b()&&i==="pending",r=l.data.purchaseOrders.find(g=>g.id===a.related_po),c=r?S(r):null,d=I(a),u=a.lines.reduce((g,L)=>g+(L.remaining_qty??L.ordered_qty),0),v=a.lines.reduce((g,L)=>g+(L.delivered_qty||L.receive_qty||0),0),m=u>0?Math.round(v/u*100):i!=="pending"?100:0;s.innerHTML=`
    <div class="d-flex justify-content-between align-items-start mb-4">
      <div>
        <div class="d-flex align-items-center gap-3 mb-2">
          <h2 class="m-0 fs-3 fw-bold">${a.delivery_number}</h2>
          <span class="badge rounded-pill border" style="background: var(--bg-page); color: var(--text-primary);">${w(i)}</span>
        </div>
        <p class="text-muted m-0">PO: <a href="#" class="text-primary text-decoration-none" onclick="navigateTo('purchase-orders');setTimeout(()=>renderPODetails('${r==null?void 0:r.id}'),100);return false;">${a.po_number}</a></p>
      </div>
      <div class="d-flex gap-2">
        ${o?`<button class="btn btn-primary btn-sm" onclick="showDeliveryModal('${a.id}')"><i class="fas fa-check me-1"></i> Confirm Receipt</button>`:""}
      </div>
    </div>

    <div class="row g-4 mb-4 mt-2">
      <div class="col-md-4">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-3 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Delivery Value</h6>
          <div class="fs-4 fw-bold text-primary">${f(d)}</div>
          <div class="small text-muted mt-1">${a.delivery_date?_(a.delivery_date):"Pending Delivery Date"}</div>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-3 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Fulfillment Progress</h6>
          <div class="d-flex justify-content-between mb-2 small fw-bold">
            <span>${v} / ${u} pcs</span>
            <span class="text-primary">${m}%</span>
          </div>
          <div class="progress mb-2" style="height: 6px;">
            <div class="progress-bar bg-primary" style="width: ${m}%"></div>
          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="p-4 rounded h-100" style="background: var(--bg-page); border: 1px solid var(--border-color);">
          <h6 class="fw-bold mb-3 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Payment Status</h6>
          ${n?`
            <div class="d-flex justify-content-between mb-2 small fw-bold">
              <span>${f(n.amount_paid||0)}</span>
              <span class="${n.status==="paid"?"text-success":"text-warning"}">${w(n.status)}</span>
            </div>
            <div class="progress" style="height: 6px;">
              <div class="progress-bar ${n.status==="paid"?"bg-success":"bg-warning"}" style="width: ${Math.round((n.amount_paid||0)/n.amount*100)}%"></div>
            </div>
            <a href="#" class="small text-decoration-none mt-3 d-block" onclick="navigateTo('payments');setTimeout(()=>showPaymentModal('${n.id}'),100);return false;">View Payment ${n.payment_reference}</a>
          `:`
            <div class="text-muted small">No payment record found.</div>
          `}
        </div>
      </div>
    </div>

    ${c?`
      <div class="alert alert-light border shadow-sm mb-4">
        <div class="d-flex justify-content-between mb-2 small fw-bold">
          <span class="text-muted"><i class="fa-solid fa-chart-pie me-2"></i>Overall PO Fulfillment</span>
          <span>${c.pct}%</span>
        </div>
        <div class="progress" style="height: 4px;">
          <div class="progress-bar bg-secondary" style="width: ${c.pct}%"></div>
        </div>
      </div>
    `:""}

    <h6 class="fw-bold mb-3 mt-4 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Delivery Lines (${((D=a.lines)==null?void 0:D.length)||0})</h6>
    <div class="table-responsive rounded border mb-4 lines-scroll-container">
      <table class="table table-borderless table-hover mb-0 align-middle">
        <thead style="background: var(--bg-page); border-bottom: 1px solid var(--border-color);">
          <tr>
            <th class="py-3 px-3 text-secondary small text-uppercase">Product</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Remaining</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-center">Received</th>
            <th class="py-3 px-3 text-secondary small text-uppercase text-end">Line Amount</th>
          </tr>
        </thead>
        <tbody>
          ${(a.lines||[]).map(g=>`
            <tr class="border-bottom">
              <td class="p-3">
                <a href="#" class="text-primary fw-medium text-decoration-none d-block mb-1" onclick="showProductModal('${g.product_id}'); return false;">${g.product_name}</a>
                <span class="badge border" style="background: var(--bg-page); color: var(--text-primary);">${f(g.unit_price_ht,3)} / u</span>
              </td>
              <td class="p-3 text-center text-muted fw-medium">${g.remaining_qty??g.ordered_qty}</td>
              <td class="p-3 text-center ${(g.delivered_qty||0)>=(g.remaining_qty??g.ordered_qty)?"text-success":"text-primary"} fw-bold">${g.delivered_qty||g.receive_qty||0}</td>
              <td class="p-3 text-end fw-bold">${f(g.line_total||0,3)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>

    ${a.notes?`
      <h6 class="fw-bold mb-2 text-uppercase text-muted" style="font-size:0.75rem; letter-spacing:0.5px;">Notes</h6>
      <div class="p-3 rounded border mb-4 text-secondary" style="background: var(--bg-page);">${a.notes}</div>
    `:""}
  `}function U(t){var d;const e=l.data.deliveries.find(u=>u.id===t);if(!e)return;const a=h(e.status),s=l.data.payments.find(u=>u.related_delivery===e.id),i=b()&&a==="pending",n=l.data.purchaseOrders.find(u=>u.id===e.related_po),o=n?S(n):null,r=`
    <div class="modal fade" id="deliveryModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-truck me-2 text-primary-brand"></i>${e.delivery_number}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="info-tile">
                  <small>Status</small>
                  <div><span class="status-badge ${a}">${w(a)}</span></div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-tile">
                  <small>PO</small>
                  <div class="fw-semibold">${e.po_number}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-tile">
                  <small>${i?"Preview Amount":"Confirmed Amount"}</small>
                  <div class="fw-bold text-primary-brand" id="deliveryPreviewTotal_${e.id}">${f(I(e))}</div>
                </div>
              </div>
            </div>

            ${o?`
              <div class="card mb-4">
                <div class="card-body py-3">
                  ${$e(o.pct,"PO fulfillment")}
                  <div class="small text-muted mt-2">${o.totalReceived} / ${o.totalOrdered} pcs received on PO</div>
                </div>
              </div>
            `:""}

            ${i?`
              <div class="alert alert-info py-2 small mb-4">
                <i class="fa-solid fa-info-circle me-2"></i>
                Enter received quantities (e.g. 80 of 100). Payment will be created only for received products.
              </div>
            `:s?`
              <div class="alert alert-light border py-2 small mb-4">
                <i class="fa-solid fa-credit-card me-2"></i>
                Payment <strong>${s.payment_reference}</strong> —
                ${f(s.amount_paid||0)} / ${f(s.amount)}
                <span class="status-badge ${s.status} ms-2">${w(s.status)}</span>
              </div>
            `:""}

            <h6 class="section-title">Delivery Lines</h6>
            <div class="table-card mb-3">
              <div class="table-responsive lines-scroll-container">
                <table class="data-table mb-0">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Remaining</th>
                      <th>${i?"Receive Now":"Received"}</th>
                      <th>Unit Price</th>
                      <th>Line Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${e.lines.map((u,v)=>`
                      <tr>
                        <td>${u.product_name}</td>
                        <td>${u.remaining_qty??u.ordered_qty}</td>
                        <td>
                          ${i?`
                            <input type="number" class="form-control form-control-sm" style="width:90px"
                              id="receiveQty_${e.id}_${v}"
                              value="${u.receive_qty??u.remaining_qty??0}"
                              min="0" max="${u.remaining_qty??u.ordered_qty}"
                              oninput="updateDeliveryPreviewAmount('${e.id}')">
                          `:u.delivered_qty||0}
                        </td>
                        <td>${f(u.unit_price_ht)}</td>
                        <td id="lineAmount_${e.id}_${v}">${f(Q(u))}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${i?`
              ${o!=null&&o.hasPartial?`
                <button type="button" class="btn btn-outline-warning" onclick="closePOPartial('${n==null?void 0:n.id}')">
                  <i class="fas fa-flag-checkered me-1"></i>Close PO (Partial)
                </button>
              `:""}
              <button type="button" class="btn btn-outline-danger" onclick="cancelDelivery('${e.id}')">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="confirmDelivery('${e.id}')">
                <i class="fas fa-check me-1"></i>Confirm Receipt
              </button>
            `:""}
          </div>
        </div>
      </div>
    </div>
  `;(d=document.getElementById("deliveryModal"))==null||d.remove(),document.body.insertAdjacentHTML("beforeend",r),new bootstrap.Modal(document.getElementById("deliveryModal")).show(),i&&re(e.id),document.getElementById("deliveryModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.confirmDelivery=Mt,window.cancelDelivery=At,window.updateDeliveryPreviewAmount=re,window.closePOPartial=te,window.navigateToProductsAndShow=u=>{var v;(v=bootstrap.Modal.getInstance(document.getElementById("deliveryModal")))==null||v.hide(),E("products"),setTimeout(()=>F(u),200)}}async function Mt(t){if(!b())return;const e=l.data.deliveries.find(n=>n.id===t);if(!e||h(e.status)!=="pending")return;const a=l.data.purchaseOrders.find(n=>n.id===e.related_po);if(!a)return;let s=0;for(let n=0;n<e.lines.length;n++){const o=e.lines[n],r=document.getElementById(`receiveQty_${t}_${n}`),c=parseInt(r==null?void 0:r.value)||0,d=o.remaining_qty??o.ordered_qty;if(c<0||c>d){y(`Invalid quantity for ${o.product_name} (max ${d})`,"warning");return}o.receive_qty=c,o.delivered_qty=c,o.line_total=c*(o.unit_price_ht||0),s+=c;const u=a.lines.find(v=>v.product_id===o.product_id);u&&c>0&&(u.received_qty=(u.received_qty||0)+c)}if(s===0){y("Enter at least one received quantity","warning");return}e.amount=I(e),e.delivery_date=new Date().toISOString().split("T")[0],e.updated_at=new Date().toISOString();const i=S(a);if(e.status=i.isComplete?"delivered":"partial",await A(e),await ot(e),i.isComplete&&(a.status="completed",a.actual_delivery_date=e.delivery_date),a.updated_at=new Date().toISOString(),await j(a),!i.isComplete&&!["completed-partial","cancelled"].includes(a.status)){const n=_e(a);n&&await A(n)}z(),bootstrap.Modal.getInstance(document.getElementById("deliveryModal")).hide(),P("deliveries"),y(`Received ${s} pcs — payment created for ${f(e.amount)}`,"success")}async function At(t){if(!b()||!confirm("Cancel this delivery?"))return;const e=l.data.deliveries.find(a=>a.id===t);e&&(e.status="cancelled",e.updated_at=new Date().toISOString(),await A(e),bootstrap.Modal.getInstance(document.getElementById("deliveryModal")).hide(),P("deliveries"),y("Delivery cancelled","info"))}function Nt(t){const e=l.data.payments,a=Ft(),s=a.totalInvoiced>0?Math.round(a.totalPaid/a.totalInvoiced*100):0;t.innerHTML=`
    ${R()}
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title"><i class="fa-solid fa-credit-card me-2 text-primary-brand"></i>Payments</h1>
        <p class="page-subtitle">Payments based on confirmed deliveries only</p>
      </div>
    </div>

    <div class="payment-summary mb-4">
      <div class="payment-summary-item">
        <div class="amount text-primary-brand">${f(a.totalInvoiced)}</div>
        <div class="label">To Pay (Delivered)</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-success">${f(a.totalPaid)}</div>
        <div class="label">Paid</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-warning">${f(a.remaining)}</div>
        <div class="label">Outstanding</div>
      </div>
    </div>

    <div class="card mb-4">
      <div class="card-body py-4">
        <div class="d-flex justify-content-between mb-2">
          <span class="small text-muted">Collection progress</span>
          <span class="small fw-bold text-primary-brand">${s}%</span>
        </div>
        <div class="progress-custom" style="height:10px">
          <div class="progress-bar-custom" style="width:${s}%;background:#10B981"></div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <select class="filter-select form-select form-select-sm" id="paymentStatusFilter" onchange="filterPayments()" style="width:160px">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="partial">Partial</option>
        <option value="paid">Paid</option>
      </select>
      <select class="filter-select form-select form-select-sm" id="paymentMethodFilter" onchange="filterPayments()" style="width:160px">
        <option value="">All Methods</option>
        <option value="bank-transfer">Bank Transfer</option>
        <option value="cheque">Cheque</option>
        <option value="cash">Cash</option>
      </select>
      <span class="ms-auto text-muted small">${e.length} payments</span>
    </div>

    <div class="table-card">
      <div class="table-responsive">
        <table class="data-table mb-0">
          <thead>
            <tr>
              <th>Reference</th>
              <th>Delivery</th>
              <th>PO</th>
              <th>Due</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="paymentsTableBody">
            ${e.length?e.map(i=>Ee(i)).join(""):`
              <tr><td colspan="7" class="text-center text-muted py-4">No payments yet</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `,window.filterPayments=Rt,window.showPaymentModal=jt,window.showDeliveryModal=U}function Ft(){const e=l.data.deliveries.filter(s=>["partial","delivered"].includes(h(s.status))).reduce((s,i)=>s+I(i),0),a=l.data.payments.reduce((s,i)=>s+(i.amount_paid||0),0);return{totalInvoiced:e,totalPaid:a,remaining:Math.max(0,e-a)}}function Ee(t){return ee(t),`
    <tr data-status="${t.status}" data-method="${t.payment_method}">
      <td class="fw-medium">${t.payment_reference}</td>
      <td>${t.delivery_number?`<a href="#" class="po-link" onclick="navigateTo('deliveries'); setTimeout(() => showDeliveryModal('${t.related_delivery}'), 200); return false;">${t.delivery_number}</a>`:"—"}</td>
      <td>${t.po_number}</td>
      <td>${f(t.amount)}</td>
      <td class="text-success fw-medium">${f(t.amount_paid||0)}</td>
      <td><span class="status-badge ${t.status}">${w(t.status)}</span></td>
      <td>
        ${b()&&t.status!=="paid"?`
          <button class="btn-action btn-action-view" title="Record payment" onclick="showPaymentModal('${t.id}')">
            <i class="fas fa-wallet"></i>
          </button>
        `:'<span class="text-muted small">—</span>'}
      </td>
    </tr>
  `}function jt(t){var i;if(!b())return;const e=l.data.payments.find(n=>n.id===t);if(!e||e.status==="paid")return;const a=ee(e),s=`
    <div class="modal fade" id="paymentModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-wallet me-2 text-primary-brand"></i>Record Payment</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <small class="text-muted">Reference</small>
              <div class="fw-semibold">${e.payment_reference}</div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-4"><small class="text-muted d-block">Due</small><strong>${f(e.amount)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Paid</small><strong class="text-success">${f(e.amount_paid||0)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Remaining</small><strong class="text-warning">${f(a)}</strong></div>
            </div>
            <label class="form-label">Payment Amount</label>
            <input type="number" step="0.01" min="0.01" max="${a}" class="form-control" id="payAmountInput" value="${a.toFixed(2)}">
            <small class="text-muted">Partial payments supported — pay only for received delivery amount.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="recordPartialPayment('${e.id}')">
              <i class="fas fa-check me-1"></i>Record Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  `;(i=document.getElementById("paymentModal"))==null||i.remove(),document.body.insertAdjacentHTML("beforeend",s),new bootstrap.Modal(document.getElementById("paymentModal")).show(),document.getElementById("paymentModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.recordPartialPayment=qt}async function qt(t){var i,n;if(!b())return;const e=l.data.payments.find(o=>o.id===t);if(!e)return;const a=ee(e),s=parseFloat((i=document.getElementById("payAmountInput"))==null?void 0:i.value)||0;if(s<=0||s>a+.001){y(`Enter an amount between 0.01 and ${f(a)}`,"warning");return}e.amount_paid=(e.amount_paid||0)+s,e.payment_date=new Date().toISOString().split("T")[0],e.updated_at=new Date().toISOString(),e.amount_paid>=e.amount-.001?(e.amount_paid=e.amount,e.status="paid"):e.status="partial",await fe(e),(n=bootstrap.Modal.getInstance(document.getElementById("paymentModal")))==null||n.hide(),P("payments"),y(`Payment recorded: ${f(s)}`,"success")}function Rt(){var i,n;const t=((i=document.getElementById("paymentStatusFilter"))==null?void 0:i.value)||"",e=((n=document.getElementById("paymentMethodFilter"))==null?void 0:n.value)||"";let a=l.data.payments;t&&(a=a.filter(o=>o.status===t)),e&&(a=a.filter(o=>o.payment_method===e));const s=document.getElementById("paymentsTableBody");s&&(s.innerHTML=a.map(o=>Ee(o)).join(""))}function Ht(t){const e=l.data.documents;t.innerHTML=`
    ${R()}
    <div class="page-header">
      <h1 class="page-title">Document Center</h1>
      <p class="page-subtitle">${e.length} documents available</p>
    </div>

    <!-- Category Filter -->
    <div class="filters-bar">
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn-primary-custom" onclick="filterDocumentsByCategory('')">
          All Documents
        </button>
        ${[{value:"purchase-orders",label:"Purchase Orders",icon:"fa-file-invoice"},{value:"invoices",label:"Invoices",icon:"fa-file-invoice-dollar"},{value:"delivery-notes",label:"Delivery Notes",icon:"fa-file-export"},{value:"technical-files",label:"Technical Files",icon:"fa-file-code"},{value:"artwork-files",label:"Artwork Files",icon:"fa-palette"}].map(a=>`
          <button class="btn-outline-custom" onclick="filterDocumentsByCategory('${a.value}')">
            <i class="fas ${a.icon}"></i> ${a.label}
          </button>
        `).join("")}
      </div>
      <div class="filter-group ms-auto">
        <input type="text" class="form-control form-control-sm" id="docSearch" placeholder="Search documents..." oninput="searchDocuments()">
      </div>
    </div>

    <!-- Documents Grid -->
    <div class="row g-4" id="documentsGrid">
      ${e.map(a=>ne(a)).join("")}
    </div>
  `,window.filterDocumentsByCategory=Vt,window.searchDocuments=Gt,window.previewDocument=Ut,window.downloadDocument=zt}function Ut(t){const e=l.data.documents.find(a=>a.id===t);e&&oe(e.data||e.url,e.name)}function zt(t){const e=l.data.documents.find(a=>a.id===t);e&&V(e.data||e.url,e.name)}function ne(t){const e={pdf:"fa-file-pdf text-danger",ai:"fa-file-image text-warning",eps:"fa-file-image text-info",psd:"fa-file-image text-primary",svg:"fa-file-image text-success"},a=t.category==="artwork-files"||t.category==="technical-files",s=a?"":`
    <button class="btn btn-outline-primary btn-sm flex-grow-1" onclick="previewDocument('${t.id}')">
      <i class="fas fa-eye me-1"></i>Preview
    </button>`;return`
    <div class="col-md-6 col-lg-3">
      <div class="card h-100" data-category="${t.category}" data-name="${t.name.toLowerCase()}">
        <div class="card-body">
          <div class="d-flex align-items-start mb-3">
            <div class="me-3">
              <i class="fas ${e[t.type]||"fa-file text-secondary"} fa-2x"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-1">${t.name}</h6>
              <small class="text-muted">${t.size}</small>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-primary-light text-primary">${ea(t.category)}</span>
            <small class="text-muted">${t.created_at}</small>
          </div>
        </div>
        <div class="card-footer bg-transparent">
          <div class="d-flex gap-2">
            ${s}
            <button class="btn btn-primary btn-sm ${a?"flex-grow-1":""}" onclick="downloadDocument('${t.id}')">
              <i class="fas fa-download me-1"></i>Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function Vt(t){const e=document.getElementById("documentsGrid");document.querySelectorAll(".filters-bar .btn").forEach(i=>{i.classList.remove("btn-primary"),i.classList.add("btn-outline-secondary")});let s=l.data.documents;t&&(s=s.filter(i=>i.category===t)),e.innerHTML=s.map(i=>ne(i)).join("")}function Gt(){var s;const t=((s=document.getElementById("docSearch"))==null?void 0:s.value.toLowerCase())||"";let e=l.data.documents;t&&(e=e.filter(i=>i.name.toLowerCase().includes(t)));const a=document.getElementById("documentsGrid");a.innerHTML=e.map(i=>ne(i)).join("")}function Wt(t){const e=l.data.settings;t.innerHTML=`
    ${R()}
    <div class="page-header">
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Configure your supplier portal</p>
    </div>

    <div class="row g-4">
      <!-- Company Info -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-building me-2"></i>Company Information</h6>
          </div>
          <div class="card-body">
            <form id="companyForm">
              <div class="mb-3">
                <label class="form-label">Company Name</label>
                <input type="text" class="form-control" id="companyName" value="${e.companyName||"WAVE VI"}">
              </div>
              <div class="mb-3">
                <label class="form-label">Supplier Name</label>
                <input type="text" class="form-control" id="supplierName" value="${e.supplierName||"SGS Printing Services"}">
              </div>
              <div class="mb-3">
                <label class="form-label">Currency</label>
                <select class="form-select" id="currency">
                  <option value="TND" ${e.currency==="TND"?"selected":""}>TND - Tunisian Dinar</option>
                  <option value="EUR" ${e.currency==="EUR"?"selected":""}>EUR - Euro</option>
                  <option value="USD" ${e.currency==="USD"?"selected":""}>USD - US Dollar</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Default VAT Rate (%)</label>
                <input type="number" class="form-control" id="defaultVat" value="${e.defaultVat||20}">
              </div>
              <button type="button" class="btn btn-primary" onclick="saveSettings()">
                <i class="fas fa-save me-1"></i>Save Settings
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Theme -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-palette me-2"></i>Appearance</h6>
          </div>
          <div class="card-body">
            <div class="mb-4">
              <label class="form-label">Theme</label>
              <div class="d-flex gap-3">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeLight" value="light" ${l.theme==="light"?"checked":""} onchange="toggleTheme()">
                  <label class="form-check-label" for="themeLight">
                    <i class="fas fa-sun text-warning me-1"></i>Light Mode
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeDark" value="dark" ${l.theme==="dark"?"checked":""} onchange="toggleTheme()">
                  <label class="form-check-label" for="themeDark">
                    <i class="fas fa-moon text-primary me-1"></i>Dark Mode
                  </label>
                </div>
              </div>
            </div>

            <hr>

            <div>
              <h6>Preview</h6>
              <div class="p-3 rounded border">
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Sample Text</strong>
                    <p class="mb-0 text-muted small">This is how your portal will look</p>
                  </div>
                  <span class="badge bg-primary">Badge</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data publishing -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-file-code me-2"></i>Publish Data (Admin)</h6>
          </div>
          <div class="card-body">
            <p class="text-muted small">
              Changes made in the portal are kept in memory for this session only. Download JSON files and commit them to <code>public/data/</code> to publish updates on GitHub Pages.
            </p>
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="btn btn-outline-primary" onclick="exportDataFiles()">
                <i class="fas fa-download me-1"></i>Download JSON Files
              </button>
              <button type="button" class="btn btn-outline-secondary" onclick="exportBackup()">
                <i class="fas fa-file-archive me-1"></i>Combined Backup
              </button>
              <label class="btn btn-outline-secondary mb-0">
                <i class="fas fa-upload me-1"></i>Import to Session
                <input type="file" accept=".json,application/json" class="d-none" id="importBackupInput" onchange="importBackup(event)">
              </label>
            </div>
            <p class="text-muted small mt-3 mb-0">
              Migrating from IndexedDB?
              <a href="./admin-export.html" target="_blank" rel="noopener">Open the export utility</a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Reload -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-arrows-rotate me-2"></i>Reload Hosted Data</h6>
          </div>
          <div class="card-body">
            <p class="text-muted small">Discard in-memory edits and reload the JSON files served from the repository.</p>
            <button class="btn btn-outline-secondary" onclick="reloadHostedData()">
              <i class="fas fa-sync me-1"></i>Reload from JSON
            </button>
          </div>
        </div>
      </div>
    </div>
  `,window.saveSettings=Jt,window.exportBackup=Yt,window.exportDataFiles=Qt,window.importBackup=Kt,window.reloadHostedData=Xt}async function Jt(){b()&&(l.data.settings={companyName:document.getElementById("companyName").value,supplierName:document.getElementById("supplierName").value,currency:document.getElementById("currency").value,defaultVat:parseInt(document.getElementById("defaultVat").value)||20,theme:l.theme},await ye(l.data.settings),y("Settings saved successfully","success"))}function Qt(){try{Ye(),y("JSON files downloaded — commit them to public/data/","success")}catch(t){console.error("Export failed:",t),y("Failed to export JSON files","danger")}}async function Yt(){try{const t=Ve(),e=new Date().toISOString().split("T")[0];he(t,`wave-vi-backup-${e}.json`),y("Combined backup exported successfully","success")}catch(t){console.error("Export failed:",t),y("Failed to export backup","danger")}}async function Kt(t){var a;const e=(a=t.target.files)==null?void 0:a[0];if(e){try{const s=await e.text();if(!confirm("Importing will replace in-memory data for this session. Continue?")){t.target.value="";return}const i=We(s);l.data.products=i.products,l.data.purchaseOrders=i.purchaseOrders,l.data.deliveries=i.deliveries,l.data.payments=i.payments,l.data.documents=i.documents,l.data.categories=i.categories,l.data.settings=i.settings,se(),P(l.currentPage),y("Backup imported successfully","success")}catch(s){console.error("Import failed:",s),y("Invalid backup file","danger")}t.target.value=""}}async function Xt(){confirm("Reload data from hosted JSON files? Unsaved session changes will be lost.")&&(y("Reloading data...","info"),await ae(),se(),P(l.currentPage),y("Data reloaded from JSON files","success"))}function z(){const t=document.getElementById("notificationBadge"),e=document.getElementById("notificationsList");if(!t||!e)return;const a=[];l.data.purchaseOrders.filter(s=>s.status==="pending"||s.status==="draft").slice(0,3).forEach(s=>{a.push({icon:"fa-file-invoice",iconClass:"bg-info-soft text-info",text:`PO ${s.po_number} — ${w(s.status)}`,time:_(s.created_at)})}),l.data.deliveries.filter(s=>h(s.status)==="pending").slice(0,2).forEach(s=>{a.push({icon:"fa-truck",iconClass:"bg-warning-soft text-warning",text:`Delivery ${s.delivery_number} awaiting confirmation`,time:"Pending"})}),l.data.payments.filter(s=>s.status==="pending").slice(0,2).forEach(s=>{a.push({icon:"fa-credit-card",iconClass:"bg-success-soft text-success",text:`Payment ${s.payment_reference} — ${f(s.amount)}`,time:s.payment_date?_(s.payment_date):"Pending"})}),t.style.display=a.length>0?"":"none",a.length===0?e.innerHTML='<div class="notif-item"><div class="notif-content"><p class="text-muted mb-0">No notifications</p></div></div>':e.innerHTML=a.map(s=>`
      <div class="notif-item unread">
        <div class="notif-icon ${s.iconClass}"><i class="fa-solid ${s.icon}"></i></div>
        <div class="notif-content">
          <p>${s.text}</p>
          <span>${s.time}</span>
        </div>
      </div>
    `).join("")}function Oe(t){const e=["draft","pending","approved","in-production","completed"],a=e.indexOf(t);return`<div class="d-flex justify-content-between align-items-center w-100 mb-4">${e.map((i,n)=>{const o=n<=a;return`<div class="text-center" style="flex: 1;">
      <div class="status-badge ${i===t?i:o?"completed":"draft"} mb-2" style="width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
        ${o?'<i class="fas fa-check"></i>':'<i class="fas fa-circle" style="font-size: 8px;"></i>'}
      </div>
      <div><small>${w(i)}</small></div>
    </div>`}).join("")}</div>`}function f(t,e=2){const s=(l.data.settings||{}).currency||"TND",i=s==="TND"?"fr-TN":s==="EUR"?"fr-FR":"en-US";return new Intl.NumberFormat(i,{style:"currency",currency:s,minimumFractionDigits:e,maximumFractionDigits:e}).format(t||0)}function Le(t,e,a){const s=parseFloat(e)||0,i=parseFloat(a)||0;switch(t){case"circle":return Math.round(Math.PI*Math.pow(s/2,2)*100)/100;case"square":return Math.round(s*s*100)/100;case"rectangle":return Math.round(s*i*100)/100;default:return 0}}function C(t){return t?`${Number(t).toLocaleString("fr-FR")} mm²`:"-"}function J(t){return new Promise((e,a)=>{const s=new FileReader;s.onload=()=>e(s.result),s.onerror=a,s.readAsDataURL(t)})}function Zt(t){if(!t)return"-";const e=Math.round((t.length-5)*.75);return e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(1)} KB`:`${(e/1048576).toFixed(1)} MB`}function V(t,e){const a=document.createElement("a");a.href=t,a.download=e,a.click()}function oe(t,e){t.startsWith("data:image/")||t.startsWith("data:application/pdf")?window.open(t,"_blank"):V(t,e)}function _(t){if(!t)return"-";const e=new Date(t);return new Intl.DateTimeFormat("en-US",{day:"numeric",month:"short",year:"numeric"}).format(e)}function w(t){return t?t.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" "):"-"}function ea(t){return t.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function y(t,e="info"){const a=document.getElementById("toastContainer");if(!a)return;const s="toast-"+Date.now(),i=`
    <div id="${s}" class="toast" role="alert">
      <div class="toast-header">
        <i class="fas ${e==="success"?"fa-check-circle text-success":e==="danger"?"fa-times-circle text-danger":e==="warning"?"fa-exclamation-circle text-warning":"fa-info-circle text-primary"} me-2"></i>
        <strong class="me-auto">${e.charAt(0).toUpperCase()+e.slice(1)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${t}</div>
    </div>
  `;a.insertAdjacentHTML("beforeend",i);const n=document.getElementById(s);new bootstrap.Toast(n,{delay:3e3}).show(),n.addEventListener("hidden.bs.toast",()=>{n.remove()})}function ta(t,e){const a=new Blob([t],{type:"text/csv;charset=utf-8;"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download=e,s.click(),URL.revokeObjectURL(s.href)}window.navigateTo=E;window.showDeliveryModal=U;window.previewDataUrl=oe;window.downloadDataUrl=V;
