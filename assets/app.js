    // Prevent benign ResizeObserver loop errors from third-party embeds (TradingView / Google Translate)
    (function () {
      const OriginalResizeObserver = window.ResizeObserver;
      if (OriginalResizeObserver) {
        window.ResizeObserver = function (callback) {
          return new OriginalResizeObserver(function (entries, observer) {
            window.requestAnimationFrame(function () {
              if (Array.isArray(entries) && entries.length > 0) {
                callback(entries, observer);
              }
            });
          });
        };
        window.ResizeObserver.prototype = OriginalResizeObserver.prototype;
      }

      const suppressResizeObserverError = (event) => {
        const msg = event && (event.message || (event.reason && event.reason.message) || '');
        if (typeof msg === 'string' && msg.includes('ResizeObserver loop')) {
          event.stopImmediatePropagation();
          event.preventDefault();
          return true;
        }
      };

      window.addEventListener('error', suppressResizeObserverError, true);
      window.addEventListener('unhandledrejection', suppressResizeObserverError, true);
    })();

    // Gold Dust Particle Animation for Dark Mode Background
    (function initGoldDustParticles() {
      const canvas = document.getElementById('gold-dust-canvas');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      let width = (canvas.width = window.innerWidth);
      let height = (canvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      });

      const particleCount = Math.min(75, Math.floor((width * height) / 18000));
      const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.9 + 0.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.12),
        alpha: Math.random() * 0.65 + 0.2,
        phase: Math.random() * Math.PI * 2
      }));

      function drawParticles() {
        ctx.clearRect(0, 0, width, height);
        const isLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (!isLight) {
          for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            p.phase += 0.025;

            if (p.y < -6) { p.y = height + 6; p.x = Math.random() * width; }
            if (p.x < -6) p.x = width + 6;
            if (p.x > width + 6) p.x = -6;

            const twinkle = p.alpha * (0.65 + 0.35 * Math.sin(p.phase));
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(218, 178, 68, ${twinkle.toFixed(3)})`;
            ctx.shadowBlur = 6;
            ctx.shadowColor = 'rgba(245, 208, 97, 0.55)';
            ctx.fill();
          }
          ctx.shadowBlur = 0;
        }
        requestAnimationFrame(drawParticles);
      }
      requestAnimationFrame(drawParticles);
    })();

    document.addEventListener('DOMContentLoaded', () => {
      const reviewTimes = document.querySelectorAll('.review-time[data-age-hours]');
      if (reviewTimes.length) {
        const reviewClockKey = 'ssi-review-age-clock-start';
        let reviewClockStartedAt = Date.now();
        try {
          const savedStart = Number(localStorage.getItem(reviewClockKey));
          if (Number.isFinite(savedStart) && savedStart > 0) {
            reviewClockStartedAt = savedStart;
          } else {
            localStorage.setItem(reviewClockKey, String(reviewClockStartedAt));
          }
        } catch (error) {
          // Keep the relative review times working when storage is unavailable.
        }

        const updateReviewAges = () => {
          const elapsedHours = Math.floor(Math.max(0, Date.now() - reviewClockStartedAt) / 3600000);
          reviewTimes.forEach((timeEl) => {
            const totalHours = Number(timeEl.dataset.ageHours) + elapsedHours;
            if (totalHours < 24) {
              timeEl.textContent = `${totalHours} ${totalHours === 1 ? 'hour' : 'hours'} ago`;
              return;
            }

            const days = Math.floor(totalHours / 24);
            timeEl.textContent = `${days} ${days === 1 ? 'day' : 'days'} ago`;
          });
        };

        updateReviewAges();
        window.setInterval(updateReviewAges, 60000);
      }

      const heroBackgroundVideos = Array.from(document.querySelectorAll('.hero-video-item'));
      if (heroBackgroundVideos.length) {
        const activeIndex = Math.max(0, heroBackgroundVideos.findIndex((video) => video.classList.contains('is-active')));

        heroBackgroundVideos.forEach((video, index) => {
          video.muted = true;
          video.playsInline = true;
          video.loop = false;
          video.classList.toggle('is-active', index === activeIndex);
          video.addEventListener('ended', () => {
            if (!video.classList.contains('is-active')) return;

            const nextVideo = heroBackgroundVideos[(index + 1) % heroBackgroundVideos.length];
            video.classList.remove('is-active');
            video.pause();
            nextVideo.classList.add('is-active');
            nextVideo.currentTime = 0;
            nextVideo.preload = 'auto';
            nextVideo.play().catch(() => {});
          });

          if (index !== activeIndex) video.pause();
        });

        heroBackgroundVideos[activeIndex].preload = 'auto';
        heroBackgroundVideos[activeIndex].play().catch(() => {});
      }

      const platformVideo = document.querySelector('.section-video');
      if (platformVideo) {
        platformVideo.muted = true;
        platformVideo.playsInline = true;
        platformVideo.play().catch(() => {});
      }

      const accountMenuWrap = document.getElementById('account-menu-wrap');
      const accountMenuToggle = document.getElementById('account-menu-toggle');
      if (accountMenuWrap && accountMenuToggle) {
        accountMenuToggle.addEventListener('click', (event) => {
          event.stopPropagation();
          const isOpen = accountMenuWrap.classList.toggle('is-open');
          accountMenuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        accountMenuWrap.querySelectorAll('.account-menu-link').forEach((link) => {
          link.addEventListener('click', () => {
            accountMenuWrap.classList.remove('is-open');
            accountMenuToggle.setAttribute('aria-expanded', 'false');
          });
        });

        document.addEventListener('click', (event) => {
          if (!accountMenuWrap.contains(event.target)) {
            accountMenuWrap.classList.remove('is-open');
            accountMenuToggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      const comingSoonDialog = document.getElementById('coming-soon-dialog');
      const comingSoonClose = document.getElementById('coming-soon-close');

      document.addEventListener('click', (event) => {
        const featureCard = event.target.closest('.feature-card.is-coming-soon');
        if (featureCard && comingSoonDialog && !comingSoonDialog.open) {
          comingSoonDialog.showModal();
        }
      });

      document.addEventListener('keydown', (event) => {
        const featureCard = event.target.closest('.feature-card.is-coming-soon');
        if (featureCard && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          if (comingSoonDialog && !comingSoonDialog.open) comingSoonDialog.showModal();
        }
      });

      if (comingSoonClose && comingSoonDialog) {
        comingSoonClose.addEventListener('click', () => comingSoonDialog.close());
      }

      /* ======================================================================
         1. LIGHT & DARK THEME TOGGLE (With LocalStorage Persistence)
         ====================================================================== */
      const themeToggleBtn = document.getElementById('theme-toggle-btn');
      const rootEl = document.documentElement;
      const savedTheme = localStorage.getItem('ssi-theme') || 'dark';
      rootEl.setAttribute('data-theme', savedTheme);

      if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
          const currentTheme = rootEl.getAttribute('data-theme');
          const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
          rootEl.setAttribute('data-theme', nextTheme);
          localStorage.setItem('ssi-theme', nextTheme);
        });
      }

      /* ======================================================================
         2. SERVICES DROPDOWN & MOBILE NAV TOGGLE
         ====================================================================== */
      const servicesNavItem = document.getElementById('services-nav-item');
      const servicesToggle = document.getElementById('services-dropdown-toggle');
      const menuToggle = document.getElementById('menu-toggle');
      const primaryNav = document.getElementById('primary-nav');

      if (servicesToggle && servicesNavItem) {
        servicesToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          const isOpen = servicesNavItem.classList.toggle('is-open');
          servicesToggle.setAttribute('aria-expanded', String(isOpen));
        });

        document.addEventListener('click', (e) => {
          if (!servicesNavItem.contains(e.target)) {
            servicesNavItem.classList.remove('is-open');
            servicesToggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
          const isOpen = primaryNav.classList.toggle('is-open');
          menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        primaryNav.querySelectorAll('a').forEach((link) => {
          link.addEventListener('click', () => {
            primaryNav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
          });
        });
      }

      /* Dismiss mini chat pill */
      const closeChatPill = document.getElementById('close-chat-pill');
      const chatPillRow = document.getElementById('chat-pill-row');
      if (closeChatPill && chatPillRow) {
        closeChatPill.addEventListener('click', () => {
          chatPillRow.style.display = 'none';
        });
      }

      /* Scroll to Top button */
      const scrollTopBtn = document.getElementById('scroll-top-btn');
      if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      }

      /* Sample Asset Data & Sparkline Generator */
      const ASSETS_DATA = [
        { name: 'Solarix', ticker: 'SLX', category: 'Crypto', color: '#6c5ce7', price: '$142.80', change: 6.42, points: [128,129,127,130,131,129,132,134,133,135,134,136,138,137,136,139,140,138,137,139,141,142,140,139,141,143,144,142,141,143,145,144,143,142,144,145,143,142,143,142.8] },
        { name: 'Aetheris', ticker: 'ATH', category: 'Crypto', color: '#0984e3', price: '$2,810.50', change: -2.18, points: [2910,2905,2915,2898,2890,2895,2880,2872,2878,2865,2850,2858,2845,2840,2848,2835,2830,2822,2828,2819,2815,2825,2812,2805,2818,2810,2802,2798,2806,2814,2808,2800,2795,2804,2812,2809,2815,2808,2812,2810.5] },
        { name: 'Fine Gold', ticker: 'XAU', category: 'Metals', color: '#d4a017', price: '$2,340.10', change: 1.35, points: [2302,2304,2301,2305,2308,2307,2310,2312,2311,2314,2316,2315,2318,2320,2319,2322,2321,2324,2326,2325,2327,2329,2328,2330,2332,2331,2333,2335,2334,2336,2335,2337,2338,2336,2339,2341,2339,2340,2342,2340.1] },
        { name: 'NordicGrid', ticker: 'NGRD', category: 'Stocks', color: '#00b894', price: '$89.45', change: 3.12, points: [85.2,85.5,85.1,85.8,86.0,85.9,86.3,86.5,86.2,86.7,87.0,86.8,87.2,87.5,87.3,87.8,88.0,87.7,88.1,88.4,88.2,88.6,88.9,88.7,89.0,89.2,88.8,89.1,89.4,89.6,89.3,89.5,89.8,89.4,89.2,89.5,89.7,89.3,89.5,89.45] },
        { name: 'GL Top 10 Index', ticker: 'GL10', category: 'Crypto Indices', color: '#006266', price: '$415.20', change: 4.05, points: [396,397,395,398,400,399,401,403,402,404,406,405,407,408,406,409,411,410,412,413,411,414,415,413,416,417,415,414,416,418,417,415,414,416,417,416,415,414,416,415.2] },
        { name: 'SLX 2x Long', ticker: 'SLX2L', category: 'Leverage', color: '#e17055', price: '$54.90', change: -4.65, points: [59.8,59.4,59.9,59.1,58.7,59.0,58.3,57.9,58.2,57.5,57.1,57.4,56.8,56.4,56.9,56.2,55.9,56.3,55.7,55.4,55.8,55.2,54.8,55.3,54.9,54.5,54.9,55.2,54.7,54.4,54.8,55.1,54.6,54.3,54.7,55.0,54.8,54.6,55.0,54.9] },
        { name: 'Fine Silver', ticker: 'XAG', category: 'Metals', color: '#636e72', price: '$28.64', change: 0.88, points: [28.1,28.15,28.12,28.2,28.24,28.22,28.28,28.3,28.26,28.33,28.36,28.34,28.4,28.42,28.39,28.45,28.48,28.44,28.5,28.52,28.49,28.54,28.56,28.53,28.58,28.6,28.57,28.61,28.63,28.6,28.62,28.65,28.61,28.59,28.63,28.66,28.62,28.63,28.65,28.64] },
        { name: 'Veloce Robotics', ticker: 'VLCE', category: 'Stocks', color: '#2d3436', price: '$312.00', change: -1.42, points: [319,318.5,319.2,318,317.4,317.8,316.9,316.2,316.8,315.9,315.2,315.7,314.9,314.4,315.0,314.1,313.6,314.2,313.5,313.0,313.6,312.8,312.3,312.9,312.2,311.8,312.4,312.7,312.1,311.6,312.2,312.5,311.9,311.5,312.0,312.3,311.8,311.9,312.1,312.0] }
      ];

      function formatCompactValue(val) {
        if (val >= 1000) return val.toFixed(0);
        if (val >= 100) return val.toFixed(1);
        return val.toFixed(2);
      }

      function createSparklineSVG(points, isPositive, uid) {
        const width = 220;
        const height = 84;
        const padTop = 14;
        const padBottom = 14;
        const plotHeight = height - padTop - padBottom;
        const minVal = Math.min(...points);
        const maxVal = Math.max(...points);
        const range = maxVal - minVal || 1;
        const strokeColor = isPositive ? '#0a8f5b' : '#e5323b';
        const gradId = `spark-grad-${uid}`;

        const coords = points.map((pt, idx) => {
          const x = (idx / (points.length - 1)) * width;
          const y = padTop + ((maxVal - pt) / range) * plotHeight;
          return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
        });

        const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
        const areaPath = `${linePath} L ${width} ${height - padBottom} L 0 ${height - padBottom} Z`;

        return `
          <svg class="sparkline-svg" viewBox="0 0 ${width} ${height}" aria-hidden="true">
            <defs>
              <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.22" />
                <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="${padTop}" x2="${width}" y2="${padTop}" stroke="#333333" stroke-width="1" stroke-dasharray="3 3" />
            <text x="${width}" y="${padTop - 3}" text-anchor="end" font-size="9" fill="#777" font-family="Inter, sans-serif">H: ${formatCompactValue(maxVal)}</text>
            <text x="${width}" y="${height - 2}" text-anchor="end" font-size="9" fill="#777" font-family="Inter, sans-serif">L: ${formatCompactValue(minVal)}</text>
            <path d="${areaPath}" fill="url(#${gradId})" />
            <path d="${linePath}" fill="none" stroke="${strokeColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        `;
      }

      /* Carousel & Filter Tabs */
      const carouselEl = document.getElementById('asset-carousel');
      const filterTabs = document.querySelectorAll('.filter-tab');
      const assetPrevBtn = document.getElementById('asset-prev');
      const assetNextBtn = document.getElementById('asset-next');

      function renderAssetCards(category) {
        if (!carouselEl) return;
        const filtered = category === 'All assets' ? ASSETS_DATA : ASSETS_DATA.filter(item => item.category === category);

        carouselEl.innerHTML = filtered.map((asset, index) => {
          const isPos = asset.change >= 0;
          const arrowSymbol = isPos ? '▲' : '▼';
          const formattedChange = `${isPos ? '+' : ''}${asset.change.toFixed(2)}%`;

          return `
            <article class="asset-card">
              <div class="asset-card-header">
                <span class="asset-badge" style="background-color: ${asset.color};">${asset.ticker.slice(0, 2)}</span>
                <h3 class="asset-name">${asset.name}</h3>
              </div>
              <div class="sparkline-box">
                ${createSparklineSVG(asset.points, isPos, `${asset.ticker}-${index}`)}
              </div>
              <div>
                <div class="asset-card-footer">
                  <span class="asset-price">${asset.price}</span>
                  <span class="asset-ticker">${asset.ticker}</span>
                </div>
                <div class="asset-change ${isPos ? 'is-positive' : 'is-negative'}">
                  <span>${arrowSymbol}</span>
                  <span>${formattedChange}</span>
                </div>
              </div>
            </article>
          `;
        }).join('');
        carouselEl.scrollLeft = 0;
      }

      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
          tab.classList.add('is-active');
          tab.setAttribute('aria-selected', 'true');
          renderAssetCards(tab.dataset.filter);
        });
      });

      if (assetPrevBtn && assetNextBtn && carouselEl) {
        const getScrollStep = () => {
          const card = carouselEl.querySelector('.asset-card');
          return card ? card.offsetWidth + 18 : 282;
        };
        assetPrevBtn.addEventListener('click', () => carouselEl.scrollBy({ left: -getScrollStep(), behavior: 'smooth' }));
        assetNextBtn.addEventListener('click', () => carouselEl.scrollBy({ left: getScrollStep(), behavior: 'smooth' }));
      }

      renderAssetCards('All assets');

      /* Reviews Slider */
      const reviewsTrack = document.getElementById('reviews-track');
      const reviewsViewport = document.getElementById('reviews-viewport');
      const reviewPrevBtn = document.getElementById('review-prev');
      const reviewNextBtn = document.getElementById('review-next');

      if (reviewsTrack && reviewsViewport && reviewPrevBtn && reviewNextBtn) {
        const reviewCards = Array.from(reviewsTrack.children);
        let currentIndex = 0;

        function getVisibleCount() {
          if (window.innerWidth <= 768) return 1;
          if (window.innerWidth <= 1024) return 2;
          return 3;
        }

        function updateReviewSlider() {
          const visibleCount = getVisibleCount();
          const maxIndex = Math.max(0, reviewCards.length - visibleCount);
          currentIndex = Math.min(Math.max(0, currentIndex), maxIndex);
          const gap = 16;
          const cardWidth = reviewCards[0].getBoundingClientRect().width;
          const offset = currentIndex * (cardWidth + gap);
          reviewsTrack.style.transform = `translateX(-${offset}px)`;
          reviewPrevBtn.disabled = currentIndex === 0;
          reviewNextBtn.disabled = currentIndex >= maxIndex;
        }

        reviewPrevBtn.addEventListener('click', () => { currentIndex--; updateReviewSlider(); });
        reviewNextBtn.addEventListener('click', () => { currentIndex++; updateReviewSlider(); });
        window.addEventListener('resize', updateReviewSlider);
        updateReviewSlider();
      }

      /* ======================================================================
         6. DEDICATED SERVICE PAGES DATA & SPA ROUTER (ALL 8 SERVICES)
         ====================================================================== */
      const SERVICE_PAGE_URLS = {
        'real-estate': 'realestate.html',
        'gold-commodities': 'gold.html',
        'crypto-currency': 'crypto.html',
        'stock-and-etfs': 'stocks.html',
        'agriculture': 'agriculture.html',
        'loan-offers': 'loans.html',
        'fund-recovery': 'fund-recovery.html',
        'big-bank-energy': 'big-bank-energy.html',
      };

      const SERVICES_CATALOG = {
        'real-estate': {
          slug: 'real-estate',
          name: 'Real Estate',
          breadcrumb: 'Invest in Real Estate',
          heroTitle: 'OWN PRIME GLOBAL<br />REAL ESTATE',
          heroSubtitle: 'Invest in fractional residential, commercial, and high-yield property developments with automated rental payouts.',
          heroAsset: 'real-estate-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/real3.jpg',
              alt: 'Real estate property investment visual showcase'
            },
            architecture: {
              src: 'Images/real1.jpg',
              alt: 'Real estate portfolio investment illustration'
            },
            market: {
              src: 'Images/real5.jpg',
              alt: 'Real estate assets and portfolio strategies'
            }
          },
          riskNote: 'Real estate values and rental yields can fluctuate depending on market conditions. Review property documentation before investing.',
          showcase1Title: 'SPEND YOUR RENTAL<br />YIELDS LIKE CASH',
          showcase1Desc: 'Use your SOLIDSPARK Card to spend monthly property dividends and real estate returns anywhere worldwide.',
          showcase1Cta: 'Get the SOLIDSPARK Card',
          showcase1Balance: '$14,820.40',
          showcase1Sub: 'Rental Yield Portfolio Available',
          showcase2Title: 'TRACK PROPERTY<br />VALUATIONS LIVE',
          showcase2Desc: 'Monitor quarterly appraisals, occupancy rates, and instant dividend distributions directly from your mobile dashboard.',
          showcase2Target: '$250,000',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR REAL ESTATE INVESTING',
          pillars: [
            { title: 'Fractional Ownership', desc: 'Start investing in vetted institutional properties from as little as $50.' },
            { title: 'Asset-Backed Security', desc: 'Every property share is backed by registered title deeds and audited valuations.' },
            { title: 'Monthly Rental Dividends', desc: 'Receive automated rental distributions directly into your SOLIDSPARK wallet.' },
            { title: 'Portfolio Diversification', desc: 'Hedge inflation with tangible urban and commercial real estate assets.' }
          ],
          pricesHeading: 'LATEST REAL ESTATE PORTFOLIO LISTINGS',
          pricesSub: 'Track live unit prices, occupancy yields, and capitalization rates across featured property trusts.',
          tableRows: [
            { name: 'Metro Tower REIT', ticker: 'MTRW', cap: '$1,420,500,000', price: '$118.40', change: '+1.45%', pos: true },
            { name: 'Nordic Logistics Park', ticker: 'NDLP', cap: '$890,210,000', price: '$94.15', change: '+0.82%', pos: true },
            { name: 'Alpine Hospitality Fund', ticker: 'ALPH', cap: '$640,800,000', price: '$76.90', change: '-0.34%', pos: false },
            { name: 'Rhine Commercial Hub', ticker: 'RCHB', cap: '$1,115,000,000', price: '$132.60', change: '+2.10%', pos: true }
          ],
          whyTitle: 'WHY INVEST IN<br />REAL ESTATE?',
          whyDesc: 'Real estate provides predictable cash flow, long-term capital appreciation, and a natural hedge against currency inflation without the hassle of direct property management.',
          whyAsset: 'real-estate-3d.png (800×800)',
          articles: [
            'REITS VS. DIRECT PROPERTY: WHICH FITS YOUR PORTFOLIO?',
            'HOW RENTAL YIELDS COMPOUND OVER A 10-YEAR HORIZON',
            'COMMERCIAL VS. RESIDENTIAL REAL ESTATE IN MODERN MARKETS'
          ],
          faqs: [
            { q: 'HOW ARE REAL ESTATE DIVIDENDS DISTRIBUTED?', a: 'Rental distributions are calculated net of management fees and credited automatically to your SOLIDSPARK USD balance on a monthly basis.' },
            { q: 'CAN I SELL MY FRACTIONAL PROPERTY SHARES ANYTIME?', a: 'Yes, you can list or liquidate your property tokens 24/7 on the SOLIDSPARK secondary liquidity pool.' }
          ]
        },
        'gold-commodities': {
          slug: 'gold-commodities',
          name: 'Gold Commodities',
          breadcrumb: 'Invest in Gold & Metals',
          heroTitle: 'REAL METALS.<br />REAL OWNERSHIP.',
          heroSubtitle: 'Buy gold, silver, platinum, and palladium with SOLIDSPARK — physically backed precious metals stored in secure vaults, tradable 24/7.',
          heroAsset: 'gold-bars-circle.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/gold2.jpg',
              alt: 'Gold bullion displayed as a precious-metals market preview'
            },
            architecture: {
              src: 'Images/gold3.jpg',
              alt: 'Gold bullion and precious metals investment illustration'
            },
            market: {
              src: 'Images/gold1.jpg',
              alt: 'Precious metals portfolio and market strategies'
            }
          },
          riskNote: 'Precious metal prices fluctuate with global commodity markets. Past performance is not indicative of future results.',
          showcase1Title: 'SPEND YOUR GOLD<br />LIKE CASH',
          showcase1Desc: 'Convert fractional gold bullion into everyday purchases instantly using the SOLIDSPARK Card.',
          showcase1Cta: 'Get the SOLIDSPARK Card',
          showcase1Balance: '$8,490.15',
          showcase1Sub: '0.1142 kg Fine Gold Available',
          showcase2Title: 'FOLLOW THE<br />BULLION MARKET',
          showcase2Desc: 'Set automated price alerts on spot gold and silver so you never miss an ideal entry or profit-taking target.',
          showcase2Target: '$2,450.00',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR PRECIOUS METALS INVESTING',
          pillars: [
            { title: 'Own What You Buy', desc: 'You own your bullion outright. It is your legal property stored in high-security vaults.' },
            { title: 'Physically Backed & Certified', desc: '100% linked to physical LBMA-accredited investment-grade bars.' },
            { title: 'Fractional Access to Metals', desc: 'Get fractional access to gold, silver, and platinum starting from just $500.' },
            { title: 'Diversify with Stability', desc: 'Precious metals act as a timeless store of value during market volatility.' }
          ],
          pricesHeading: 'LATEST PRECIOUS METALS PRICES',
          pricesSub: 'Track real-time prices for gold, silver, platinum and palladium, updated continuously.',
          tableRows: [
            { name: 'Gold', ticker: 'XAU', cap: '$21,529,083,133,157', price: '$113.29', change: '+0.12%', pos: true },
            { name: 'Silver', ticker: 'XAG', cap: '$112,251,773,738', price: '$1.4213', change: '-2.09%', pos: false },
            { name: 'Platinum', ticker: 'XPT', cap: '$10,662,875,797', price: '$43.56', change: '-0.82%', pos: false },
            { name: 'Palladium', ticker: 'XPD', cap: '$5,616,625,550', price: '$29.18', change: '-0.54%', pos: false }
          ],
          whyTitle: 'WHY INVEST IN<br />PRECIOUS METALS?',
          whyDesc: 'Precious metals like gold offer stability when markets shift. As tangible bullion, they act as a timeless hedge against inflation and help diversify modern portfolios.',
          whyAsset: 'precious-metals-node.png (800×800)',
          articles: [
            'GOLD OR BITCOIN: WHICH IS THE BETTER CHOICE FOR INVESTORS?',
            'GOLD AND INFLATION: HOW SECURE IS THE METAL IN CRISIS?',
            'BUYING PHYSICAL GOLD OR INVESTING IN ETFS: A COMPARISON'
          ],
          faqs: [
            { q: "WHAT DOES 'PHYSICALLY BACKED' MEAN?", a: 'Every gram of gold or silver you purchase on SOLIDSPARK is 100% backed by physical bullion bars held in insured, high-security vaults.' },
            { q: 'HOW ARE THE PRECIOUS METALS STORED?', a: 'Bullion is stored in allocated vault facilities in Switzerland and audited regularly by independent inspectors.' }
          ]
        },
        'crypto-currency': {
          slug: 'crypto-currency',
          name: 'Crypto Currency',
          breadcrumb: 'Invest in cryptocurrencies',
          heroTitle: 'JOIN THE CRYPTO<br />MOVEMENT',
          heroSubtitle: 'Invest in Bitcoin, Ethereum, Polkadot and more fast, secure and 24/7.*',
          heroAsset: 'crypto-investor-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/crypto.jpg',
              alt: 'Bitcoin, Ethereum and other cryptocurrency coins'
            },
            architecture: {
              src: 'Images/crypto2.jpg',
              alt: 'Cryptocurrency market architecture illustration'
            },
            market: {
              src: 'Images/crypto3.jpg',
              alt: 'Bitcoin and cryptocurrency coins arranged on a light background'
            },
            savings: {
              src: 'Images/savings.jpg',
              alt: 'Savings plan piggy bank with coins and cash'
            }
          },
          riskNote: 'Crypto-assets are highly volatile. You could sustain a loss of some or all of your investment, so invest only what you can afford to lose.',
          showcase1Title: 'SPEND YOUR<br />CRYPTO LIKE CASH',
          showcase1Desc: 'Use the SOLIDSPARK Card to spend crypto, precious metals and other assets anywhere you want.',
          showcase1Cta: 'Get the SOLIDSPARK Card',
          showcase1Balance: '$1,248.59',
          showcase1Sub: '0.02764 BTC available',
          showcase2Title: 'FOLLOW THE<br />CRYPTO MARKET',
          showcase2Desc: 'Track your price movements with targeted notifications, set up price alerts to move with the market or HODL as long as you want.',
          showcase2Target: '$100,000',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR CRYPTO INVESTING',
          pillars: [
            { title: 'Do it all on SOLIDSPARK', desc: 'Invest in crypto alongside Stocks & ETFs, precious metals and more — all in one place.' },
            { title: 'Invest your way', desc: 'Easily swap your cryptocurrencies with Stocks & ETFs, precious metals and other assets.' },
            { title: 'Set up a savings plan', desc: 'Set up automatic daily, weekly or monthly recurring buys in your favourite digital assets.' },
            { title: 'More money in your portfolio', desc: 'Zero deposit and withdrawal fees across supported payment methods.' }
          ],
          pricesHeading: 'LATEST CRYPTOCURRENCY PRICES',
          pricesSub: 'Track real-time prices for Bitcoin, Ethereum, Solana and leading digital assets 24/7.',
          tableRows: [
            { name: 'Bitcoin', ticker: 'BTC', cap: '$1,840,120,450,000', price: '$95,370.95', change: '+2.84%', pos: true },
            { name: 'Ethereum', ticker: 'ETH', cap: '$382,410,900,000', price: '$3,180.40', change: '+1.65%', pos: true },
            { name: 'Solana', ticker: 'SOL', cap: '$84,920,110,000', price: '$178.20', change: '-0.92%', pos: false },
            { name: 'Polkadot', ticker: 'DOT', cap: '$11,450,300,000', price: '$7.85', change: '+4.12%', pos: true }
          ],
          whyTitle: 'WHY INVEST IN<br />CRYPTOCURRENCIES?',
          whyDesc: 'Cryptocurrencies power decentralized global networks, borderless settlement, and programmable finance—offering high-growth asymmetric potential for modern portfolios.',
          whyAsset: 'crypto-network-3d.png (800×800)',
          articles: [
            'BITCOIN 101: UNDERSTANDING DIGITAL SCARCITY',
            'DOLLAR-COST AVERAGING INTO CRYPTO WITH SAVINGS PLANS',
            'COLD STORAGE SECURITY: HOW YOUR KEYS STAY PROTECTED'
          ],
          faqs: [
            { q: 'HOW ARE MY CRYPTO ASSETS STORED?', a: 'The vast majority of user crypto assets are held in multi-signature offline cold storage vaults with institutional-grade security controls.' },
            { q: 'CAN I SWAP BETWEEN CRYPTO AND OTHER ASSETS?', a: 'Yes, you can instantly swap any supported cryptocurrency directly into gold, stocks, or fiat balances 24/7.' }
          ]
        },
        'stock-and-etfs': {
          slug: 'stock-and-etfs',
          name: 'Stock and EFTs',
          breadcrumb: 'Invest in Stocks & ETFs',
          heroTitle: 'INVEST IN GLOBAL<br />STOCKS & ETFS',
          heroSubtitle: 'Buy fractional shares of the world’s top companies and diversified index ETFs commission-free, 24/7.',
          heroAsset: 'stocks-etfs-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/stock3.jpg',
              alt: 'Stocks and exchange-traded funds market showcase'
            },
            architecture: {
              src: 'Images/stock1.jpg',
              alt: 'Stocks and ETF portfolio investment illustration'
            },
            market: {
              src: 'Images/stock2.jpg',
              alt: 'Stocks and ETF assets and portfolio strategies'
            }
          },
          riskNote: 'Capital at risk. The value of stocks and ETFs can go down as well as up and you may get back less than you invest.',
          showcase1Title: 'SPEND YOUR<br />DIVIDENDS LIKE CASH',
          showcase1Desc: 'Put your stock dividends and ETF returns to work immediately with the SOLIDSPARK Card.',
          showcase1Cta: 'Get the SOLIDSPARK Card',
          showcase1Balance: '$19,340.00',
          showcase1Sub: 'Global Tech & S&P ETF Portfolio',
          showcase2Title: 'SET LIMIT ORDERS<br />& PRICE ALERTS',
          showcase2Desc: 'Automate your entries on Apple, NVIDIA, Tesla, and leading S&P 500 ETFs with precision target alerts.',
          showcase2Target: '$245.00',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR STOCKS & ETFS',
          pillars: [
            { title: 'Fractional Shares from $500', desc: 'Own a slice of high-priced blue-chip stocks regardless of share price.' },
            { title: 'Zero Commission Trading', desc: 'Keep more of your returns with transparent spreads and no hidden ticket fees.' },
            { title: 'Automated ETF Savings', desc: 'Build long-term wealth effortlessly with recurring index investments.' },
            { title: 'Pro-Rata Dividends', desc: 'Receive your proportional share of cash dividends directly in your account.' }
          ],
          pricesHeading: 'LATEST STOCKS & ETFS PRICES',
          pricesSub: 'Real-time quotes for global technology leaders and broad-market exchange-traded funds.',
          tableRows: [
            { name: 'NVIDIA Corp.', ticker: 'NVDA', cap: '$3,120,000,000,000', price: '$134.50', change: '+2.40%', pos: true },
            { name: 'Apple Inc.', ticker: 'AAPL', cap: '$3,380,000,000,000', price: '$218.90', change: '+0.75%', pos: true },
            { name: 'S&P 500 Core ETF', ticker: 'CSPX', cap: '$98,400,000,000', price: '$542.10', change: '+0.48%', pos: true },
            { name: 'Tesla Inc.', ticker: 'TSLA', cap: '$790,500,000,000', price: '$246.30', change: '-1.15%', pos: false }
          ],
          whyTitle: 'WHY INVEST IN<br />STOCKS & ETFS?',
          whyDesc: 'Equities and broad-market ETFs have historically delivered compounding long-term wealth growth, allowing you to own stakes in the world’s most innovative businesses.',
          whyAsset: 'stocks-etf-blocks.png (800×800)',
          articles: [
            'ETFS EXPLAINED: HOW ONE TRADE BUYS 500 COMPANIES',
            'FRACTIONAL INVESTING: STARTING BIG WITH SMALL AMOUNTS',
            'DIVIDEND GROWTH INVESTING FOR PASSIVE INCOME'
          ],
          faqs: [
            { q: 'DO I RECEIVE DIVIDENDS ON FRACTIONAL SHARES?', a: 'Yes, whenever a company or ETF distributes a dividend, your proportional share is credited automatically to your wallet.' },
            { q: 'CAN I TRADE STOCKS OUTSIDE MARKET HOURS?', a: 'Yes, SOLIDSPARK enables 24/7 fractional trading so you can react to news anytime.' }
          ]
        },
        'agriculture': {
          slug: 'agriculture',
          name: 'Agriculture',
          breadcrumb: 'Agricultural Commodities & Farmland',
          heroTitle: 'CULTIVATE WEALTH IN<br />GLOBAL AGRICULTURE',
          heroSubtitle: 'Invest in productive farmland trusts, essential soft commodities, and sustainable AgriTech supply chains.',
          heroAsset: 'agriculture-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/agric1.jpg',
              alt: 'Golden field of wheat ready for harvest'
            },
            architecture: {
              src: 'Images/agric2.jpg',
              alt: 'Farmers tending green crop rows'
            },
            market: {
              src: 'Images/agric3.jpg',
              alt: 'Cattle grazing on a sustainable farm'
            }
          },
          riskNote: 'Agricultural commodities are influenced by weather patterns, seasonal cycles, and global supply chains.',
          showcase1Title: 'HARVEST YIELDS<br />INTO DAILY SPENDING',
          showcase1Desc: 'Access seasonal crop returns and farmland dividends directly via your SOLIDSPARK Card.',
          showcase1Cta: 'Get the SOLIDSPARK Card',
          showcase1Balance: '$7,290.50',
          showcase1Sub: 'Agri-Commodity & Farmland Basket',
          showcase2Title: 'TRACK GLOBAL CROP<br />& GRAIN MARKETS',
          showcase2Desc: 'Monitor wheat, coffee, cocoa, and sustainable farmland indices with instant price alerts.',
          showcase2Target: '$640.00',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR AGRICULTURE INVESTING',
          pillars: [
            { title: 'Essential Real Assets', desc: 'Food and agricultural production represent non-discretionary global demand.' },
            { title: 'Inflation Protection', desc: 'Soft commodities and farmland historically rise alongside consumer food prices.' },
            { title: 'Sustainable AgriTech', desc: 'Back precision farming, irrigation, and high-yield crop innovation.' },
            { title: 'Low Equity Correlation', desc: 'Balance tech-heavy portfolios with tangible land and harvest cycles.' }
          ],
          pricesHeading: 'LATEST AGRICULTURE & COMMODITY PRICES',
          pricesSub: 'Live market prices for grain baskets, farmland trusts, and agricultural producers.',
          tableRows: [
            { name: 'Global Wheat Index', ticker: 'WEAT', cap: '$14,200,000,000', price: '$612.40', change: '+1.18%', pos: true },
            { name: 'European Farmland REIT', ticker: 'EUFM', cap: '$3,450,000,000', price: '$84.20', change: '+0.55%', pos: true },
            { name: 'Arabica Coffee ETC', ticker: 'COFF', cap: '$4,890,000,000', price: '$238.75', change: '+2.64%', pos: true },
            { name: 'AgriTech Leaders ETF', ticker: 'AGRI', cap: '$2,710,000,000', price: '$49.30', change: '-0.42%', pos: false }
          ],
          whyTitle: 'WHY INVEST IN<br />AGRICULTURE?',
          whyDesc: 'With a growing global population and finite arable land, productive farmland and essential agricultural commodities offer resilient, inflation-hedged returns.',
          whyAsset: 'agriculture-3d.png (800×800)',
          articles: [
            'FARMLAND AS AN ASSET CLASS: HISTORICAL STABILITY',
            'SOFT COMMODITIES 101: GRAINS, COFFEE & COCOA',
            'HOW PRECISION AGRITECH IS TRANSFORMING CROP YIELDS'
          ],
          faqs: [
            { q: 'HOW DO I GAIN EXPOSURE TO FARMLAND WITHOUT BUYING A FARM?', a: 'Through fractional shares in audited agricultural land trusts and commodity ETCs available directly on SOLIDSPARK.' },
            { q: 'ARE AGRICULTURAL RETURNS SEASONAL?', a: 'Farmland trusts typically distribute annual or semi-annual harvest yields, while commodity ETCs trade continuously.' }
          ]
        },
        'loan-offers': {
          slug: 'loan-offers',
          name: 'Loan Offers',
          breadcrumb: 'Collateralized Credit & Loan Offers',
          heroTitle: 'INSTANT LIQUIDITY.<br />KEEP YOUR ASSETS.',
          heroSubtitle: 'Unlock flexible credit lines backed by your crypto, gold, or stock portfolio without selling your long-term investments.',
          heroAsset: 'loan-offers-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/loan4.jpg',
              alt: 'Loan offers visual showcase'
            },
            architecture: {
              src: 'Images/loan3.jpg',
              alt: 'Asset-backed loan investment illustration'
            },
            market: {
              src: 'Images/loan2.jpg',
              alt: 'Loan offers and portfolio strategies'
            }
          },
          riskNote: 'Borrowing against volatile collateral carries liquidation risk if collateral value drops below maintenance thresholds.',
          showcase1Title: 'SPEND YOUR CREDIT<br />LINE IMMEDIATELY',
          showcase1Desc: 'Draw down approved funds straight onto your SOLIDSPARK Card with zero origination delays.',
          showcase1Cta: 'Explore Credit Limits',
          showcase1Balance: '$15,000.00',
          showcase1Sub: 'Available Credit Line at 4.9% APR',
          showcase2Title: 'REAL-TIME LTV<br />HEALTH ALERTS',
          showcase2Desc: 'Stay in full control with automated Loan-to-Value notifications and one-tap collateral top-ups.',
          showcase2Target: '35% LTV',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR PORTFOLIO LOANS',
          pillars: [
            { title: 'No Credit Score Checks', desc: 'Your existing SOLIDSPARK portfolio serves as instant collateral.' },
            { title: 'Keep Market Upside', desc: 'Your pledged Bitcoin, gold, or ETFs remain yours while you access cash.' },
            { title: 'Flexible Repayment', desc: 'Repay principal and interest on your own schedule with zero early exit fees.' },
            { title: 'Instant Approval', desc: 'Funds disburse to your USD wallet in under 60 seconds.' }
          ],
          pricesHeading: 'CURRENT SOLIDSPARK LOAN TIERS & RATES',
          pricesSub: 'Compare interest rates, Loan-to-Value ratios, and supported collateral pools.',
          tableRows: [
            { name: 'Gold-Backed Credit Line', ticker: 'GLD-LN', cap: '$250,000', price: '4.50% APR', change: '70% Max LTV', pos: true },
            { name: 'Bitcoin Collateral Loan', ticker: 'BTC-LN', cap: '$500,000', price: '5.90% APR', change: '60% Max LTV', pos: true },
            { name: 'Blue-Chip ETF Credit', ticker: 'ETF-LN', cap: '$150,000', price: '4.90% APR', change: '65% Max LTV', pos: true },
            { name: 'Stablecoin Express Line', ticker: 'USD-LN', cap: '$100,000', price: '3.95% APR', change: '80% Max LTV', pos: true }
          ],
          whyTitle: 'WHY USE ASSET-BACKED<br />LOAN OFFERS?',
          whyDesc: 'Selling appreciating assets triggers taxable events and cuts off future gains. Collateralized loans give you immediate liquidity while your portfolio keeps working.',
          whyAsset: 'loan-vault-3d.png (800×800)',
          articles: [
            'HOW PORTFOLIO-BACKED LOANS WORK WITHOUT SELLING',
            'MANAGING LOAN-TO-VALUE (LTV) RATIOS SAFELY',
            'GOLD-BACKED CREDIT VS. TRADITIONAL BANK LOANS'
          ],
          faqs: [
            { q: 'HOW FAST DO I RECEIVE MY LOAN FUNDS?', a: 'Once you select your collateral amount and confirm terms, funds are credited to your wallet immediately.' },
            { q: 'ARE THERE EARLY REPAYMENT PENALTIES?', a: 'No, you can repay part or all of your loan balance at any time with zero penalties.' }
          ]
        },
        'fund-recovery': {
          slug: 'fund-recovery',
          name: 'Fund Recovery',
          breadcrumb: 'Asset Tracing & Fund Recovery',
          heroTitle: 'RECLAIM & TRACE<br />YOUR DIGITAL ASSETS',
          heroSubtitle: 'Forensic blockchain tracing, lost wallet access assistance, and structured dispute documentation led by compliance specialists.',
          heroAsset: 'fund-recovery-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/rec1.jpg',
              alt: 'Fund recovery visual showcase'
            },
            architecture: {
              src: 'Images/rec2.jpg',
              alt: 'Fund recovery and asset tracing illustration'
            },
            market: {
              src: 'Images/rec3.jpg',
              alt: 'Fund recovery assets and portfolio strategies'
            }
          },
          riskNote: 'Recovery outcomes depend on on-chain traceability, exchange cooperation, and jurisdictional legal processes.',
          showcase1Title: 'SECURE RECOVERED<br />FUNDS IN ONE VAULT',
          showcase1Desc: 'Once traced and reclaimed, deposit recovered assets into cold storage or spend via your SOLIDSPARK Card.',
          showcase1Cta: 'Start Case Assessment',
          showcase1Balance: '$12,500.00',
          showcase1Sub: 'Verified Case Escrow Balance',
          showcase2Title: 'REAL-TIME FORENSIC<br />CASE MILESTONES',
          showcase2Desc: 'Track every blockchain audit report, exchange freeze request, and legal filing directly in your portal.',
          showcase2Target: 'Stage 3/4',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR FUND RECOVERY',
          pillars: [
            { title: 'On-Chain Forensics', desc: 'Advanced transaction graph clustering to trace misrouted or unauthorized transfers.' },
            { title: 'Exchange Liaison', desc: 'Formal compliance dossiers prepared for regulated VASP and banking freeze requests.' },
            { title: 'Wallet Access Support', desc: 'Cryptographic recovery protocols for corrupted or partially remembered wallet backups.' },
            { title: 'Transparent Fee Structure', desc: 'Clear upfront case evaluation with no hidden administrative charges.' }
          ],
          pricesHeading: 'FUND RECOVERY SERVICE PACKAGES',
          pricesSub: 'Structured forensic tracing and asset restitution tiers tailored to case complexity.',
          tableRows: [
            { name: 'On-Chain Trace & Report', ticker: 'TRC-01', cap: '$15,000', price: '$120.00', change: '+4.50%', pos: true },
            { name: 'Exchange Freeze Dossier', ticker: 'FRZ-02', cap: '$45,000', price: '$350.00', change: '+6.20%', pos: true },
            { name: 'Wallet Seed & Key Audit', ticker: 'WLT-03', cap: '$85,000', price: '$540.00', change: '+3.80%', pos: true },
            { name: 'Institutional Restitution', ticker: 'INS-04', cap: '$250,000', price: '$980.00', change: '+7.40%', pos: true }
          ],
          whyTitle: 'WHY CHOOSE SOLIDSPARK<br />FUND RECOVERY?',
          whyDesc: 'Speed and forensic accuracy are critical when tracing digital assets. Our compliance team produces court-ready blockchain intelligence reports recognized by exchanges.',
          whyAsset: 'forensic-shield-3d.png (800×800)',
          articles: [
            'FIRST 24 HOURS: WHAT TO DO AFTER AN UNAUTHORIZED TRANSFER',
            'HOW BLOCKCHAIN FORENSICS TRACKS FUNDS ACROSS BRIDGES',
            'PROTECTING YOUR PORTFOLIO WITH HARDWARE & MULTI-SIG'
          ],
          faqs: [
            { q: 'WHAT INFORMATION DO I NEED TO START A CASE?', a: 'Provide transaction hashes (TXIDs), receiving wallet addresses, dates, and any communication logs for our initial forensic review.' },
            { q: 'DO YOU EVER ASK FOR MY CURRENT PRIVATE KEYS?', a: 'Never. For active wallets, we only ever require public transaction IDs and read-only addresses.' }
          ]
        },
        'big-bank-energy': {
          slug: 'big-bank-energy',
          name: 'Big Bank Energy Investment',
          breadcrumb: 'Banking & Global Energy Infrastructure',
          heroTitle: 'POWER YOUR PORTFOLIO.<br />BANKS & ENERGY.',
          heroSubtitle: 'Invest in systemically important global banks alongside renewable and traditional energy infrastructure leaders.',
          heroAsset: 'bank-energy-hero.png (1200×1200)',
          images: {
            hero: {
              src: 'Images/bank3.jpg',
              alt: 'Big Bank Energy Investment market showcase'
            },
            architecture: {
              src: 'Images/bank1.jpg',
              alt: 'Big Bank Energy investment analysis'
            },
            market: {
              src: 'Images/bank2.jpg',
              alt: 'Big Bank Energy assets and portfolio strategies'
            }
          },
          riskNote: 'Financial and energy equities are sensitive to interest rate policies and global commodity cycles.',
          showcase1Title: 'SPEND INSTITUTIONAL<br />DIVIDENDS DAILY',
          showcase1Desc: 'Access quarterly payouts from tier-1 banks and energy utilities directly on your SOLIDSPARK Card.',
          showcase1Cta: 'Get the SOLIDSPARK Card',
          showcase1Balance: '$22,410.90',
          showcase1Sub: 'Banking & Energy Yield Portfolio',
          showcase2Title: 'TRACK RATES &<br />ENERGY BENCHMARKS',
          showcase2Desc: 'Monitor central bank rate decisions, Brent crude, and clean grid ETFs with real-time alerts.',
          showcase2Target: '$188.00',
          pillarsHeading: 'THE SOLIDSPARK STANDARD FOR BANKING & ENERGY',
          pillars: [
            { title: 'Tier-1 Global Banks', desc: 'Fractional access to JPMorgan, HSBC, BNP Paribas, and leading global banks.' },
            { title: 'Clean & Traditional Energy', desc: 'Balanced exposure across solar/wind utilities and major energy producers.' },
            { title: 'Strong Dividend Yields', desc: 'Established financial and energy giants distribute consistent shareholder income.' },
            { title: 'Rate & Inflation Hedge', desc: 'Banks benefit from higher interest rates while energy hedges commodity spikes.' }
          ],
          pricesHeading: 'LATEST BIG BANK & ENERGY PRICES',
          pricesSub: 'Real-time quotes across major banking institutions and global energy infrastructure leaders.',
          tableRows: [
            { name: 'JPMorgan Chase & Co.', ticker: 'JPM', cap: '$580,400,000,000', price: '$214.60', change: '+1.35%', pos: true },
            { name: 'TotalEnergies SE', ticker: 'TTE', cap: '$148,200,000,000', price: '$62.80', change: '+0.92%', pos: true },
            { name: 'BNP Paribas SA', ticker: 'BNP', cap: '$74,900,000,000', price: '$65.15', change: '+1.10%', pos: true },
            { name: 'NextEra Clean Energy', ticker: 'NEE', cap: '$152,600,000,000', price: '$74.40', change: '-0.48%', pos: false }
          ],
          whyTitle: 'WHY INVEST IN BIG<br />BANKS & ENERGY?',
          whyDesc: 'Banking and energy form the twin pillars of the global economy—delivering robust cash flows, high dividend yields, and natural resilience across economic cycles.',
          whyAsset: 'bank-energy-3d.png (800×800)',
          articles: [
            'HOW INTEREST RATES DRIVE BANKING SECTOR EARNINGS',
            'THE ENERGY TRANSITION: UTILITIES & CLEAN GRID INFRASTRUCTURE',
            'BUILDING A HIGH-DIVIDEND CORE WITH BANKS & ENERGY'
          ],
          faqs: [
            { q: 'HOW OFTEN DO BANK AND ENERGY STOCKS PAY DIVIDENDS?', a: 'Most US banks pay quarterly dividends, while global banks and energy leaders pay semi-annually or quarterly.' },
            { q: 'CAN I INVEST IN BOTH SECTORS THROUGH ONE INDEX?', a: 'Yes, you can pick individual stocks or invest in our Global Banks & Energy Leaders basket.' }
          ]
        }
      };

      const serviceCategoryGrid = document.getElementById('service-category-grid');
      if (serviceCategoryGrid) {
        const serviceOrder = [
          'real-estate',
          'gold-commodities',
          'crypto-currency',
          'stock-and-etfs',
          'agriculture',
          'loan-offers',
          'fund-recovery',
          'big-bank-energy'
        ];
        const serviceCards = serviceOrder
          .map((slug) => SERVICES_CATALOG[slug])
          .map((service) => {
            const image = service.images && service.images.hero;
            const description = service.slug === 'crypto-currency'
              ? 'Explore digital assets and review their market information.'
              : service.slug === 'gold-commodities'
              ? 'Follow precious-metal markets alongside other asset categories.'
              : service.slug === 'stock-and-etfs'
              ? 'Invest in fractional shares of leading global companies and diversified index funds.'
              : service.heroSubtitle;
            return `
              <a class="category-card" href="${SERVICE_PAGE_URLS[service.slug]}" data-service="${service.slug}" data-page-url="${SERVICE_PAGE_URLS[service.slug]}">
                <div>
                  <h3 class="category-title">${service.name}</h3>
                  <p class="category-desc">${description}</p>
                </div>
                <div class="img-placeholder img-placeholder-dark ratio-4x3 category-image"${image ? '' : ` role="img" aria-label="${service.name} market preview"`}>
                  ${image ? `<img src="${image.src}" alt="${image.alt}" loading="lazy">` : `<span>${service.name} overview</span><span class="image-size-label">Illustrative market preview</span>`}
                </div>
              </a>
            `;
          })
          .join('');
        serviceCategoryGrid.innerHTML = serviceCards;
      }

      const homePageView = document.getElementById('home-page-view');
      const servicePageView = document.getElementById('service-page-view');
      const infoPageView = document.getElementById('info-page-view');
      let liveMarketTimer = null;
      let activeServiceSlug = null;

      /* ======================================================================
         6B. CONTEXTUAL INFO PAGES (VIEW LICENCE, READ MORE, READ REVIEWS, ETC.)
         ====================================================================== */
      const INFO_TOPICS_CATALOG = {
        'licence': {
          badge: 'Regulatory & Licensing Registry',
          title: 'SOLIDSPARK REGULATORY LICENCES & OVERSIGHT',
          subtitle: 'Full transparency on our financial services registrations, payment institution authorisations, and multi-jurisdictional compliance framework.',
          highlights: [
            { label: 'Entity Name', value: 'SOLIDSPARK Financial Services Ltd.' },
            { label: 'Registration Status', value: 'Active & Audited (2026)' },
            { label: 'AML / KYC Framework', value: 'AML5 & FATF Compliant' },
            { label: 'Client Fund Segregation', value: '100% Ring-Fenced Tier-1 Custody' },
            { label: 'Base Settlement Currency', value: 'USD ($)' }
          ],
          sections: [
            {
              heading: 'MULTI-ASSET BROKERAGE & CUSTODY AUTHORISATION',
              body: 'SOLIDSPARK operates under strict financial market supervision, maintaining segregated client accounts so investor cash, fractional equities, and bullion holdings are never commingled with corporate operating funds.'
            },
            {
              heading: 'INDEPENDENT RESERVES & QUARTERLY AUDITS',
              body: 'All physically backed precious metals and institutional real estate pools undergo third-party verification, ensuring 1:1 asset backing and verifiable title provenance at all times.'
            }
          ]
        },
        'security': {
          badge: 'Security & Compliance Architecture',
          title: 'AML5 COMPLIANCE, COLD STORAGE & VAULT SECURITY',
          subtitle: 'How SOLIDSPARK safeguards your digital assets, precious metals, and account credentials against unauthorized access.',
          highlights: [
            { label: 'Cold Storage Ratio', value: '95%+ Multi-Sig Offline Vaults' },
            { label: 'Encryption Standard', value: 'AES-256 & Hardware HSM' },
            { label: 'Bullion Vaulting', value: 'Insured Swiss & London Facilities' },
            { label: 'Monitoring', value: '24/7 Real-Time Fraud & On-Chain SOC' }
          ],
          sections: [
            {
              heading: 'INSTITUTIONAL MULTI-SIGNATURE COLD CUSTODY',
              body: 'Digital assets on SOLIDSPARK are protected inside air-gapped hardware security modules requiring multi-party cryptographic authorization across geographically distributed vaults.'
            },
            {
              heading: 'AML5 & CONTINUOUS TRANSACTION SCREENING',
              body: 'Every deposit, swap, and withdrawal is screened under strict Anti-Money Laundering (AML5) protocols to protect our ecosystem and guarantee clean liquidity for every investor.'
            }
          ]
        },
        'savings-plans': {
          badge: 'Automated Wealth Building',
          title: 'SOLIDSPARK AUTOMATED SAVINGS PLANS',
          subtitle: 'Build long-term wealth automatically using dollar-cost averaging across stocks, ETFs, crypto, gold, and sector portfolios from $500.',
          highlights: [
            { label: 'Minimum Recurring Buy', value: '$500.00 USD' },
            { label: 'Available Frequencies', value: 'Daily, Weekly, Bi-Weekly, Monthly' },
            { label: 'Supported Assets', value: '10,000+ Assets & Sector Baskets' },
            { label: 'Flexibility', value: 'Pause, Edit, or Cancel Anytime' }
          ],
          sections: [
            {
              heading: 'SMOOTH OUT MARKET VOLATILITY WITH DCA',
              body: 'By investing a fixed dollar amount at regular intervals, you automatically acquire more units when prices dip and fewer when prices peak—removing emotional market timing.'
            },
            {
              heading: 'INSTANT EXECUTION & ZERO LOCK-INS',
              body: 'Modify your recurring contribution amount, switch target assets, or liquidate your accumulated holdings 24/7 with full transparency.'
            }
          ]
        },
        'all-in-one-app': {
          badge: 'Unified Multi-Asset Platform',
          title: 'THE ALL-IN-ONE SOLIDSPARK INVESTMENT APP',
          subtitle: 'Manage crypto, stocks, ETFs, gold bullion, real estate yields, and your SOLIDSPARK ATM Card from a single unified interface.',
          highlights: [
            { label: 'Supported Sectors', value: '12 Dedicated Investment Verticals' },
            { label: 'Card Integration', value: 'Instant Portfolio-to-Card Spending' },
            { label: 'Price Alerts', value: 'Real-Time Push & Target Triggers' },
            { label: 'Availability', value: 'Web, iOS & Android 24/7' }
          ],
          sections: [
            {
              heading: 'SWAP ANY ASSET FOR ANY OTHER ASSET',
              body: 'Move seamlessly between Bitcoin, physical Gold, fractional NVIDIA shares, or rental real estate in a single transaction without waiting days for bank wires.'
            },
            {
              heading: 'SPEND YOUR PORTFOLIO ANYWHERE',
              body: 'Link any asset wallet to your SOLIDSPARK ATM Card and pay at millions of merchants worldwide with instant USD conversion at the point of sale.'
            }
          ]
        },
        'reviews': {
          badge: 'Verified Investor Community',
          title: 'WHAT OUR INVESTORS SAY ABOUT SOLIDSPARK',
          subtitle: 'Explore real feedback, star ratings, and portfolio experiences from verified SOLIDSPARK investors across all 8 investment verticals.',
          highlights: [
            { label: 'Overall Rating', value: '4.8 / 5.0 Stars (Great)' },
            { label: 'Active Portfolios', value: '120,000+ Global Accounts' },
            { label: 'Average Payout Speed', value: 'Under 15 Minutes' },
            { label: 'Support Availability', value: '24/7 Live Specialist Desk' }
          ],
          sections: [
            {
              heading: 'TRUSTED ACROSS MULTI-ASSET PORTFOLIOS',
              body: 'From fractional gold savers and real estate dividend investors to active crypto and ETF traders, SOLIDSPARK empowers everyday investors with institutional tools.'
            }
          ]
        }
      };

      const FLOATING_REVIEWS_DATA = [
        [
          { name: 'Hannah M.', role: 'Real Estate & ETF Investor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Monthly rental payouts arrive right on schedule and the USD dashboard is crystal clear.' },
          { name: 'Marcus T.', role: 'Gold & Crypto Trader', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Swapping between Gold bullion and Bitcoin in seconds has completely simplified my hedging.' },
          { name: 'Priya S.', role: 'Stocks & Savings Plan User', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Automated weekly $50 ETF buys run effortlessly. Best onboarding experience I have ever had.' },
          { name: 'Lukas W.', role: 'SOLIDSPARK Card Holder', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Used my SOLIDSPARK ATM Card across three countries last month with instant settlement.' }
        ],
        [
          { name: 'David K.', role: 'Big Bank & Energy Portfolio', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Quarterly dividends from JPMorgan and TotalEnergies compound automatically in my account.' },
          { name: 'Sophia L.', role: 'Agriculture & Commodities', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80', stars: 4, text: 'Love having farmland REITs and coffee ETCs right alongside my tech stocks.' },
          { name: 'Daniel O.', role: 'Collateral Loan Client', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Unlocked a $12,000 credit line against my gold holdings in under a minute without selling.' }
        ],
        [
          { name: 'Claire V.', role: 'Multi-Asset Investor', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Clear market information and a simple dashboard make it easier to follow my diversified portfolio.' },
          { name: 'Mateo G.', role: 'Fund Recovery Client', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Their forensic tracing report gave my exchange everything needed to freeze a misrouted transfer.' }
        ],
        [
          { name: 'Nadia H.', role: 'Precious Metals Saver', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Physically backed gold and silver from $500 makes saving for my family effortless.' },
          { name: 'Victor C.', role: 'Active Multi-Asset Trader', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Live price alerts and 24/7 execution mean I never miss a move even on weekends.' },
          { name: 'Grace A.', role: 'Dividend Growth Investor', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Customer support replied in two minutes and walked me through setting up my recurring plan.' },
          { name: 'Henrik S.', role: 'Institutional ETF Saver', avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=100&q=80', stars: 4, text: 'Access to iShares, Amundi, and Xtrackers under one clean dark-mode UI is unmatched.' }
        ],
        [
          { name: 'Fatima Z.', role: 'Real Estate & Gold Investor', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Transparent fees, fast USD withdrawals, and real asset backing set SOLIDSPARK apart.' },
          { name: 'Oliver P.', role: 'Tech & AI Stocks Investor', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Fractional shares of NVIDIA and Apple let me balance my portfolio down to the exact dollar.' },
          { name: 'Klara M.', role: 'Long-Term Wealth Builder', avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Five stars for reliability. Everything from KYC verification to card spending just works.' },
          { name: 'Samuel E.', role: 'Crypto & Energy Investor', avatar: 'https://images.unsplash.com/photo-1504257432389-52343af06Xy3?auto=format&fit=crop&w=100&q=80', stars: 5, text: 'Having 8 distinct investment sectors under one verified login saves me hours every week.' }
        ]
      ];

      function buildFiveRowFloatingReviewsHTML() {
        const rowsHTML = FLOATING_REVIEWS_DATA.map((rowItems, rowIdx) => {
          const doubled = [...rowItems, ...rowItems];
          const cards = doubled
            .map((rev) => {
              const starsStr = '★'.repeat(rev.stars) + '☆'.repeat(5 - rev.stars);
              return `
                <article class="floating-review-card">
                  <div class="floating-review-user">
                    <img class="floating-review-avatar" src="${rev.avatar}" alt="${rev.name}" loading="lazy" onerror="this.src='https://placehold.co/84x84/1572E8/ffffff?text=${encodeURIComponent(rev.name.slice(0, 2))}'" />
                    <div class="floating-review-meta">
                      <span class="floating-review-name">${rev.name}</span>
                      <span class="floating-review-role">${rev.role}</span>
                    </div>
                    <span style="margin-left:auto; color:#0a8f5b; font-size:0.85rem; letter-spacing:1px;">${starsStr}</span>
                  </div>
                  <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.55;">"${rev.text}"</p>
                </article>
              `;
            })
            .join('');

          return `
            <div class="reviews-marquee-row ${rowIdx % 2 === 1 ? 'is-reverse' : ''}">
              <div class="reviews-marquee-track" style="animation-duration: ${38 + rowIdx * 4}s;">
                ${cards}
              </div>
            </div>
          `;
        }).join('');

        return `
          <section class="reviews-marquee-section">
            <div class="container">
              <div class="section-header-center">
                <span class="pill-outline">4.8 ★ Rated Great Across Verified Portfolios</span>
                <h2 class="section-heading" style="margin-bottom: 10px;">LIVE INVESTOR REVIEWS &amp; RATINGS</h2>
                <p style="color: var(--text-secondary); max-width: 660px; margin: 0 auto; font-size: 0.95rem;">
                  Hover over any row to pause and read real investor experiences across crypto, gold, real estate, stocks, and card spending.
                </p>
              </div>
            </div>
            <div class="reviews-marquee-rows">
              ${rowsHTML}
            </div>
          </section>
        `;
      }

      function renderInfoPage(topicKey, contextTitle, contextServiceSlug) {
        if (!infoPageView || !homePageView || !servicePageView) return;
        stopLiveMarketTicker();

        const svc = contextServiceSlug && SERVICES_CATALOG[contextServiceSlug] ? SERVICES_CATALOG[contextServiceSlug] : null;
        const baseTopic = INFO_TOPICS_CATALOG[topicKey];

        const resolvedTitle = contextTitle || (baseTopic ? baseTopic.title : 'SOLIDSPARK INSIGHTS');
        const topicTitle = contextTitle || resolvedTitle;
        const resolvedBadge = baseTopic
          ? baseTopic.badge
          : svc
          ? `${svc.name} Research & Insights`
          : 'SOLIDSPARK Research';
        const resolvedSubtitle = baseTopic
          ? baseTopic.subtitle
          : `In-depth analysis, risk considerations, and portfolio strategies for ${topicTitle} within ${svc ? svc.name : 'SOLIDSPARK Multi-Asset Portfolios'}.`;

        const highlights = baseTopic
          ? baseTopic.highlights
          : [
              { label: 'Category', value: svc ? svc.name : 'Multi-Asset Strategy' },
              { label: 'Minimum Entry', value: '$500.00 Fractional' },
              { label: 'Settlement', value: '24/7 Instant USD ($)' },
              { label: 'Custody Standard', value: 'Segregated & Audited' }
            ];

        const sections = baseTopic
          ? baseTopic.sections
          : [
              {
                heading: `UNDERSTANDING ${topicTitle}`,
                body: `Investors exploring ${svc ? svc.name : 'modern global markets'} frequently evaluate how ${topicTitle.toLowerCase()} impacts long-term risk-adjusted returns, liquidity, and inflation resilience. SOLIDSPARK provides transparent pricing, fractional allocation from $500, and real-time analytics so you can execute with confidence.`
              },
              {
                heading: 'HOW TO APPLY THIS STRATEGY ON SOLIDSPARK',
                body: `Open your SOLIDSPARK dashboard, select ${svc ? svc.name : 'your preferred asset class'}, and configure either an instant market order or an automated recurring Savings Plan denominated in USD ($).`
              }
            ];

        const backHref = svc ? `#service/${svc.slug}` : '#';
        const backAttr = svc ? `data-service="${svc.slug}"` : `data-nav="home"`;
        const backLabel = svc ? `Back to ${svc.name}` : 'Back to Home';

        const highlightsHTML = highlights
          .map(
            (h) => `
            <div class="info-spec-row">
              <span style="color: var(--text-muted);">${h.label}</span>
              <strong style="color: var(--text-primary); text-align: right;">${h.value}</strong>
            </div>`
          )
          .join('');

        const sectionsHTML = sections
          .map(
            (sec) => `
            <div>
              <h2 style="margin-bottom: 10px;">${sec.heading}</h2>
              <p>${sec.body}</p>
            </div>`
          )
          .join('');

        infoPageView.innerHTML = `
          <div class="sp-breadcrumb-bar">
            <div class="container sp-breadcrumb-inner">
              <div class="sp-breadcrumb-trail">
                <a href="#" data-nav="home">Home</a>
                <span>/</span>
                ${svc ? `<a href="#service/${svc.slug}" data-service="${svc.slug}">${svc.name}</a><span>/</span>` : ''}
                <span class="sp-breadcrumb-pill">${resolvedBadge}</span>
              </div>
              <div class="sp-quick-nav-links">
                <a href="${backHref}" ${backAttr}>&larr; ${backLabel}</a>
              </div>
            </div>
          </div>

          <section class="sp-hero-band">
            <div class="container">
              <span class="pill-outline">${resolvedBadge}</span>
              <h1 class="sp-hero-title" style="max-width: 900px; margin-top: 12px;">${resolvedTitle}</h1>
              <p class="sp-hero-subtitle" style="max-width: 720px;">${resolvedSubtitle}</p>
              <div style="display: flex; flex-wrap: wrap; gap: 14px;">
                <a href="${backHref}" ${backAttr} class="btn btn-blue btn-lg">${backLabel}</a>
                <a href="#info/reviews" data-info-topic="reviews" class="btn btn-sm" style="border-color: var(--border-color); color: var(--text-primary); padding: 14px 26px;">Read Investor Reviews</a>
              </div>
            </div>
          </section>

          <section class="info-article-band">
            <div class="container info-content-grid">
              <div class="info-body-card">
                ${sectionsHTML}
              </div>
              <aside class="info-sidebar-card">
                <h3 style="font-family: var(--font-display); font-size: 1.45rem; text-transform: uppercase;">KEY SPECIFICATIONS</h3>
                <div>${highlightsHTML}</div>
                <a href="${backHref}" ${backAttr} class="btn btn-blue btn-sm" style="margin-top: 8px;">Start Investing in USD ($)</a>
              </aside>
            </div>
          </section>

          ${topicKey === 'reviews' ? buildFiveRowFloatingReviewsHTML() : ''}
        `;

        homePageView.style.display = 'none';
        servicePageView.classList.remove('is-active');
        infoPageView.classList.add('is-active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      /* ======================================================================
         6C. REAL-TIME 2-SECOND FLUCTUATION ENGINE (-10 TO +10 RANGE)
         ====================================================================== */
      function stopLiveMarketTicker() {
        if (liveMarketTimer) {
          clearInterval(liveMarketTimer);
          liveMarketTimer = null;
        }
      }

      function formatDollarCompact(num) {
        return '$' + Math.round(num).toLocaleString('en-US');
      }

      function startLiveMarketTicker(slug) {
        stopLiveMarketTicker();
        const svc = SERVICES_CATALOG[slug];
        if (!svc) return;

        // Parse base numeric values once per table render
        const baseMetrics = svc.tableRows.map((row) => {
          const capNum = parseFloat(String(row.cap).replace(/[^0-9.-]/g, '')) || 0;
          const priceNum = parseFloat(String(row.price).replace(/[^0-9.-]/g, '')) || 0;
          const priceDecimals = (String(row.price).split('.')[1] || '').replace(/[^0-9]/g, '').length || 2;
          const isPriceDollar = String(row.price).includes('$');
          const isPriceApr = String(row.price).includes('APR');

          const changeNum = parseFloat(String(row.change).replace(/[^0-9.-]/g, '')) || 0;
          const isChangePct = String(row.change).includes('%');
          const changeSuffix = String(row.change).replace(/^[+-]?[0-9.,]+/, '');

          return {
            capNum,
            priceNum,
            priceDecimals,
            isPriceDollar,
            isPriceApr,
            changeNum,
            isChangePct,
            changeSuffix
          };
        });

        liveMarketTimer = setInterval(() => {
          if (!servicePageView || !servicePageView.classList.contains('is-active')) {
            stopLiveMarketTicker();
            return;
          }

          baseMetrics.forEach((m, idx) => {
            const capEl = document.getElementById(`sp-live-cap-${idx}`);
            const priceEl = document.getElementById(`sp-live-price-${idx}`);
            const changeEl = document.getElementById(`sp-live-change-${idx}`);
            if (!capEl || !priceEl || !changeEl) return;

            // Random delta strictly within [-10, +10]
            const deltaCap = (Math.random() * 20 - 10) * (m.capNum >= 1000000 ? 125000 : 1);
            const nextCap = Math.max(1000, m.capNum + deltaCap);
            capEl.textContent = formatDollarCompact(nextCap);

            const deltaPrice = Math.random() * 20 - 10; // -10 to +10
            const rawNextPrice = m.priceNum + deltaPrice;
            const safeNextPrice = Math.max(0.01, rawNextPrice);
            if (m.isPriceDollar) {
              priceEl.textContent = '$' + safeNextPrice.toLocaleString('en-US', {
                minimumFractionDigits: m.priceDecimals,
                maximumFractionDigits: m.priceDecimals
              });
            } else if (m.isPriceApr) {
              priceEl.textContent = safeNextPrice.toFixed(2) + '% APR';
            } else {
              priceEl.textContent = safeNextPrice.toFixed(2);
            }

            const deltaChange = Math.random() * 20 - 10; // -10 to +10
            const nextChange = m.changeNum + deltaChange;
            const isPos = nextChange >= 0;
            const sign = isPos ? '+' : '';
            changeEl.textContent = `${sign}${nextChange.toFixed(2)}${m.changeSuffix || '%'}`;
            changeEl.style.color = isPos ? 'var(--positive)' : 'var(--red)';
          });
        }, 2000);
      }

      function renderServicePage(slug) {
        const svc = SERVICES_CATALOG[slug];
        if (!svc || !homePageView || !servicePageView) return;
        const heroImage = svc.images && svc.images.hero;
        const architectureImage = svc.images && svc.images.architecture;
        const marketImage = svc.images && svc.images.market;
        const savingsImage = (svc.images && svc.images.savings) || {
          src: 'Images/savings.jpg',
          alt: 'Savings plan piggy bank with coins and cash'
        };
        activeServiceSlug = slug;
        document.title = `${svc.name} — Solidspark Investment`;
        if (infoPageView) infoPageView.classList.remove('is-active');

        // Update active state in dropdown
        document.querySelectorAll('.services-dropdown-link').forEach((el) => {
          el.classList.toggle('is-active', el.dataset.service === slug);
        });
        document.querySelectorAll('.nav-link').forEach((el) => el.classList.remove('is-active'));
        if (servicesToggle) servicesToggle.classList.add('is-active');

        const switcherChips = Object.values(SERVICES_CATALOG)
          .map(
            (item) =>
              `<a href="${SERVICE_PAGE_URLS[item.slug]}" data-service="${item.slug}" data-page-url="${SERVICE_PAGE_URLS[item.slug]}" class="sp-switcher-chip ${
                item.slug === slug ? 'is-current' : ''
              }">${item.name}</a>`
          )
          .join('');

        const pillarsHTML = svc.pillars
          .map(
            (p) => `
            <div class="sp-step-col">
              <div class="sp-pillar-icon-box" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
              </div>
              <h3>${p.title}</h3>
              <p>${p.desc}</p>
            </div>`
          )
          .join('');

        const tableRowsHTML = svc.tableRows
          .map(
            (row, idx) => `
            <tr>
              <td>
                <div class="sp-asset-cell">
                  <span class="asset-badge" style="background-color: #1572E8;">${row.ticker.slice(0, 2)}</span>
                  <div>
                    <div style="font-weight: 700;">${row.name}</div>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${row.ticker}</div>
                  </div>
                </div>
              </td>
              <td id="sp-live-cap-${idx}" class="live-tick-flash">${row.cap}</td>
              <td id="sp-live-price-${idx}" class="live-tick-flash" style="font-weight: 700;">${row.price}</td>
              <td id="sp-live-change-${idx}" class="live-tick-flash" style="font-weight: 600; color: ${row.pos ? 'var(--positive)' : 'var(--red)'};">${row.change}</td>
              <td>
                <svg width="84" height="26" viewBox="0 0 84 26" aria-hidden="true">
                  <polyline fill="none" stroke="${row.pos ? '#0a8f5b' : '#e5323b'}" stroke-width="2"
                    points="${
                      row.pos
                        ? `2,22 18,18 34,20 50,12 66,14 82,${4 + (idx % 3)}`
                        : `2,6 18,10 34,9 50,16 66,18 82,${22 - (idx % 3)}`
                    }" />
                </svg>
              </td>
              <td><a href="#assets-heading" data-nav="home" class="btn btn-blue btn-sm">Invest</a></td>
            </tr>`
          )
          .join('');

        const pricesContentHTML = slug === 'crypto-currency'
          ? `
            <div class="tv-market-data-wrap">
              <tv-market-data symbol-sectors='[{"sectionName":"Crypto","symbols":["BINANCE:BTCUSDT","BINANCE:ETHUSDT","BINANCE:SOLUSDT","BINANCE:XRPUSDT","BINANCE:BNBUSDT"]}]'></tv-market-data>
            </div>
            <div class="tv-market-cta">
              <a href="#assets-heading" data-nav="home" class="btn btn-blue btn-lg">Explore markets</a>
            </div>`
          : `
            <div class="sp-table-wrap">
              <table class="sp-market-table">
                <thead>
                  <tr><th>Asset</th><th>Market Cap / Pool</th><th>Price / Rate</th><th>24h / Yield</th><th>Chart</th><th>Action</th></tr>
                </thead>
                <tbody>${tableRowsHTML}</tbody>
              </table>
            </div>`;

        const articlesHTML = svc.articles
          .map(
            (artTitle, artIdx) => `
            <article class="sp-editorial-card">
              <h3 class="sp-editorial-title">${artTitle}</h3>
              <a href="#info/article-${slug}-${artIdx}" data-info-topic="article" data-info-title="${artTitle}" data-info-service="${slug}" class="sp-editorial-link">Read more</a>
            </article>`
          )
          .join('');

        const faqsHTML = svc.faqs
          .map(
            (faq, idx) => `
            <div class="sp-faq-item ${idx === 0 ? 'is-open' : ''}">
              <button type="button" class="sp-faq-btn" aria-expanded="${idx === 0 ? 'true' : 'false'}">
                <span>${faq.q}</span>
                <svg class="sp-faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <div class="sp-faq-answer">${faq.a}</div>
            </div>`
          )
          .join('');

        servicePageView.innerHTML = `
          <!-- 1. Breadcrumb Bar -->
          <div class="sp-breadcrumb-bar">
            <div class="container sp-breadcrumb-inner">
              <div class="sp-breadcrumb-trail">
                <a href="#" data-nav="home">Home</a>
                <span>/</span>
                <span class="sp-breadcrumb-pill">${svc.breadcrumb}</span>
              </div>
              <div class="sp-quick-nav-links">
                <a href="#sp-service-faq">FAQ</a>
                <a href="#" data-nav="home">&larr; Back to All Investments</a>
              </div>
            </div>
          </div>

          <!-- 2. Split Hero -->
          <section class="sp-hero-band">
            <div class="container sp-hero-grid">
              <div>
                <p class="sp-eyebrow">Explore ${svc.name}</p>
                <h1 class="sp-hero-title">${svc.heroTitle}</h1>
                <p class="sp-hero-subtitle">${svc.heroSubtitle}</p>
                <a href="https://user.solidsparkinvestment.ltd/login" class="btn btn-blue btn-lg">Get started</a>
              </div>
              <div class="sp-hero-media${heroImage ? ' has-image' : ''}"${heroImage ? '' : ` role="img" aria-label="${svc.name} Hero Image"`}>
                ${heroImage ? `<img class="sp-hero-image" src="${heroImage.src}" alt="${heroImage.alt}" loading="lazy">` : ''}
                <strong>${svc.name} Visual Showcase</strong>
                <span style="margin-top: 6px;">Illustrative market preview</span>
                ${heroImage ? '' : '<span class="image-size-label">Recommended: 1200 × 1200 px</span>'}
              </div>
            </div>
          </section>

          <!-- 3. Trust Seals Strip -->
          <section class="sp-trust-band">
            <div class="container">
              <div class="sp-trust-grid">
                <div class="sp-seal-item">
                  <svg class="sp-seal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.9 2.1 3.6-.3 1.3 3.4 3.2 1.7-.7 3.5.7 3.5-3.2 1.7-1.3 3.4-3.6-.3L12 22l-2.9-2.1-3.6.3-1.3-3.4-3.2-1.7.7-3.5-.7-3.5 3.2-1.7 1.3-3.4 3.6.3L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>
                  <p class="sp-seal-text">Regulated multi-asset investment firm &amp; licensed payment institution.</p>
                  <a href="#info/licence" data-info-topic="licence" data-info-service="${slug}" class="sp-seal-link">View licence</a>
                </div>
                <div class="sp-seal-item">
                  <svg class="sp-seal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.9 2.1 3.6-.3 1.3 3.4 3.2 1.7-.7 3.5.7 3.5-3.2 1.7-1.3 3.4-3.6-.3L12 22l-2.9-2.1-3.6.3-1.3-3.4-3.2-1.7.7-3.5-.7-3.5 3.2-1.7 1.3-3.4 3.6.3L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>
                  <p class="sp-seal-text">Fully compliant with AML5. Funds secured in offline cold storage &amp; insured vaults.</p>
                  <a href="#info/security" data-info-topic="security" data-info-service="${slug}" class="sp-seal-link">Read more</a>
                </div>
                <div class="sp-seal-item">
                  <svg class="sp-seal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.9 2.1 3.6-.3 1.3 3.4 3.2 1.7-.7 3.5.7 3.5-3.2 1.7-1.3 3.4-3.6-.3L12 22l-2.9-2.1-3.6.3-1.3-3.4-3.2-1.7.7-3.5-.7-3.5 3.2-1.7 1.3-3.4 3.6.3L12 2z"/><polyline points="9 12 11 14 15 10"/></svg>
                  <p class="sp-seal-text">Rated Great across global investors. Trusted by thousands of active portfolios.</p>
                  <a href="#info/reviews" data-info-topic="reviews" data-info-service="${slug}" class="sp-seal-link">Read reviews</a>
                </div>
              </div>
              <p class="sp-risk-note">${svc.riskNote}</p>
            </div>
          </section>

          <!-- 4. Get Started in Minutes -->
          <section class="sp-steps-band">
            <div class="container">
              <p class="sp-eyebrow">Getting started</p>
              <h2 class="sp-section-heading-left">GET STARTED IN MINUTES</h2>
              <div class="sp-4col-grid">
                <div class="sp-step-col">
                  <h3>1. Sign up to SOLIDSPARK</h3>
                  <p>Sign up to create your free SOLIDSPARK account in seconds.</p>
                </div>
                <div class="sp-step-col">
                  <h3>2. Verify</h3>
                  <p>Verify your identity with one of our trusted verification partners.</p>
                </div>
                <div class="sp-step-col">
                  <h3>3. Deposit</h3>
                  <p>Deposit your funds securely through supported banking &amp; crypto options.</p>
                </div>
                <div class="sp-step-col">
                  <h3>4. Trade</h3>
                  <p>You’re all set! Invest, swap, and manage ${svc.name} 24/7.</p>
                </div>
              </div>
              <div style="text-align: center;">
                <a href="https://user.solidsparkinvestment.ltd/login" class="btn btn-blue btn-lg">Get started</a>
              </div>
            </div>
          </section>

          <!-- 5. Mobile Showcase 1 (SOLIDSPARK Card) -->
          <section class="sp-showcase-band">
            <div class="container sp-showcase-grid">
              <div>
                <p class="sp-eyebrow">Platform features</p>
                <h2 class="sp-section-heading-left" style="margin-bottom: 16px;">${svc.showcase1Title}</h2>
                <p style="color: var(--text-secondary); max-width: 460px; margin-bottom: 28px;">${svc.showcase1Desc}</p>
                <a href="#assets-heading" data-nav="home" class="btn btn-blue btn-lg">${svc.showcase1Cta}</a>
              </div>
              <div class="sp-showcase-visual">
                <div class="sp-phone-mockup">
                  <div class="sp-phone-notch"></div>
                  <div class="sp-phone-balance-label">Linked Portfolio Balance</div>
                  <div class="sp-phone-balance">${svc.showcase1Balance}</div>
                  <div style="font-size: 0.72rem; color: #2ee59d; margin-bottom: 14px;">${svc.showcase1Sub}</div>
                  <div class="sp-phone-card">
                    <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#aaa; margin-bottom:18px;">
                      <span>SOLIDSPARK</span>
                      <span>PLATINUM</span>
                    </div>
                    <div style="font-family:monospace; letter-spacing:2px; font-size:0.85rem;">•••• •••• •••• 9482</div>
                  </div>
                  <div class="sp-phone-row"><span>Monthly Cashback</span><span style="color:#2ee59d;">+2.00%</span></div>
                  <div class="sp-phone-row"><span>Instant Settlement</span><span>Active</span></div>
                </div>
              </div>
            </div>
          </section>

          <!-- 6. Mobile Showcase 2 (Price Alerts) -->
          <section class="sp-showcase-band">
            <div class="container sp-showcase-grid is-reversed">
              <div>
                <p class="sp-eyebrow">Market tools</p>
                <h2 class="sp-section-heading-left" style="margin-bottom: 16px;">${svc.showcase2Title}</h2>
                <p style="color: var(--text-secondary); max-width: 460px;">${svc.showcase2Desc}</p>
              </div>
              <div class="sp-showcase-visual">
                <div class="sp-phone-mockup">
                  <div class="sp-phone-notch"></div>
                  <div class="sp-phone-balance-label">Target Price Alert</div>
                  <div class="sp-phone-balance">${svc.showcase2Target}</div>
                  <div style="display:flex; gap:6px; margin-bottom:16px;">
                    <span style="flex:1; text-align:center; padding:5px; border:1px solid #333; border-radius:6px; font-size:0.7rem;">-10%</span>
                    <span style="flex:1; text-align:center; padding:5px; border:1px solid #333; border-radius:6px; font-size:0.7rem;">-5%</span>
                    <span style="flex:1; text-align:center; padding:5px; border:1px solid #1572E8; background:#1572E8; border-radius:6px; font-size:0.7rem;">+5%</span>
                    <span style="flex:1; text-align:center; padding:5px; border:1px solid #333; border-radius:6px; font-size:0.7rem;">+10%</span>
                  </div>
                  <div style="background:#ffffff; color:#000000; text-align:center; padding:10px; border-radius:8px; font-weight:700; font-size:0.82rem;">Add alert</div>
                </div>
              </div>
            </div>
          </section>

          <!-- 7. Four Pillars Standard -->
          <section class="sp-pillars-band">
            <div class="container">
              <p class="sp-eyebrow">Our standards</p>
              <h2 class="sp-section-heading-left">${svc.pillarsHeading}</h2>
              <div class="sp-4col-grid" style="margin-bottom: 0;">${pillarsHTML}</div>
            </div>
          </section>

          <!-- 8. Live Market Table -->
          <section class="sp-prices-band">
            <div class="container">
              <p class="sp-eyebrow">Market overview</p>
              <h2 class="sp-section-heading-left" style="margin-bottom: 10px;">${svc.pricesHeading}</h2>
              <p style="color: var(--text-secondary);">${svc.pricesSub}</p>
              ${pricesContentHTML}
            </div>
          </section>

          <!-- 9. Why Invest Split Section -->
          <section class="sp-showcase-band">
            <div class="container sp-showcase-grid is-reversed">
              <div>
                <p class="sp-eyebrow">Why Solidspark</p>
                <h2 class="sp-section-heading-left" style="margin-bottom: 16px;">${svc.whyTitle}</h2>
                <p style="color: var(--text-secondary); max-width: 480px;">${svc.whyDesc}</p>
              </div>
              <div class="sp-showcase-visual">
                <div class="sp-hero-media${architectureImage ? ' has-image' : ''}" style="max-width: 400px; margin: 0 auto;"${architectureImage ? '' : ` role="img" aria-label="${svc.name} Illustration"`}>
                  ${architectureImage ? `<img class="sp-hero-image" src="${architectureImage.src}" alt="${architectureImage.alt}" loading="lazy">` : ''}
                  <strong>${svc.name} Architecture</strong>
                  <span style="margin-top: 6px;">Portfolio analysis preview</span>
                  ${architectureImage ? '' : '<span class="image-size-label">Recommended: 800 × 800 px</span>'}
                </div>
              </div>
            </div>
          </section>

          <!-- 10. Editorial Comparison Cards -->
          <section class="sp-editorial-band">
            <div class="container">
              <div class="sp-editorial-grid">${articlesHTML}</div>
            </div>
          </section>

          <!-- 11. Dark Highlight Band + Dual Promo Cards -->
          <section class="sp-dark-highlights-band">
            <div class="container">
              <div class="sp-highlight-top">
                ${marketImage
                  ? `<div class="img-placeholder img-placeholder-dark ratio-4x3 crypto-image"><img src="${marketImage.src}" alt="${marketImage.alt}" loading="lazy"></div>`
                  : `<div class="img-placeholder img-placeholder-dark ratio-4x3"><span>Market overview</span><span class="image-size-label">Recommended: 1200 × 900 px</span></div>`}
                <div>
                  <h2 style="font-family: var(--font-display); font-size: clamp(2rem, 3.5vw, 2.8rem); text-transform: uppercase; line-height: 1.02;">
                    10,000+ ASSETS &amp; PORTFOLIO STRATEGIES
                  </h2>
                  <ul class="sp-highlight-list">
                    <li>Invest fractionally from $500 or acquire whole institutional units.</li>
                    <li>Transparent flat execution with zero hidden custody fees.</li>
                    <li>Automate recurring buys with SOLIDSPARK Savings Plans.</li>
                    <li>Consolidated tax and performance reporting in one click.</li>
                  </ul>
                </div>
              </div>

              <div class="sp-dual-promo-grid">
                <div class="sp-promo-white-card">
                  <div>
                    <h3 style="font-family: var(--font-display); font-size: 1.8rem; text-transform: uppercase; margin-bottom: 8px;">SAVINGS PLANS</h3>
                    <p style="font-size: 0.9rem; color: #444; margin-bottom: 16px;">Set recurring weekly or monthly buys across ${svc.name} and 2,500+ ETFs.</p>
                    <a href="#info/savings-plans" data-info-topic="savings-plans" data-info-service="${slug}" class="btn btn-blue btn-sm">Learn more</a>
                  </div>
                  ${savingsImage
                    ? `<div class="promo-image-frame"><img src="${savingsImage.src}" alt="${savingsImage.alt}" loading="lazy"></div>`
                    : `<div class="img-placeholder img-placeholder-light ratio-1x1"><span>Portfolio overview</span><span class="image-size-label">Recommended: 800 × 800 px</span></div>`}
                </div>

                <div class="sp-promo-white-card">
                  <div>
                    <h3 style="font-family: var(--font-display); font-size: 1.8rem; text-transform: uppercase; margin-bottom: 8px;">ALL-IN-ONE INVESTMENT APP</h3>
                    <p style="font-size: 0.9rem; color: #444; margin-bottom: 16px;">Crypto, stocks, gold, real estate, and ${svc.name} in one seamless experience.</p>
                    <a href="#info/all-in-one-app" data-info-topic="all-in-one-app" data-info-service="${slug}" class="btn btn-blue btn-sm">Explore App</a>
                  </div>
                  <div class="img-placeholder img-placeholder-light ratio-1x1">
                    <span>Mobile investing tools</span>
                    <span class="image-size-label">Recommended: 800 × 800 px</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 12. Institutional Partners -->
          <section class="sp-partners-band">
            <div class="container">
              <div class="section-header-center">
                <p class="sp-eyebrow">Our partners</p>
                <h2 class="section-heading" style="margin-bottom: 12px;">INSTITUTIONAL SAVINGS PLANS ON SOLIDSPARK</h2>
                <p style="color: var(--text-secondary); max-width: 680px; margin: 0 auto 36px;">
                  Invest regularly in diversified strategies through partnerships with leading global asset managers and custodians.
                </p>
              </div>
              <div class="sp-editorial-grid">
                <div class="sp-partner-card">
                  <div>
                    <img class="sp-partner-logo" src="Images/ishares.png" alt="iShares" loading="lazy">
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 12px;">Access over 530 institutional index funds managed with decades of global market expertise.</p>
                  </div>
                  <a href="#info/ishares" data-info-topic="partner" data-info-title="ISHARES INSTITUTIONAL ETF SAVINGS PLANS" data-info-service="${slug}" class="sp-editorial-link">See more</a>
                </div>
                <div class="sp-partner-card">
                  <div>
                    <img class="sp-partner-logo" src="Images/amundi.jpg" alt="Amundi" loading="lazy">
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 12px;">Tap into a leading global asset manager with over 300 diversified sector and commodity ETFs.</p>
                  </div>
                  <a href="#info/amundi" data-info-topic="partner" data-info-title="AMUNDI MULTI-ASSET & COMMODITY INDEX PLANS" data-info-service="${slug}" class="sp-editorial-link">See more</a>
                </div>
                <div class="sp-partner-card">
                  <div>
                    <img class="sp-partner-logo" src="Images/xtrackers.png" alt="Xtrackers" loading="lazy">
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 12px;">Explore more than 270 transparent ETFs spanning equities, metals, and energy infrastructure.</p>
                  </div>
                  <a href="#info/xtrackers" data-info-topic="partner" data-info-title="XTRACKERS GLOBAL EQUITIES, METALS & ENERGY ETFS" data-info-service="${slug}" class="sp-editorial-link">See more</a>
                </div>
              </div>
            </div>
          </section>

          <!-- 13. Top Up, Trade On -->
          <section class="sp-topup-band">
            <div class="container">
              <p class="eyebrow">Funding and trading</p>
              <h2 class="section-heading">TOP UP, TRADE ON</h2>
              <div class="sp-editorial-grid">
                <div class="sp-topup-card">
                  <div class="sp-pillar-icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                  <h3 style="font-family: var(--font-display); font-size: 1.55rem; text-transform: uppercase;">FREE DEPOSITS ACROSS MOST PAYMENT OPTIONS</h3>
                </div>
                <div class="sp-topup-card">
                  <div class="sp-pillar-icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
                  <h3 style="font-family: var(--font-display); font-size: 1.55rem; text-transform: uppercase;">TRADE SMOOTHLY WITH A SIMPLE AND INTUITIVE UX</h3>
                </div>
                <div class="sp-topup-card">
                  <div class="sp-pillar-icon-box"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></div>
                  <h3 style="font-family: var(--font-display); font-size: 1.55rem; text-transform: uppercase;">CUSTOMER SERVICE ACROSS ALL CHANNELS</h3>
                </div>
              </div>
            </div>
          </section>

          <!-- 14. Service FAQ Accordion + Quick Service Switcher -->
          <section class="sp-faq-band" id="sp-service-faq">
            <div class="container">
              <p class="sp-eyebrow">Need to know</p>
              <h2 class="sp-section-heading-left">FAQ — ${svc.name}</h2>
              <div class="sp-faq-list" style="max-width: 100%;">${faqsHTML}</div>

              <div class="sp-switcher-bar">
                <span style="font-size: 0.82rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Switch Service:</span>
                ${switcherChips}
              </div>
            </div>
          </section>

          <!-- 15. Legal Execution Footnote -->
          <section class="sp-legal-band">
            <div class="container">
              Execution-only services for ${svc.name}, equities, ETFs, and digital assets are provided by SOLIDSPARK Financial Services. Not a public offer. This information is provided for informational purposes only and does not constitute investment advice or a recommendation. Investing involves risk of loss, and past performance is not a reliable indicator of future results. Consider your circumstances and consult an independent adviser prior to investing.
            </div>
          </section>
        `;

        homePageView.style.display = 'none';
        servicePageView.classList.add('is-active');
        startLiveMarketTicker(slug);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      function showHomePage(scrollTarget) {
        if (!homePageView || !servicePageView) return;
        stopLiveMarketTicker();
        servicePageView.classList.remove('is-active');
        if (infoPageView) infoPageView.classList.remove('is-active');
        homePageView.style.display = 'block';
        document.querySelectorAll('.services-dropdown-link').forEach((el) => el.classList.remove('is-active'));
        if (servicesToggle) servicesToggle.classList.remove('is-active');

        if (scrollTarget) {
          const targetEl = document.querySelector(scrollTarget);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            return;
          }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      /* ======================================================================
         7. FAQ ACCORDION & NAVIGATION HANDLERS
         ====================================================================== */
      document.addEventListener('click', (e) => {
        const faqBtn = e.target.closest('.sp-faq-btn');
        if (faqBtn) {
          const item = faqBtn.closest('.sp-faq-item');
          if (item) {
            const willOpen = !item.classList.contains('is-open');
            item.classList.toggle('is-open', willOpen);
            faqBtn.setAttribute('aria-expanded', String(willOpen));
          }
          return;
        }

        const infoTrigger = e.target.closest('[data-info-topic]');
        if (infoTrigger) {
          e.preventDefault();
          const topic = infoTrigger.dataset.infoTopic;
          const title = infoTrigger.dataset.infoTitle || null;
          const svcSlug = infoTrigger.dataset.infoService || activeServiceSlug;
          const routeParams = new URLSearchParams();
          if (title) routeParams.set('title', title);
          if (svcSlug) routeParams.set('service', svcSlug);
          const routeQuery = routeParams.toString();
          window.location.hash = `info/${topic}${routeQuery ? `?${routeQuery}` : ''}`;
          renderInfoPage(topic, title, svcSlug);
          return;
        }

        const serviceTrigger = e.target.closest('[data-service]');
        if (serviceTrigger) {
          e.preventDefault();
          const slug = serviceTrigger.dataset.service;
          if (SERVICES_CATALOG[slug]) {
            const pageUrl = serviceTrigger.dataset.pageUrl || SERVICE_PAGE_URLS[slug];
            if (pageUrl) {
              window.location.href = pageUrl;
              return;
            }
            window.location.hash = `service/${slug}`;
            renderServicePage(slug);
            if (servicesNavItem) servicesNavItem.classList.remove('is-open');
            if (primaryNav) primaryNav.classList.remove('is-open');
          }
          return;
        }

        const homeTrigger = e.target.closest('[data-nav="home"]');
        if (homeTrigger) {
          e.preventDefault();
          const href = homeTrigger.getAttribute('href');
          if (document.body.dataset.servicePage || document.documentElement.dataset.servicePage) {
            const homeUrl = 'solid_spark_investment%20.html';
            window.location.href = `${homeUrl}${href && href.startsWith('#') && href.length > 1 ? href : ''}`;
            return;
          }
          history.replaceState(null, '', window.location.pathname);
          showHomePage(href && href.startsWith('#') && href.length > 1 ? href : null);
        }
      });

      // Handle browser back/forward or direct #service/<slug> or #info/<topic> URL load
      function handleHashRoute() {
        const hash = window.location.hash || '';
        const pageServiceSlug = document.body.dataset.servicePage || document.documentElement.dataset.servicePage;
        if (pageServiceSlug && SERVICES_CATALOG[pageServiceSlug] && (!hash || hash.startsWith('#service/'))) {
          const serviceHash = `#service/${pageServiceSlug}`;
          if (window.location.hash !== serviceHash) {
            history.replaceState(null, '', `${window.location.pathname}${serviceHash}`);
          }
          renderServicePage(pageServiceSlug);
          return;
        }
        if (hash.startsWith('#service/')) {
          const slug = hash.replace('#service/', '').trim();
          if (SERVICES_CATALOG[slug]) {
            renderServicePage(slug);
            return;
          }
        }
        if (hash.startsWith('#info/')) {
          const route = hash.slice('#info/'.length);
          const [topic, query = ''] = route.split('?');
          const routeParams = new URLSearchParams(query);
          renderInfoPage(topic.trim(), routeParams.get('title'), routeParams.get('service') || activeServiceSlug);
          return;
        }
        showHomePage(hash.length > 1 ? hash : null);
      }

      window.addEventListener('hashchange', handleHashRoute);
      handleHashRoute();
    });