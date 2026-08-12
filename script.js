const products = [
    {
        id: 1,
        n: "✏️ Pencil Sketches",
        c: "pencil",
        p: 850,
        img: "images/pencil.jpg"
    },

    {
        id: 2,
        n: "🎨 Oil Pastels",
        c: "oilpastel",
        p: 1200,
        img: "images/oilpastel.jpg"
    },

    {
        id: 3,
        n: "💧 Watercolor Art",
        c: "watercolor",
        p: 1000,
        img: "images/watercolor.jpg"
    },

    {
        id: 4,
        n: "🖌️ Acrylic Paintings",
        c: "acrylic",
        p: 1500,
        img: "images/acrylic.jpg"
    },

    {
        id: 5,
        n: "🌀 Abstract Art",
        c: "abstract",
        p: 1300,
        img: "images/abstract.jpg"
    }
];

let cart = JSON.parse(localStorage.getItem("oviaraCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("oviaraWishlist")) || [];

const money = n => "₹" + n.toLocaleString("en-IN");

/* ---------------- PRODUCTS ---------------- */

function showProducts(filter = "all") {

    const container = document.getElementById("products");

    const filtered = products.filter(product =>
        filter === "all" || product.c === filter
    );

    container.innerHTML = filtered.map(product => `

        <article class="product">

            <div class="product-image">

                <img 
                    src="${product.img}"
                    alt="${product.n}"
                    onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='flex';
                    "
                >

                <div class="fallback">

                    <small>${product.c}</small>

                    <strong>${product.n}</strong>

                    <span>Add ${product.img}</span>

                </div>

                <button 
                    class="heart-btn"
                    onclick="addWishlist(${product.id})">
                    ${wishlist.includes(product.id) ? "♥" : "♡"}
                </button>

            </div>

            <div class="product-info">

                <h3>${product.n}</h3>

                <div class="meta">

                    <span>${product.c}</span>

                    <b>${money(product.p)}</b>

                </div>

                <button 
                    class="add"
                    onclick="addToCart(${product.id})">

                    Add to bag →

                </button>

            </div>

        </article>

    `).join("");
}

showProducts();


/* ---------------- FILTER ---------------- */

document.querySelectorAll(".filters button").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".filters button")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        showProducts(button.dataset.filter);

    });

});


/* ---------------- CART ---------------- */

function addToCart(id) {

    const product = products.find(p => p.id === id);

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.q++;

    } else {

        cart.push({
            ...product,
            q: 1
        });

    }

    saveData();

    showCart();

    toast(product.n + " added to your bag ✨");
}


function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveData();

    showCart();

}


function changeQuantity(id, amount) {

    const item = cart.find(p => p.id === id);

    if (!item) return;

    item.q += amount;

    if (item.q <= 0) {

        removeFromCart(id);

        return;

    }

    saveData();

    showCart();

}


/* ---------------- CART PANEL ---------------- */

function showCart() {

    let panel = document.getElementById("cartPanel");

    if (!panel) {

        panel = document.createElement("div");

        panel.id = "cartPanel";

        panel.className = "side-panel";

        document.body.appendChild(panel);

    }

    const total = cart.reduce(
        (sum, item) => sum + item.p * item.q,
        0
    );

    panel.innerHTML = `

        <div class="panel-header">

            <h2>Your Bag</h2>

            <button onclick="closePanels()">×</button>

        </div>

        <div class="cart-items">

            ${
                cart.length === 0

                ? `<div class="empty">
                    <div>🛍️</div>
                    <h3>Your bag is empty</h3>
                    <p>Discover something beautiful from OVIARA.</p>
                   </div>`

                :

                cart.map(item => `

                    <div class="cart-item">

                        <img 
                            src="${item.img}"
                            onerror="this.style.display='none'"
                        >

                        <div>

                            <h3>${item.n}</h3>

                            <p>${money(item.p)}</p>

                            <div class="quantity">

                                <button onclick="changeQuantity(${item.id},-1)">
                                    −
                                </button>

                                <span>${item.q}</span>

                                <button onclick="changeQuantity(${item.id},1)">
                                    +
                                </button>

                            </div>

                        </div>

                        <button 
                            class="remove"
                            onclick="removeFromCart(${item.id})">

                            ×

                        </button>

                    </div>

                `).join("")

            }

        </div>

        <div class="cart-bottom">

            <div class="total">

                <span>Total</span>

                <strong>${money(total)}</strong>

            </div>

            <button 
                class="checkout"
                onclick="checkout()">

                Proceed to Checkout →

            </button>

        </div>

    `;

    panel.classList.add("open");

}


/* ---------------- WISHLIST ---------------- */

function addWishlist(id) {

    const product = products.find(p => p.id === id);

    if (wishlist.includes(id)) {

        wishlist = wishlist.filter(item => item !== id);

        toast(product.n + " removed from wishlist");

    } else {

        wishlist.push(id);

        toast(product.n + " added to wishlist ♡");

    }

    saveData();

    showProducts();

}


/* ---------------- WISHLIST PANEL ---------------- */

function showWishlist() {

    let panel = document.getElementById("wishlistPanel");

    if (!panel) {

        panel = document.createElement("div");

        panel.id = "wishlistPanel";

        panel.className = "side-panel";

        document.body.appendChild(panel);

    }

    const items = products.filter(p => wishlist.includes(p.id));

    panel.innerHTML = `

        <div class="panel-header">

            <h2>Wishlist ♡</h2>

            <button onclick="closePanels()">×</button>

        </div>

        <div class="wishlist-items">

            ${
                items.length === 0

                ? `<div class="empty">
                    <div>♡</div>
                    <h3>Your wishlist is empty</h3>
                    <p>Save artwork you love here.</p>
                   </div>`

                :

                items.map(item => `

                    <div class="cart-item">

                        <img src="${item.img}">

                        <div>

                            <h3>${item.n}</h3>

                            <p>${money(item.p)}</p>

                            <button 
                                class="add"
                                onclick="addToCart(${item.id})">

                                Add to Bag →

                            </button>

                        </div>

                    </div>

                `).join("")

            }

        </div>

    `;

    panel.classList.add("open");

}


/* ---------------- SEARCH ---------------- */

/* =========================
   SEARCH
========================= */

function openSearch() {

    let search = document.getElementById("searchBox");

    if (!search) {

        search = document.createElement("div");

        search.id = "searchBox";

        search.className = "search-overlay";

        search.innerHTML = `
            <button class="search-close"
                    onclick="closeSearch()">×</button>

            <div>

                <p class="eyebrow">
                    SEARCH OVIARA
                </p>

                <h2>
                    Find your <em>art.</em>
                </h2>

                <input
                    id="searchInput"
                    placeholder="Search drawings, portraits, prints..."
                >

                <div id="searchResults"></div>

            </div>
        `;

        document.body.appendChild(search);
    }

    search.classList.add("show");

    document.getElementById("searchInput").focus();
}


function closeSearch() {

    const search = document.getElementById("searchBox");

    if (search) {
        search.classList.remove("show");
    }

}


document.addEventListener("input", e => {

    if (e.target.id !== "searchInput") return;

    const value = e.target.value.toLowerCase();

    const results = products.filter(product =>
        product.n.toLowerCase().includes(value) ||
        product.c.toLowerCase().includes(value)
    );

    document.getElementById("searchResults").innerHTML =

        results.length

        ?

        results.map(p => `

            <div class="search-result">

                <span>${p.n}</span>

                <b>${money(p.p)}</b>

            </div>

        `).join("")

        :

        `<p class="no-result">No artwork found.</p>`;

});


/* ---------------- HEADER BUTTONS ---------------- */

document.getElementById("searchOpen")
    .addEventListener("click", openSearch);

document.getElementById("wishOpen")
    .addEventListener("click", showWishlist);

document.getElementById("cartOpen")
    .addEventListener("click", showCart);


/* ---------------- CLOSE PANELS ---------------- */

function closePanels() {

    document.querySelectorAll(".side-panel")
        .forEach(panel => panel.classList.remove("open"));

}


/* ---------------- CHECKOUT ---------------- */

function checkout() {

    if (cart.length === 0) {

        toast("Your bag is empty 🛍️");

        return;

    }

    toast("Checkout coming soon ✨");

}


/* ---------------- SAVE ---------------- */

function saveData() {

    localStorage.setItem(
        "oviaraCart",
        JSON.stringify(cart)
    );

    localStorage.setItem(
        "oviaraWishlist",
        JSON.stringify(wishlist)
    );

    document.getElementById("cartCount").textContent =
        cart.reduce((sum, item) => sum + item.q, 0);

    document.getElementById("wishCount").textContent =
        wishlist.length;

}


/* ---------------- TOAST ---------------- */

function toast(message) {

    let toastBox = document.getElementById("toast");

    toastBox.textContent = message;

    toastBox.classList.add("show");

    setTimeout(() => {

        toastBox.classList.remove("show");

    }, 2500);

}


/* ---------------- CUSTOM ART ---------------- */

const modal = document.getElementById("modal");

document.getElementById("customBtn").onclick = () => {

    modal.classList.add("show");

};

document.getElementById("close").onclick = () => {

    modal.classList.remove("show");

};

modal.onclick = e => {

    if (e.target === modal) {

        modal.classList.remove("show");

    }

};


/* ---------------- CONTACT ---------------- */

document.getElementById("contactForm").onsubmit = e => {

    e.preventDefault();

    toast("Thank you! Your message has been received ✨");

    e.target.reset();

};


/* ---------------- NEWSLETTER ---------------- */

document.getElementById("news").onsubmit = e => {

    e.preventDefault();

    toast("Welcome to the OVIARA studio ✨");

    e.target.reset();

};


/* ---------------- MOBILE MENU ---------------- */

document.getElementById("menu").onclick = () => {

    document.getElementById("nav")
        .classList.toggle("show");

};


/* INITIALIZE */

saveData();