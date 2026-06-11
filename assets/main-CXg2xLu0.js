(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function a(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=a(i);fetch(i.href,n)}})();const Se="wave-vi-portal",xe=1,ie=["products","purchaseOrders","deliveries","payments","documents","meta"],U={companyName:"WAVE VI",supplierName:"SGS Printing Services",currency:"TND",defaultVat:0,theme:"light"},ne=["Tickets","Flyers","Posters","Brochures","Badges","Labels","Packaging","Signage","Other"];let q=null;function Ie(){return q||(q=new Promise((t,e)=>{const a=indexedDB.open(Se,xe);a.onerror=()=>e(a.error),a.onsuccess=()=>t(a.result),a.onupgradeneeded=s=>{const i=s.target.result;for(const n of ie)i.objectStoreNames.contains(n)||i.createObjectStore(n,{keyPath:n==="meta"?"key":"id"})}})),q}async function O(t,e,a){const s=await Ie();return new Promise((i,n)=>{const o=s.transaction(t,e),l=o.objectStore(t),c=a(l);o.oncomplete=()=>i(c),o.onerror=()=>n(o.error)})}async function S(t){return O(t,"readonly",e=>new Promise((a,s)=>{const i=e.getAll();i.onsuccess=()=>a(i.result),i.onerror=()=>s(i.error)}))}async function _(t,e){return O(t,"readwrite",a=>a.put(e))}async function x(t,e){return O(t,"readwrite",a=>{for(const s of e)a.put(s)})}async function De(t){return O(t,"readwrite",e=>e.clear())}async function oe(t){return O("meta","readonly",e=>new Promise((a,s)=>{const i=e.get(t);i.onsuccess=()=>{var n;return a(((n=i.result)==null?void 0:n.value)??null)},i.onerror=()=>s(i.error)}))}async function le(t,e){return _("meta",{key:t,value:e})}async function Ee(){const t=await oe("settings");return t?{...U,...t}:{...U}}async function L(t){await le("settings",t)}async function Oe(){const t=await oe("categories");return t!=null&&t.length?t:[...ne]}async function ke(t){await le("categories",t)}async function de(){const[t,e,a,s,i,n,o]=await Promise.all([S("products"),S("purchaseOrders"),S("deliveries"),S("payments"),S("documents"),Ee(),Oe()]);return{products:t,purchaseOrders:e,deliveries:a,payments:s,documents:i,settings:n,categories:o}}async function Be(t){await _("products",t)}async function C(t){await _("purchaseOrders",t)}async function D(t){await _("deliveries",t)}async function re(t){await _("payments",t)}async function Le(t){await _("documents",t)}async function Ce(){const t=await de();return{version:1,exportedAt:new Date().toISOString(),products:t.products,purchase_orders:t.purchaseOrders,deliveries:t.deliveries,payments:t.payments,documents:t.documents,settings:t.settings,categories:t.categories}}async function Te(t){const e=typeof t=="string"?JSON.parse(t):t;await ce(),await Promise.all([x("products",e.products||[]),x("purchaseOrders",e.purchase_orders||e.purchaseOrders||[]),x("deliveries",e.deliveries||[]),x("payments",e.payments||[]),x("documents",e.documents||[]),L({...U,...e.settings||{}}),ke(e.categories||ne)]),Ne(e),Re(e.purchase_orders||e.purchaseOrders||[])}async function ce(){await Promise.all(ie.map(De))}function E(t,e){const a=`counter_${e}`,s=parseInt(localStorage.getItem(a)||"0",10)+1;return localStorage.setItem(a,String(s)),`${t}-${String(s).padStart(3,"0")}`}function Me(){const e=parseInt(localStorage.getItem("counter_poNumber")||"0",10)+1;return`PO-SGS-${String(e).padStart(3,"0")}`}function Ae(){const t="counter_poNumber",e=parseInt(localStorage.getItem(t)||"0",10)+1;return localStorage.setItem(t,String(e)),`PO-SGS-${String(e).padStart(3,"0")}`}function Re(t){if(!(t!=null&&t.length))return;const e=t.reduce((a,s)=>{const i=(s.po_number||"").match(/^PO-SGS-(\d+)$/);return i?Math.max(a,parseInt(i[1],10)):a},0);e>0&&localStorage.setItem("counter_poNumber",String(e))}function Ne(t){const e={product:I(t.products,"PRD-"),purchaseOrder:I(t.purchase_orders||t.purchaseOrders,"PO-"),delivery:I(t.deliveries,"DEL-"),payment:I(t.payments,"PAY-"),document:I(t.documents,"DOC-")};for(const[a,s]of Object.entries(e))localStorage.setItem(`counter_${a}`,String(s))}function I(t,e){return t!=null&&t.length?t.reduce((a,s)=>{const i=s.id||"";if(!i.startsWith(e))return a;const n=parseInt(i.slice(e.length),10);return Number.isNaN(n)?a:Math.max(a,n)},0):0}function Fe(){for(const t of Object.keys(localStorage))t.startsWith("counter_")&&localStorage.removeItem(t)}function qe(t,e){const a=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download=e,s.click(),URL.revokeObjectURL(s.href)}const W="wavevi_session",je={wavevi:{password:"wavevi",role:"admin",displayName:"WAVE VI",roleLabel:"Administrator",initials:"WV"},sgs:{password:"sgs",role:"supplier",displayName:"SGS Printing Services",roleLabel:"Supplier",initials:"SG"}};function He(t,e){const a=je[t.trim().toLowerCase()];if(!a||a.password!==e)return null;const s={username:t.trim().toLowerCase(),role:a.role,displayName:a.displayName,roleLabel:a.roleLabel,initials:a.initials,loggedInAt:new Date().toISOString()};return sessionStorage.setItem(W,JSON.stringify(s)),s}function Ue(){sessionStorage.removeItem(W)}function z(){try{const t=sessionStorage.getItem(W);return t?JSON.parse(t):null}catch{return null}}function Ve(){return!!z()}function T(){var t;return((t=z())==null?void 0:t.role)==="admin"}function g(){return T()}function ue(t){return!(t==="settings"&&!T())}const d={data:{products:[],purchaseOrders:[],deliveries:[],payments:[],documents:[],categories:[],settings:{}},currentPage:"dashboard",charts:{},theme:"light"};document.addEventListener("DOMContentLoaded",()=>{Ge()});function Ge(){var e;const t=document.getElementById("loginForm");t==null||t.addEventListener("submit",a=>{a.preventDefault();const s=document.getElementById("loginUser").value,i=document.getElementById("loginPass").value,n=document.getElementById("loginError");if(!He(s,i)){n.textContent="Invalid username or password.",n.classList.remove("d-none");return}n.classList.add("d-none"),ee()}),(e=document.getElementById("logoutBtn"))==null||e.addEventListener("click",()=>{confirm("Sign out?")&&(Ue(),location.reload())}),Ve()&&ee()}async function ee(){var e,a;(e=document.getElementById("loginScreen"))==null||e.classList.add("d-none"),(a=document.getElementById("appShell"))==null||a.classList.remove("d-none"),We(),await K(),ve(),Je(),Ze(),Ke(),Xe(),me(d.currentPage);const t=window.location.hash.slice(1)||"dashboard";w(ue(t)?t:"dashboard")}function We(){const t=z();t&&(document.getElementById("profileName").textContent=t.displayName,document.getElementById("profileRole").textContent=t.roleLabel,document.getElementById("profileInitials").textContent=t.initials,document.getElementById("sidebarUserName").textContent=t.displayName,document.getElementById("sidebarUserRole").textContent=t.roleLabel,document.querySelectorAll(".admin-only").forEach(e=>{e.classList.toggle("hidden-role",!T())}))}function k(){return g()?"":'<div class="readonly-banner"><i class="fa-solid fa-eye"></i> Read-only access — contact WAVE VI admin to make changes.</div>'}const te={dashboard:{icon:"fa-gauge-high",label:"Dashboard"},products:{icon:"fa-box-open",label:"Product Catalog"},"purchase-orders":{icon:"fa-file-invoice",label:"Purchase Orders"},deliveries:{icon:"fa-truck",label:"Deliveries"},payments:{icon:"fa-credit-card",label:"Payments"},documents:{icon:"fa-folder-open",label:"Documents"},settings:{icon:"fa-gear",label:"Settings"}};function me(t){const e=te[t]||te.dashboard,a=document.getElementById("topnavBreadcrumb");a&&(a.innerHTML=`<i class="fa-solid ${e.icon} me-2 text-primary-brand"></i><span>${e.label}</span>`)}function v(t){return t==="preparing"?"pending":t==="partially-delivered"?"partial":t}function ze(){for(const t of d.data.purchaseOrders)for(const e of t.lines)e.received_qty==null&&(e.received_qty=0);for(const t of d.data.purchaseOrders){if(t.lines.some(s=>s.received_qty>0))continue;const a=d.data.deliveries.filter(s=>s.related_po===t.id&&["partial","delivered"].includes(v(s.status)));for(const s of a)for(const i of s.lines){const n=t.lines.find(o=>o.product_id===i.product_id);n&&(n.received_qty=(n.received_qty||0)+(i.delivered_qty||i.receive_qty||0))}}for(const t of d.data.payments)t.amount_paid==null&&(t.amount_paid=t.status==="paid"?t.amount:0)}function $(t){const e=t.lines.map(l=>{const c=l.quantity,r=l.received_qty||0,u=Math.max(0,c-r);return{product_id:l.product_id,product_name:l.product_name,ordered:c,received:r,remaining:u,unit_price_ht:l.unit_price_ht,surface_mm2:l.surface_mm2}}),a=e.reduce((l,c)=>l+c.ordered,0),s=e.reduce((l,c)=>l+c.received,0),i=e.reduce((l,c)=>l+c.remaining,0),n=t.lines.reduce((l,c)=>l+(c.received_qty||0)*c.unit_price_ht,0),o=t.total_ht||0;return{lines:e,totalOrdered:a,totalReceived:s,totalRemaining:i,receivedAmount:n,orderedAmount:o,pct:a>0?Math.round(s/a*100):0,isComplete:i===0,hasPartial:s>0&&i>0}}function V(t){return(t.delivered_qty||t.receive_qty||0)*(t.unit_price_ht||0)}function P(t){return["partial","delivered"].includes(v(t.status))?t.amount!=null?t.amount:(t.lines||[]).reduce((e,a)=>e+V(a),0):(t.lines||[]).reduce((e,a)=>e+V(a),0)}function Y(t){return Math.max(0,(t.amount||0)-(t.amount_paid||0))}function Q(t,e="Fulfillment"){return`
    <div class="fulfillment-block">
      <div class="d-flex justify-content-between mb-1">
        <small class="text-muted">${e}</small>
        <small class="fw-semibold">${t}%</small>
      </div>
      <div class="progress-custom">
        <div class="progress-bar-custom" style="width:${t}%;background:var(--brand-primary)"></div>
      </div>
    </div>
  `}function pe(t){const e=d.data.deliveries.find(o=>o.related_po===t.id&&v(o.status)==="pending");if(e)return e;const a=$(t);if(a.totalRemaining===0)return null;const s=d.data.deliveries.filter(o=>o.related_po===t.id).length+1,i=s>1?`-${String(s).padStart(2,"0")}`:"",n=a.lines.filter(o=>o.remaining>0).map(o=>({product_id:o.product_id,product_name:o.product_name,ordered_qty:o.ordered,remaining_qty:o.remaining,receive_qty:o.remaining,delivered_qty:0,unit_price_ht:o.unit_price_ht,surface_mm2:o.surface_mm2||0,line_total:o.remaining*o.unit_price_ht}));return{id:E("DEL","delivery"),delivery_number:`DEL-${t.po_number}${i}`,related_po:t.id,po_number:t.po_number,status:"pending",delivery_date:null,amount:0,lines:n,documents:[],notes:`Auto-created from ${t.po_number}`,created_at:new Date().toISOString(),updated_at:new Date().toISOString()}}async function Ye(t){const e=d.data.payments.find(i=>i.related_delivery===t.id);if(e)return e;const a=P(t),s={id:E("PAY","payment"),payment_reference:`PAY-${t.delivery_number}`,related_po:t.related_po,related_delivery:t.id,delivery_number:t.delivery_number,po_number:t.po_number,payment_method:"bank-transfer",amount:a,amount_paid:0,payment_date:null,status:"pending",created_at:new Date().toISOString(),updated_at:new Date().toISOString()};return await re(s),d.data.payments.push(s),s}async function J(t){var s;if(!g())return;const e=d.data.purchaseOrders.find(i=>i.id===t);if(!e)return;const a=$(e);if(a.totalReceived===0){p("Receive at least one delivery before closing partially","warning");return}if(confirm(`Close PO ${e.po_number} with ${a.pct}% received? Remaining qty will not be delivered.`)){e.status="completed-partial",e.updated_at=new Date().toISOString(),e.actual_delivery_date=new Date().toISOString().split("T")[0];for(const i of d.data.deliveries.filter(n=>n.related_po===t&&v(n.status)==="pending"))i.status="cancelled",i.updated_at=new Date().toISOString(),await D(i);await C(e),R(),(s=bootstrap.Modal.getInstance(document.getElementById("poModal")))==null||s.hide(),h("purchase-orders"),p("PO closed with partial fulfillment","success")}}function ae(t){const e=d.data.deliveries.find(i=>i.id===t);if(!e)return 0;let a=0;e.lines.forEach((i,n)=>{const o=document.getElementById(`receiveQty_${t}_${n}`),l=parseInt(o==null?void 0:o.value)||0;a+=l*(i.unit_price_ht||0);const c=document.getElementById(`lineAmount_${t}_${n}`);c&&(c.textContent=m(l*(i.unit_price_ht||0)))});const s=document.getElementById(`deliveryPreviewTotal_${t}`);return s&&(s.textContent=m(a)),a}async function K(){try{const t=await de();d.data.products=t.products,d.data.purchaseOrders=t.purchaseOrders,d.data.deliveries=t.deliveries,d.data.payments=t.payments,d.data.documents=t.documents,d.data.categories=t.categories,d.data.settings=t.settings,d.data.settings.currency==="MAD"&&(d.data.settings.currency="TND",await L(d.data.settings)),d.theme=t.settings.theme||"light",ze(),R()}catch(t){console.error("Error loading data:",t),p("Error loading data. Please refresh the page.","danger")}}function ve(){document.documentElement.setAttribute("data-theme",d.theme),fe()}async function Qe(){d.theme=d.theme==="light"?"dark":"light",document.documentElement.setAttribute("data-theme",d.theme),T()&&(d.data.settings.theme=d.theme,await L(d.data.settings)),fe()}function fe(){const t=document.getElementById("themeIcon")||document.querySelector("#themeToggle i");t&&(t.className=d.theme==="light"?"fa-solid fa-moon":"fa-solid fa-sun")}function Je(){window.addEventListener("hashchange",()=>{w(window.location.hash.slice(1)||"dashboard")})}function w(t){ue(t)||(p("You do not have access to this page.","warning"),t="dashboard"),d.currentPage=t,window.location.hash=t,document.querySelectorAll(".nav-link").forEach(e=>{e.classList.toggle("active",e.dataset.page===t)}),me(t),h(t)}function Ke(){var a,s,i,n,o;(a=document.getElementById("themeToggle"))==null||a.addEventListener("click",Qe);const t=document.getElementById("sidebar"),e=document.getElementById("sidebarOverlay");(s=document.getElementById("sidebarToggle"))==null||s.addEventListener("click",()=>{t==null||t.classList.add("mobile-open"),e==null||e.classList.add("show")}),(i=document.getElementById("sidebarClose"))==null||i.addEventListener("click",j),e==null||e.addEventListener("click",j),(n=document.getElementById("notificationBtn"))==null||n.addEventListener("click",l=>{var c;l.stopPropagation(),(c=document.getElementById("notifDropdown"))==null||c.classList.toggle("show")}),document.addEventListener("click",l=>{var c;!l.target.closest("#notificationBtn")&&!l.target.closest("#notifDropdown")&&((c=document.getElementById("notifDropdown"))==null||c.classList.remove("show"))}),(o=document.getElementById("refreshData"))==null||o.addEventListener("click",async()=>{p("Refreshing data...","info"),await K(),h(d.currentPage),p("Data refreshed successfully","success")}),document.querySelectorAll(".nav-link").forEach(l=>{l.addEventListener("click",c=>{c.preventDefault();const r=l.dataset.page;r&&(w(r),j())})})}function j(){var t,e;(t=document.getElementById("sidebar"))==null||t.classList.remove("mobile-open","active"),(e=document.getElementById("sidebarOverlay"))==null||e.classList.remove("show")}function Ze(){const t=document.getElementById("globalSearch"),e=document.getElementById("searchResults");!t||!e||(t.addEventListener("input",a=>{const s=a.target.value.toLowerCase().trim();if(s.length<2){e.classList.remove("active","show");return}const i=[];d.data.products.forEach(n=>{(n.name.toLowerCase().includes(s)||n.reference.toLowerCase().includes(s))&&i.push({type:"product",icon:"fa-box",name:n.name,detail:n.reference,id:n.id})}),d.data.purchaseOrders.forEach(n=>{(n.po_number.toLowerCase().includes(s)||n.status.includes(s))&&i.push({type:"po",icon:"fa-file-invoice",name:n.po_number,detail:n.status,id:n.id})}),d.data.documents.forEach(n=>{n.name.toLowerCase().includes(s)&&i.push({type:"document",icon:"fa-file",name:n.name,detail:n.category,id:n.id})}),i.length>0?(e.innerHTML=i.slice(0,8).map(n=>`
        <div class="search-result-item" data-type="${n.type}" data-id="${n.id}">
          <i class="fas ${n.icon}"></i>
          <div>
            <p class="mb-0">${n.name}</p>
            <small>${n.detail}</small>
          </div>
        </div>
      `).join(""),e.classList.add("active","show"),e.querySelectorAll(".search-result-item").forEach(n=>{n.addEventListener("click",()=>{e.classList.remove("active","show"),t.value="",n.dataset.type==="product"?(w("products"),setTimeout(()=>M(n.dataset.id),100)):n.dataset.type==="po"&&(w("purchase-orders"),setTimeout(()=>be(n.dataset.id),100))})})):(e.innerHTML='<div class="p-3 text-center text-muted">No results found</div>',e.classList.add("active","show"))}),document.addEventListener("click",a=>{a.target.closest(".search-container")||e.classList.remove("active","show")}))}function Xe(){const t=document.getElementById("lastUpdate");t&&(t.textContent=new Date().toLocaleString("en-US",{day:"numeric",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}))}function h(t){const e=document.getElementById("mainContent");if(e)switch(t){case"dashboard":se(e);break;case"products":st(e);break;case"purchase-orders":rt(e);break;case"deliveries":ht(e);break;case"payments":_t(e);break;case"documents":Et(e);break;case"settings":Ct(e);break;default:se(e)}}function se(t){const e=et();t.innerHTML=`
    ${k()}
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
          <h3>${e.totalPOs}</h3>
          <p>Total Purchase Orders</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon success">
          <i class="fas fa-coins"></i>
        </div>
        <div class="kpi-content">
          <h3>${m(e.totalHT)}</h3>
          <p>Total Amount HT</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon info">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="kpi-content">
          <h3>${m(e.totalPaid)}</h3>
          <p>Total Paid</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon danger">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="kpi-content">
          <h3>${m(e.remainingBalance)}</h3>
          <p>Remaining Balance</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon primary">
          <i class="fas fa-truck-loading"></i>
        </div>
        <div class="kpi-content">
          <h3>${e.pendingDeliveries}</h3>
          <p>Pending Deliveries</p>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-icon success">
          <i class="fas fa-box"></i>
        </div>
        <div class="kpi-content">
          <h3>${e.deliveredOrders}</h3>
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
        ${e.orderStatusItems.map(a=>`
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
                    <span>${e.paymentProgress}%</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar bg-success" style="width: ${e.paymentProgress}%"></div>
                  </div>
                </div>
                <div class="row text-center mt-4">
                  <div class="col-4">
                    <h4 class="text-success">${m(e.totalPaid)}</h4>
                    <small class="text-muted">Paid</small>
                  </div>
                  <div class="col-4">
                    <h4 class="text-warning">${m(e.partialPayments)}</h4>
                    <small class="text-muted">Partial</small>
                  </div>
                  <div class="col-4">
                    <h4 class="text-danger">${m(e.remainingBalance)}</h4>
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
              ${at()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,setTimeout(()=>{tt(e)},100)}function et(){const t=d.data.purchaseOrders.filter(r=>r.status!=="cancelled"),e=t.reduce((r,u)=>r+(u.total_ht||0),0),a=d.data.deliveries.filter(r=>["partial","delivered"].includes(v(r.status))),s=d.data.deliveries.filter(r=>v(r.status)==="pending"),i=a.reduce((r,u)=>r+P(u),0),n=d.data.payments.reduce((r,u)=>r+(u.amount_paid||0),0),o=t.reduce((r,u)=>{const f=u.status||"Unknown";return r[f]=(r[f]||0)+1,r},{}),c=["Draft","Pending","Approved","In Production","Completed","Cancelled"].map(r=>({label:r,count:o[r]||0,colorClass:r==="Draft"?"status-secondary":r==="Pending"?"status-warning":r==="Approved"?"status-info":r==="In Production"?"status-primary":r==="Completed"?"status-success":r==="Cancelled"?"status-danger":"status-secondary"}));return{totalPOs:t.length,totalHT:e,totalPaid:n,remainingBalance:Math.max(0,i-n),pendingDeliveries:s.length,deliveredOrders:a.length,paymentProgress:i>0?Math.round(n/i*100):0,partialPayments:0,orderStatusItems:c}}function tt(t){const e=document.getElementById("monthlyPurchasesChart");if(e){d.charts.monthly&&d.charts.monthly.destroy();const i=6,n=[],o=new Map,l=[],c=new Date;for(let r=i-1;r>=0;r--){const u=new Date(c.getFullYear(),c.getMonth()-r,1),f=`${u.getFullYear()}-${u.getMonth()}`;n.push(u.toLocaleString("en-US",{month:"short"})),o.set(f,l.length),l.push(0)}d.data.purchaseOrders.filter(r=>r.status!=="cancelled").forEach(r=>{const u=new Date(r.created_at||r.date||r.order_date);if(isNaN(u))return;const f=`${u.getFullYear()}-${u.getMonth()}`,B=o.get(f);typeof B=="number"&&(l[B]+=r.total_ht||0)}),d.charts.monthly=new Chart(e,{type:"bar",data:{labels:n,datasets:[{label:`Purchases (${d.data.settings.currency||"TND"})`,data:l,backgroundColor:"rgba(37, 99, 235, 0.8)",borderRadius:6}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1},tooltip:{callbacks:{label:r=>`${d.data.settings.currency||"TND"} ${r.parsed.y.toLocaleString()}`}}},scales:{y:{beginAtZero:!0,grid:{color:"rgba(0,0,0,0.05)"},ticks:{callback:r=>`${d.data.settings.currency||"TND"} ${r.toLocaleString()}`}},x:{grid:{display:!1}}}}})}const a=document.getElementById("deliveryStatusChart");a&&(d.charts.delivery&&d.charts.delivery.destroy(),d.charts.delivery=new Chart(a,{type:"doughnut",data:{labels:["Delivered","Partial","Pending","Cancelled"],datasets:[{data:[d.data.deliveries.filter(i=>v(i.status)==="delivered").length,d.data.deliveries.filter(i=>v(i.status)==="partial").length,d.data.deliveries.filter(i=>v(i.status)==="pending").length,d.data.deliveries.filter(i=>v(i.status)==="cancelled").length],backgroundColor:["#10b981","#8B5CF6","#f59e0b","#94a3b8"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{position:"bottom"}}}}));const s=document.getElementById("paymentProgressChart");s&&(d.charts.payment&&d.charts.payment.destroy(),d.charts.payment=new Chart(s,{type:"doughnut",data:{labels:["Paid","Pending"],datasets:[{data:[t.totalPaid,t.remainingBalance],backgroundColor:["#10b981","#ef4444"]}]},options:{responsive:!0,maintainAspectRatio:!1,plugins:{legend:{display:!1}},cutout:"70%"}}))}function at(){const t=[];return d.data.purchaseOrders.slice(0,3).forEach(e=>{t.push({date:e.created_at,action:"Purchase Order Created",reference:e.po_number,status:e.status})}),d.data.deliveries.slice(0,2).forEach(e=>{t.push({date:e.updated_at,action:"Delivery "+(e.status==="delivered"?"Completed":"Updated"),reference:e.delivery_number,status:e.status==="delivered"?"completed":"in-production"})}),t.sort((e,a)=>new Date(a.date)-new Date(e.date)),t.slice(0,5).map(e=>`
    <tr>
      <td>${b(e.date)}</td>
      <td>${e.action}</td>
      <td><a href="#purchase-orders" class="text-primary" onclick="navigateTo('purchase-orders'); return false;">${e.reference}</a></td>
      <td><span class="status-badge ${e.status}">${y(e.status)}</span></td>
    </tr>
  `).join("")}function st(t){const e=d.data.products;t.innerHTML=`
    <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h1 class="page-title">Product Catalog</h1>
        <p class="page-subtitle">${e.length} products available</p>
      </div>
      <div>
        ${g()?`<button class="btn btn-primary" onclick="showProductModal()">
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
      ${e.map(a=>ge(a)).join("")}
    </div>
  `,window.showProductModal=M,window.filterProducts=it}function ge(t){return`
    <div class="product-card" data-category="${t.category}" data-id="${t.id}">
      <div class="product-image">
        ${t.product_image?`<img src="${t.product_image}" alt="${t.name}" loading="lazy">`:'<div class="product-image-placeholder"><i class="fas fa-image"></i></div>'}
      </div>
      <div class="product-info">
        <div class="product-category">${t.category}</div>
        <h3 class="product-name">${t.name}</h3>
        <div class="product-reference">${t.reference}</div>
        <div class="product-price">${m(t.price_ht)} HT</div>
        ${t.surface_mm2?`<div class="product-reference small">${N(t.surface_mm2)}</div>`:""}
      </div>
      <div class="product-actions d-flex gap-2 px-3 pb-3">
        <button class="btn btn-sm btn-outline-primary flex-grow-1" onclick="showProductModal('${t.id}')">
          <i class="fas fa-eye me-1"></i>View
        </button>
      </div>
    </div>
  `}function it(){var i,n;const t=((i=document.getElementById("categoryFilter"))==null?void 0:i.value)||"",e=((n=document.getElementById("productSearch"))==null?void 0:n.value.toLowerCase())||"";let a=d.data.products;t&&(a=a.filter(o=>o.category===t)),e&&(a=a.filter(o=>o.name.toLowerCase().includes(e)||o.reference.toLowerCase().includes(e)));const s=document.getElementById("productsGrid");s&&(s.innerHTML=a.map(o=>ge(o)).join(""))}function M(t=null){var o;if(!t&&!g()){p("You have read-only access.","warning");return}const e=t?d.data.products.find(l=>l.id===t):null,a=!!e,s=`
    <div class="modal fade" id="productModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${a?e.name:"New Product"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${a?`
              <div class="row g-4 mb-4">
                ${e.product_image?`
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Product Image</label>
                    <img src="${e.product_image}" alt="${e.name}" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                `:""}
                ${e.delivery_image?`
                  <div class="col-md-6">
                    <label class="form-label fw-bold">Delivery Image</label>
                    <img src="${e.delivery_image}" alt="Delivery format" class="img-fluid rounded" style="max-height: 200px;">
                  </div>
                `:""}
              </div>

              <div class="mb-4">
                <h6>Description</h6>
                <p class="text-secondary">${e.description}</p>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-md-4"><strong>Reference:</strong> ${e.reference}</div>
                <div class="col-md-4"><strong>Unit:</strong> ${e.unit}</div>
                <div class="col-md-4"><strong>Category:</strong> ${e.category}</div>
                <div class="col-md-4"><strong>Price HT:</strong> ${m(e.price_ht)}</div>
                <div class="col-md-4"><strong>Print Support:</strong> ${e.print_support||"-"}</div>
                <div class="col-md-4"><strong>Print Method:</strong> ${e.print_method||"-"}</div>
                <div class="col-md-4"><strong>Format:</strong> ${lt(e.format)}</div>
                <div class="col-md-4"><strong>Dimensions:</strong> ${dt(e)}</div>
                <div class="col-md-4"><strong>Surface:</strong> ${N(e.surface_mm2)}</div>
              </div>

              ${e.source_file?`
                <h6 class="mb-2">Source Print File</h6>
                <div class="d-flex align-items-center gap-2 mb-4">
                  <span class="badge bg-primary-light text-primary">
                    <i class="fas fa-file me-1"></i>${e.source_file_name||"Source file"}
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
                    <input type="number" step="0.01" class="form-control" id="productPrice" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Print Support</label>
                    <select class="form-select" id="productPrintSupport">
                      <option value="">Select support</option>
                      <option value="indoor">Indoor</option>
                      <option value="outdoor">Outdoor</option>
                      <option value="indoor-outdoor">Indoor / Outdoor</option>
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
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Format</label>
                    <select class="form-select" id="productFormat" onchange="updateProductSurfacePreview()">
                      <option value="">Select format</option>
                      <option value="circle">Circle</option>
                      <option value="square">Square (Carré)</option>
                      <option value="rectangle">Rectangle</option>
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
  `;(o=document.getElementById("productModal"))==null||o.remove(),document.body.insertAdjacentHTML("beforeend",s),new bootstrap.Modal(document.getElementById("productModal")).show();const n=document.getElementById("downloadSourceFileBtn");n&&(e!=null&&e.source_file)&&n.addEventListener("click",()=>F(e.source_file,e.source_file_name||"source-file")),document.getElementById("productModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.saveProduct=ot,window.updateProductSurfacePreview=nt,window.previewDataUrl=X}function nt(){var o,l,c;const t=(o=document.getElementById("productFormat"))==null?void 0:o.value,e=(l=document.getElementById("productDimWidth"))==null?void 0:l.value,a=(c=document.getElementById("productDimHeight"))==null?void 0:c.value,s=document.getElementById("dimHeightGroup"),i=document.getElementById("dimWidthLabel"),n=document.getElementById("productSurface");if(s&&(s.style.display=t==="rectangle"?"":"none"),i&&(i.textContent=t==="circle"?"Diameter (mm)":t==="square"?"Side (mm)":"Width (mm)"),n){const r=Pe(t,e,a);n.value=r>0?N(r):""}}async function ot(){if(!g())return;const t=document.getElementById("productFormat").value,e=parseFloat(document.getElementById("productDimWidth").value)||0,a=parseFloat(document.getElementById("productDimHeight").value)||0,s=Pe(t,e,a),i=document.getElementById("productImageFile").files[0],n=document.getElementById("deliveryImageFile").files[0],o=document.getElementById("sourceFile").files[0],l={id:E("PRD","product"),reference:document.getElementById("productRef").value,name:document.getElementById("productName").value,category:document.getElementById("productCategory").value,unit:document.getElementById("productUnit").value,description:document.getElementById("productDesc").value,price_ht:parseFloat(document.getElementById("productPrice").value),print_support:document.getElementById("productPrintSupport").value,print_method:document.getElementById("productPrintMethod").value,format:t,dimension_width:e,dimension_height:t==="rectangle"?a:null,surface_mm2:s,product_image:i?await H(i):null,delivery_image:n?await H(n):null,source_file:o?await H(o):null,source_file_name:o?o.name:null,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};if(await Be(l),d.data.products.push(l),o){const c={id:E("DOC","document"),name:o.name,type:o.name.split(".").pop().toLowerCase(),category:"artwork-files",size:Ft(l.source_file),data:l.source_file,url:l.source_file,related_product:l.id,created_at:new Date().toISOString().split("T")[0]};await Le(c),d.data.documents.push(c)}bootstrap.Modal.getInstance(document.getElementById("productModal")).hide(),h("products"),p("Product created successfully","success")}function lt(t){return{circle:"Circle",square:"Square (Carré)",rectangle:"Rectangle"}[t]||"-"}function dt(t){return!t.format||!t.dimension_width?"-":t.format==="rectangle"?`${t.dimension_width} × ${t.dimension_height||0} mm`:t.format==="circle"?`Ø ${t.dimension_width} mm`:`${t.dimension_width} mm`}function rt(t){const e=d.data.purchaseOrders;t.innerHTML=`
    <div class="page-header d-flex justify-content-between align-items-center flex-wrap gap-3">
      <div>
        <h1 class="page-title">Purchase Orders</h1>
        <p class="page-subtitle">${e.length} orders tracked</p>
      </div>
      <div>
        ${g()?`<button class="btn btn-primary" onclick="showPOModal()">
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
          ${["draft","pending","approved","in-production","completed","cancelled"].map(a=>`<option value="${a}">${y(a)}</option>`).join("")}
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
              ${e.map(a=>ye(a)).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <div class="pagination-info">Showing ${e.length} entries</div>
      <nav>
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
          <li class="page-item active"><a class="page-link" href="#">1</a></li>
          <li class="page-item disabled"><a class="page-link" href="#">Next</a></li>
        </ul>
      </nav>
    </div>
  `,window.showPOModal=be,window.filterPOs=ct,window.exportPOs=bt}function ye(t){return`
    <tr data-status="${t.status}" data-date="${t.date}">
      <td>
        <a href="#" class="text-primary fw-medium" onclick="showPOModal('${t.id}'); return false;">${t.po_number}</a>
      </td>
      <td>${b(t.date)}</td>
      <td><span class="status-badge ${t.status}">${y(t.status)}</span></td>
      <td>${m(t.total_ht)}</td>
      <td>${t.actual_delivery_date?b(t.actual_delivery_date):t.expected_delivery_date?b(t.expected_delivery_date):"-"}</td>
      <td>
        <button class="action-btn" onclick="showPOModal('${t.id}')" title="View">
          <i class="fas fa-eye"></i>
        </button>
        <button class="action-btn" onclick="printPO('${t.id}')" title="Print">
          <i class="fas fa-print"></i>
        </button>
      </td>
    </tr>
  `}function ct(){var i,n;const t=((i=document.getElementById("poStatusFilter"))==null?void 0:i.value)||"",e=((n=document.getElementById("poDateFilter"))==null?void 0:n.value)||"";let a=d.data.purchaseOrders;t&&(a=a.filter(o=>o.status===t)),e&&(a=a.filter(o=>o.date.startsWith(e)));const s=document.getElementById("poTableBody");s&&(s.innerHTML=a.map(o=>ye(o)).join(""))}function be(t=null){var o;if(!t&&!g()){p("You have read-only access.","warning");return}const e=t?d.data.purchaseOrders.find(l=>l.id===t):null;if(!e&&t)return;const a=e?d.data.deliveries.filter(l=>l.related_po===e.id):[],s=e?d.data.payments.filter(l=>l.related_po===e.id):[],i=`
    <div class="modal fade" id="poModal" tabindex="-1">
      <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${e?e.po_number:"New Purchase Order"}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            ${e?`
              <!-- Status Timeline -->
              <div class="mb-4">
                <h6 class="mb-3">Order Status</h6>
                <div class="d-flex justify-content-between">
                  ${Nt(e.status)}
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
                          <div class="fw-medium">${e.po_number}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Order Date</small>
                          <div class="fw-medium">${b(e.date)}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Expected Delivery</small>
                          <div class="fw-medium">${e.expected_delivery_date?b(e.expected_delivery_date):"-"}</div>
                        </div>
                        <div class="col-6">
                          <small class="text-muted">Supplier Ref</small>
                          <div class="fw-medium">${e.supplier_reference||"-"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="card">
                    <div class="card-header"><h6 class="mb-0">Financial Summary</h6></div>
                    <div class="card-body">
                      ${(()=>{const l=$(e);return`
                          <div class="d-flex justify-content-between mb-2">
                            <span>Ordered HT</span>
                            <span class="fw-medium">${m(l.orderedAmount)}</span>
                          </div>
                          <div class="d-flex justify-content-between mb-3">
                            <span>Received HT</span>
                            <span class="fw-medium text-success">${m(l.receivedAmount)}</span>
                          </div>
                          ${Q(l.pct,"PO Fulfillment")}
                          <div class="small text-muted mt-2">${l.totalReceived} / ${l.totalOrdered} pcs received</div>
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
                      ${$(e).lines.map(l=>`
                        <tr>
                          <td>
                            <a href="#" class="text-primary fw-medium" onclick="navigateToProductsAndShow('${l.product_id}'); return false;">
                              ${l.product_name}
                            </a>
                          </td>
                          <td>${l.ordered}</td>
                          <td class="text-success fw-medium">${l.received}</td>
                          <td>${l.remaining}</td>
                          <td>${m(l.unit_price_ht)}</td>
                          <td>${m(l.ordered*l.unit_price_ht)}</td>
                        </tr>
                      `).join("")}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="5" class="text-end fw-bold">Total HT</td>
                        <td class="fw-bold">${m(e.total_ht)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              ${e.notes?`
                <div class="mb-4">
                  <h6 class="mb-2">Notes</h6>
                  <p class="text-secondary">${e.notes}</p>
                </div>
              `:""}

              ${a.length>0?`
                <div class="mb-4">
                  <h6 class="mb-3">Deliveries</h6>
                  ${a.map(l=>`
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <a href="#" class="fw-medium text-primary" onclick="navigateToDeliveriesAndShow('${l.id}'); return false;">${l.delivery_number}</a>
                            <span class="status-badge ${v(l.status)} ms-2">${y(v(l.status))}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-medium">${m(P(l))}</div>
                            <small class="text-muted">${l.delivery_date?b(l.delivery_date):"Pending"}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join("")}
                </div>
              `:""}

              ${s.length>0?`
                <div class="mb-4">
                  <h6 class="mb-3">Payments</h6>
                  ${s.map(l=>`
                    <div class="card mb-2">
                      <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-center">
                          <div>
                            <span class="fw-medium">${l.payment_reference}</span>
                            <span class="status-badge ${l.status} ms-2">${y(l.status)}</span>
                          </div>
                          <div class="text-end">
                            <div class="fw-bold">${m(l.amount_paid||0)} / ${m(l.amount)}</div>
                            <small class="text-muted">${l.payment_date?b(l.payment_date):"Pending"}</small>
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
                    <input type="text" class="form-control" id="poNumber" value="${Me()}" readonly required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Order Date *</label>
                    <input type="date" class="form-control" id="poDate" value="${new Date().toISOString().split("T")[0]}" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Supplier Reference</label>
                    <input type="text" class="form-control" id="poRef">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Expected Delivery Date</label>
                    <input type="date" class="form-control" id="poDeliveryDate">
                  </div>
                  <div class="col-12">
                    <label class="form-label">Notes</label>
                    <textarea class="form-control" id="poNotes" rows="2"></textarea>
                  </div>
                </div>

                <h6 class="mt-4 mb-3">Order Lines</h6>
                <div id="poLines">
                  ${he(null,0)}
                </div>
                <button type="button" class="btn btn-outline-primary btn-sm mt-2" onclick="addPOLine()">
                  <i class="fas fa-plus me-1"></i>Add Line
                </button>
              </form>
            `}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
            ${e?`
              <button type="button" class="btn btn-outline-primary" onclick="printPO('${e.id}')">
                <i class="fas fa-print me-1"></i>Print PO
              </button>
              ${g()?`
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <select class="form-select form-select-sm" id="poStatusSelect" style="width: auto;">
                    ${["draft","pending","approved","in-production","completed","completed-partial","cancelled"].map(l=>`<option value="${l}" ${e.status===l?"selected":""}>${y(l)}</option>`).join("")}
                  </select>
                  <button type="button" class="btn btn-primary" onclick="updatePOStatus('${e.id}')">
                    <i class="fas fa-save me-1"></i>Update Status
                  </button>
                  ${$(e).hasPartial&&!["completed","completed-partial","cancelled"].includes(e.status)?`
                      <button type="button" class="btn btn-outline-warning" onclick="closePOPartial('${e.id}')">
                        <i class="fas fa-flag-checkered me-1"></i>Close PO (Partial)
                      </button>
                    `:""}
                </div>
              `:""}
            `:`
              <button type="button" class="btn btn-primary" onclick="savePO()">
                <i class="fas fa-save me-1"></i>Create PO
              </button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;(o=document.getElementById("poModal"))==null||o.remove(),document.body.insertAdjacentHTML("beforeend",i),e||(G=1),new bootstrap.Modal(document.getElementById("poModal")).show(),document.getElementById("poModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.savePO=ft,window.addPOLine=ut,window.updatePOLineTotal=mt,window.viewPOLineProduct=pt,window.removePOLine=vt,window.printPO=gt,window.updatePOStatus=yt,window.navigateToProductsAndShow=l=>{bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),w("products"),setTimeout(()=>M(l),200)},window.closePOPartial=J,window.navigateToDeliveriesAndShow=l=>{bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),w("deliveries"),setTimeout(()=>A(l),200)}}function he(t,e){return`
    <div class="row g-2 mb-2 align-items-end po-line" data-index="${e}">
      <div class="col-md-4">
        <label class="form-label small mb-1">Product</label>
        <div class="input-group">
          <select class="form-select" id="poProduct${e}" onchange="updatePOLineTotal(${e})" required>
            <option value="">Select Product</option>
            ${d.data.products.map(a=>`<option value="${a.id}" data-price="${a.price_ht}" data-surface="${a.surface_mm2||0}">${a.name} (${a.reference})</option>`).join("")}
          </select>
          <button type="button" class="btn btn-outline-secondary" id="poViewProduct${e}" onclick="viewPOLineProduct(${e})" title="View product" disabled>
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">Qty</label>
        <input type="number" class="form-control" id="poQty${e}" placeholder="Qty" min="1" value="1" oninput="updatePOLineTotal(${e})" required>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Surface</label>
        <input type="text" class="form-control" id="poSurface${e}" placeholder="mm²" readonly>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Unit Price</label>
        <input type="number" step="0.01" class="form-control" id="poUnitPrice${e}" placeholder="Price" readonly>
      </div>
      <div class="col-md-2">
        <label class="form-label small mb-1">Total HT</label>
        <input type="number" step="0.01" class="form-control" id="poLineTotal${e}" placeholder="Total" readonly>
      </div>
      <div class="col-md-1">
        <label class="form-label small mb-1">&nbsp;</label>
        <button type="button" class="btn btn-outline-danger btn-sm w-100" onclick="removePOLine(${e})">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `}let G=1;function ut(){document.getElementById("poLines").insertAdjacentHTML("beforeend",he(null,G)),G++}function mt(t){const e=document.getElementById(`poProduct${t}`),a=document.getElementById(`poQty${t}`),s=document.getElementById(`poUnitPrice${t}`),i=document.getElementById(`poSurface${t}`),n=document.getElementById(`poLineTotal${t}`),o=document.getElementById(`poViewProduct${t}`);if(e.value){const l=e.options[e.selectedIndex],c=parseFloat(l.dataset.price)||0,r=parseFloat(l.dataset.surface)||0,u=parseInt(a.value)||0;s.value=c.toFixed(2),i.value=r>0?N(r):"-",n.value=(c*u).toFixed(2),o&&(o.disabled=!1)}else s.value="",i.value="",n.value="",o&&(o.disabled=!0)}function pt(t){var a;const e=(a=document.getElementById(`poProduct${t}`))==null?void 0:a.value;e&&navigateToProductsAndShow(e)}function vt(t){const e=document.querySelector(`.po-line[data-index="${t}"]`);e&&e.remove()}async function ft(){if(!g())return;const t=[];if(document.querySelectorAll(".po-line").forEach(i=>{var r;const n=i.dataset.index,o=document.getElementById(`poProduct${n}`),l=document.getElementById(`poQty${n}`),c=document.getElementById(`poUnitPrice${n}`);if(o.value&&l.value){const u=d.data.products.find(_e=>_e.id===o.value),f=document.getElementById(`poSurface${n}`),B=u.surface_mm2||parseFloat(((r=f==null?void 0:f.dataset)==null?void 0:r.raw)||0)||0;t.push({product_id:o.value,product_name:u.name,quantity:parseInt(l.value),unit_price_ht:parseFloat(c.value),surface_mm2:B,line_total_ht:parseFloat(c.value)*parseInt(l.value),received_qty:0})}}),t.length===0){p("Please add at least one product line","warning");return}const a=t.reduce((i,n)=>i+n.line_total_ht,0),s={id:E("PO","purchaseOrder"),po_number:Ae(),date:document.getElementById("poDate").value,status:"draft",supplier_reference:document.getElementById("poRef").value,expected_delivery_date:document.getElementById("poDeliveryDate").value,actual_delivery_date:null,lines:t,total_ht:a,total_ttc:a,notes:document.getElementById("poNotes").value,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};await C(s),d.data.purchaseOrders.push(s),bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),h("purchase-orders"),p("Purchase Order created successfully","success")}function gt(t){const e=d.data.purchaseOrders.find(s=>s.id===t);if(!e)return;const a=window.open("","_blank");a.document.write(`
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
          <div class="company-name">${d.data.settings.companyName}</div>
          <div>Supplier: SGS Printing Services</div>
        </div>
        <div class="po-info">
          <h1>PURCHASE ORDER</h1>
          <div><strong>${e.po_number}</strong></div>
          <div>Date: ${b(e.date)}</div>
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
              <td>${m(s.unit_price_ht)}</td>
              <td>${m(s.line_total_ht)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="totals">
        <p class="total-row">Total HT: ${m(e.total_ht)}</p>
      </div>

      ${e.notes?`<p style="margin-top: 30px;"><strong>Notes:</strong> ${e.notes}</p>`:""}
    </body>
    </html>
  `),a.document.close(),a.print()}async function yt(t){var s;if(!g())return;const e=d.data.purchaseOrders.find(i=>i.id===t);if(!e)return;const a=(s=document.getElementById("poStatusSelect"))==null?void 0:s.value;if(!a||a===e.status){p("Please select a different status","warning");return}if(a==="completed-partial"){await J(t);return}if(a==="completed"&&!$(e).isComplete){p("PO is not fully received. Use Close PO (Partial) or receive remaining qty.","warning");return}if(e.status=a,e.updated_at=new Date().toISOString(),a==="in-production"){const i=pe(e);i&&(d.data.deliveries.some(o=>o.id===i.id)||(await D(i),d.data.deliveries.push(i),p(`Delivery ${i.delivery_number} created`,"info")))}a==="completed"&&(e.actual_delivery_date=e.actual_delivery_date||new Date().toISOString().split("T")[0]),await C(e),R(),bootstrap.Modal.getInstance(document.getElementById("poModal")).hide(),h("purchase-orders"),p(`PO status updated to ${y(e.status)}`,"success")}function bt(){const t=[["PO Number","Date","Status","Amount HT","Delivery Date"].join(","),...d.data.purchaseOrders.map(e=>[e.po_number,e.date,e.status,e.total_ht,e.actual_delivery_date||e.expected_delivery_date||""].join(","))].join(`
`);jt(t,"purchase-orders.csv")}function ht(t){const e=d.data.deliveries,a=e.filter(o=>v(o.status)==="pending").length,s=e.filter(o=>v(o.status)==="partial").length,i=e.filter(o=>v(o.status)==="delivered").length,n=e.filter(o=>["partial","delivered"].includes(v(o.status))).reduce((o,l)=>o+P(l),0);t.innerHTML=`
    ${k()}
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
          <div class="kpi-value" style="font-size:18px">${m(n)}</div>
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
      <span class="ms-auto text-muted small">${e.length} deliveries</span>
    </div>

    <div class="row g-3" id="deliveriesList">
      ${e.length?e.map(o=>we(o)).join(""):`
        <div class="col-12"><div class="empty-state"><i class="fa-solid fa-truck"></i><p>No deliveries yet</p></div></div>
      `}
    </div>
  `,window.filterDeliveries=wt,window.showDeliveryModal=A}function we(t){const e=v(t.status),a=d.data.payments.find(o=>o.related_delivery===t.id),s=t.lines.reduce((o,l)=>o+(l.remaining_qty??l.ordered_qty),0),i=t.lines.reduce((o,l)=>o+(l.delivered_qty||l.receive_qty||0),0),n=s>0?Math.round(i/s*100):e!=="pending"?100:0;return`
    <div class="col-md-6 col-xl-4">
      <div class="card delivery-card h-100" data-status="${e}">
        <div class="card-header d-flex justify-content-between align-items-center py-3">
          <div>
            <h6 class="mb-0">${t.delivery_number}</h6>
            <small class="text-muted">${t.po_number}</small>
          </div>
          <span class="status-badge ${e}">${y(e)}</span>
        </div>
        <div class="card-body">
          <div class="d-flex justify-content-between mb-3">
            <div>
              <small class="text-muted d-block">Amount</small>
              <span class="fw-bold text-primary-brand">${m(P(t))}</span>
            </div>
            <div class="text-end">
              <small class="text-muted d-block">Date</small>
              <span>${t.delivery_date?b(t.delivery_date):"—"}</span>
            </div>
          </div>
          ${e==="pending"?Q(n,"Qty to receive"):`
            <div class="small text-muted">${i} pcs confirmed in this delivery</div>
          `}
          ${a?`
            <div class="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
              <small class="text-muted">Payment</small>
              <span class="status-badge ${a.status}">${m(a.amount_paid||0)} / ${m(a.amount)}</span>
            </div>
          `:""}
        </div>
        <div class="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
          <button class="btn btn-outline-primary btn-sm w-100" onclick="showDeliveryModal('${t.id}')">
            <i class="fa-solid fa-eye me-1"></i>View Details
          </button>
        </div>
      </div>
    </div>
  `}function wt(){var s;const t=((s=document.getElementById("deliveryStatusFilter"))==null?void 0:s.value)||"";let e=d.data.deliveries;t&&(e=e.filter(i=>v(i.status)===t));const a=document.getElementById("deliveriesList");a&&(a.innerHTML=e.map(i=>we(i)).join(""))}function A(t){var r;const e=d.data.deliveries.find(u=>u.id===t);if(!e)return;const a=v(e.status),s=d.data.payments.find(u=>u.related_delivery===e.id),i=g()&&a==="pending",n=d.data.purchaseOrders.find(u=>u.id===e.related_po),o=n?$(n):null,l=`
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
                  <div><span class="status-badge ${a}">${y(a)}</span></div>
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
                  <div class="fw-bold text-primary-brand" id="deliveryPreviewTotal_${e.id}">${m(P(e))}</div>
                </div>
              </div>
            </div>

            ${o?`
              <div class="card mb-4">
                <div class="card-body py-3">
                  ${Q(o.pct,"PO fulfillment")}
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
                ${m(s.amount_paid||0)} / ${m(s.amount)}
                <span class="status-badge ${s.status} ms-2">${y(s.status)}</span>
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
                    ${e.lines.map((u,f)=>`
                      <tr>
                        <td>${u.product_name}</td>
                        <td>${u.remaining_qty??u.ordered_qty}</td>
                        <td>
                          ${i?`
                            <input type="number" class="form-control form-control-sm" style="width:90px"
                              id="receiveQty_${e.id}_${f}"
                              value="${u.receive_qty??u.remaining_qty??0}"
                              min="0" max="${u.remaining_qty??u.ordered_qty}"
                              oninput="updateDeliveryPreviewAmount('${e.id}')">
                          `:u.delivered_qty||0}
                        </td>
                        <td>${m(u.unit_price_ht)}</td>
                        <td id="lineAmount_${e.id}_${f}">${m(V(u))}</td>
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
  `;(r=document.getElementById("deliveryModal"))==null||r.remove(),document.body.insertAdjacentHTML("beforeend",l),new bootstrap.Modal(document.getElementById("deliveryModal")).show(),i&&ae(e.id),document.getElementById("deliveryModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.confirmDelivery=$t,window.cancelDelivery=Pt,window.updateDeliveryPreviewAmount=ae,window.closePOPartial=J,window.navigateToProductsAndShow=u=>{var f;(f=bootstrap.Modal.getInstance(document.getElementById("deliveryModal")))==null||f.hide(),w("products"),setTimeout(()=>M(u),200)}}async function $t(t){if(!g())return;const e=d.data.deliveries.find(n=>n.id===t);if(!e||v(e.status)!=="pending")return;const a=d.data.purchaseOrders.find(n=>n.id===e.related_po);if(!a)return;let s=0;for(let n=0;n<e.lines.length;n++){const o=e.lines[n],l=document.getElementById(`receiveQty_${t}_${n}`),c=parseInt(l==null?void 0:l.value)||0,r=o.remaining_qty??o.ordered_qty;if(c<0||c>r){p(`Invalid quantity for ${o.product_name} (max ${r})`,"warning");return}o.receive_qty=c,o.delivered_qty=c,o.line_total=c*(o.unit_price_ht||0),s+=c;const u=a.lines.find(f=>f.product_id===o.product_id);u&&c>0&&(u.received_qty=(u.received_qty||0)+c)}if(s===0){p("Enter at least one received quantity","warning");return}e.amount=P(e),e.delivery_date=new Date().toISOString().split("T")[0],e.updated_at=new Date().toISOString();const i=$(a);if(e.status=i.isComplete?"delivered":"partial",await D(e),await Ye(e),i.isComplete&&(a.status="completed",a.actual_delivery_date=e.delivery_date),a.updated_at=new Date().toISOString(),await C(a),!i.isComplete&&!["completed-partial","cancelled"].includes(a.status)){const n=pe(a);n&&(await D(n),d.data.deliveries.push(n))}R(),bootstrap.Modal.getInstance(document.getElementById("deliveryModal")).hide(),h("deliveries"),p(`Received ${s} pcs — payment created for ${m(e.amount)}`,"success")}async function Pt(t){if(!g()||!confirm("Cancel this delivery?"))return;const e=d.data.deliveries.find(a=>a.id===t);e&&(e.status="cancelled",e.updated_at=new Date().toISOString(),await D(e),bootstrap.Modal.getInstance(document.getElementById("deliveryModal")).hide(),h("deliveries"),p("Delivery cancelled","info"))}function _t(t){const e=d.data.payments,a=St(),s=a.totalInvoiced>0?Math.round(a.totalPaid/a.totalInvoiced*100):0;t.innerHTML=`
    ${k()}
    <div class="page-header">
      <div class="page-header-left">
        <h1 class="page-title"><i class="fa-solid fa-credit-card me-2 text-primary-brand"></i>Payments</h1>
        <p class="page-subtitle">Payments based on confirmed deliveries only</p>
      </div>
    </div>

    <div class="payment-summary mb-4">
      <div class="payment-summary-item">
        <div class="amount text-primary-brand">${m(a.totalInvoiced)}</div>
        <div class="label">To Pay (Delivered)</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-success">${m(a.totalPaid)}</div>
        <div class="label">Paid</div>
      </div>
      <div class="payment-summary-item">
        <div class="amount text-warning">${m(a.remaining)}</div>
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
            ${e.length?e.map(i=>$e(i)).join(""):`
              <tr><td colspan="7" class="text-center text-muted py-4">No payments yet</td></tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `,window.filterPayments=Dt,window.showPaymentModal=xt,window.showDeliveryModal=A}function St(){const e=d.data.deliveries.filter(s=>["partial","delivered"].includes(v(s.status))).reduce((s,i)=>s+P(i),0),a=d.data.payments.reduce((s,i)=>s+(i.amount_paid||0),0);return{totalInvoiced:e,totalPaid:a,remaining:Math.max(0,e-a)}}function $e(t){return Y(t),`
    <tr data-status="${t.status}" data-method="${t.payment_method}">
      <td class="fw-medium">${t.payment_reference}</td>
      <td>${t.delivery_number?`<a href="#" class="po-link" onclick="navigateTo('deliveries'); setTimeout(() => showDeliveryModal('${t.related_delivery}'), 200); return false;">${t.delivery_number}</a>`:"—"}</td>
      <td>${t.po_number}</td>
      <td>${m(t.amount)}</td>
      <td class="text-success fw-medium">${m(t.amount_paid||0)}</td>
      <td><span class="status-badge ${t.status}">${y(t.status)}</span></td>
      <td>
        ${g()&&t.status!=="paid"?`
          <button class="btn-action btn-action-view" title="Record payment" onclick="showPaymentModal('${t.id}')">
            <i class="fas fa-wallet"></i>
          </button>
        `:'<span class="text-muted small">—</span>'}
      </td>
    </tr>
  `}function xt(t){var i;if(!g())return;const e=d.data.payments.find(n=>n.id===t);if(!e||e.status==="paid")return;const a=Y(e),s=`
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
              <div class="col-4"><small class="text-muted d-block">Due</small><strong>${m(e.amount)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Paid</small><strong class="text-success">${m(e.amount_paid||0)}</strong></div>
              <div class="col-4"><small class="text-muted d-block">Remaining</small><strong class="text-warning">${m(a)}</strong></div>
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
  `;(i=document.getElementById("paymentModal"))==null||i.remove(),document.body.insertAdjacentHTML("beforeend",s),new bootstrap.Modal(document.getElementById("paymentModal")).show(),document.getElementById("paymentModal").addEventListener("hidden.bs.modal",function(){this.remove()}),window.recordPartialPayment=It}async function It(t){var i,n;if(!g())return;const e=d.data.payments.find(o=>o.id===t);if(!e)return;const a=Y(e),s=parseFloat((i=document.getElementById("payAmountInput"))==null?void 0:i.value)||0;if(s<=0||s>a+.001){p(`Enter an amount between 0.01 and ${m(a)}`,"warning");return}e.amount_paid=(e.amount_paid||0)+s,e.payment_date=new Date().toISOString().split("T")[0],e.updated_at=new Date().toISOString(),e.amount_paid>=e.amount-.001?(e.amount_paid=e.amount,e.status="paid"):e.status="partial",await re(e),(n=bootstrap.Modal.getInstance(document.getElementById("paymentModal")))==null||n.hide(),h("payments"),p(`Payment recorded: ${m(s)}`,"success")}function Dt(){var i,n;const t=((i=document.getElementById("paymentStatusFilter"))==null?void 0:i.value)||"",e=((n=document.getElementById("paymentMethodFilter"))==null?void 0:n.value)||"";let a=d.data.payments;t&&(a=a.filter(o=>o.status===t)),e&&(a=a.filter(o=>o.payment_method===e));const s=document.getElementById("paymentsTableBody");s&&(s.innerHTML=a.map(o=>$e(o)).join(""))}function Et(t){const e=d.data.documents;t.innerHTML=`
    ${k()}
    <div class="page-header">
      <h1 class="page-title">Document Center</h1>
      <p class="page-subtitle">${e.length} documents available</p>
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
      ${e.map(a=>Z(a)).join("")}
    </div>
  `,window.filterDocumentsByCategory=Bt,window.searchDocuments=Lt,window.previewDocument=Ot,window.downloadDocument=kt}function Ot(t){const e=d.data.documents.find(a=>a.id===t);e&&X(e.data||e.url,e.name)}function kt(t){const e=d.data.documents.find(a=>a.id===t);e&&F(e.data||e.url,e.name)}function Z(t){const e={pdf:"fa-file-pdf text-danger",ai:"fa-file-image text-warning",eps:"fa-file-image text-info",psd:"fa-file-image text-primary",svg:"fa-file-image text-success"},a=t.category==="artwork-files"||t.category==="technical-files",s=a?"":`
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
            <span class="badge bg-primary-light text-primary">${qt(t.category)}</span>
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
  `}function Bt(t){const e=document.getElementById("documentsGrid");document.querySelectorAll(".filters-bar .btn").forEach(i=>{i.classList.remove("btn-primary"),i.classList.add("btn-outline-secondary")});let s=d.data.documents;t&&(s=s.filter(i=>i.category===t)),e.innerHTML=s.map(i=>Z(i)).join("")}function Lt(){var s;const t=((s=document.getElementById("docSearch"))==null?void 0:s.value.toLowerCase())||"";let e=d.data.documents;t&&(e=e.filter(i=>i.name.toLowerCase().includes(t)));const a=document.getElementById("documentsGrid");a.innerHTML=e.map(i=>Z(i)).join("")}function Ct(t){const e=d.data.settings;t.innerHTML=`
    ${k()}
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

      <!-- Backup & Restore -->
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h6 class="mb-0"><i class="fas fa-database me-2"></i>Backup & Restore</h6>
          </div>
          <div class="card-body">
            <p class="text-muted small">Export all portal data as JSON, or import a previous backup.</p>
            <div class="d-flex flex-wrap gap-2">
              <button type="button" class="btn btn-outline-primary" onclick="exportBackup()">
                <i class="fas fa-download me-1"></i>Export Backup
              </button>
              <label class="btn btn-outline-secondary mb-0">
                <i class="fas fa-upload me-1"></i>Import Backup
                <input type="file" accept=".json,application/json" class="d-none" id="importBackupInput" onchange="importBackup(event)">
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Reset Data -->
      <div class="col-md-6">
        <div class="card border-danger">
          <div class="card-header bg-danger-light">
            <h6 class="mb-0 text-danger"><i class="fas fa-exclamation-triangle me-2"></i>Danger Zone</h6>
          </div>
          <div class="card-body">
            <p class="text-muted small">Clear all stored data and start fresh. This action cannot be undone.</p>
            <button class="btn btn-outline-danger" onclick="resetLocalData()">
              <i class="fas fa-trash me-1"></i>Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  `,window.saveSettings=Tt,window.resetLocalData=Rt,window.exportBackup=Mt,window.importBackup=At}async function Tt(){g()&&(d.data.settings={companyName:document.getElementById("companyName").value,supplierName:document.getElementById("supplierName").value,currency:document.getElementById("currency").value,defaultVat:parseInt(document.getElementById("defaultVat").value)||20,theme:d.theme},await L(d.data.settings),p("Settings saved successfully","success"))}async function Mt(){try{const t=await Ce(),e=new Date().toISOString().split("T")[0];qe(t,`wave-vi-backup-${e}.json`),p("Backup exported successfully","success")}catch(t){console.error("Export failed:",t),p("Failed to export backup","danger")}}async function At(t){var a;const e=(a=t.target.files)==null?void 0:a[0];if(e){try{const s=await e.text();if(!confirm("Importing will replace all current data. Continue?")){t.target.value="";return}await Te(s),await K(),ve(),h(d.currentPage),p("Backup imported successfully","success")}catch(s){console.error("Import failed:",s),p("Invalid backup file","danger")}t.target.value=""}}async function Rt(){confirm("Are you sure you want to reset all stored data? This cannot be undone.")&&(await ce(),Fe(),p("Data reset. Reloading...","success"),setTimeout(()=>location.reload(),1e3))}function R(){const t=document.getElementById("notificationBadge"),e=document.getElementById("notificationsList");if(!t||!e)return;const a=[];d.data.purchaseOrders.filter(s=>s.status==="pending"||s.status==="draft").slice(0,3).forEach(s=>{a.push({icon:"fa-file-invoice",iconClass:"bg-info-soft text-info",text:`PO ${s.po_number} — ${y(s.status)}`,time:b(s.created_at)})}),d.data.deliveries.filter(s=>v(s.status)==="pending").slice(0,2).forEach(s=>{a.push({icon:"fa-truck",iconClass:"bg-warning-soft text-warning",text:`Delivery ${s.delivery_number} awaiting confirmation`,time:"Pending"})}),d.data.payments.filter(s=>s.status==="pending").slice(0,2).forEach(s=>{a.push({icon:"fa-credit-card",iconClass:"bg-success-soft text-success",text:`Payment ${s.payment_reference} — ${m(s.amount)}`,time:s.payment_date?b(s.payment_date):"Pending"})}),t.style.display=a.length>0?"":"none",a.length===0?e.innerHTML='<div class="notif-item"><div class="notif-content"><p class="text-muted mb-0">No notifications</p></div></div>':e.innerHTML=a.map(s=>`
      <div class="notif-item unread">
        <div class="notif-icon ${s.iconClass}"><i class="fa-solid ${s.icon}"></i></div>
        <div class="notif-content">
          <p>${s.text}</p>
          <span>${s.time}</span>
        </div>
      </div>
    `).join("")}function Nt(t){const e=["draft","pending","approved","in-production","completed"],a=e.indexOf(t);return e.map((s,i)=>{const n=i<=a;return`<div class="text-center" style="flex: 1;">
      <div class="status-badge ${s===t?s:n?"completed":"draft"} mb-2" style="width: 32px; height: 32px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;">
        ${n?'<i class="fas fa-check"></i>':'<i class="fas fa-circle" style="font-size: 8px;"></i>'}
      </div>
      <div><small>${y(s)}</small></div>
    </div>`}).join("")}function m(t){const a=(d.data.settings||{}).currency||"TND",s=a==="TND"?"fr-TN":a==="EUR"?"fr-FR":"en-US";return new Intl.NumberFormat(s,{style:"currency",currency:a,minimumFractionDigits:2}).format(t)}function Pe(t,e,a){const s=parseFloat(e)||0,i=parseFloat(a)||0;switch(t){case"circle":return Math.round(Math.PI*Math.pow(s/2,2)*100)/100;case"square":return Math.round(s*s*100)/100;case"rectangle":return Math.round(s*i*100)/100;default:return 0}}function N(t){return t?`${Number(t).toLocaleString("fr-FR")} mm²`:"-"}function H(t){return new Promise((e,a)=>{const s=new FileReader;s.onload=()=>e(s.result),s.onerror=a,s.readAsDataURL(t)})}function Ft(t){if(!t)return"-";const e=Math.round((t.length-5)*.75);return e<1024?`${e} B`:e<1048576?`${(e/1024).toFixed(1)} KB`:`${(e/1048576).toFixed(1)} MB`}function F(t,e){const a=document.createElement("a");a.href=t,a.download=e,a.click()}function X(t,e){t.startsWith("data:image/")||t.startsWith("data:application/pdf")?window.open(t,"_blank"):F(t,e)}function b(t){if(!t)return"-";const e=new Date(t);return new Intl.DateTimeFormat("en-US",{day:"numeric",month:"short",year:"numeric"}).format(e)}function y(t){return t?t.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" "):"-"}function qt(t){return t.split("-").map(e=>e.charAt(0).toUpperCase()+e.slice(1)).join(" ")}function p(t,e="info"){const a=document.getElementById("toastContainer");if(!a)return;const s="toast-"+Date.now(),i=`
    <div id="${s}" class="toast" role="alert">
      <div class="toast-header">
        <i class="fas ${e==="success"?"fa-check-circle text-success":e==="danger"?"fa-times-circle text-danger":e==="warning"?"fa-exclamation-circle text-warning":"fa-info-circle text-primary"} me-2"></i>
        <strong class="me-auto">${e.charAt(0).toUpperCase()+e.slice(1)}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
      </div>
      <div class="toast-body">${t}</div>
    </div>
  `;a.insertAdjacentHTML("beforeend",i);const n=document.getElementById(s);new bootstrap.Toast(n,{delay:3e3}).show(),n.addEventListener("hidden.bs.toast",()=>{n.remove()})}function jt(t,e){const a=new Blob([t],{type:"text/csv;charset=utf-8;"}),s=document.createElement("a");s.href=URL.createObjectURL(a),s.download=e,s.click(),URL.revokeObjectURL(s.href)}window.navigateTo=w;window.showDeliveryModal=A;window.previewDataUrl=X;window.downloadDataUrl=F;
