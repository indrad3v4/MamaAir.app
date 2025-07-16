// Analytics tracking for MamaAir.app
(function() {
    'use strict';

    // Track page load
    gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    let scrollDepthTracked = {
        25: false,
        50: false,
        75: false,
        100: false
    };

    function trackScrollDepth() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);

        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
        }

        // Track quarter milestones
        Object.keys(scrollDepthTracked).forEach(depth => {
            if (scrollPercent >= depth && !scrollDepthTracked[depth]) {
                scrollDepthTracked[depth] = true;
                gtag('event', 'scroll_depth', {
                    depth: depth + '%',
                    page_location: window.location.href
                });
            }
        });
    }

    // Throttled scroll tracking
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(trackScrollDepth, 100);
    });

    // Track Play badge clicks
    document.addEventListener('click', function(e) {
        const playLinks = e.target.closest('a[href*="play.google.com"]');
        if (playLinks) {
            gtag('event', 'play_badge_click', {
                utm_source: 'partner',
                button_location: getButtonLocation(e.target),
                page_location: window.location.href
            });
        }
    });

    function getButtonLocation(element) {
        const heroSection = document.querySelector('section');
        const downloadSection = document.querySelector('#download');
        
        if (heroSection && heroSection.contains(element)) {
            return 'hero';
        } else if (downloadSection && downloadSection.contains(element)) {
            return 'download';
        }
        return 'unknown';
    }

    // Track section visibility
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gtag('event', 'section_view', {
                    section_name: entry.target.id,
                    page_location: window.location.href
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => {
        observer.observe(section);
    });

    // Track time on page
    let startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        gtag('event', 'time_on_page', {
            time_seconds: timeOnPage,
            page_location: window.location.href
        });
    });

    // Track language switcher clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-lang]')) {
            const lang = e.target.getAttribute('data-lang') || e.target.textContent;
            gtag('event', 'language_switch', {
                language: lang,
                page_location: window.location.href
            });
        }
    });

    // Track form interactions
    const iframe = document.querySelector('iframe[src*="google.com/forms"]');
    if (iframe) {
        iframe.addEventListener('load', function() {
            gtag('event', 'contact_form_load', {
                page_location: window.location.href
            });
        });
    }

    // Track policy accordion opens
    document.addEventListener('click', function(e) {
        if (e.target.closest('#policies button')) {
            const policyType = e.target.querySelector('h3')?.textContent || 'unknown';
            gtag('event', 'policy_view', {
                policy_type: policyType,
                page_location: window.location.href
            });
        }
    });

})();
