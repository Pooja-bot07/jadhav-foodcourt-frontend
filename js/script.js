
const STALLS_API = "http://localhost:5000/api/stalls";
const GALLERY_API = "http://localhost:5000/api/gallery";


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (menuToggle && mobileMenu) {

    menuToggle.addEventListener("click", function () {

        if (mobileMenu.style.display === "flex") {
            mobileMenu.style.display = "none";
        } else {
            mobileMenu.style.display = "flex";
        }

    });


    const mobileLinks = mobileMenu.querySelectorAll("a");

    mobileLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            mobileMenu.style.display = "none";

        });

    });

}


/* =========================================================
   STALL DATA
   Loaded from MongoDB
========================================================= */

let stalls = [];


/* =========================================================
   CAROUSEL ELEMENTS
========================================================= */

const track = document.getElementById("jfcTrack");

const prevButton = document.getElementById("jfcPrev");

const nextButton = document.getElementById("jfcNext");

const categoryText = document.getElementById("jfcCategory");

const nameText = document.getElementById("jfcName");

const descriptionText = document.getElementById("jfcText");

const exploreLink = document.getElementById("jfcLink");

const currentNumber = document.getElementById("jfcCurrent");

const totalNumber =
    document.querySelector(".jfc-counter small");


/* =========================================================
   CAROUSEL STATE
========================================================= */

let currentIndex = 0;


/* =========================================================
   LOAD STALLS FROM MONGODB
========================================================= */

async function loadStalls() {

    try {

        const response = await fetch(STALLS_API);

        if (!response.ok) {
            throw new Error("Failed to fetch stalls");
        }

        const databaseStalls = await response.json();


        stalls = databaseStalls.filter(function (stall) {

            return (
                stall.type === "stall" &&
                stall.available === true
            );

        });


        if (stalls.length === 0) {

            if (track) {

                track.innerHTML = `
                    <p style="
                        text-align:center;
                        width:100%;
                        color:#777;
                    ">
                        No stalls available.
                    </p>
                `;

            }

            return;
        }


        currentIndex = 0;

        createCards();

        updateCarousel();


    } catch (error) {

        console.error(
            "Error loading stalls:",
            error
        );


        if (track) {

            track.innerHTML = `
                <p style="
                    text-align:center;
                    width:100%;
                    color:#777;
                ">
                    Unable to load stalls.
                </p>
            `;

        }

    }

}


/* =========================================================
   CREATE STALL CARDS
========================================================= */

function createCards() {

    if (!track) {
        return;
    }

    track.innerHTML = "";


    stalls.forEach(function (stall, index) {

        let logoImage = "images/hero.jpg";

        const name =
            (stall.name || "").toLowerCase();


        if (name.includes("datta")) {

            logoImage =
                "images/shree-datta-bhel-logo.jpg";

        }

        else if (
            name.includes("kharada") ||
            name.includes("kharda")
        ) {

            logoImage =
                "images/kharada-vada-pav-logo.jpg";

        }

        else if (name.includes("misal")) {

            logoImage =
                "images/misal-katta-logo.jpg";

        }

        else if (name.includes("saiba")) {

            logoImage =
                "images/saiba-amrutatulaya-logo.jpg";

        }


        const card =
            document.createElement("div");

        card.className = "jfc-card";


        card.innerHTML = `

            <img
                src="${logoImage}"
                alt="${stall.name}"
                onerror="this.src='images/hero.jpg'"
            >

            <div class="jfc-card-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="jfc-card-name">
                ${stall.name}
            </div>

        `;


        track.appendChild(card);

    });

}


/* =========================================================
   UPDATE CAROUSEL
========================================================= */

function updateCarousel() {

    if (!track) {
        return;
    }


    const cards =
        track.querySelectorAll(".jfc-card");


    const total = cards.length;


    if (total === 0) {
        return;
    }


    cards.forEach(function (card, index) {

        let position =
            index - currentIndex;


        if (position > total / 2) {
            position -= total;
        }


        if (position < -total / 2) {
            position += total;
        }


        /* CENTER */

        if (position === 0) {

            card.style.transform =
                "translate(-50%, -50%) scale(1)";

            card.style.opacity = "1";

            card.style.filter = "blur(0px)";

            card.style.zIndex = "10";

            card.style.pointerEvents = "auto";

        }


        /* LEFT */

        else if (position === -1) {

            card.style.transform =
                "translate(-145%, -50%) scale(0.82)";

            card.style.opacity = "0.65";

            card.style.filter = "blur(0px)";

            card.style.zIndex = "5";

            card.style.pointerEvents = "auto";

        }


        /* RIGHT */

        else if (position === 1) {

            card.style.transform =
                "translate(45%, -50%) scale(0.82)";

            card.style.opacity = "0.65";

            card.style.filter = "blur(0px)";

            card.style.zIndex = "5";

            card.style.pointerEvents = "auto";

        }


        /* HIDDEN */

        else {

            card.style.transform =
                "translate(-50%, -50%) scale(0.5)";

            card.style.opacity = "0";

            card.style.filter = "blur(6px)";

            card.style.zIndex = "0";

            card.style.pointerEvents = "none";

        }

    });


    updateInformation();

}


/* =========================================================
   UPDATE STALL INFORMATION
========================================================= */

function updateInformation() {

    const stall =
        stalls[currentIndex];


    if (!stall) {
        return;
    }


    if (categoryText) {

        categoryText.textContent =
            stall.category || "";

    }


    if (nameText) {

        nameText.textContent =
            stall.name || "";

    }


    if (descriptionText) {

        descriptionText.textContent =
            stall.description || "";

    }


    /* =====================================================
       MENU LINK
    ===================================================== */

    if (exploreLink) {

        let stallKey = "";

        const name =
            (stall.name || "").toLowerCase();


        if (name.includes("datta")) {

            stallKey = "datta";

        }

        else if (
            name.includes("kharada") ||
            name.includes("kharda")
        ) {

            stallKey = "kharda";

        }

        else if (name.includes("misal")) {

            stallKey = "misal";

        }

        else if (name.includes("saiba")) {

            stallKey = "saiba";

        }


        if (stallKey !== "") {

            exploreLink.href =
                `menu.html?stall=${stallKey}`;

        }

        else {

            exploreLink.href =
                "menu.html";

        }

    }


    /* CURRENT NUMBER */

    if (currentNumber) {

        currentNumber.textContent =
            String(currentIndex + 1).padStart(2, "0");

    }


    /* TOTAL NUMBER */

    if (totalNumber) {

        totalNumber.textContent =
            String(stalls.length).padStart(2, "0");

    }

}


/* =========================================================
   NEXT BUTTON
========================================================= */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        function () {

            if (stalls.length === 0) {
                return;
            }


            currentIndex++;


            if (currentIndex >= stalls.length) {
                currentIndex = 0;
            }


            updateCarousel();

        }
    );

}


/* =========================================================
   PREVIOUS BUTTON
========================================================= */

if (prevButton) {

    prevButton.addEventListener(
        "click",
        function () {

            if (stalls.length === 0) {
                return;
            }


            currentIndex--;


            if (currentIndex < 0) {

                currentIndex =
                    stalls.length - 1;

            }


            updateCarousel();

        }
    );

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (stalls.length === 0) {
            return;
        }


        if (event.key === "ArrowRight") {

            currentIndex++;


            if (currentIndex >= stalls.length) {
                currentIndex = 0;
            }


            updateCarousel();

        }


        if (event.key === "ArrowLeft") {

            currentIndex--;


            if (currentIndex < 0) {

                currentIndex =
                    stalls.length - 1;

            }


            updateCarousel();

        }

    }
);


/* =========================================================
   AUTO CAROUSEL
========================================================= */

let autoSlide;


function startAutoSlide() {

    clearInterval(autoSlide);


    autoSlide = setInterval(
        function () {

            if (stalls.length === 0) {
                return;
            }


            currentIndex++;


            if (currentIndex >= stalls.length) {
                currentIndex = 0;
            }


            updateCarousel();

        },
        5000
    );

}


/* =========================================================
   STOP AUTO-SLIDE ON HOVER
========================================================= */

if (track) {

    track.addEventListener(
        "mouseenter",
        function () {

            clearInterval(autoSlide);

        }
    );


    track.addEventListener(
        "mouseleave",
        function () {

            startAutoSlide();

        }
    );

}


/* =========================================================
   HERO REVEAL ANIMATION
========================================================= */

const revealElements =
    document.querySelectorAll(
        ".hero-label, .hero h1, .hero-marathi, .hero-description, .hero-actions"
    );


revealElements.forEach(
    function (element, index) {

        element.style.opacity = "0";

        element.style.transform =
            "translateY(30px)";

        element.style.transition =
            "opacity 0.8s ease, transform 0.8s ease";

        element.style.transitionDelay =
            (index * 0.12) + "s";

    }
);


window.addEventListener(
    "load",
    function () {

        revealElements.forEach(
            function (element) {

                element.style.opacity = "1";

                element.style.transform =
                    "translateY(0)";

            }
        );

    }
);


/* =========================================================
   PUBLIC GALLERY
   LOADED FROM MONGODB
========================================================= */

async function loadPublicGallery() {

    const gallery =
        document.getElementById("publicGallery");


    if (!gallery) {
        return;
    }


    try {

        const response =
            await fetch(GALLERY_API);


        if (!response.ok) {
            throw new Error(
                "Failed to load gallery"
            );
        }


        const images =
            await response.json();


        if (!images || images.length === 0) {

            gallery.innerHTML = `
                <p class="gallery-empty">
                    Gallery coming soon.
                </p>
            `;

            return;
        }


        gallery.innerHTML =
            images.map(
                function (item, index) {

                    let extraClass = "";


                    if (index === 0) {

                        extraClass =
                            "gallery-large";

                    }

                    else if (index === 3) {

                        extraClass =
                            "gallery-wide";

                    }


                    return `

                        <div
                            class="gallery-item ${extraClass}"
                        >

                            <img
                                src="${item.image.startsWith("images/") ? item.image : "images/" + item.image}"
                                alt="${item.title || "Jadhav Food Court"}"
                                loading="lazy"
                                onerror="this.style.display='none'"
                            >


                            <div class="gallery-caption">

                                <span>
                                    ${String(index + 1).padStart(2, "0")}
                                </span>


                                <strong>
                                    ${item.title || "Jadhav Food Court"}
                                </strong>

                            </div>

                        </div>

                    `;

                }
            ).join("");

    }


    catch (error) {

        console.error(
            "Error loading public gallery:",
            error
        );


        gallery.innerHTML = `
            <p class="gallery-empty">
                Unable to load gallery.
            </p>
        `;
    }

}


/* =========================================================
   INITIALIZE
========================================================= */

loadStalls();

startAutoSlide();

loadPublicGallery();