const products = [
  {id:1,name:"Sweet Red Apples",category:"Fruits",price:149,unit:"1 kg",emoji:"🍎",tag:"POPULAR",desc:"Crisp, juicy and naturally sweet"},
  {id:2,name:"Fresh Bananas",category:"Fruits",price:55,unit:"1 dozen",emoji:"🍌",tag:"FARM FRESH",desc:"Naturally ripened goodness"},
  {id:3,name:"Garden Carrots",category:"Vegetables",price:48,unit:"500 g",emoji:"🥕",tag:"FRESH PICK",desc:"Crunchy everyday favourite"},
  {id:4,name:"Green Broccoli",category:"Vegetables",price:75,unit:"1 piece",emoji:"🥦",tag:"",desc:"Fresh greens for healthy meals"},
  {id:5,name:"Farm Fresh Milk",category:"Dairy",price:32,unit:"500 ml",emoji:"🥛",tag:"DAILY ESSENTIAL",desc:"A creamy everyday essential"},
  {id:6,name:"Cheddar Cheese",category:"Dairy",price:125,unit:"200 g",emoji:"🧀",tag:"",desc:"Rich and full of flavour"},
  {id:7,name:"Sourdough Bread",category:"Bakery",price:85,unit:"1 loaf",emoji:"🍞",tag:"BAKED TODAY",desc:"Soft inside with a golden crust"},
  {id:8,name:"Choco Chip Cookies",category:"Snacks",price:99,unit:"200 g",emoji:"🍪",tag:"TREAT YOURSELF",desc:"A little moment of happiness"}
];
let cart = {};
let activeCategory = "All";
const grid = document.getElementById("productGrid");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");

function renderProducts(){
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const shown = products.filter(p => (activeCategory==="All" || p.category===activeCategory) && (p.name.toLowerCase().includes(query) || p.category.toLowerCase().includes(query)));
  document.getElementById("itemTotal").textContent = `${shown.length} product${shown.length===1?"":"s"}`;
  grid.innerHTML = shown.length ? shown.map(p=>`
    <article class="product-card">
      <div class="product-art">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<span>${p.emoji}</span></div>
      <div class="product-info"><span class="product-category">${p.category}</span><h3>${p.name}</h3><p>${p.desc}</p>
        <div class="product-bottom"><span class="price">₹${p.price} <small>/ ${p.unit}</small></span><button class="add-btn" data-add="${p.id}" aria-label="Add ${p.name}">+</button></div>
      </div>
    </article>`).join("") : `<div class="no-results">No groceries found. Try another search 🌿</div>`;
}
function updateCart(){
  const entries = Object.entries(cart).filter(([,qty])=>qty>0);
  const count = entries.reduce((sum,[,qty])=>sum+qty,0);
  const total = entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0);
  document.getElementById("cartCount").textContent=count;
  document.getElementById("subtotal").textContent=`₹${total}`;
  document.getElementById("cartItems").innerHTML = entries.length ? entries.map(([id,qty])=>{
    const p=products.find(x=>x.id===Number(id));
    return `<div class="cart-row"><div class="cart-emoji">${p.emoji}</div><div><h4>${p.name}</h4><small>₹${p.price} / ${p.unit}</small><div class="qty"><button data-change="${id}" data-delta="-1">−</button><span>${qty}</span><button data-change="${id}" data-delta="1">+</button></div></div><span class="cart-line-price">₹${p.price*qty}</span></div>`;
  }).join("") : `<div class="empty-cart">Your basket is waiting for something fresh. 🥬</div>`;
}
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1900)}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show")}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show")}

grid.addEventListener("click",e=>{
  const btn=e.target.closest("[data-add]"); if(!btn)return;
  const id=Number(btn.dataset.add);cart[id]=(cart[id]||0)+1;updateCart();
  showToast(`${products.find(p=>p.id===id).name} added to basket`);
});
document.getElementById("cartItems").addEventListener("click",e=>{
  const btn=e.target.closest("[data-change]");if(!btn)return;
  const id=Number(btn.dataset.change);cart[id]=Math.max(0,(cart[id]||0)+Number(btn.dataset.delta));updateCart();
});
document.getElementById("categories").addEventListener("click",e=>{
  const btn=e.target.closest("[data-category]");if(!btn)return;
  activeCategory=btn.dataset.category;
  document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b===btn));renderProducts();
});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("cartToggle").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>{
  if(!Object.values(cart).some(q=>q>0)){showToast("Your basket is empty!");return;}
  showToast("Demo checkout — connect a payment service to accept orders.");
});
renderProducts();updateCart();
