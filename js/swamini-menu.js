const API_URL = "http://localhost:5000/api/restaurant-menu";
const menuSection = document.querySelector(".swamini-menu-section");

async function loadRestaurantMenu() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load restaurant menu");
        }

        const menuItems = await response.json();

        displayRestaurantMenu(menuItems);

    } catch (error) {
        console.error("Restaurant menu error:", error);

        if (menuSection) {
            menuSection.innerHTML = `
                <div class="swamini-section-heading">
                    <span>OUR MENU</span>
                    <h2>Menu currently unavailable.</h2>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
}

function displayRestaurantMenu(menuItems) {

    if (!menuSection) {
        return;
    }

    if (menuItems.length === 0) {
        menuSection.innerHTML = `
            <div class="swamini-section-heading">
                <span>OUR MENU</span>

                <h2>
                    Menu coming
                    <em>soon.</em>
                </h2>

                <p>
                    Our restaurant menu is being updated.
                    Please check back soon.
                </p>
            </div>
        `;

        return;
    }

    const categories = {};

    menuItems.forEach(function(item) {

        if (item.available === false) {
            return;
        }

        const category = item.category || "Other";

        if (!categories[category]) {
            categories[category] = [];
        }

        categories[category].push(item);
    });

    let html = `
        <div class="swamini-section-heading">

            <span>OUR MENU</span>

            <h2>
                Something for
                <em>everyone.</em>
            </h2>

            <p>
                Explore our selection of vegetarian favourites.
            </p>

        </div>
    `;

    let categoryNumber = 1;

    Object.keys(categories).forEach(function(category) {

        html += `
            <div class="swamini-menu-category">

                <div class="category-heading">

                    <span>
                        ${String(categoryNumber).padStart(2, "0")}
                    </span>

                    <div>
                        <small>SWAMINI SPECIAL</small>

                        <h3>${category}</h3>
                    </div>

                </div>

                <div class="swamini-menu-grid">
        `;

        categories[category].forEach(function(item) {

            html += `
                <article class="swamini-menu-card">

                    <div>
                        <h4>${item.name}</h4>

                        <p>
                            ${item.description || ""}
                        </p>
                    </div>

                    <strong>
                        ₹${item.price}
                    </strong>

                </article>
            `;

        });

        html += `
                </div>
            </div>
        `;

        categoryNumber++;
    });

    menuSection.innerHTML = html;
}

loadRestaurantMenu();