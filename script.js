(function () {
    const cdn = "https://" + "cdn.jsdelivr.net/npm/";

    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = cdn + "@fortawesome/fontawesome-free@6.5.1/css/all.min.css";
    document.head.appendChild(fa);

    function addJs(url, cb) {
        const s = document.createElement("script");
        s.src = url;
        s.onload = cb;
        s.onerror = cb;
        document.body.appendChild(s);
    }

    addJs(cdn + "gsap@3.12.5/dist/gsap.min.js", () => {
        addJs(cdn + "gsap@3.12.5/dist/ScrollTrigger.min.js", startSite);
    });

    function startSite() {
        const hasGsap = typeof gsap !== "undefined";
        if (hasGsap && typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

        const overlay = document.getElementById("introOverlay");
        const skipBtn = document.getElementById("skipIntro");
        const wordEl = document.getElementById("introWord");
        const roleEl = document.getElementById("introRole");
        const dotEl = document.getElementById("introDot");
        const canvas = document.getElementById("particleCanvas");

        let dots = [];
        let animId;
                function makePortrait() {
            if (!canvas) return;
            const ctx = canvas.getContext("2d");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const img = new Image();
            img.src = "image/personal.jpg";
            img.onload = () => {
                try {
                    const size = 220;
                    const off = document.createElement("canvas");
                    off.width = size;
                    off.height = size;
                    const octx = off.getContext("2d");

                    octx.filter = "grayscale(100%) contrast(140%) brightness(105%)";
                    octx.drawImage(img, 0, 0, size, size);
                    const data = octx.getImageData(0, 0, size, size).data;

                    const scale = 1.2;
                    const ox = (canvas.width - size * scale) / 2;
                    const oy = (canvas.height - size * scale) / 2 - 75;

                    for (let y = 0; y < size; y += 2) {
                        for (let x = 0; x < size; x += 2) {
                            const dx = (x - size * 0.49) / (size * 0.43);
                            const dy = (y - size * 0.45) / (size * 0.45);
                            if (dx * dx + dy * dy > 1) continue;

                            const b = data[(y * size + x) * 4];
                            // Skip bright room background, keep hair, face, and shirt shades
                            if (b < 238) {
                                const shade = Math.min(255, Math.max(65, b + 25));
                                dots.push({
                                    x: Math.random() * canvas.width,
                                    y: Math.random() * canvas.height,
                                    tx: ox + x * scale,
                                    ty: oy + y * scale,
                                    r: 1.7,
                                    c: `rgb(${shade}, ${shade}, ${shade + 12})`
                                });
                            }
                        }
                    }
                } catch (e) {
                    dots = Array.from({ length: 120 }, () => ({
                        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                        tx: Math.random() * canvas.width, ty: Math.random() * canvas.height,
                        r: 2, c: "#cbd5e1"
                    }));
                }
            };

            function draw() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                dots.forEach(p => {
                    p.x += (p.tx - p.x) * 0.12;
                    p.y += (p.ty - p.y) * 0.12;
                    ctx.fillStyle = p.c;
                    ctx.fillRect(p.x, p.y, p.r, p.r);
                });
                animId = requestAnimationFrame(draw);
            }
            draw();
        }


        function closeIntro() {
            if (!overlay || overlay.dataset.closed === "true") return;
            overlay.dataset.closed = "true";
            cancelAnimationFrame(animId);

            if (hasGsap) {
                gsap.to(overlay, {
                    yPercent: -100,
                    duration: 0.9,
                    ease: "power4.inOut",
                    onComplete: () => {
                        overlay.style.display = "none";
                        gsap.fromTo(".hero-reveal", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, stagger: 0.14 });
                    }
                });
            } else {
                overlay.style.display = "none";
            }
        }

        if (hasGsap) {
            const tl = gsap.timeline({ onComplete: () => setTimeout(closeIntro, 1800) });
            tl.fromTo(dotEl, { scale: 0 }, { scale: 1.5, duration: 0.45, ease: "back.out(2)" })
              .to(dotEl, { scale: 0, opacity: 0, duration: 0.25 })
              .to(wordEl, { opacity: 1, y: -10, duration: 0.55, ease: "power3.out" })
              .to(wordEl, {
                  opacity: 0, duration: 0.3, delay: 0.5,
                  onComplete: () => {
                      wordEl.textContent = "PORTFOLIO";
                      makePortrait();
                  }
              })
              .to(wordEl, { opacity: 1, duration: 0.5 })
              .to(roleEl, { opacity: 1, duration: 0.4 }, "-=0.2");
        } else {
            setTimeout(closeIntro, 2000);
        }

        if (skipBtn) skipBtn.addEventListener("click", closeIntro);

        // Scroll Animations
        if (hasGsap && typeof ScrollTrigger !== "undefined") {
            gsap.fromTo("#stLine1", { xPercent: 4 }, { xPercent: -4, scrollTrigger: { trigger: "#statementSec", start: "top bottom", end: "bottom top", scrub: 1 } });
            gsap.fromTo("#stLine2", { xPercent: -4 }, { xPercent: 4, scrollTrigger: { trigger: "#statementSec", start: "top bottom", end: "bottom top", scrub: 1 } });
            gsap.fromTo("#stLine3", { xPercent: 4 }, { xPercent: -4, scrollTrigger: { trigger: "#statementSec", start: "top bottom", end: "bottom top", scrub: 1 } });

            gsap.utils.toArray(".reveal-up").forEach(el => {
                gsap.fromTo(el, { y: 40, opacity: 0 }, {
                    y: 0, opacity: 1, duration: 0.75, ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" }
                });
            });
        }

        // Theme Toggle (Dark / Light)
        const themeBtn = document.getElementById("themeToggle");
        const themeLbl = document.getElementById("themeLabel");
        if (themeBtn) {
            themeBtn.addEventListener("click", () => {
                const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
                document.documentElement.setAttribute("data-theme", next);
                themeLbl.textContent = next.toUpperCase();
            });
        }

        // Language Toggle (EN / AR)
        const dict = {
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
                    if (dict[lang][key]) el.textContent = dict[lang][key];
                });
            });
        });
    }
})();
