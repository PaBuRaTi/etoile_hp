// étoile — site interactions

const header = document.getElementById('header');
const progressBar = document.getElementById('progressBar');
const toTop = document.getElementById('toTop');
const isTermsPage = header && header.classList.contains('is-scrolled') && !document.querySelector('.hero');

// Sticky header background / progress bar / back-to-top
const onScroll = () => {
  const y = window.scrollY;
  if (header && !isTermsPage) header.classList.toggle('is-scrolled', y > 40);
  if (progressBar) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = max > 0 ? `${(y / max) * 100}%` : '0%';
  }
  if (toTop) toTop.classList.toggle('is-visible', y > 600);
};
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', onScroll, { passive: true });
onScroll();

if (toTop) {
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Mobile nav — body固定式のスクロールロック。
// overflow:hidden 方式はブラウザによってスクロール位置が0にリセットされ、
// メニューを閉じるとページ先頭に飛んでしまうため、position:fixed で固定し
// 閉じるときに元の位置へ復元する。
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('nav');
if (hamburger && nav) {
  let lockedY = 0;

  const lockScroll = () => {
    lockedY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedY}px`;
    document.body.style.width = '100%';
  };
  const unlockScroll = () => {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo({ top: lockedY, behavior: 'instant' });
  };

  const setNav = (open) => {
    nav.classList.toggle('is-open', open);
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    if (open) lockScroll();
    else unlockScroll();
  };

  hamburger.addEventListener('click', () => setNav(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setNav(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) setNav(false);
  });
}

// Scroll reveal
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px' }
);
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Scrollspy — 表示中のセクションに対応するナビリンクを強調
const sections = ['about', 'join', 'schedule', 'access', 'faq']
  .map((id) => document.getElementById(id))
  .filter(Boolean);
if (sections.length) {
  const navLinks = new Map();
  document.querySelectorAll('.nav__list a[href^="#"]').forEach((a) => {
    navLinks.set(a.getAttribute('href').slice(1), a);
  });
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navLinks.get(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach((s) => spy.observe(s));
}
