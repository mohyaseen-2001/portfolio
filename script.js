(function bootstrapPortfolio() {
    const cdnBase = "https://" + "cdn.jsdelivr.net/npm/";

    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = cdnBase + "@fortawesome/fontawesome-free@6.5.1/css/all.min.css";
    document.head.appendChild(faLink);

    function loadScript(src, callback) {
        const s = document.createElement("script");
        s.src = src;
        s.onload = callback;
        s.onerror = callback;
        document.body.appendChild(s);
    }

    loadScript(cdnBase + "gsap@3.12.5/dist/gsap.min.js", () => {
        loadScript(cdnBase + "gsap@3.12.5/dist/ScrollTrigger.min.js", initApp);
    });

    function initApp() {
        const hasGsap = typeof gsap !== "undefined";
        if (hasGsap && typeof ScrollTrigger !== "undefined") {
            gsap.registerPlugin(ScrollTrigger);
        }

        const introOverlay = document.getElementById("introOverlay");
        const skipBtn = document.getElementById("skipIntro");
        const introContact = document.getElementById("introSkipContact");
        const canvas = document.getElementById("particleCanvas");

        if (canvas) {
            const ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const particles = Array.from({ length: 110 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2.2 + 0.8,
                dx: (Math.random() - 0.5) * 1.1,
                dy: (Math.random() - 0.5) * 1.1
            }));

            function animateParticles() {
                if (!introOverlay || introOverlay.style.display === "none") return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "#a855f7";
                particles.forEach(p => {
                    p.x += p.dx;
                    p.y += p.dy;
                    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fill();
                });
                requestAnimationFrame(animateParticles);
            }
            animateParticles();
        }

        function closeIntro() {
            if (!introOverlay || introOverlay.dataset.closed === "true") return;
            introOverlay.dataset.closed = "true";

            if (hasGsap) {
                gsap.to(introOverlay, {
                    yPercent: -100,
                    duration: 0.85,
                    ease: "power4.inOut",
                    onComplete: () => {
                        introOverlay.style.display = "none";
                        playHeroReveal();
                    }
                });
            } else {
                introOverlay.style.transition = "transform 0.8s ease";
                introOverlay.style.transform = "translateY(-100%)";
                setTimeout(() => { introOverlay.style.display = "none"; }, 800);
            }
        }

        const autoTimer = setTimeout(closeIntro, 2400);
        if (skipBtn) skipBtn.addEventListener("click", () => { clearTimeout(autoTimer); closeIntro(); });
        if (introContact) introContact.addEventListener("click", () => { clearTimeout(autoTimer); closeIntro(); });

        function playHeroReveal() {
            if (!hasGsap) return;
            gsap.fromTo(".hero-reveal",
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.85, stagger: 0.14, ease: "power3.out" }
            );
        }

        if (hasGsap && typeof ScrollTrigger !== "undefined") {
            gsap.to("#stLine1", {
                xPercent: -12,
                scrollTrigger: { trigger: "#statementSec", start: "top bottom", end: "bottom top", scrub: 1 }
            });
            gsap.to("#stLine2", {
                xPercent: 12,
                scrollTrigger: { trigger: "#statementSec", start: "top bottom", end: "bottom top", scrub: 1 }
            });
            gsap.to("#stLine3", {
                xPercent: -10,
                scrollTrigger: { trigger: "#statementSec", start: "top bottom", end: "bottom top", scrub: 1 }
            });

            gsap.utils.toArray(".reveal-up").forEach(el => {
                gsap.fromTo(el,
                    { y: 40, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
                        scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
                    }
                );
            });
        }

        const themeToggle = document.getElementById("themeToggle");
        const themeLabel = document.getElementById("themeLabel");
        if (themeToggle) {
            themeToggle.addEventListener("click", () => {
                const current = document.documentElement.getAttribute("data-theme");
                const next = current === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
                themeLabel.textContent = next.toUpperCase();
            });
        }
        const translations = {
            en: {
                nav_home: "Home", nav_about: "About", nav_skills: "Expertise", nav_projects: "Projects", nav_contact: "Contact", nav_talk: "• LET'S TALK",
                hero_hi: "HI, I'M MOHAMMED", hero_t1: "SOFTWARE", hero_t2: "& CREATOR.",
                hero_desc: "I build scalable web applications and RESTful APIs using Laravel, PHP, and React. Best Project Award recipient focused on clean architecture and great user experiences.",
                hero_btn1: "VIEW PROJECTS", hero_btn2: "ABOUT ME",
                about_kicker: "ABOUT ME", about_title: "A little about me.",
                about_p1: "I'm Mohammed Yaseen, a Software Engineering graduate from Al-Balqa Applied University and a proud recipient of the Best Project Award at my university.",
                about_p2: "I specialize in architecting secure multi-role systems with Laravel and MySQL, alongside building responsive, interactive interfaces with React and JavaScript.",
                skills_title: "My Skills.", skills_note: "Frontend, backend, databases, and RESTful API architecture.",
                sk1_t: "Frontend Development", sk1_d: "I build responsive, interactive interfaces using React, JavaScript ES6, HTML5, CSS3, and Bootstrap.",
                sk2_t: "Backend Engineering", sk2_d: "I architect secure MVC systems and REST APIs with Laravel 12, PHP OOP, Sanctum, and Middleware.",
                sk3_t: "Database Systems", sk3_d: "I design normalized relational schemas, migrations, Eloquent relationships, and optimized MySQL queries.",
                sk4_t: "Integrations & Tools", sk4_d: "I integrate payment gateways (Stripe), AI APIs (Gemini), Git workflows, and API testing with Postman.",
                proj_title: "My Projects.", proj_note: "Selected full-stack systems and interactive applications.",
                form_badge: "SEND A MESSAGE", form_name: "Your Name", form_email: "Email Address", form_msg: "Message", form_btn: "SEND MESSAGE",
                pitch_1: "Got an idea?", pitch_2: "Let's build it.",
                pitch_desc: "Whether you need a scalable Laravel backend, a REST API, or a modern full-stack web application—feel free to reach out."
            },
            ar: {
                nav_home: "الرئيسية", nav_about: "عني", nav_skills: "المهارات", nav_projects: "المشاريع", nav_contact: "تواصل معي", nav_talk: "• لنتحدث",
                hero_hi: "مرحباً، أنا محمد ياسين", hero_t1: "مهندس برمجيات", hero_t2: "ومطور ويب.",
                hero_desc: "أبني تطبيقات ويب متكاملة وواجهات برمجية REST APIs باستخدام Laravel و PHP و React. حاصل على جائزة أفضل مشروع جامعي وأركز على نظافة الكود وتجربة المستخدم.",
                hero_btn1: "استعرض مشاريعي", hero_btn2: "نبذة عني",
                about_kicker: "نبذة عني", about_title: "تعرّف عليّ أكثر.",
                about_p1: "أنا محمد ياسين، مهندس برمجيات من جامعة البلقاء التطبيقية وحاصل على جائزة أفضل مشروع على مستوى الجامعة.",
                about_p2: "أتخصص في بناء الأنظمة الخلفية الآمنة متعددة الصلاحيات باستخدام Laravel و MySQL، إلى جانب تطوير واجهات تفاعلية حديثة باستخدام React و JavaScript.",
                skills_title: "مهاراتي التقنية.", skills_note: "تطوير الواجهات الأمامية، الأنظمة الخلفية، وقواعد البيانات.",
                sk1_t: "تطوير الواجهات الأمامية", sk1_d: "بناء واجهات مستخدم متجاوبة وتفاعلية باستخدام React و JavaScript و HTML5 و CSS3 و Bootstrap.",
                sk2_t: "هندسة الأنظمة الخلفية", sk2_d: "تصميم وبناء أنظمة MVC وواجهات REST APIs آمنة باستخدام Laravel 12 و PHP OOP و Sanctum.",
                sk3_t: "إدارة قواعد البيانات", sk3_d: "تصميم الجداول والعلاقات المعيارية في MySQL وكتابة استعلامات سريعة وموثوقة.",
                sk4_t: "الربط والأدوات", sk4_d: "ربط بوابات الدفع الإلكتروني Stripe وواجهات الذكاء الاصطناعي Gemini وإدارة المشاريع عبر Git.",
                proj_title: "أبرز مشاريعي.", proj_note: "مجموعة مختارة من الأنظمة المتكاملة والتطبيقات التفاعلية.",
                form_badge: "أرسل رسالة", form_name: "الاسم الكامل", form_email: "البريد الإلكتروني", form_msg: "رسالتك", form_btn: "إرسال الرسالة",
                pitch_1: "عندك فكرة؟", pitch_2: "خلينا ننفذها.",
                pitch_desc: "سواء كنت تبحث عن مطور Laravel لبناء نظام متكامل أو واجهة API أو موقع حديث، يسعدني تواصلك معي."
            }
        };

        document.querySelectorAll(".lang-opt").forEach(opt => {
            opt.addEventListener("click", () => {
                document.querySelectorAll(".lang-opt").forEach(o => o.classList.remove("active"));
                opt.classList.add("active");
                const lang = opt.getAttribute("data-lang");
                document.documentElement.setAttribute("lang", lang);
                document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");

                document.querySelectorAll("[data-i18n]").forEach(el => {
                    const key = el.getAttribute("data-i18n");
                    if (translations[lang][key]) el.textContent = translations[lang][key];
                });
            });
        });

        const gh = "https://" + "://github.com";
        document.querySelectorAll(".work-card").forEach(card => {
            const repo = card.getAttribute("data-repo");
            const live = card.getAttribute("data-live");
            if (live === "edutrack") {
                const liveBtn = card.querySelector(".live-btn");
                const codeBtn = card.querySelector(".code-btn");
                if (liveBtn) liveBtn.href = "https://" + "hadeelabdal-majeed.github.io/EduTrack/";
                if (codeBtn) codeBtn.href = gh + repo;
            } else {
                const btn = card.querySelector(".circle-arrow-btn");
                if (btn && repo) btn.href = gh + repo;
            }
        });

        const ghUser = gh + "mohyaseen-2001";
        const liUrl = "https://" + "://linkedin.com";
        ["aboutGhLink", "footerGh"].forEach(id => { const el = document.getElementById(id); if (el) el.href = ghUser; });
        ["aboutLiLink", "footerLi"].forEach(id => { const el = document.getElementById(id); if (el) el.href = liUrl; });
    }
})();
