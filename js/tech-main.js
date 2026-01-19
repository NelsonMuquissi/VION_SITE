document.addEventListener('DOMContentLoaded', () => {

    // --- FAQ Logic ---
    const faqSearch = document.getElementById('faqSearch');
    const faqFilters = document.getElementById('faqFilters');
    const faqItems = document.querySelectorAll('.faq-card');

    if (faqSearch && faqFilters) {

        // Search Function
        faqSearch.addEventListener('keyup', (e) => {
            const query = e.target.value.toLowerCase();
            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });

        // Filter Function
        const chips = faqFilters.querySelectorAll('.faq-chip');
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                // Remove active class
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');

                const category = chip.getAttribute('data-filter');

                faqItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Original Scroll Reveal & Counters ---
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const elementVisible = 100;

        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < windowHeight - elementVisible) {
                reveal.classList.add('active');
            }
        });
    };
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll();

    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;
    const startCounters = () => {
        const section = document.getElementById('benefits');
        if (!section) return;

        const sectionTop = section.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;

        if (sectionTop < screenPosition && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const targetText = counter.getAttribute('data-target');
                const target = +targetText;
                const increment = target / 60;

                const updateCount = () => {
                    const count = +counter.innerText;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 30);
                    } else {
                        counter.innerText = targetText + (counter.nextElementSibling && counter.nextElementSibling.innerText.includes('%') ? '' : '');
                    }
                };
                updateCount();
            });
        }
    };
    window.addEventListener('scroll', startCounters);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
