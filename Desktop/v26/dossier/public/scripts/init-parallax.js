// This script will be executed after jQuery and the parallax plugin are loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if jQuery is loaded
  if (typeof window.jQuery !== "undefined") {
    console.log("jQuery is loaded!")

    // Make sure $ is defined
    const $ = window.jQuery

    // Initialize parallax after a short delay to ensure everything is ready
    setTimeout(() => {
      try {
        $("#parallax-background").parallax({
          scalarX: 25,
          scalarY: 15,
          frictionX: 0.1,
          frictionY: 0.1,
        })
        console.log("Parallax initialized successfully")
      } catch (error) {
        console.error("Error initializing parallax:", error)
      }
    }, 500)
  } else {
    console.error("jQuery is not loaded!")
  }
})
