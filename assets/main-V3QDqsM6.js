(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();const E={companyName:"WAVE VI",supplierName:"SGS Printing Services",currency:"TND",defaultVat:0,theme:"light",categories:["Tickets","Flyers","Posters","Brochures","Badges","Labels","Packaging","Signage","Other"]};let b=null;const h={product:0,purchaseOrder:0,delivery:0,payment:0,document:0,poNumber:0};function Se(e){return`./data/${e}?v=${Date.now()}`}async function O(e){const t=await fetch(Se(e));if(!t.ok)throw new Error(`Failed to load data/${e} (${t.status})`);return t.json()}async function Ie(){return O("products.json")}async function De(){return O("purchase-orders.json")}async function Ee(){return O("deliveries.json")}async function Oe(){return O("payments.json")}async function ke(){return O("documents.json")}async function Be(){const e=await O("settings.json"),{categories:t,...a}=e||{};return{settings:{...E,...a},categories:t!=null&&t.length?t:[...E.categories]}}async function Le(){const[e,t,a,s,i,n]=await Promise.all([Ie(),De(),Ee(),Oe(),ke(),Be()]);return b={products:Array.isArray(e)?e:[],purchaseOrders:Array.isArray(t)?t:[],deliveries:Array.isArray(a)?a:[],payments:Array.isArray(s)?s:[],documents:Array.isArray(i)?i:[],settings:n.settings,categories:n.categories},me(b),ue(b.purchaseOrders),b}function _(){return b||(b={products:[],purchaseOrders:[],deliveries:[],payments:[],documents:[],settings:{...E},categories:[...E.categories]}),b}async function Te(){return!1}async function D(e){e(),await Te()}async function Ce(e){await D(()=>{const t=_(),a=t.products.findIndex(s=>s.id===e.id);a>=0?t.products[a]=e:t.products.push(e)})}async function Me(e){await D(()=>{const t=_();t.products=(t.products||[]).filter(a=>a.id!==e)})}async function F(e){await D(()=>{const t=_(),a=t.purchaseOrders.findIndex(s=>s.id===e.id);a>=0?t.purchaseOrders[a]=e:t.purchaseOrders.push(e)})}async function L(e){await D(()=>{const t=_(),a=t.deliveries.findIndex(s=>s.id===e.id);a>=0?t.deliveries[a]=e:t.deliveries.push(e)})}async function re(e){await D(()=>{const t=_(),a=t.payments.findIndex(s=>s.id===e.id);a>=0?t.payments[a]=e:t.payments.push(e)})}async function Ae(e){await D(()=>{const t=_(),a=t.documents.findIndex(s=>s.id===e.id);a>=0?t.documents[a]=e:t.documents.push(e)})}async function ce(e){await D(()=>{const t=_();t.settings={...t.settings,...e},e.categories&&(t.categories=e.categories)})}function Fe(){const e=_();return{version:2,exportedAt:new Date().toISOString(),products:e.products,purchase_orders:e.purchaseOrders,deliveries:e.deliveries,payments:e.payments,documents:e.documents,settings:e.settings,categories:e.categories}}function Ne(){const e=_(),{categories:t,...a}=e.settings;return{"products.json":e.products,"purchase-orders.json":e.purchaseOrders,"deliveries.json":e.deliveries,"payments.json":e.payments,"documents.json":e.documents,"settings.json":{...a,categories:e.categories}}}function Re(e){var a,s,i;const t=typeof e=="string"?JSON.parse(e):e;return b={products:t.products||[],purchaseOrders:t.purchase_orders||t.purchaseOrders||[],deliveries:t.deliveries||[],payments:t.payments||[],documents:t.documents||[],settings:{...E,...t.settings||{}},categories:(a=t.categories)!=null&&a.length?t.categories:(i=(s=t.settings)==null?void 0:s.categories)!=null&&i.length?t.settings.categories:[...E.categories]},b.settings.categories=b.categories,me(b),ue(b.purchaseOrders),b}function T(e,t){return h[t]=(h[t]||0)+1,`${e}-${String(h[t]).padStart(3,"0")}`}function qe(){const e=(h.poNumber||0)+1;return`PO-SGS-${String(e).padStart(3,"0")}`}function je(){return h.poNumber=(h.poNumber||0)+1,`PO-SGS-${String(h.poNumber).padStart(3,"0")}`}function ue(e){if(!(e!=null&&e.length))return;const t=e.reduce((a,s)=>{const i=(s.po_number||"").match(/^PO-SGS-(\d+)$/);return i?Math.max(a,parseInt(i[1],10)):a},0);t>0&&(h.poNumber=t)}function me(e){h.product=B(e.products,"PRD-"),h.purchaseOrder=B(e.purchase_orders||e.purchaseOrders,"PO-"),h.delivery=B(e.deliveries,"DEL-"),h.payment=B(e.payments,"PAY-"),h.document=B(e.documents,"DOC-")}function B(e,t){return e!=null&&e.length?e.reduce((a,s)=>{const i=s.id||"";if(!i.startsWith(t))return a;const n=parseInt(i.slice(t.length),10);return Number.isNaN(n)?a:Math.max(a,n)},0):0}function pe(e,t){const a=new Blob([JSON.stringify(e,null,2)],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download=t,s.click(),URL.revokeObjectURL(s.href)}function He(){const e=Ne();for(const[t,a]of Object.entries(e))pe(a,t)}const Q="wavevi_session",Ue={wavevi:{password:"waveiovi",role:"admin",displayName:"WAVE VI",roleLabel:"Administrator",initials:"WV"},sgs:{password:"sgs",role:"supplier",displayName:"SGS Printing Services",roleLabel:"Supplier",initials:"SG"}};function Ve(e,t){const a=Ue[e.trim().toLowerCase()];if(!a||a.password!==t)return null;const s={username:e.trim().toLowerCase(),role:a.role,displayName:a.displayName,roleLabel:a.roleLabel,initials:a.initials,loggedInAt:new Date().toISOString()};return sessionStorage.setItem(Q,JSON.stringify(s)),s}function Ge(){sessionStorage.removeItem(Q)}function Y(){try{const e=sessionStorage.getItem(Q);return e?JSON.parse(e):null}catch{return null}}function We(){return!!Y()}function N(){var e;return((e=Y())==null?void 0:e.role)==="admin"}function y(){return N()}function ve(e){return!(e==="settings"&&!N())}const d={data:{products:[],purchaseOrders:[],deliveries:[],payments:[],documents:[],categories:[],settings:{}},currentPage:"dashboard",charts:{},theme:"light"};document.addEventListener("DOMContentLoaded",()=>{ze()});function ze(){var t;const e=document.getElementById("loginForm");e==null||e.addEventListener("submit",a=>{a.preventDefault();const s=document.getElementById("loginUser").value,i=document.getElementById("loginPass").value,n=document.getElementById("loginError");if(!Ve(s,i)){n.textContent="Invalid username or password.",n.classList.remove("d-none");return}n.classList.add("d-none"),ne()}),(t=document.getElementById("logoutBtn"))==null||t.addEventListener("click",()=>{confirm("Sign out?")&&(Ge(),location.reload())}),We()&&ne()}async function ne(){var t,a;(t=document.getElementById("loginScreen"))==null||t.classList.add("d-none"),(a=document.getElementById("appShell"))==null||a.classList.remove("d-none"),Je(),await ee(),te(),Xe(),tt(),et(),at(),fe(d.currentPage);const e=window.location.hash.slice(1)||"dashboard";S(ve(e)?e:"dashboard")}function Je(){const e=Y();e&&(document.getElementById("profileName").textContent=e.displayName,document.getElementById("profileRole").textContent=e.roleLabel,document.getElementById("profileInitials").textContent=e.initials,document.getElementById("sidebarUserName").textContent=e.displayName,document.getElementById("sidebarUserRole").textContent=e.roleLabel,document.querySelectorAll(".admin-only").forEach(t=>{t.classList.toggle("hidden-role",!N())}))}function Qe(){return""}function C(){return y()?Qe():'<div class="readonly-banner"><i class="fa-solid fa-eye"></i> Read-only access — contact WAVE VI admin to make changes.</div>'}const oe={dashboard:{icon:"fa-gauge-high",label:"Dashboard"},products:{icon:"fa-box-open",label:"Product Catalog"},"purchase-orders":{icon:"fa-file-invoice",label:"Purchase Orders"},deliveries:{icon:"fa-truck",label:"Deliveries"},payments:{icon:"fa-credit-card",label:"Payments"},documents:{icon:"fa-folder-open",label:"Documents"},settings:{icon:"fa-gear",label:"Settings"}};function fe(e){const t=oe[e]||oe.dashboard,a=document.getElementById("topnavBreadcrumb");a&&(a.innerHTML=`<i class="fa-solid ${t.icon} me-2 text-primary-brand"></i><span>${t.label}</span>`)}function f(e){return e==="preparing"?"pending":e==="partially-delivered"?"partial":e}function Ye(){for(const e of d.data.purchaseOrders)for(const t of e.lines)t.received_qty==null&&(t.received_qty=0);for(const e of d.data.purchaseOrders){if(e.lines.some(s=>s.received_qty>0))continue;const a=d.data.deliveries.filter(s=>s.related_po===e.id&&["partial","delivered"].includes(f(s.status)));for(const s of a)for(const i of s.lines){const n=e.lines.find(o=>o.product_id===i.product_id);n&&(n.received_qty=(n.received_qty||0)+(i.delivered_qty||i.receive_qty||0))}}for(const e of d.data.payments)e.amount_paid==null&&(e.amount_paid=e.status==="paid"?e.amount:0)}function x(e){const t=e.lines.map(l=>{const c=l.quantity,r=l.received_qty||0,m=Math.max(0,c-r);return{product_id:l.product_id,product_name:l.product_name,ordered:c,received:r,remaining:m,unit_price_ht:l.unit_price_ht,surface_mm2:l.surface_mm2}}),a=t.reduce((l,c)=>l+c.ordered,0),s=t.reduce((l,c)=>l+c.received,0),i=t.reduce((l,c)=>l+c.remaining,0),n=e.lines.reduce((l,c)=>l+(c.received_qty||0)*c.unit_price_ht,0),o=e.total_ht||0;return{lines:t,totalOrdered:a,totalReceived:s,totalRemaining:i,receivedAmount:n,orderedAmount:o,pct:a>0?Math.round(s/a*100):0,isComplete:i===0,hasPartial:s>0&&i>0}}function W(e){return(e.delivered_qty||e.receive_qty||0)*(e.unit_price_ht||0)}function I(e){return["partial","delivered"].includes(f(e.status))?e.amount!=null?e.amount:(e.lines||[]).reduce((t,a)=>t+W(a),0):(e.lines||[]).reduce((t,a)=>t+W(a),0)}function K(e){return Math.max(0,(e.amount||0)-(e.amount_paid||0))}function Z(e,t="Fulfillment"){return`
    <div class="fulfillment-block">
      <div class="d-flex justify-content-between mb-1">
        <small class="text-muted">${t}</small>
        <small class="fw-semibold">${e}%</small>
      </div>
      <div class="progress-custom">
        <div class="progress-bar-custom" style="width:${e}%;background:var(--brand-primary)"></div>
      </div>
    </div>
  `}function ye(e){const t=d.data.deliveries.find(o=>o.related_po===e.id&&f(o.status)==="pending");if(t)return t;const a=x(e);if(a.totalRemaining===0)return null;const s=d.data.deliveries.filter(o=>o.related_po===e.id).length+1,i=s>1?`-${String(s).padStart(2,"0")}`:"",n=a.lines.filter(o=>o.remaining>0).map(o=>({product_id:o.product_id,product_name:o.product_name,ordered_qty:o.ordered,remaining_qty:o.remaining,receive_qty:o.remaining,delivered_qty:0,unit_price_ht:o.unit_price_ht,surface_mm2:o.surface_mm2||0,line_total:o.remaining*o.unit_price_ht}));return{id:T("DEL","delivery"),delivery_number:`DEL-${e.po_number}${i}`,related_po:e.id,po_number:e.po_number,status:"pending",delivery_date:null,amount:0,lines:n,documents:[],notes:`Auto-created from ${e.po_number}`,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}}async function Ke(e){const t=d.data.payments.find(i=>i.related_delivery===e.id);if(t)return t;const a=I(e),s={id:T("PAY","payment"),payment_reference:`PAY-${e.delivery_number}`,related_po:e.related_po,related_delivery:e.id,delivery_number:e.delivery_number,po_number:e.po_number,payment_method:"bank-transfer",amount:a,amount_paid:0,payment_date:null,status:"pending",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return await re(s),s}async function X(e){var s;if(!y())return;const t=d.data.purchaseOrders.find(i=>i.id===e);if(!t)return;const a=x(t);if(a.totalReceived===0){v("Receive at least one delivery before closing partially","warning");return}if(confirm(`Close PO ${t.po_number} with ${a.pct}% received? Remaining qty will not be delivered.`)){t.status="completed-partial",t.updated_at=new Date().toISOString(),t.actual_delivery_date=new Date().toISOString().split("T")[0];for(const i of d.data.deliveries.filter(n=>n.related_po===e&&f(n.status)==="pending"))i.status="cancelled",i.updated_at=new Date().toISOString(),await L(i);await F(t),j(),(s=bootstrap.Modal.getInstance(document.getElementById("poModal")))==null||s.hide(),P("purchase-orders"),v("PO closed with partial fulfillment","success")}}function de(e){const t=d.data.deliveries.find(i=>i.id===e);if(!t)return 0;let a=0;t.lines.forEach((i,n)=>{const o=document.getElementById(`receiveQty_${e}_${n}`),l=parseInt(o==null?void 0:o.value)||0;a+=l*(i.unit_price_ht||0);const c=document.getElementById(`lineAmount_${e}_${n}`);c&&(c.textContent=p(l*(i.unit_price_ht||0)))});const s=document.getElementById(`deliveryPreviewTotal_${e}`);return s&&(s.textContent=p(a)),a}async function ee(){try{const e=await Le();d.data.products=e.products,d.data.purchaseOrders=e.purchaseOrders,d.data.deliveries=e.deliveries,d.data.payments=e.payments,d.data.documents=e.documents,d.data.categories=e.categories,d.data.settings=e.settings,d.data.settings.currency==="MAD"&&(d.data.settings.currency="TND"),d.theme=e.settings.theme||"light",Ye(),j()}catch(e){console.error("Error loading data:",e),v("Error loading data. Please refresh the page.","danger")}}function te(){document.documentElement.setAttribute("data-theme",d.theme),ge()}async function Ze(){d.theme=d.theme==="light"?"dark":"light",document.documentElement.setAttribute("data-theme",d.theme),N()&&(d.data.settings.theme=d.theme,await ce(d.data.settings)),ge()}function ge(){const e=document.getElementById("themeIcon")||document.querySelector("#themeToggle i");e&&(e.className=d.theme==="light"?"fa-solid fa-moon":"fa-solid fa-sun")}function Xe(){window.addEventListener("hashchange",()=>{S(window.location.hash.slice(1)||"dashboard")})}function S(e){ve(e)||(v("You do not have access to this page.","warning"),e="dashboard"),d.currentPage=e,window.location.hash=e,document.querySelectorAll(".nav-link").forEach(t=>{t.classList.toggle("active",t.dataset.page===e)}),fe(e),P(e)}function et(){var a,s,i,n,o;(a=document.getElementById("themeToggle"))==null||a.addEventListener("click",Ze);const e=document.getElementById("sidebar"),t=document.getElementById("sidebarOverlay");(s=document.getElementById("sidebarToggle"))==null||s.addEventListener("click",()=>{e==null||e.classList.add("mobile-open"),t==null||t.classList.add("show")}),(i=document.getElementById("sidebarClose"))==null||i.addEventListener("click",V),t==null||t.addEventListener("click",V),(n=document.getElementById("notificationBtn"))==null||n.addEventListener("click",l=>{var c;l.stopPropagation(),(c=document.getElementById("notifDropdown"))==null||c.classList.toggle("show")}),document.addEventListener("click",l=>{var c;!l.target.closest("#notificationBtn")&&!l.target.closest("#notifDropdown")&&((c=document.getElementById("notifDropdown"))==null||c.classList.remove("show"))}),(o=document.getElementById("refreshData"))==null||o.addEventListener("click",async()=>{v("Refreshing data...","info"),await ee(),P(d.currentPage),v("Data refreshed successfully","success")}),document.querySelectorAll(".nav-link").forEach(l=>{l.addEventListener("click",c=>{c.preventDefault();const r=l.dataset.page;r&&(S(r),V())})})}function V(){var e,t;(e=document.getElementById("sidebar"))==null||e.classList.remove("mobile-open","active"),(t=document.getElementById("sidebarOverlay"))==null||t.classList.remove("show")}function tt(){const e=document.getElementById("globalSearch"),t=document.getElementById("searchResults");!e||!t||(e.addEventListener("input",a=>{const s=a.target.value.toLowerCase().trim();if(s.length<2){t.classList.remove("active","show");return}const i=[];d.data.products.forEach(n=>{(n.name.toLowerCase().includes(s)||n.reference.toLowerCase().includes(s))&&i.push({type:"product",icon:"fa-box",name:n.name,detail:n.reference,id:n.id})}),d.data.purchaseOrders.forEach(n=>{(n.po_number.toLowerCase().includes(s)||n.status.includes(s))&&i.push({type:"po",icon:"fa-file-invoice",name:n.po_number,detail:n.status,id:n.id})}),d.data.documents.forEach(n=>{n.name.toLowerCase().includes(s)&&i.push({type:"document",icon:"fa-file",name:n.name,detail:n.category,id:n.id})}),i.length>0?(t.innerHTML=i.slice(0,8).map(n=>`
        <div class="search-result-item" data-type="${n.type}" data-id="${n.id}">
          <i class="fas ${n.icon}"></i>
          <div>
            <p class="mb-0">${n.name}</p>
            <small>${n.detail}</small>
          </div>
        </div>
      `).join(""),t.classList.add("active","show"),t.querySelectorAll(".search-result-item").forEach(n=>{n.addEventListener("click",()=>{t.classList.remove("active","show"),e.value="",n.dataset.type==="product"?(S("products"),setTimeout(()=>M(n.dataset.id),100)):n.dataset.type==="po"&&(S("purchase-orders"),setTimeout(()=>ae(n.dataset.id),100))})})):(t.innerHTML='<div class="p-3 text-center text-muted">No results found</div>',t.classList.add("active","show"))}),document.addEventListener("click",a=>{a.target.closest(".search-container")||t.classList.remove("active","show")}))}function at(){const e=document.getElementById("lastUpdate");e&&(e.textContent=new Date().toLocaleString("en-US",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}))}function P(e){const t=document.getElementById("mainContent");if(t)switch(e){case"dashboard":le(t);break;case"products":ot(t);break;case"purchase-orders":ut(t);break;case"deliveries":xt(t);break;case"payments":Et(t);break;case"documents":Tt(t);break;case"settings":Nt(t);break;default:le(t)}}function le(e){const t=st();e.innerHTML=`
    ${C()}
    <div class="page-header">
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">Overview of your supplier portal activities</p>
    </div>

    <!-- KPI Cards -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon primary">
          <i class="fas fa-file-invoice"></i>
        </div>
        <div class="kpi-content">
          <h3>${t.totalPOs}</h3>
          <p>Total Purchase Orders</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon success">
          <i class="fas fa-coins"></i>
        </div>
        <div class="kpi-content">
          <h3>${p(t.totalHT)}</h3>
          <p>Total Amount HT</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon info">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="kpi-content">
          <h3>${p(t.totalPaid)}</h3>
          <p>Total Paid</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon danger">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="kpi-content">
          <h3>${p(t.remainingBalance)}</h3>
          <p>Remaining Balance</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon primary">
          <i class="fas fa-truck-loading"></i>
        </div>
        <div class="kpi-content">
          <h3>${t.pendingDeliveries}</h3>
          <p>Pending Deliveries</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon success">
          <i class="fas fa-box"></i>
        </div>
        <div class="kpi-content">
          <h3>${t.deliveredOrders}</h3>
          <p>Delivered Orders</p>
        </div>
      </div>
    </div>

    <div class="status-breakdown-section">
      <div class="section-header">
        <div>
          <h5 class="section-title">Order Status Breakdown</h5>
          <p class="section-subtitle">See current PO distribution by workflow stage.</p>
        </div>
      </div>
      <div class="status-breakdown-grid">
        ${t.orderStatusItems.map(a=>`
          <div class="status-card">
            <div class="status-card-top">
              <span class="status-indicator ${a.colorClass}"></span>
              <span class="status-label">${a.label}</span>
            </div>
            <div class="status-value">${a.count}</div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row g-4 mb-4">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Monthly Purchases</h5>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="monthlyPurchasesChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Delivery Status</h5>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <canvas id="deliveryStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Progress -->
    <div class="row g-4 mb-4">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="card-title mb-0">Payment Progress</h5>
          </div>
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-8">
                <div class="mb-3">
                  <div class="d-flex justify-content-between mb-1">
                    <span>Payment Collection</span>
                    <span>${t.paymentProgress}%</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar bg-success" style="width: ${t.paymentProgress}%"></div>
                  </div>
                </div>
                <div class="row text-center mt-4">
                  <div class="col-4">
                    <h4 class="text-success">${p(t.totalPaid)}</h4>
                    <small class="text-muted">Paid</small>
                  </div>
                  <div class="col-4">
                    <h4 class="text-warning">${p(t.partialPayments)}</h4>
                    <small class="text-muted">Partial</small>
                  </div>
                  <div class="col-4">
                    <h4 class="text-danger">${p(t.remainingBalance)}</h4>
                    <small class="text-muted">Pending</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="chart-container" style="height: 200px;">
                  <canvas id="paymentProgressChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5 class="card-title mb-0">Recent Activity</h5>
        <a href="#purchase-orders" class="btn btn-sm btn-outline-primary">View All</a>
      </div>
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Action</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${nt()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{it(t)},100)}function st(){const e=d.data.purchaseOrders.filter(r=>r.status!=="cancelled"),t=e.reduce((r,m)=>r+(m.total_ht||0),0),a=d.data.deliveries.filter(r=>["partial","delivered"].includes(f(r.status))),s=d.data.deliveries.filter(r=>f(r.status)==="pending"),i=a.reduce((r,m)=>r+I(m),0),n=d.data.payments.reduce((r,m)=>r+(m.amount_paid||0),0),o=e.reduce((r,m)=>{const g=m.status||"Unknown";return r[g]=(r[g]||0)+1,r},{}),c=["Draft","Pending","Approved","In Production","Completed","Cancelled"].map(r=>({label:r,count:o[r]||0,colorClass:r==="Draft"?"status-secondary":r==="Pending"?"status-warning":r==="Approved"?"status-info":r==="In Production"?"status-primary":r==="Completed"?"status-success":r==="Cancelled"?"status-danger":"status-secondary"}));return{totalPOs:e.length,totalHT:t,totalPaid:n,remainingBalance:Math.max(0,i-n),pendingDeliveries:s.length,deliveredOrders:a.length,paymentProgress:i>0?Math.round(n/i*100):0,partialPayments:0,orderStatusItems:c}}function it(e){const t=document.getElementById("monthlyPurchasesChart");if(t){d.charts.monthly&&d.charts.monthly.destroy();const i=6,n=[],o=new Map,l=[],c=new Date;for(let r=i-1;r>=0;r--){const m=new Date(c.getFullYear(),c.getMonth()-r,1),g=`${m.getFullYear()}-${m.getMonth()}`;n.push(m.toLocaleString("en-US",{month:"short"})),o.set(g,l.length),l.push(0)}d.data.purchaseOrders.filter(r=>r.status!=="cancelled").forEach(r=>{const m=new Date(r.created_at||r.date||r.order_date);if(isNaN(m))return;const g=`${m.getFullYear()}-${m.getMonth()}`,u=o.get(g);typeof u=="number"&&(l[u]+=r.total_ht||0)}),d.charts.monthly=new Chart(t,{type:"bar",data:{labels:n,datasets:[{label:`Purchases (${d.data.settings.currency||"TND"})`,data:l,backgroundColor:"rgba(37, 99, 235, 0.8)",borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>`${d.data.settings.currency||"TND"} ${r.parsed.y.toLocaleString()}`}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(0,0,0,0.05)"},ticks:{callback:r=>`${d.data.settings.currency||"TND"} ${r.toLocaleString()}`}},x:{grid:{display:!1}}}}})}const a=document.getElementById("deliveryStatusChart");a&&(d.charts.delivery&&d.charts.delivery.destroy(),d.charts.delivery=new Chart(a,{type:"doughnut",data:{labels:["Delivered","Partial","Pending","Cancelled"],datasets:[{data:[d.data.deliveries.filter(i=>f(i.status)==="delivered").length,d.data.deliveries.filter(i=>f(i.status)==="partial").length,d.data.deliveries.filter(i=>f(i.status)==="pending").length,d.data.deliveries.filter(i=>f(i.status)==="cancelled").length],backgroundColor:["#10b981","#8B5CF6","#f59e0b","#94a3b8"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}));const s=document.getElementById("paymentProgressChart");s&&(d.charts.payment&&d.charts.payment.destroy(),d.charts.payment=new Chart(s,{type:"doughnut",data:{labels:["Paid","Pending"],datasets:[{data:[e.totalPaid,e.remainingBalance],backgroundColor:["#10b981","#ef4444"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},cutout:"70%"}}))}function nt(){const e=[];return d.data.purchaseOrders.slice(0,3).forEach(t=>{e.push({date:t.created_at,action:"Purchase Order Created",reference:t.po_number,status:t.status})}),d.data.deliveries.slice(0,2).forEach(t=>{e.push({date:t.updated_at,action:"Delivery "+(t.status==="delivered"?"Completed":"Updated"),reference:t.delivery_number,status:t.status==="delivered"?"completed":"in-production"})}),e.sort((t,a)=>new Date(a.date)-new Date(t.date)),e.slice(0,5).map(t=>`
    <tr>
      <td>${$(t.date)}</td>
      <td>${t.action}</td>
      <td><a href="#purchase-orders" class="text-primary" onclick="navigateTo('purchase-orders'); return false;">${t.reference}</a></td>
      <td><span class="status-badge ${t.status}">${w(t.status)}</span></td>
    </tr>
  `).join("")}function ot(e){const t=d.data.products;e.innerHTML=`
    <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h1 class="page-title">Product Catalog</h1>
        <p class="page-subtitle">${t.length} products available</p>
      </div>
      <div>
        ${y()?`<button class="btn btn-primary" onclick="showProductModal()">
          <i class="fas fa-plus me-2"></i>Add Product
        </button>`:""}
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>Category:</label>
        <select class="form-select form-select-sm" id="categoryFilter" onchange="filterProducts()">
          <option value="">All Categories</option>
          ${d.data.categories.map(a=>`<option value="${a}">${a}</option>`).join("")}
        </select>
      </div>
      <div class="filter-group">
        <label>Search:</label>
        <input type="text" class="form-control form-control-sm" id="productSearch" placeholder="Search products..." oninput="filterProducts()">
      </div>
    </div>

    <!-- Products Grid -->
    <div class="products-grid" id="productsGrid">
      ${t.map(a=>be(a)).join("")}
    </div>
  `,window.showProductModal=M,window.filterProducts=dt}function be(e){return`
    <div class="product-card" data-category="${e.category}" data-id="${e.id}">
      <div class="product-image">
        ${e.product_image?`<img src="${e.product_image}" alt="${e.name}" loading="lazy">`:'<div class="product-image-placeholder"><i class="fas fa-image"></i></div>'}
      </div>
      <div class="product-info">
        <div class="product-category">${e.category}</div>
        <h3 class="product-name">${e.name}</h3>
        <div class="product-reference">${e.reference}</div>
        <div class="product-price">${p(e.price_ht)} HT</div>
        ${e.surface_mm2?`<div class="product-reference small">${k(e.surface_mm2)}</div>`:""}
      </div>
      <div class="product-actions d-flex gap-2 px-3 pb-3">
        <button class="btn btn-sm btn-outline-primary flex-grow-1" onclick="showProductModal('${e.id}')">
          <i class="fas fa-eye me-1"></i>View
        </button>
        ${y()?`
        <button class="btn btn-sm btn-outline-danger" onclick="deleteProduct('${e.id}')">
          <i class="fas fa-trash me-1"></i>Delete
        </button>
        `:""}
      </div>
    </div>
  `}function dt(){var i,n;const e=((i=document.getElementById("categoryFilter"))==null?void 0:i.value)||"",t=((n=document.getElementById("productSearch"))==null?void 0:n.value.toLowerCase())||"";let a=d.data.products;e&&(a=a.filter(o=>o.category===e)),t&&(a=a.filter(o=>o.name.toLowerCase().includes(t)||o.reference.toLowerCase().includes(t)));const s=document.getElementById("productsGrid");s&&(s.innerHTML=a.map(o=>be(o)).join(""))}function M(e=null){var o;if(!e&&!y()){v("You have read-only access.","warning");return}const t=e?d.data.products.find(l=>l.id===e):null,a=!!t,s=`
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${a?t.name:"New Product"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${a?`
              <div class="row g-4 mb-4">
                ${t.product_image?`
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Product Image</label>
                    <img src="${t.product_image}" alt="${t.name}" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                `:""}
                ${t.delivery_image?`
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Delivery Image</label>
                    <img src="${t.delivery_image}" alt="Delivery format" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                `:""}
              </div>

              <div class="mb-4">
                <h6>Description</h6>
                <p class="text-secondary">${t.description}</p>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-4"><strong>Reference:</strong> ${t.reference}</div>
                <div class="col-md-4"><strong>Unit:</strong> ${t.unit}</div>
                <div class="col-md-4"><strong>Category:</strong> ${t.category}</div>
                  <div class="col-md-4"><strong>Price HT:</strong> ${p(t.price_ht,3)}</div>
                  <div class="col-md-4"><strong>Print Support:</strong> ${t.print_support||"-"}</div>
                  <div class="col-md-4"><strong>Print Method:</strong> ${t.print_method||"-"}</div>
                  <div class="col-md-4"><strong>Material:</strong> ${t.material||"-"}</div>
                  <div class="col-md-4"><strong>Finish:</strong> ${t.finish||"-"}</div>

              ${t.source_file?`
                <h6 class="mb-2">Source Print File</h6>
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="badge bg-primary-light text-primary">
                    <i class="fas fa-file me-1"></i>${t.source_file_name||"Source file"}
                  </span>
                  <button type="button" class="btn btn-sm btn-primary" id="downloadSourceFileBtn">
                    <i class="fas fa-download me-1"></i>Download
                  </button>
                </div>
              `:""}
            `:`
              <form id="productForm">
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
                      ${d.data.categories.map(l=>`<option value="${l}">${l}</option>`).join("")}
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
            ${a?"":`
              <button type="button" class="btn btn-primary" onclick="saveProduct()">
                <i class="fas fa-save me-1"></i>Save Product
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;(o=document.getElementById("productModal"))==null||o.remove(),document.body.insertAdjacentHTML("beforeend",s),new bootstrap.Modal(document.getElementById("productModal")).show();const n=document.getElementById("downloadSourceFileBtn");n&&(t!=null&&t.source_file)&&n.addEventListener("click",()=>H(t.source_file,t.source_file_name||"source-file")),document.getElementById("productModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.saveProduct=rt,window.updateProductSurfacePreview=lt,window.previewDataUrl=ie,window.deleteProduct=ct}function lt(){var o,l,c;const e=(o=document.getElementById("productFormat"))==null?void 0:o.value,t=(l=document.getElementById("productDimWidth"))==null?void 0:l.value,a=(c=document.getElementById("productDimHeight"))==null?void 0:c.value,s=document.getElementById("dimHeightGroup"),i=document.getElementById("dimWidthLabel"),n=document.getElementById("productSurface");if(s&&(s.style.display=e==="rectangle"?"":"none"),i&&(i.textContent=e==="circle"?"Diameter (mm)":e==="square"?"Side (mm)":"Width (mm)"),n){const r=Pe(e,t,a);n.value=r>0?k(r):""}}async function rt(){var c,r;if(!y())return;const e=document.getElementById("productFormat").value,t=parseFloat(document.getElementById("productDimWidth").value)||0,a=parseFloat(document.getElementById("productDimHeight").value)||0,s=Pe(e,t,a),i=document.getElementById("productImageFile").files[0],n=document.getElementById("deliveryImageFile").files[0],o=document.getElementById("sourceFile").files[0],l={id:T("PRD","product"),reference:document.getElementById("productRef").value,name:document.getElementById("productName").value,category:document.getElementById("productCategory").value,unit:document.getElementById("productUnit").value,description:document.getElementById("productDesc").value,price_ht:parseFloat(document.getElementById("productPrice").value),print_support:document.getElementById("productPrintSupport").value,print_method:document.getElementById("productPrintMethod").value,material:((c=document.getElementById("productMaterial"))==null?void 0:c.value)||null,finish:((r=document.getElementById("productFinish"))==null?void 0:r.value)||null,format:e,dimension_width:t,dimension_height:e==="rectangle"?a:null,surface_mm2:s,product_image:i?await G(i):null,delivery_image:n?await G(n):null,source_file:o?await G(o):null,source_file_name:o?o.name:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};if(await Ce(l),o){const m={id:T("DOC","document"),name:o.name,type:o.name.split(".").pop().toLowerCase(),category:"artwork-files",size:Gt(l.source_file),data:l.source_file,url:l.source_file,related_product:l.id,created_at:new Date().toISOString().split("T")[0]};await Ae(m)}bootstrap.Modal.getInstance(document.getElementById("productModal")).hide(),P("products"),v("Product created successfully","success")}async function ct(e){if(y()&&confirm("Delete this product? This action cannot be undone."))try{await Me(e),P("products"),v("Product deleted","success")}catch(t){console.error("Delete product failed",t),v("Failed to delete product","danger")}}function ut(e){const t=d.data.purchaseOrders;e.innerHTML=`
    <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h1 class="page-title">Purchase Orders</h1>
        <p class="page-subtitle">${t.length} orders tracked</p>
      </div>
      <div>
        ${y()?`<button class="btn btn-primary" onclick="showPOModal()">
          <i class="fas fa-plus me-2"></i>New PO
        </button>`:""}
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="filter-group">
        <label>Status:</label>
        <select class="form-select form-select-sm" id="poStatusFilter" onchange="filterPOs()">
          <option value="">All Status</option>
          ${["draft","pending","approved","in-production","completed","cancelled"].map(a=>`<option value="${a}">${w(a)}</option>`).join("")}
        </select>
      </div>
      <div class="filter-group">
        <label>Date:</label>
        <input type="date" class="form-control form-control-sm" id="poDateFilter" onchange="filterPOs()">
      </div>
      <div class="ms-auto">
        <button class="btn btn-outline-secondary btn-sm" onclick="exportPOs()">
          <i class="fas fa-download me-1"></i>Export CSV
        </button>
      </div>
    </div>

    <!-- PO Table -->
    <div class="card">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount HT</th>
                <th>Delivery Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="poTableBody">
              ${t.map(a=>he(a)).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <div class="pagination-info">Showing ${t.length} entries</div>
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item disabled"><a class="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  `,window.showPOModal=ae,window.filterPOs=mt,window.exportPOs=_t}function he(e){return`
    <tr data-status="${e.status}" data-date="${e.date}">
      <td>
        <a href="#" class="text-primary fw-medium" onclick="showPOModal('${e.id}'); return false;">${e.po_number}</a>
      </td>
      <td>${$(e.date)}</td>
      <td><span class="status-badge ${e.status}">${w(e.status)}</span></td>
      <td>${p(e.total_ht,3)}</td>
      <td>${e.actual_delivery_date?$(e.actual_delivery_date):e.expected_delivery_date?$(e.expected_delivery_date):"-"}</td>
      <td>
        <button class="action-btn" onclick="showPOModal('${e.id}')" title="View">
          <i class="fas fa-eye"></i>
        </button>
        ${y()?`
          <button class="action-btn" onclick="editPO('${e.id}')" title="Edit">
            <i class="fas fa-pen"></i>
          </button>
        `:""}
        <button class="action-btn" onclick="printPO('${e.id}')" title="Print">
          <i class="fas fa-print"></i>
        </button>
      </td>
    </tr>
  `}function mt(){var i,n;const e=((i=document.getElementById("poStatusFilter"))==null?void 0:i.value)||"",t=((n=document.getElementById("poDateFilter"))==null?void 0:n.value)||"";let a=d.data.purchaseOrders;e&&(a=a.filter(o=>o.status===e)),t&&(a=a.filter(o=>o.date.startsWith(t)));const s=document.getElementById("poTableBody");s&&(s.innerHTML=a.map(o=>he(o)).join(""))}function ae(e=null,t={}){var r,m,g;if(!e&&!y()){v("You have read-only access.","warning");return}const a=e?d.data.purchaseOrders.find(u=>u.id===e):null,s=a&&t.editMode&&y(),i=a&&!s;if(!a&&e)return;const n=a?d.data.deliveries.filter(u=>u.related_po===a.id):[],o=a?d.data.payments.filter(u=>u.related_po===a.id):[],l=`
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
                  ${Vt(a.status)}
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
                          <div class="fw-medium">${$(a.date)}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Expected Delivery</small>
                          <div class="fw-medium">${a.expected_delivery_date?$(a.expected_delivery_date):"-"}</div>
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
                      ${(()=>{const u=x(a);return`
                          <div class="d-flex justify-content-between mb-2">
                            <span>Ordered HT</span>
                            <span class="fw-medium">${p(u.orderedAmount)}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <span>Received HT</span>
                            <span class="fw-medium text-success">${p(u.receivedAmount)}</span>
                          </div>
                          ${Z(u.pct,"PO Fulfillment")}
                          <div class="small text-muted mt-2">${u.totalReceived} / ${u.totalOrdered} pcs received</div>
                        `})()}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Order Lines -->
              <div class="mb-4">
                <h6 class="mb-3">Order Lines</h6>
                <div class="table-responsive">
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
                      ${x(a).lines.map(u=>`
                        <tr>
                          <td>
                            <a href="#" class="text-primary fw-medium" onclick="showProductModal('${u.product_id}'); return false;">
                              ${u.product_name}
                            </a>
                          </td>
                          <td>${u.ordered}</td>
                          <td class="text-success fw-medium">${u.received}</td>
                          <td>${u.remaining}</td>
                          <td>${p(u.unit_price_ht,3)}</td>
                          <td>${p(u.ordered*u.unit_price_ht,3)}</td>
                        </tr>
                      `).join("")}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="5" class="text-end fw-bold">Total HT</td>
                        <td class="fw-bold">${p(a.total_ht,3)}</td>
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
                  ${n.map(u=>`
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <a href="#" class="fw-medium text-primary" onclick="navigateToDeliveriesAndShow('${u.id}'); return false;">${u.delivery_number}</a>
                            <span class="status-badge ${f(u.status)} ms-2">${w(f(u.status))}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-medium">${p(I(u))}</div>
                            <small class="text-muted">${u.delivery_date?$(u.delivery_date):"Pending"}</small>
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
                  ${o.map(u=>`
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span class="fw-medium">${u.payment_reference}</span>
                            <span class="status-badge ${u.status} ms-2">${w(u.status)}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-bold">${p(u.amount_paid||0)} / ${p(u.amount)}</div>
                            <small class="text-muted">${u.payment_date?$(u.payment_date):"Pending"}</small>
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
                    <input type="text" class="form-control" id="poNumber" value="${a?a.po_number:qe()}" readonly required>
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
                  <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="poNotes" rows="2">${(a==null?void 0:a.notes)||""}</textarea>
                  </div>
                </div>

                <h6 class="mt-4 mb-3">Order Lines</h6>
                <div id="poLines">
                  ${(r=a==null?void 0:a.lines)!=null&&r.length?a.lines.map((u,A)=>z(u,A)).join(""):z(null,0)}
                </div>
                <div class="d-flex justify-content-between align-items-center gap-3 mt-3">
                  <div>
                    <div class="text-muted small">Total Surface</div>
                    <div id="poLinesSurfaceTotal" class="fw-semibold">${a?k(yt(a)):"-"} </div>
                  </div>
                  <div>
                    <div class="text-muted small">Total Commande HT</div>
                    <div id="poLinesHTTotal" class="fw-semibold">${p(a?a.total_ht:0,3)}</div>
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
              ${y()?`
                <button type="button" class="btn btn-outline-secondary" onclick="showPOModal('${a.id}', { editMode: true })">
                  <i class="fas fa-pen me-1"></i>Edit PO
                </button>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <select class="form-select form-select-sm" id="poStatusSelect" style="width: auto;">
                    ${["draft","pending","approved","in-production","completed","completed-partial","cancelled"].map(u=>`<option value="${u}" ${a.status===u?"selected":""}>${w(u)}</option>`).join("")}
                  </select>
                  <button type="button" class="btn btn-primary" onclick="updatePOStatus('${a.id}')">
                    <i class="fas fa-save me-1"></i>Update Status
                  </button>
                  ${x(a).hasPartial&&!["completed","completed-partial","cancelled"].includes(a.status)?`
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
  `;(m=document.getElementById("poModal"))==null||m.remove(),document.body.insertAdjacentHTML("beforeend",l),J=a&&s?((g=a.lines)==null?void 0:g.length)||0:1,new bootstrap.Modal(document.getElementById("poModal")).show(),R(),document.getElementById("poModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.savePO=wt,window.addPOLine=pt,window.updatePOLineTotal=vt,window.viewPOLineProduct=ft,window.removePOLine=ht,window.printPO=$t,window.updatePOStatus=Pt,window.editPO=u=>ae(u,{editMode:!0}),window.navigateToProductsAndShow=M,window.closePOPartial=X,window.navigateToDeliveriesAndShow=u=>{bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),S("deliveries"),setTimeout(()=>q(u),200)}}function z(e,t){const a=(e==null?void 0:e.product_id)||"",s=d.data.products.find(c=>c.id===a),i=(e==null?void 0:e.quantity)||1,n=(e==null?void 0:e.unit_price_ht)!=null?e.unit_price_ht.toFixed(3):((s==null?void 0:s.price_ht)||"").toString(),o=(e==null?void 0:e.surface_mm2)!=null?k(e.surface_mm2):"",l=e?(e.line_total_ht||e.quantity*e.unit_price_ht).toFixed(3):"";return`
    <div class="row g-2 mb-2 align-items-end po-line" data-index="${t}">
      <div class="col-md-4">
        <label class="form-label small mb-1">Product</label>
        <div class="input-group">
          <select class="form-select" id="poProduct${t}" onchange="updatePOLineTotal(${t})" required>
            <option value="">Select Product</option>
            ${d.data.products.map(c=>`
              <option value="${c.id}" data-price="${c.price_ht}" data-surface="${c.surface_mm2||0}" ${c.id===a?"selected":""}>
                ${c.name} (${c.reference})
              </option>
            `).join("")}
          </select>
          <button type="button" class="btn btn-outline-secondary" id="poViewProduct${t}" onclick="viewPOLineProduct(${t})" title="View product" ${a?"":"disabled"}>
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">Qty</label>
        <input type="number" class="form-control" id="poQty${t}" placeholder="Qty" min="1" value="${i}" oninput="updatePOLineTotal(${t})" required>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Surface</label>
        <input type="text" class="form-control" id="poSurface${t}" placeholder="mm²" readonly value="${o}">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Unit Price</label>
        <input type="text" class="form-control" id="poUnitPrice${t}" placeholder="Price" readonly value="${n}">
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Total HT</label>
        <input type="text" class="form-control" id="poLineTotal${t}" placeholder="Total" readonly value="${l}">
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">&nbsp;</label>
        <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removePOLine(${t})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `}let J=1;function pt(){document.getElementById("poLines").insertAdjacentHTML("beforeend",z(null,J)),J++,R()}function vt(e){const t=document.getElementById(`poProduct${e}`),a=document.getElementById(`poQty${e}`),s=document.getElementById(`poUnitPrice${e}`),i=document.getElementById(`poSurface${e}`),n=document.getElementById(`poLineTotal${e}`),o=document.getElementById(`poViewProduct${e}`);if(t&&t.value){const l=t.options[t.selectedIndex],c=parseFloat(l.dataset.price)||0,r=parseFloat(l.dataset.surface)||0,m=parseInt(a.value)||0;s.value=c.toFixed(3),i.value=r>0?k(r):"-",n.value=(c*m).toFixed(3),o&&(o.disabled=!1)}else s&&(s.value=""),i&&(i.value=""),n&&(n.value=""),o&&(o.disabled=!0);R()}function ft(e){var a;const t=(a=document.getElementById(`poProduct${e}`))==null?void 0:a.value;if(t){const s=bootstrap.Modal.getInstance(document.getElementById("poModal"));s&&s.hide(),M(t)}}function yt(e){return(e.lines||[]).reduce((t,a)=>{const s=parseFloat(a.surface_mm2)||0,i=parseInt(a.quantity)||0;return t+s*i},0)}function gt(){const e=document.querySelectorAll(".po-line");let t=0;return e.forEach(a=>{const s=document.getElementById(`poProduct${a.dataset.index}`),i=document.getElementById(`poQty${a.dataset.index}`);document.getElementById(`poSurface${a.dataset.index}`);const n=parseInt(i==null?void 0:i.value)||0,o=s!=null&&s.value&&parseFloat(s.options[s.selectedIndex].dataset.surface)||0;t+=o*n}),t}function bt(){const e=document.querySelectorAll(".po-line");let t=0;return e.forEach(a=>{const s=document.getElementById(`poLineTotal${a.dataset.index}`),i=parseFloat(s==null?void 0:s.value)||0;t+=i}),t}function R(){const e=document.getElementById("poLinesSurfaceTotal"),t=document.getElementById("poLinesHTTotal");e&&(e.textContent=k(gt())),t&&(t.textContent=p(bt(),3))}function ht(e){const t=document.querySelector(`.po-line[data-index="${e}"]`);t&&(t.remove(),R())}async function wt(){var o;if(!y())return;const e=[];if(document.querySelectorAll(".po-line").forEach(l=>{var u;const c=l.dataset.index,r=document.getElementById(`poProduct${c}`),m=document.getElementById(`poQty${c}`),g=document.getElementById(`poUnitPrice${c}`);if(r.value&&m.value){const A=d.data.products.find(xe=>xe.id===r.value),U=document.getElementById(`poSurface${c}`),_e=A.surface_mm2||parseFloat(((u=U==null?void 0:U.dataset)==null?void 0:u.raw)||0)||0;e.push({product_id:r.value,product_name:A.name,quantity:parseInt(m.value),unit_price_ht:parseFloat(g.value),surface_mm2:_e,line_total_ht:parseFloat(g.value)*parseInt(m.value),received_qty:0})}}),e.length===0){v("Please add at least one product line","warning");return}const a=(o=document.getElementById("poId"))==null?void 0:o.value,s=a?d.data.purchaseOrders.find(l=>l.id===a):null,i=e.reduce((l,c)=>l+c.line_total_ht,0),n=s?{...s,date:document.getElementById("poDate").value,supplier_reference:document.getElementById("poRef").value,expected_delivery_date:document.getElementById("poDeliveryDate").value,actual_delivery_date:s.actual_delivery_date,lines:e.map(l=>{var c;return{...l,received_qty:Math.min(((c=s.lines.find(r=>r.product_id===l.product_id))==null?void 0:c.received_qty)||0,l.quantity)}}),total_ht:i,total_ttc:i,notes:document.getElementById("poNotes").value,updated_at:new Date().toISOString()}:{id:T("PO","purchaseOrder"),po_number:je(),date:document.getElementById("poDate").value,status:"draft",supplier_reference:document.getElementById("poRef").value,expected_delivery_date:document.getElementById("poDeliveryDate").value,actual_delivery_date:null,lines:e,total_ht:i,total_ttc:i,notes:document.getElementById("poNotes").value,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};await F(n),bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),P("purchase-orders"),v(s?"Purchase Order updated successfully":"Purchase Order created successfully","success")}function $t(e){const t=d.data.purchaseOrders.find(s=>s.id===e);if(!t)return;const a=window.open("","_blank");a.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>PO ${t.po_number}</title>
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
          <div class="company-name">${d.data.settings.companyName}</div>
          <div>Supplier: SGS Printing Services</div>
        </div>
        <div class="po-info">
          <h1>PURCHASE ORDER</h1>
          <div><strong>${t.po_number}</strong></div>
          <div>Date: ${$(t.date)}</div>
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
          ${t.lines.map(s=>`
            <tr>
              <td>${s.product_name}</td>
              <td>${s.quantity}</td>
              <td>${p(s.unit_price_ht)}</td>
              <td>${p(s.line_total_ht)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="totals">
        <p class="total-row">Total HT: ${p(t.total_ht,3)}</p>

      ${t.notes?`<p style="margin-top: 30px;"><strong>Notes:</strong> ${t.notes}</p>`:""}
    </body>
    </html>
  `),a.document.close(),a.print()}async function Pt(e){var s;if(!y())return;const t=d.data.purchaseOrders.find(i=>i.id===e);if(!t)return;const a=(s=document.getElementById("poStatusSelect"))==null?void 0:s.value;if(!a||a===t.status){v("Please select a different status","warning");return}if(a==="completed-partial"){await X(e);return}if(a==="completed"&&!x(t).isComplete){v("PO is not fully received. Use Close PO (Partial) or receive remaining qty.","warning");return}if(t.status=a,t.updated_at=new Date().toISOString(),a==="in-production"){const i=ye(t);i&&(d.data.deliveries.some(o=>o.id===i.id)||(await L(i),v(`Delivery ${i.delivery_number} created`,"info")))}a==="completed"&&(t.actual_delivery_date=t.actual_delivery_date||new Date().toISOString().split("T")[0]),await F(t),j(),bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),P("purchase-orders"),v(`PO status updated to ${w(t.status)}`,"success")}function _t(){const e=[["PO Number","Date","Status","Amount HT","Delivery Date"].join(","),...d.data.purchaseOrders.map(t=>[t.po_number,t.date,t.status,t.total_ht,t.actual_delivery_date||t.expected_delivery_date||""].join(","))].join(`
`);zt(e,"purchase-orders.csv")}function xt(e){const t=d.data.deliveries,a=t.filter(o=>f(o.status)==="pending").length,s=t.filter(o=>f(o.status)==="partial").length,i=t.filter(o=>f(o.status)==="delivered").length,n=t.filter(o=>["partial","delivered"].includes(f(o.status))).reduce((o,l)=>o+I(l),0);e.innerHTML=`
    ${C()}
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title"><i class="fa-solid fa-truck me-2 text-primary-brand"></i>Deliveries</h1>
        <p class="page-subtitle">Track partial and full shipments linked to purchase orders</p>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-6 col-md-3">
        <div class="kpi-card kpi-warning">
          <div class="kpi-icon icon-warning"><i class="fa-solid fa-clock"></i></div>
          <div class="kpi-label">Pending</div>
          <div class="kpi-value">${a}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kpi-card kpi-purple">
          <div class="kpi-icon icon-purple"><i class="fa-solid fa-boxes-stacked"></i></div>
          <div class="kpi-label">Partial</div>
          <div class="kpi-value">${s}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kpi-card kpi-success">
          <div class="kpi-icon icon-success"><i class="fa-solid fa-check"></i></div>
          <div class="kpi-label">Delivered</div>
          <div class="kpi-value">${i}</div>
        </div>
      </div>
      <div class="col-6 col-md-3">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon icon-primary"><i class="fa-solid fa-coins"></i></div>
          <div class="kpi-label">Confirmed HT</div>
          <div class="kpi-value" style="font-size:18px">${p(n)}</div>
        </div>
      </div>
    </div>

    <div class="filter-bar">
      <select class="filter-select form-select form-select-sm" id="deliveryStatusFilter" onchange="filterDeliveries()" style="width:180px">
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="partial">Partial</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <span class="ms-auto text-muted small">${t.length} deliveries</span>
    </div>

    <div class="row g-3" id="deliveriesList">
      ${t.length?t.map(o=>we(o)).join(""):`
        <div class="col-12"><div class="empty-state"><i class="fa-solid fa-truck"></i><p>No deliveries yet</p></div></div>
      `}
    </div>
  `,window.filterDeliveries=St,window.showDeliveryModal=q}function we(e){const t=f(e.status),a=d.data.payments.find(o=>o.related_delivery===e.id),s=e.lines.reduce((o,l)=>o+(l.remaining_qty??l.ordered_qty),0),i=e.lines.reduce((o,l)=>o+(l.delivered_qty||l.receive_qty||0),0),n=s>0?Math.round(i/s*100):t!=="pending"?100:0;return`
    <div class="col-md-6 col-xl-4">
      <div class="card delivery-card h-100" data-status="${t}">
        <div class="card-header d-flex justify-content-between align-items-center py-3">
          <div>
            <h6 class="mb-0">${e.delivery_number}</h6>
            <small class="text-muted">${e.po_number}</small>
          </div>
          <span class="status-badge ${t}">${w(t)}</span>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3">
            <div>
              <small class="text-muted d-block">Amount</small>
              <span class="fw-bold text-primary-brand">${p(I(e))}</span>
            </div>
            <div class="text-end">
              <small class="text-muted d-block">Date</small>
              <span>${e.delivery_date?$(e.delivery_date):"—"}</span>
            </div>
          </div>
          ${t==="pending"?Z(n,"Qty to receive"):`
            <div class="small text-muted">${i} pcs confirmed in this delivery</div>
          `}
          ${a?`
            <div class="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
              <small class="text-muted">Payment</small>
              <span class="status-badge ${a.status}">${p(a.amount_paid||0)} / ${p(a.amount)}</span>
            </div>
          `:""}
        </div>
        <div class="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
          <button class="btn btn-outline-primary btn-sm w-100" onclick="showDeliveryModal('${e.id}')">
            <i class="fa-solid fa-eye me-1"></i>View Details
          </button>
        </div>
      </div>
    </div>
  `}function St(){var s;const e=((s=document.getElementById("deliveryStatusFilter"))==null?void 0:s.value)||"";let t=d.data.deliveries;e&&(t=t.filter(i=>f(i.status)===e));const a=document.getElementById("deliveriesList");a&&(a.innerHTML=t.map(i=>we(i)).join(""))}function q(e){var r;const t=d.data.deliveries.find(m=>m.id===e);if(!t)return;const a=f(t.status),s=d.data.payments.find(m=>m.related_delivery===t.id),i=y()&&a==="pending",n=d.data.purchaseOrders.find(m=>m.id===t.related_po),o=n?x(n):null,l=`
    <div class="modal fade" id="deliveryModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title"><i class="fa-solid fa-truck me-2 text-primary-brand"></i>${t.delivery_number}</h5>
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
                  <div class="fw-semibold">${t.po_number}</div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="info-tile">
                  <small>${i?"Preview Amount":"Confirmed Amount"}</small>
                  <div class="fw-bold text-primary-brand" id="deliveryPreviewTotal_${t.id}">${p(I(t))}</div>
                </div>
              </div>
            </div>

            ${o?`
              <div class="card mb-4">
                <div class="card-body py-3">
                  ${Z(o.pct,"PO fulfillment")}
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
                ${p(s.amount_paid||0)} / ${p(s.amount)}
                <span class="status-badge ${s.status} ms-2">${w(s.status)}</span>
              </div>
            `:""}

            <h6 class="section-title">Delivery Lines</h6>
            <div class="table-card mb-3">
              <div class="table-responsive">
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
                    ${t.lines.map((m,g)=>`
                      <tr>
                        <td>${m.product_name}</td>
                        <td>${m.remaining_qty??m.ordered_qty}</td>
                        <td>
                          ${i?`
                            <input type="number" class="form-control form-control-sm" style="width:90px"
                              id="receiveQty_${t.id}_${g}"
                              value="${m.receive_qty??m.remaining_qty??0}"
                              min="0" max="${m.remaining_qty??m.ordered_qty}"
                              oninput="updateDeliveryPreviewAmount('${t.id}')">
                          `:m.delivered_qty||0}
                        </td>
                        <td>${p(m.unit_price_ht)}</td>
                        <td id="lineAmount_${t.id}_${g}">${p(W(m))}</td>
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
              <button type="button" class="btn btn-outline-danger" onclick="cancelDelivery('${t.id}')">Cancel</button>
              <button type="button" class="btn btn-primary" onclick="confirmDelivery('${t.id}')">
                <i class="fas fa-check me-1"></i>Confirm Receipt
              </button>
            `:""}
          </div>
        </div>
      </div>
    </div>
  `;(r=document.getElementById("deliveryModal"))==null||r.remove(),document.body.insertAdjacentHTML("beforeend",l),new bootstrap.Modal(document.getElementById("deliveryModal")).show(),i&&de(t.id),document.getElementById("deliveryModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.confirmDelivery=It,window.cancelDelivery=Dt,window.updateDeliveryPreviewAmount=de,window.closePOPartial=X,window.navigateToProductsAndShow=m=>{var g;(g=bootstrap.Modal.getInstance(document.getElementById("deliveryModal")))==null||g.hide(),S("products"),setTimeout(()=>M(m),200)}}async function It(e){if(!y())return;const t=d.data.deliveries.find(n=>n.id===e);if(!t||f(t.status)!=="pending")return;const a=d.data.purchaseOrders.find(n=>n.id===t.related_po);if(!a)return;let s=0;for(let n=0;n<t.lines.length;n++){const o=t.lines[n],l=document.getElementById(`receiveQty_${e}_${n}`),c=parseInt(l==null?void 0:l.value)||0,r=o.remaining_qty??o.ordered_qty;if(c<0||c>r){v(`Invalid quantity for ${o.product_name} (max ${r})`,"warning");return}o.receive_qty=c,o.delivered_qty=c,o.line_total=c*(o.unit_price_ht||0),s+=c;const m=a.lines.find(g=>g.product_id===o.product_id);m&&c>0&&(m.received_qty=(m.received_qty||0)+c)}if(s===0){v("Enter at least one received quantity","warning");return}t.amount=I(t),t.delivery_date=new Date().toISOString().split("T")[0],t.updated_at=new Date().toISOString();const i=x(a);if(t.status=i.isComplete?"delivered":"partial",await L(t),await Ke(t),i.isComplete&&(a.status="completed",a.actual_delivery_date=t.delivery_date),a.updated_at=new Date().toISOString(),await F(a),!i.isComplete&&!["completed-partial","cancelled"].includes(a.status)){const n=ye(a);n&&await L(n)}j(),bootstrap.Modal.getInstance(document.getElementById("deliveryModal")).hide(),P("deliveries"),v(`Received ${s} pcs — payment created for ${p(t.amount)}`,"success")}async function Dt(e){if(!y()||!confirm("Cancel this delivery?"))return;const t=d.data.deliveries.find(a=>a.id===e);t&&(t.status="cancelled",t.updated_at=new Date().toISOString(),await L(t),bootstrap.Modal.getInstance(document.getElementById("deliveryModal")).hide(),P("deliveries"),v("Delivery cancelled","info"))}function Et(e){const t=d.data.payments,a=Ot(),s=a.totalInvoiced>0?Math.round(a.totalPaid/a.totalInvoiced*100):0;e.innerHTML=`
    ${C()}
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title"><i class="fa-solid fa-credit-card me-2 text-primary-brand"></i>Payments</h1>
        <p class="page-subtitle">Payments based on confirmed deliveries only</p>
      </div>
    </div>

    <div class="payment-summary mb-4">
      <div class="payment-summary-item">
        <div class="amount text-primary-brand">${p(a.totalInvoiced)}</div>
        <div class="label">To Pay (Delivered)</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-success">${p(a.totalPaid)}</div>
        <div class="label">Paid</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-warning">${p(a.remaining)}</div>
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
      <span class="ms-auto text-muted small">${t.length} payments</span>
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
            ${t.length?t.map(i=>$e(i)).join(""):`
              <tr><td colspan="7" class="text-center text-muted py-4">No payments yet</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `,window.filterPayments=Lt,window.showPaymentModal=kt,window.showDeliveryModal=q}function Ot(){const t=d.data.deliveries.filter(s=>["partial","delivered"].includes(f(s.status))).reduce((s,i)=>s+I(i),0),a=d.data.payments.reduce((s,i)=>s+(i.amount_paid||0),0);return{totalInvoiced:t,totalPaid:a,remaining:Math.max(0,t-a)}}function $e(e){return K(e),`
    <tr data-status="${e.status}" data-method="${e.payment_method}">
      <td class="fw-medium">${e.payment_reference}</td>
      <td>${e.delivery_number?`<a href="#" class="po-link" onclick="navigateTo('deliveries'); setTimeout(() => showDeliveryModal('${e.related_delivery}'), 200); return false;">${e.delivery_number}</a>`:"—"}</td>
      <td>${e.po_number}</td>
      <td>${p(e.amount)}</td>
      <td class="text-success fw-medium">${p(e.amount_paid||0)}</td>
      <td><span class="status-badge ${e.status}">${w(e.status)}</span></td>
      <td>
        ${y()&&e.status!=="paid"?`
          <button class="btn-action btn-action-view" title="Record payment" onclick="showPaymentModal('${e.id}')">
            <i class="fas fa-wallet"></i>
          </button>
        `:'<span class="text-muted small">—</span>'}
      </td>
    </tr>
  `}function kt(e){var i;if(!y())return;const t=d.data.payments.find(n=>n.id===e);if(!t||t.status==="paid")return;const a=K(t),s=`
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
              <div class="fw-semibold">${t.payment_reference}</div>
            </div>
            <div class="row g-3 mb-3">
              <div class="col-4"><small class="text-muted d-block">Due</small><strong>${p(t.amount)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Paid</small><strong class="text-success">${p(t.amount_paid||0)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Remaining</small><strong class="text-warning">${p(a)}</strong></div>
            </div>
            <label class="form-label">Payment Amount</label>
            <input type="number" step="0.01" min="0.01" max="${a}" class="form-control" id="payAmountInput" value="${a.toFixed(2)}">
            <small class="text-muted">Partial payments supported — pay only for received delivery amount.</small>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-primary" onclick="recordPartialPayment('${t.id}')">
              <i class="fas fa-check me-1"></i>Record Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  `;(i=document.getElementById("paymentModal"))==null||i.remove(),document.body.insertAdjacentHTML("beforeend",s),new bootstrap.Modal(document.getElementById("paymentModal")).show(),document.getElementById("paymentModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.recordPartialPayment=Bt}async function Bt(e){var i,n;if(!y())return;const t=d.data.payments.find(o=>o.id===e);if(!t)return;const a=K(t),s=parseFloat((i=document.getElementById("payAmountInput"))==null?void 0:i.value)||0;if(s<=0||s>a+.001){v(`Enter an amount between 0.01 and ${p(a)}`,"warning");return}t.amount_paid=(t.amount_paid||0)+s,t.payment_date=new Date().toISOString().split("T")[0],t.updated_at=new Date().toISOString(),t.amount_paid>=t.amount-.001?(t.amount_paid=t.amount,t.status="paid"):t.status="partial",await re(t),(n=bootstrap.Modal.getInstance(document.getElementById("paymentModal")))==null||n.hide(),P("payments"),v(`Payment recorded: ${p(s)}`,"success")}function Lt(){var i,n;const e=((i=document.getElementById("paymentStatusFilter"))==null?void 0:i.value)||"",t=((n=document.getElementById("paymentMethodFilter"))==null?void 0:n.value)||"";let a=d.data.payments;e&&(a=a.filter(o=>o.status===e)),t&&(a=a.filter(o=>o.payment_method===t));const s=document.getElementById("paymentsTableBody");s&&(s.innerHTML=a.map(o=>$e(o)).join(""))}function Tt(e){const t=d.data.documents;e.innerHTML=`
    ${C()}
    <div class="page-header">
      <h1 class="page-title">Document Center</h1>
      <p class="page-subtitle">${t.length} documents available</p>
    </div>

    <!-- Category Filter -->
    <div class="filters-bar">
      <div class="d-flex gap-2 flex-wrap">
        <button class="btn btn-sm btn-primary" onclick="filterDocumentsByCategory('')">
          All Documents
        </button>
        ${[{value:"purchase-orders",label:"Purchase Orders",icon:"fa-file-invoice"},{value:"invoices",label:"Invoices",icon:"fa-file-invoice-dollar"},{value:"delivery-notes",label:"Delivery Notes",icon:"fa-file-export"},{value:"technical-files",label:"Technical Files",icon:"fa-file-code"},{value:"artwork-files",label:"Artwork Files",icon:"fa-palette"}].map(a=>`
          <button class="btn btn-sm btn-outline-secondary" onclick="filterDocumentsByCategory('${a.value}')">
            <i class="fas ${a.icon} me-1"></i>${a.label}
          </button>
        `).join("")}
      </div>
      <div class="filter-group ms-auto">
        <input type="text" class="form-control form-control-sm" id="docSearch" placeholder="Search documents..." oninput="searchDocuments()">
      </div>
    </div>

    <!-- Documents Grid -->
    <div class="row g-4" id="documentsGrid">
      ${t.map(a=>se(a)).join("")}
    </div>
  `,window.filterDocumentsByCategory=At,window.searchDocuments=Ft,window.previewDocument=Ct,window.downloadDocument=Mt}function Ct(e){const t=d.data.documents.find(a=>a.id===e);t&&ie(t.data||t.url,t.name)}function Mt(e){const t=d.data.documents.find(a=>a.id===e);t&&H(t.data||t.url,t.name)}function se(e){const t={pdf:"fa-file-pdf text-danger",ai:"fa-file-image text-warning",eps:"fa-file-image text-info",psd:"fa-file-image text-primary",svg:"fa-file-image text-success"},a=e.category==="artwork-files"||e.category==="technical-files",s=a?"":`
    <button class="btn btn-outline-primary btn-sm flex-grow-1" onclick="previewDocument('${e.id}')">
      <i class="fas fa-eye me-1"></i>Preview
    </button>`;return`
    <div class="col-md-6 col-lg-3">
      <div class="card h-100" data-category="${e.category}" data-name="${e.name.toLowerCase()}">
        <div class="card-body">
          <div class="d-flex align-items-start mb-3">
            <div class="me-3">
              <i class="fas ${t[e.type]||"fa-file text-secondary"} fa-2x"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="mb-1">${e.name}</h6>
              <small class="text-muted">${e.size}</small>
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="badge bg-primary-light text-primary">${Wt(e.category)}</span>
            <small class="text-muted">${e.created_at}</small>
          </div>
        </div>
        <div class="card-footer bg-transparent">
          <div class="d-flex gap-2">
            ${s}
            <button class="btn btn-primary btn-sm ${a?"flex-grow-1":""}" onclick="downloadDocument('${e.id}')">
              <i class="fas fa-download me-1"></i>Download
            </button>
          </div>
        </div>
      </div>
    </div>
  `}function At(e){const t=document.getElementById("documentsGrid");document.querySelectorAll(".filters-bar .btn").forEach(i=>{i.classList.remove("btn-primary"),i.classList.add("btn-outline-secondary")});let s=d.data.documents;e&&(s=s.filter(i=>i.category===e)),t.innerHTML=s.map(i=>se(i)).join("")}function Ft(){var s;const e=((s=document.getElementById("docSearch"))==null?void 0:s.value.toLowerCase())||"";let t=d.data.documents;e&&(t=t.filter(i=>i.name.toLowerCase().includes(e)));const a=document.getElementById("documentsGrid");a.innerHTML=t.map(i=>se(i)).join("")}function Nt(e){const t=d.data.settings;e.innerHTML=`
    ${C()}
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
                <input type="text" class="form-control" id="companyName" value="${t.companyName||"WAVE VI"}">
              </div>
              <div class="mb-3">
                <label class="form-label">Supplier Name</label>
                <input type="text" class="form-control" id="supplierName" value="${t.supplierName||"SGS Printing Services"}">
              </div>
              <div class="mb-3">
                <label class="form-label">Currency</label>
                <select class="form-select" id="currency">
                  <option value="TND" ${t.currency==="TND"?"selected":""}>TND - Tunisian Dinar</option>
                  <option value="EUR" ${t.currency==="EUR"?"selected":""}>EUR - Euro</option>
                  <option value="USD" ${t.currency==="USD"?"selected":""}>USD - US Dollar</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Default VAT Rate (%)</label>
                <input type="number" class="form-control" id="defaultVat" value="${t.defaultVat||20}">
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
                  <input class="form-check-input" type="radio" name="theme" id="themeLight" value="light" ${d.theme==="light"?"checked":""} onchange="toggleTheme()">
                  <label class="form-check-label" for="themeLight">
                    <i class="fas fa-sun text-warning me-1"></i>Light Mode
                  </label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="theme" id="themeDark" value="dark" ${d.theme==="dark"?"checked":""} onchange="toggleTheme()">
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
  `,window.saveSettings=Rt,window.exportBackup=jt,window.exportDataFiles=qt,window.importBackup=Ht,window.reloadHostedData=Ut}async function Rt(){y()&&(d.data.settings={companyName:document.getElementById("companyName").value,supplierName:document.getElementById("supplierName").value,currency:document.getElementById("currency").value,defaultVat:parseInt(document.getElementById("defaultVat").value)||20,theme:d.theme},await ce(d.data.settings),v("Settings saved successfully","success"))}function qt(){try{He(),v("JSON files downloaded — commit them to public/data/","success")}catch(e){console.error("Export failed:",e),v("Failed to export JSON files","danger")}}async function jt(){try{const e=Fe(),t=new Date().toISOString().split("T")[0];pe(e,`wave-vi-backup-${t}.json`),v("Combined backup exported successfully","success")}catch(e){console.error("Export failed:",e),v("Failed to export backup","danger")}}async function Ht(e){var a;const t=(a=e.target.files)==null?void 0:a[0];if(t){try{const s=await t.text();if(!confirm("Importing will replace in-memory data for this session. Continue?")){e.target.value="";return}const i=Re(s);d.data.products=i.products,d.data.purchaseOrders=i.purchaseOrders,d.data.deliveries=i.deliveries,d.data.payments=i.payments,d.data.documents=i.documents,d.data.categories=i.categories,d.data.settings=i.settings,te(),P(d.currentPage),v("Backup imported successfully","success")}catch(s){console.error("Import failed:",s),v("Invalid backup file","danger")}e.target.value=""}}async function Ut(){confirm("Reload data from hosted JSON files? Unsaved session changes will be lost.")&&(v("Reloading data...","info"),await ee(),te(),P(d.currentPage),v("Data reloaded from JSON files","success"))}function j(){const e=document.getElementById("notificationBadge"),t=document.getElementById("notificationsList");if(!e||!t)return;const a=[];d.data.purchaseOrders.filter(s=>s.status==="pending"||s.status==="draft").slice(0,3).forEach(s=>{a.push({icon:"fa-file-invoice",iconClass:"bg-info-soft text-info",text:`PO ${s.po_number} — ${w(s.status)}`,time:$(s.created_at)})}),d.data.deliveries.filter(s=>f(s.status)==="pending").slice(0,2).forEach(s=>{a.push({icon:"fa-truck",iconClass:"bg-warning-soft text-warning",text:`Delivery ${s.delivery_number} awaiting confirmation`,time:"Pending"})}),d.data.payments.filter(s=>s.status==="pending").slice(0,2).forEach(s=>{a.push({icon:"fa-credit-card",iconClass:"bg-success-soft text-success",text:`Payment ${s.payment_reference} — ${p(s.amount)}`,time:s.payment_date?$(s.payment_date):"Pending"})}),e.style.display=a.length>0?"":"none",a.length===0?t.innerHTML='<div class="notif-item"><div class="notif-content"><p class="text-muted mb-0">No notifications</p></div></div>':t.innerHTML=a.map(s=>`
      <div class="notif-item unread">
        <div class="notif-icon ${s.iconClass}"><i class="fa-solid ${s.icon}"></i></div>
        <div class="notif-content">
          <p>${s.text}</p>
          <span>${s.time}</span>
        </div>
      </div>
    `).join("")}function Vt(e){const t=["draft","pending","approved","in-production","completed"],a=t.indexOf(e);return t.map((s,i)=>{const n=i<=a;return`<div class="text-center" style="flex: 1;">
      <div class="status-badge ${s===e?s:n?"completed":"draft"} mb-2" style="width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
        ${n?'<i class="fas fa-check"></i>':'<i class="fas fa-circle" style="font-size: 8px;"></i>'}
      </div>
      <div><small>${w(s)}</small></div>
    </div>`}).join("")}function p(e,t=2){const s=(d.data.settings||{}).currency||"TND",i=s==="TND"?"fr-TN":s==="EUR"?"fr-FR":"en-US";return new Intl.NumberFormat(i,{style:"currency",currency:s,minimumFractionDigits:t,maximumFractionDigits:t}).format(e||0)}function Pe(e,t,a){const s=parseFloat(t)||0,i=parseFloat(a)||0;switch(e){case"circle":return Math.round(Math.PI*Math.pow(s/2,2)*100)/100;case"square":return Math.round(s*s*100)/100;case"rectangle":return Math.round(s*i*100)/100;default:return 0}}function k(e){return e?`${Number(e).toLocaleString("fr-FR")} mm²`:"-"}function G(e){return new Promise((t,a)=>{const s=new FileReader;s.onload=()=>t(s.result),s.onerror=a,s.readAsDataURL(e)})}function Gt(e){if(!e)return"-";const t=Math.round((e.length-5)*.75);return t<1024?`${t} B`:t<1048576?`${(t/1024).toFixed(1)} KB`:`${(t/1048576).toFixed(1)} MB`}function H(e,t){const a=document.createElement("a");a.href=e,a.download=t,a.click()}function ie(e,t){e.startsWith("data:image/")||e.startsWith("data:application/pdf")?window.open(e,"_blank"):H(e,t)}function $(e){if(!e)return"-";const t=new Date(e);return new Intl.DateTimeFormat("en-US",{day:"numeric",month:"short",year:"numeric"}).format(t)}function w(e){return e?e.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" "):"-"}function Wt(e){return e.split("-").map(t=>t.charAt(0).toUpperCase()+t.slice(1)).join(" ")}function v(e,t="info"){const a=document.getElementById("toastContainer");if(!a)return;const s="toast-"+Date.now(),i=`
    <div id="${s}" class="toast" role="alert">
      <div class="toast-header">
        <i class="fas ${t==="success"?"fa-check-circle text-success":t==="danger"?"fa-times-circle text-danger":t==="warning"?"fa-exclamation-circle text-warning":"fa-info-circle text-primary"} me-2"></i>
        <strong class="me-auto">${t.charAt(0).toUpperCase()+t.slice(1)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${e}</div>
    </div>
  `;a.insertAdjacentHTML("beforeend",i);const n=document.getElementById(s);new bootstrap.Toast(n,{delay:3e3}).show(),n.addEventListener("hidden.bs.toast",()=>{n.remove()})}function zt(e,t){const a=new Blob([e],{type:"text/csv;charset=utf-8;"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download=t,s.click(),URL.revokeObjectURL(s.href)}window.navigateTo=S;window.showDeliveryModal=q;window.previewDataUrl=ie;window.downloadDataUrl=H;
