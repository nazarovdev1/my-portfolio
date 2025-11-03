document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ec4899" },
        shape: { type: "circle" },
        opacity: { value: 0.5, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#818cf8",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false,
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.7 } },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: { distance: 200, duration: 0.4 },
          push: { particles_nb: 4 },
          remove: { particles_nb: 2 },
        },
      },
      retina_detect: true,
    });
  }

  const menuButton = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
        mobileMenu.classList.add("hidden");
      }
      const targetElement = document.querySelector(this.getAttribute("href"));
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }

      document
        .querySelectorAll(".nav-link")
        .forEach((nav) => nav.classList.remove("active-nav"));
      this.classList.add("active-nav");
    });
  });

  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-link");
    const scrollPosition = window.scrollY;

    let currentSectionId = "";
    const headerOffset = 150;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - headerOffset;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        currentSectionId = sectionId;
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active-nav");
      if (link.getAttribute("href").substring(1) === currentSectionId) {
        link.classList.add("active-nav");
      }
    });

    if (currentSectionId === "" && window.scrollY < 300) {
      navLinks.forEach((link) => {
        link.classList.remove("active-nav");
        if (link.getAttribute("href") === "#home") {
          link.classList.add("active-nav");
        }
      });
    }
  });

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fadeIn");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(
      ".skill-card, .project-card, .timeline-item, .glow-box, .lg\\:w-2\\/3, .lg\\:w-1\\/2, .lg\\:w-1\\/3"
    )
    .forEach((el) => {
      observer.observe(el);
    });

  const contactForm = document.getElementById("contactForm");
  const successAlert = document.getElementById("successAlert");
  const errorAlert = document.getElementById("errorAlert");
  const submitBtn = document.getElementById("submitBtn");

  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      console.log("[v0] Form submitted with:", {
        name,
        email,
        subject,
        message,
      });

      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      submitBtn.textContent = "Sending...";

      try {
        console.log("[v0] Sending request to /api/contact");

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, subject, message }),
        });

        const data = await response.json();
        console.log("[v0] Response status:", response.status);
        console.log("[v0] Response data:", data);

        if (response.ok) {
          successAlert.classList.add("show");
          errorAlert.classList.remove("show");

          contactForm.reset();

          setTimeout(() => {
            successAlert.classList.remove("show");
          }, 5000);
        } else {
          errorAlert.classList.add("show");
          successAlert.classList.remove("show");
          document.getElementById("errorMessage").textContent =
            data.error || "Failed to send message";
        }
      } catch (error) {
        console.error("[v0] Error:", error);
        errorAlert.classList.add("show");
        successAlert.classList.remove("show");
        document.getElementById("errorMessage").textContent =
          "Network error. Please try again.";
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
        submitBtn.textContent = "Send Message";
      }
    });
  }
  document.getElementById("land").addEventListener("click", ()=>{
    window.location="./ui dashboard/build/index.html"
  })
  document.getElementById("land1").addEventListener("click", ()=>{
    window.location="./task manager/index.html"
  })
});
