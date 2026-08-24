/* =========================================================
   JADHAV FOOD COURT
   MENU JAVASCRIPT
========================================================= */


/* =========================================================
   API
========================================================= */

const MENU_API = "http://localhost:5000/api/menu";
const STALL_API = "http://localhost:5000/api/stalls";


/* =========================================================
   ELEMENTS
========================================================= */

const stallButtons =
    document.getElementById("stallButtons");

const stallName =
    document.getElementById("stallName");

const stallCategory =
    document.getElementById("stallCategory");

const stallDescription =
    document.getElementById("stallDescription");

const stallNumber =
    document.getElementById("stallNumber");

const menuGrid =
    document.getElementById("menuGrid");


/* =========================================================
   STALL DATA
========================================================= */

let stalls = [];

let menuItems = [];

let selectedStall = null;


/* =========================================================
   GET STALL KEY
========================================================= */

function getStallKey(name) {

    const value =
        (name || "").toLowerCase().trim();


    if (value.includes("datta")) {
        return "datta";
    }


    if (
        value.includes("kharada") ||
        value.includes("kharda")
    ) {
        return "kharda";
    }


    if (value.includes("misal")) {
        return "misal";
    }


    if (value.includes("saiba")) {
        return "saiba";
    }


    return null;

}


/* =========================================================
   GET STALL FROM URL
========================================================= */

const urlParams =
    new URLSearchParams(window.location.search);

const urlStall =
    urlParams.get("stall");


/* =========================================================
   LOAD STALLS
========================================================= */

async function loadStalls() {

    try {

        const response =
            await fetch(STALL_API);


        if (!response.ok) {

            throw new Error(
                "Failed to load stalls"
            );

        }


        const databaseStalls =
            await response.json();


        /*
         * Only display:
         *
         * type = stall
         * available = true
         *
         * Swamini is a restaurant,
         * so it stays separate.
         */

        stalls =
            databaseStalls.filter(function (stall) {

                return (
                    stall.type === "stall" &&
                    stall.available === true
                );

            });


        if (stalls.length === 0) {

            stallButtons.innerHTML = `
                <p>
                    No stalls available.
                </p>
            `;

            return;

        }


        /*
         * Determine selected stall
         */

        if (urlStall) {

            const found =
                stalls.find(function (stall) {

                    return (
                        getStallKey(stall.name)
                        === urlStall
                    );

                });


            if (found) {

                selectedStall =
                    getStallKey(found.name);

            }

        }


        /*
         * Default stall
         */

        if (!selectedStall) {

            selectedStall =
                getStallKey(stalls[0].name);

        }


        createStallButtons();


    }

    catch (error) {

        console.error(
            "Error loading stalls:",
            error
        );


        stallButtons.innerHTML = `
            <p>
                Unable to load stalls.
            </p>
        `;

    }

}


/* =========================================================
   CREATE STALL BUTTONS
========================================================= */

function createStallButtons() {

    stallButtons.innerHTML = "";


    stalls.forEach(function (stall, index) {


        const key =
            getStallKey(stall.name);


        if (!key) {
            return;
        }


        const button =
            document.createElement("button");


        button.className =
            "stall-button";


        button.dataset.stall =
            key;


        button.textContent =
            stall.name;


        if (key === selectedStall) {

            button.classList.add("active");

        }


        button.addEventListener(
            "click",
            function () {

                selectStall(key);

            }
        );


        stallButtons.appendChild(button);

    });


    displayStall(selectedStall);

}


/* =========================================================
   SELECT STALL
========================================================= */

function selectStall(stallKey) {

    const stall =
        stalls.find(function (item) {

            return (
                getStallKey(item.name)
                === stallKey
            );

        });


    if (!stall) {
        return;
    }


    selectedStall =
        stallKey;


    /*
     * Update URL
     */

    const newUrl =
        window.location.pathname +
        "?stall=" +
        stallKey;


    window.history.replaceState(
        {},
        "",
        newUrl
    );


    /*
     * Update active button
     */

    document
        .querySelectorAll(".stall-button")
        .forEach(function (button) {

            button.classList.remove("active");


            if (
                button.dataset.stall
                === stallKey
            ) {

                button.classList.add("active");

            }

        });


    displayStall(stallKey);


    /*
     * Scroll to menu
     */

    const selectedSection =
        document.getElementById(
            "selectedStall"
        );


    if (selectedSection) {

        selectedSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

}


/* =========================================================
   DISPLAY STALL
========================================================= */

function displayStall(stallKey) {

    const stall =
        stalls.find(function (item) {

            return (
                getStallKey(item.name)
                === stallKey
            );

        });


    if (!stall) {
        return;
    }


    /*
     * Stall name
     */

    stallName.textContent =
        stall.name;


    /*
     * Category
     */

    stallCategory.textContent =
        stall.category || "MENU";


    /*
     * Description
     */

    stallDescription.textContent =
        stall.description || "";


    /*
     * Stall number
     */

    const index =
        stalls.findIndex(function (item) {

            return (
                getStallKey(item.name)
                === stallKey
            );

        });


    stallNumber.textContent =
        String(index + 1).padStart(2, "0");


    /*
     * Filter menu items
     */

    const items =
        menuItems.filter(function (item) {

            return (
                getStallKey(item.stall)
                === stallKey
            );

        });


    renderMenuItems(items);

}


/* =========================================================
   RENDER MENU ITEMS
========================================================= */

function renderMenuItems(items) {

    menuGrid.innerHTML = "";


    if (!items || items.length === 0) {

        menuGrid.innerHTML = `

            <div class="menu-empty">

                <h3>
                    Menu coming soon
                </h3>

                <p>
                    We're preparing something delicious.
                </p>

            </div>

        `;

        return;

    }


    items.forEach(function (item, index) {


        const card =
            document.createElement("article");


        card.className =
            "menu-item";


        card.style.animationDelay =
            (index * 0.08) + "s";


        /*
         * Image fallback
         */

        const image =
            item.image &&
            item.image.trim() !== ""

                ? item.image

                : "images/hero.jpg";


        card.innerHTML = `

            <div class="menu-item-image">

                <img
                    src="${image}"
                    alt="${item.name}"
                    loading="lazy"
                    onerror="this.src='images/hero.jpg'"
                >

            </div>


            <div class="menu-item-content">

                <h3>
                    ${item.name}
                </h3>


                ${
                    item.description
                        ? `
                            <p class="menu-item-description">
                                ${item.description}
                            </p>
                          `
                        : ""
                }


                <div class="menu-item-bottom">

                    <span class="menu-price">
                        ₹${item.price}
                    </span>


                    <span class="menu-item-number">

                        ${String(index + 1)
                            .padStart(2, "0")}

                    </span>

                </div>

            </div>

        `;


        menuGrid.appendChild(card);

    });

}


/* =========================================================
   LOAD MENU FROM MONGODB
========================================================= */

async function loadMenu() {

    try {

        console.log(
            "Loading menu from MongoDB..."
        );


        const response =
            await fetch(MENU_API);


        if (!response.ok) {

            throw new Error(
                "Failed to load menu"
            );

        }


        const databaseMenu =
            await response.json();


        /*
         * Only available items
         */

        menuItems =
            databaseMenu.filter(function (item) {

                return item.available === true;

            });


        console.log(
            "Menu loaded:",
            menuItems
        );


        /*
         * Display selected stall
         */

        if (selectedStall) {

            displayStall(selectedStall);

        }

    }

    catch (error) {

        console.error(
            "Error loading menu:",
            error
        );


        menuGrid.innerHTML = `

            <div class="menu-empty">

                <h3>
                    Unable to load menu
                </h3>

                <p>
                    Please try again later.
                </p>

            </div>

        `;

    }

}


/* =========================================================
   INITIALIZE PAGE
========================================================= */

async function initializeMenu() {

    /*
     * First load stalls
     */

    await loadStalls();


    /*
     * Then load menu
     */

    await loadMenu();

}


/* =========================================================
   START
========================================================= */

initializeMenu();