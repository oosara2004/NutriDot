// Mobile menu functionality - only run if elements exist
document.addEventListener('DOMContentLoaded', function() {
    const menu = document.querySelector('#mobile-menu');
    const menuLinks = document.querySelector('.navbar__menu');

    if (menu && menuLinks) {
        menu.addEventListener('click', function(){
            menu.classList.toggle('is-active');
            menuLinks.classList.toggle('active');
        });
    }

    // Language translations
    const translations = {
        en: {
            heroTitle: "Your next ride",
            heroSubtitle: "is just a tap away!",
            heroDescription: "See what makes us different.",
            servicesHeading: "Service For People With Need",
            metroLines: "Metro Lines",
            stations: "Stations",
            home: "Home",
            languages: "Languages",
            tracks: "Tracks",
            tickets: "Tickets",
            plan: "Plan",
            signIn: "Sign In",
            buttonsignUp: "Sign Up",
            explore: "Explore",
            contactUs: "Contact Us",
            chatBot: "Chat Bot",
            terms: "Terms Of Service",
            LinP: "Purple line",
            LinB: "Blue line",
            LinR: "Read line",
            LinO: "Orange line",
            LinY: "Yellow line",
            LinG: "Green line",
            TBuy:"Buy Ticket",
            TMy:"My Ticket",
            PPYT:"Plan Your Trip",
            PVS:"View Schedule"
        },
        ar: {
            home: "المنزل",
            languages: "اللغات",
            tracks: "المسارات",
            tickets: "التذاكر",
            plan: "الخطط",
            signIn: "تسجيل الدخول",
            buttonsignUp: "إنشاء حساب",
            heroTitle: "رحلتك القادمة",
            heroSubtitle: "مجرد نقرة واحدة بعيدة!",
            heroDescription: "اكتشف ما الذي يجعلنا مختلفين.",
            servicesHeading: "خدمات للأشخاص ذوي الاحتياجات",
            metroLines: "خطوط المترو",
            stations: "المحطات",
            explore: "استكشف",
            contactUs: "تواصل معنا",
            chatBot: "روبوت الدردشة",
            terms: "شروط الخدمة",
            LinP: "المسار البنفسجي",
            LinB: "المسار الازرق",
            LinR: "المسار الاحمر",
            LinO: "المسار البرتقالي",
            LinY: "المسار الاصفر",
            LinG: "المسار الاخضر",
            TBuy:"شراء تذكرة",
            TMy:"تذاكري",
            PPYT:"خطط لرحلتك",
            PVS:"جدول الرحلات"
        }
    };

    // Language change function - only run if elements exist
    function changeLanguage(lang) {
        const heroTitle = document.getElementById("hero-title");
        const heroSubtitle = document.getElementById("hero-subtitle");
        const heroDescription = document.getElementById("hero-description");
        const buttonSignUp = document.getElementById("button-signUp");

        if (heroTitle) heroTitle.textContent = translations[lang].heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = translations[lang].heroSubtitle;
        if (heroDescription) heroDescription.textContent = translations[lang].heroDescription;
        if (buttonSignUp) buttonSignUp.textContent = translations[lang].buttonsignUp;

        // Services heading
        const servicesHeading = document.querySelector(".services h1");
        if (servicesHeading) servicesHeading.textContent = translations[lang].servicesHeading;

        // Service cards
        const serviceCards = document.querySelectorAll(".services__card h2");
        if (serviceCards.length >= 2) {
            serviceCards[0].textContent = translations[lang].metroLines;
            serviceCards[1].textContent = translations[lang].stations;
        }

        // Line elements
        const lineElements = {
            "Lin-P": translations[lang].LinP,
            "Lin-B": translations[lang].LinB,
            "Lin-R": translations[lang].LinR,
            "Lin-O": translations[lang].LinO,
            "Lin-Y": translations[lang].LinY,
            "Lin-G": translations[lang].LinG,
            "T-Buy": translations[lang].TBuy,
            "T-My": translations[lang].TMy,
            "P-PYT": translations[lang].PPYT,
            "P-VS": translations[lang].PVS
        };

        Object.keys(lineElements).forEach(id => {
            const element = document.getElementById(id);
            if (element) element.textContent = lineElements[id];
        });

        // Navigation links
        const navLinks = {
            "navbar__links[href='/']": translations[lang].home,
            "language-btn[href='/languages']": translations[lang].languages,
            "navbar__links[href='/tracks']": translations[lang].tracks,
            "navbar__links[href='/tickets']": translations[lang].tickets,
            "navbar__links[href='/plan']": translations[lang].plan
        };

        Object.keys(navLinks).forEach(selector => {
            const element = document.querySelector(`.${selector}`);
            if (element) element.textContent = navLinks[selector];
        });

        const signInBtn = document.querySelector(".navbar__btn a");
        if (signInBtn) signInBtn.textContent = translations[lang].signIn;

        // Service card buttons
        const serviceButtons = document.querySelectorAll(".services__card button");
        serviceButtons.forEach(button => {
            if (button) button.textContent = translations[lang].explore;
        });

        // Footer links
        const footerLinks = document.querySelectorAll(".footer__link--items a");
        if (footerLinks.length >= 3) {
            footerLinks[0].textContent = translations[lang].contactUs;
            footerLinks[1].textContent = translations[lang].chatBot;
            footerLinks[2].textContent = translations[lang].terms;
        }
    }

    // Language event listeners - only add if elements exist
    const languageAr = document.getElementById("language-ar");
    const languageEn = document.getElementById("language-en");

    if (languageAr) {
        languageAr.addEventListener("click", (e) => {
            e.preventDefault();
            changeLanguage("ar");
        });
    }

    if (languageEn) {
        languageEn.addEventListener("click", (e) => {
            e.preventDefault();
            changeLanguage("en");
        });
    }

    // Route finding function - only run if elements exist
    window.findRoute = function() {
        const startElement = document.getElementById("start");
        const destinationElement = document.getElementById("destination");
        const resultElement = document.getElementById("result");

        if (!startElement || !destinationElement || !resultElement) {
            console.log("Route finding elements not found on this page");
            return;
        }

        const start = startElement.value;
        const destination = destinationElement.value;
        
        fetch('http://localhost:5000/findRoute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ start: start, destination: destination })
        })
        .then(response => response.json())
        .then(data => {
            resultElement.innerText = `The Best Route From ${start} To ${destination}: ${data.route.join(' -> ')}, Duration: ${data.duration} minutes.`;
        })
        .catch(error => {
            console.error('Error:', error);
            resultElement.innerText = 'Failed to fetch the route.';
        });
    };

    // Alternative route finding function
    window.findBestRoute = async function() {
        const locationElement = document.getElementById("location");
        const destinationElement = document.getElementById("destination");
        const resultElement = document.getElementById("result");

        if (!locationElement || !destinationElement || !resultElement) {
            console.log("Best route finding elements not found on this page");
            return;
        }

        const location = locationElement.value;
        const destination = destinationElement.value;

        try {
            const response = await fetch("http://127.0.0.1:5000/find_route", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ location, destination }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();

            if (data.route) {
                resultElement.textContent = `${data.route} (${data.time} minutes)`;
            } else {
                resultElement.textContent = "No route found.";
            }
        } catch (error) {
            console.error("Error:", error);
            resultElement.textContent = "An error occurred. Check the console for details.";
        }
    };

    // Card animation - only run if elements exist
    const cards = document.querySelectorAll(".card");
    if (cards.length > 0) {
        let index = 0;

        function showNextCard() {
            if (index < cards.length) {
                cards[index].classList.add("show");
                index++;
            }
        }

        window.addEventListener("scroll", function () {
            if (window.scrollY > 200 * index) { 
                showNextCard();
            }
        });
    }

    // Sign in function - only run if elements exist
    window.signIn = function() {
        const usernameElement = document.getElementById('username');
        const passwordElement = document.getElementById('password');

        if (!usernameElement || !passwordElement) {
            console.log("Sign in elements not found on this page");
            return;
        }

        const username = usernameElement.value;
        const password = passwordElement.value;

        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().signInWithEmailAndPassword(username, password)
                .then((userCredential) => {
                    const user = userCredential.user;
                    console.log("Logged in as: " + user.email);
                    window.location.href = "index.html";
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    console.error(errorCode, errorMessage);
                    alert("Error: " + errorMessage);
                });
        } else {
            console.error("Firebase not loaded");
        }
    };
});