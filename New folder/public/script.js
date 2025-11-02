// Declare particlesJS variable
const particlesJS = window.particlesJS

document.addEventListener("DOMContentLoaded", () => {
  // Particles background
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
    },
  })

  // Mobile menu toggle
  const menuButton = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  menuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      mobileMenu.classList.add("hidden")
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })
    })
  })

  // Highlight active section
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section")
    const navLinks = document.querySelectorAll(".nav-link")
    const scrollPosition = window.scrollY

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active-nav")
          if (link.getAttribute("href").substring(1) === sectionId) {
            link.classList.add("active-nav")
          }
        })
      }
    })
  })

  // Animate on scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fadeIn")
      }
    })
  }, observerOptions)

  document.querySelectorAll(".skill-card, .project-card, .timeline-item").forEach((el) => {
    observer.observe(el)
  })

  // Contact form submission
  const contactForm = document.getElementById("contactForm")
  const successAlert = document.getElementById("successAlert")
  const errorAlert = document.getElementById("errorAlert")
  const submitBtn = document.getElementById("submitBtn")

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const subject = document.getElementById("subject").value
    const message = document.getElementById("message").value

    console.log("[v0] Form submitted with:", { name, email, subject, message })

    // Show loading state
    submitBtn.disabled = true
    submitBtn.classList.add("loading")
    submitBtn.textContent = "Sending..."

    try {
      console.log("[v0] Sending request to /api/contact")
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message }),
      })

      console.log("[v0] Response status:", response.status)
      const data = await response.json()
      console.log("[v0] Response data:", data)

      if (response.ok) {
        // Show success message
        successAlert.classList.add("show")
        errorAlert.classList.remove("show")

        // Reset form
        contactForm.reset()

        // Hide success message after 5 seconds
        setTimeout(() => {
          successAlert.classList.remove("show")
        }, 5000)
      } else {
        // Show error message
        errorAlert.classList.add("show")
        successAlert.classList.remove("show")
        document.getElementById("errorMessage").textContent = data.error || "Failed to send message"
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      errorAlert.classList.add("show")
      successAlert.classList.remove("show")
      document.getElementById("errorMessage").textContent = "Network error. Please try again."
    } finally {
      // Reset button state
      submitBtn.disabled = false
      submitBtn.classList.remove("loading")
      submitBtn.textContent = "Send Message"
    }
  })
})
