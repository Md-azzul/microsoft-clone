const btn = document.querySelector(".menu-btn");
const menu = document.querySelector(".main-menu");
const nav = document.querySelector(".main-nav");
const icon = btn.querySelector("i");
const overlay = Object.assign(document.createElement("div"), { className: "overlay" });
document.body.appendChild(overlay);

/* Mobile menu */
function setMenu(open) {
    menu.classList.toggle("show", open);
    overlay.classList.toggle("show", open);
    icon.classList.toggle("fa-bars", !open);
    icon.classList.toggle("fa-times", open);
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
btn.addEventListener("click", () => setMenu(!menu.classList.contains("show")));
btn.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); btn.click(); } });
overlay.addEventListener("click", () => setMenu(false));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
addEventListener("resize", () => { if (innerWidth > 700) setMenu(false); });

/* Nav shadow on scroll */
const onScroll = () => nav.classList.toggle("scrolled", scrollY > 10);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* Highlight current section in the menu */
const links = [...menu.querySelectorAll("a")];
const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
}, { rootMargin: "-40% 0px -55% 0px" });
document.querySelectorAll("header[id], section[id]").forEach((s) => spy.observe(s));

/* Scroll reveal with stagger */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
if (!reduce) {
    const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
            if (!e.isIntersecting) return;
            const el = e.target;
            el.classList.add("visible");
            io.unobserve(el);
            // drop the reveal classes afterwards so hover effects stay snappy
            setTimeout(() => {
                el.classList.remove("reveal", "left", "visible");
                el.style.transitionDelay = "";
            }, 900 + parseFloat(el.style.transitionDelay || 0) * 1000);
        });
    }, { threshold: 0.15 });
    [
        [".home-cards > div", ""], [".xbox .content, .carbon .content", "left"],
        [".follow > *", ""], [".links-inner > ul", ""], [".footer-inner > *", ""]
    ].forEach(([sel, dir]) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add("reveal");
            if (dir) el.classList.add(dir);
            el.style.transitionDelay = (i % 4) * 0.12 + "s";
            io.observe(el);
        });
    });
}
