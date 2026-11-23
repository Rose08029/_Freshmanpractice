// 移动端导航菜单
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", isOpen);
    menuButton.textContent = isOpen ? "×" : "☰";
  });
}

// 旅行清单进度
const checklist = document.querySelector(".checklist");
if (checklist) {
  const boxes = checklist.querySelectorAll('input[type="checkbox"]');
  const progress = document.querySelector(".check-progress");

  function updateProgress() {
    const completed = checklist.querySelectorAll('input[type="checkbox"]:checked').length;
    progress.textContent = `已完成 ${completed} / ${boxes.length} 项`;
  }

  boxes.forEach((box) => box.addEventListener("change", updateProgress));
  updateProgress();
}


// ============================
// 旅行相册：大图自动轮播（淡入淡出）
// ============================
const slideImage = document.querySelector("#slide-image");

if (slideImage) {
  const slides = [
    { image: "images/guilin.svg", title: "桂林 · 漓江山水", alt: "桂林漓江山水" },
    { image: "images/zhangjiajie.svg", title: "张家界 · 云雾峰林", alt: "张家界云雾峰林" },
    { image: "images/chengdu.svg", title: "成都 · 街巷日常", alt: "成都街巷" },
    { image: "images/xian.svg", title: "西安 · 古城记忆", alt: "西安古城" },
    { image: "images/hero-mountains.svg", title: "远方 · 日出时分", alt: "日出时分的山脉" }
  ];

  const slideTitle = document.querySelector("#slide-title");
  const slideCount = document.querySelector("#slide-count");
  const dotsContainer = document.querySelector("#slide-dots");
  const previousButton = document.querySelector("#prev-btn");
  const nextButton = document.querySelector("#next-btn");

  let currentSlide = 0;
  let timer = null;
  let fadeTimer = null;

  // 为每张图片建立一个可点击的圆点。
  slides.forEach((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slide-dot";
    dot.setAttribute("aria-label", `显示第 ${index + 1} 张：${slide.title}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartTimer();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll(".slide-dot");

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    // 先淡出，再换图，最后淡入。
    slideImage.classList.add("is-fading");
    clearTimeout(fadeTimer);

    fadeTimer = setTimeout(() => {
      const slide = slides[currentSlide];
      slideImage.src = slide.image;
      slideImage.alt = slide.alt;
      slideTitle.textContent = slide.title;
      slideCount.textContent =
        `${String(currentSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentSlide);
        dot.setAttribute("aria-current", dotIndex === currentSlide ? "true" : "false");
      });

      slideImage.classList.remove("is-fading");
    }, 250);
  }

  function startTimer() {
    timer = setInterval(() => showSlide(currentSlide + 1), 3500);
  }

  function restartTimer() {
    clearInterval(timer);
    startTimer();
  }

  previousButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
    restartTimer();
  });

  nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
    restartTimer();
  });

  // 鼠标悬停时暂停，离开后继续播放。
  const slideshow = document.querySelector(".slideshow");
  slideshow.addEventListener("mouseenter", () => clearInterval(timer));
  slideshow.addEventListener("mouseleave", startTimer);

  showSlide(0);
  startTimer();
}


// 首页实景照片轮播：淡入淡出
const homeSlideImage = document.querySelector("#home-slide-image");
if (homeSlideImage) {
  const homeSlides = [
    {
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/DSC07370-Great-Wall-of-China.jpg?width=1800",
      title: "万里长城 · 山脊上的历史",
      alt: "中国长城实景照片"
    },
    {
      image: "images/gugong.jpg",
      title: "北京故宫 · 红墙与琉璃瓦",
      alt: "从景山眺望紫禁城"
    },
    {
      image: "images/jiuzhaigou.jpg",
      title: "九寨沟 · 五花海",
      alt: "四川九寨沟五花海秋日湖水与彩林"
    },
    {
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/West_Lake%2C_Hangzhou_2025.jpg?width=1800",
      title: "杭州西湖 · 三潭印月与雷峰塔",
      alt: "杭州西湖三潭印月与雷峰塔"
    },
    {
      image: "images/mogaoku.png",
      title: "敦煌莫高窟 · 千年石窟",
      alt: "甘肃敦煌莫高窟石窟外景"
    },
    {
      image: "images/yuanlin.jpg",
      title: "苏州园林 · 移步换景",
      alt: "苏州古典园林亭台与花木"
    }
  ];
  const homeTitle = document.querySelector("#home-slide-title");
  const homeCount = document.querySelector("#home-slide-count");
  let homeIndex = 0;
  function showHomeSlide(index) {
    homeIndex = (index + homeSlides.length) % homeSlides.length;
    homeSlideImage.classList.add("is-fading");
    setTimeout(() => {
      const item = homeSlides[homeIndex];
      homeSlideImage.src = item.image;
      homeSlideImage.alt = item.alt;
      homeTitle.textContent = item.title;
      homeCount.textContent = `${String(homeIndex + 1).padStart(2, "0")} / ${String(homeSlides.length).padStart(2, "0")}`;
      homeSlideImage.classList.remove("is-fading");
    }, 300);
  }
  setInterval(() => showHomeSlide(homeIndex + 1), 4500);
}

// 旅行相册：选择目的地后，播放该组 8 张照片
const gallerySelect = document.querySelector("#destination-select");
const galleryImage = document.querySelector("#slide-image");
if (gallerySelect && galleryImage) {
  const photoGroups = {
    guilin: {
      name: "桂林",
      photos: ["guilinmountain.jpg", "guilinriver.jpg", "guilinsky.jpg", "guilinstwenty.jpg", "guilinsunset.jpg", "guilinsvdoublepagoda.jpg", "hcity.jpg", "huilinelenose.jpg"]
    },
    chongqing: {
      name: "重庆",
      photos: ["chongqingbridge.jpg", "chongqingbuilding.jpg", "cqhongyadong.jpg", "cqliziba.jpg", "fengjiequtangxia.jpg", "fengjiequxia.jpg", "fengjieriver.jpg", "fengjiesky.jpg"]
    },
    kanas: {
      name: "新疆喀纳斯",
      photos: ["kanasihu.jpg", "kanasihu1.jpg", "kanasihu2.jpg", "kanasihu3.jpg", "kanasilake.jpg", "kanasimoonwan.jpg", "kanasimountain.jpg", "knswolongwan.jpg"]
    },
    xian: {
      name: "西安",
      photos: ["xianbingmay1.jpg", "xianbingmay2.jpg", "xianbowuguan.jpg", "xianbwgtangsancai.jpg", "xianchengqiang.jpg", "xianchengqiang2.jpg", "xianlishan.jpg", "xianzhonggulou.jpg"]
    }
  };

  const galleryTitle = document.querySelector("#slide-title");
  const galleryCount = document.querySelector("#slide-count");
  const dotsContainer = document.querySelector("#slide-dots");
  const previousButton = document.querySelector("#prev-btn");
  const nextButton = document.querySelector("#next-btn");
  let currentPhoto = 0;
  let currentGroup = gallerySelect.value;
  let galleryTimer;
  let fadeTimer;

  function photoPath(group, filename) {
    return `images/personal/${group}/${filename}`;
  }
  function buildDots() {
    dotsContainer.innerHTML = "";
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slide-dot";
      dot.setAttribute("aria-label", `显示第 ${i + 1} 张照片`);
      dot.addEventListener("click", () => {
        showPhoto(i);
        restartGalleryTimer();
      });
      dotsContainer.appendChild(dot);
    }
  }
  function showPhoto(index) {
    const group = photoGroups[currentGroup];
    currentPhoto = (index + group.photos.length) % group.photos.length;
    galleryImage.classList.add("is-fading");
    clearTimeout(fadeTimer);
    fadeTimer = setTimeout(() => {
      const filename = group.photos[currentPhoto];
      galleryImage.src = photoPath(currentGroup, filename);
      galleryImage.alt = `${group.name}旅行照片 ${currentPhoto + 1}`;
      galleryTitle.textContent = `${group.name} · 我的旅行`;
      galleryCount.textContent = `${String(currentPhoto + 1).padStart(2, "0")} / 08`;
      dotsContainer.querySelectorAll(".slide-dot").forEach((dot, i) => {
        dot.classList.toggle("active", i === currentPhoto);
        dot.setAttribute("aria-current", i === currentPhoto ? "true" : "false");
      });
      galleryImage.classList.remove("is-fading");
    }, 250);
  }
  function startGalleryTimer() {
    clearInterval(galleryTimer);
    galleryTimer = setInterval(() => showPhoto(currentPhoto + 1), 3500);
  }
  function restartGalleryTimer() {
    startGalleryTimer();
  }
  function changeGroup() {
    currentGroup = gallerySelect.value;
    currentPhoto = 0;
    buildDots();
    showPhoto(0);
    startGalleryTimer();
  }
  previousButton.addEventListener("click", () => { showPhoto(currentPhoto - 1); restartGalleryTimer(); });
  nextButton.addEventListener("click", () => { showPhoto(currentPhoto + 1); restartGalleryTimer(); });
  gallerySelect.addEventListener("change", changeGroup);
  const gallerySlideshow = document.querySelector(".personal-slideshow");
  gallerySlideshow.addEventListener("mouseenter", () => clearInterval(galleryTimer));
  gallerySlideshow.addEventListener("mouseleave", startGalleryTimer);
  buildDots();
  showPhoto(0);
  startGalleryTimer();
}
