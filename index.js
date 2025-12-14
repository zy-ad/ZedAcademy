document.addEventListener("DOMContentLoaded", () => {
  // ======================= 1. سلايدر Hero التلقائي =======================
  const heroSliderImages = document.querySelectorAll(
    ".hero-slider .slider-image"
  );
  const heroSliderDots = document.querySelectorAll(".hero-slider .dot");
  let currentSlide = 0;
  const slideInterval = 5000; // 5 ثواني

  function showHeroSlide(index) {
    heroSliderImages.forEach((img) => img.classList.remove("active"));
    heroSliderDots.forEach((dot) => dot.classList.remove("active"));

    heroSliderImages[index].classList.add("active");
    heroSliderDots[index].classList.add("active");
    currentSlide = index;
  }

  function nextHeroSlide() {
    const nextIndex = (currentSlide + 1) % heroSliderImages.length;
    showHeroSlide(nextIndex);
  }

  let heroSlideTimer = setInterval(nextHeroSlide, slideInterval);

  heroSliderDots.forEach((dot) => {
    dot.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      clearInterval(heroSlideTimer);
      showHeroSlide(index);
      heroSlideTimer = setInterval(nextHeroSlide, slideInterval);
    });
  });

  // ======================= 2. مودال تسجيل الدخول =======================
  const loginModal = document.getElementById("loginModal");
  const openLoginBtn = document.getElementById("openLoginModal");
  const closeBtn = document.querySelector(".close-btn");

  openLoginBtn.addEventListener("click", () => {
    loginModal.classList.add("active", "fadeIn");
  });

  closeBtn.addEventListener("click", () => {
    loginModal.classList.remove("active", "fadeIn");
  });

  window.addEventListener("click", (event) => {
    if (event.target === loginModal) {
      loginModal.classList.remove("active", "fadeIn");
    }
  });

  // ======================= 3. العدادات المتحركة (Animated Counters) =======================
  const counters = document.querySelectorAll(".counter");
  const aboutSection = document.getElementById("about");
  const aboutImage = document.querySelector(".about-image");
  let hasAnimated = false;

  function animateCounter(counter) {
    const target = +counter.getAttribute("data-target");
    const duration = 1500; // 1.5 ثانية
    const startTime = performance.now();

    function updateCount(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.floor(progress * target);

      counter.innerText = value;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        counter.innerText = target;
      }
    }
    requestAnimationFrame(updateCount);
  }

  const aboutObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!hasAnimated) {
            // تشغيل العدادات
            counters.forEach(animateCounter);
            // تفعيل حركة ظهور الصورة
            if (aboutImage) {
              // لا نحتاج لإضافة فئة "visible" لأننا نستخدم فئة CSS مسبقة (animate-from-bottom)
              // لكن يجب إجبار إعادة تشغيل الحركة إذا لزم الأمر، لكن في هذه الحالة، كفاية الفئة
              aboutImage.style.opacity = 1; // لضمان ظهورها بشكل صحيح مع الـ animate-from-bottom
            }
            hasAnimated = true;
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 } // يبدأ عندما يظهر 30% من القسم
  );

  if (aboutSection) {
    aboutObserver.observe(aboutSection);
  }

  // ======================= 4. سلايدر صور المنتجات (لكل الكاردات) =======================
  const productCards = document.querySelectorAll(
    ".product-card[data-product-id]"
  );

  function showProductSlide(productId, step) {
    const sliderWrapper = document.querySelector(
      `.product-image-slider[data-product-id="${productId}"]`
    );
    const images = sliderWrapper.querySelectorAll(".product-image");

    let currentIndex = 0;

    images.forEach((img, index) => {
      if (img.classList.contains("active")) {
        currentIndex = index;
      }
      img.classList.remove("active");
    });

    // حساب الفهرس الجديد والانتقال الدوري
    let newIndex = currentIndex + step;
    if (newIndex >= images.length) {
      newIndex = 0;
    } else if (newIndex < 0) {
      newIndex = images.length - 1;
    }

    images[newIndex].classList.add("active");
  }

  // تفعيل أزرار التنقل (prev/next) لجميع المنتجات
  productCards.forEach((card) => {
    const productId = card.getAttribute("data-product-id");
    const prevBtn = card.querySelector(".prev-btn");
    const nextBtn = card.querySelector(".next-btn");

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // منع انتقال النقرة للكارد كله
        showProductSlide(productId, -1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // منع انتقال النقرة للكارد كله
        showProductSlide(productId, 1);
      });
    }
  });

  // ======================= 5. حركات ظهور الكاردات (Scroll Animation) =======================
  const cardsToAnimate = document.querySelectorAll(
    ".course-card, .product-card"
  );

  const cardObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const card = entry.target;
          // الحصول على التأخير المحدد من JS في خطوة لاحقة، أو استخدام قيمة افتراضية
          const delay = card.getAttribute("data-delay") || "0";

          // إضافة الفئة Visible بعد تأخير بسيط لإتاحة الرؤية
          setTimeout(() => {
            card.classList.add("visible");
          }, delay);

          observer.unobserve(card); // التوقف عن مراقبة الكارد بعد ظهوره
        }
      });
    },
    {
      rootMargin: "0px",
      threshold: 0.1, // يبدأ الحركة عندما يظهر 10% من الكارد
    }
  );

  cardsToAnimate.forEach((card, index) => {
    // إعطاء تأخير متفاوت (staggered delay) لكل كارد
    // التأخير 100 مللي ثانية بين كل كارد وآخر
    const delay = index * 100;
    card.setAttribute("data-delay", delay);

    cardObserver.observe(card);
  });

  // =========================================================
  // 6. التحكم في الانتقال عبر النافبار وشاشة التحميل
  // =========================================================

  const loadingScreen = document.getElementById("loading-screen");
  // تحديد جميع روابط التنقل التي تقع ضمن فئة 'nav-item'
  const navLinks = document.querySelectorAll(".nav-links a.nav-item");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // تحقق من أن الرابط ليس هو الصفحة الحالية
      if (this.classList.contains("active")) {
        e.preventDefault();
        return;
      }

      e.preventDefault(); // منع الانتقال الافتراضي فوراً

      const targetUrl = this.href;

      // أ. إظهار شاشة التحميل
      loadingScreen.classList.add("is-active");

      // ب. تحديد المدة الزمنية للتحميل إلى 500 مللي ثانية (نصف ثانية)
      const loadingDuration = 500;

      setTimeout(() => {
        // ج. التوجيه إلى الصفحة الجديدة بعد انتهاء الوقت
        window.location.href = targetUrl;
      }, loadingDuration);
    });
  });

  // =========================================================
  // 7. إخفاء شاشة التحميل عند تحميل محتوى الصفحة الجديدة
  // =========================================================

  window.addEventListener("load", () => {
    // تأخير بسيط لضمان الإخفاء السلس
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.remove("is-active");
      }
    }, 100);
  });
});
