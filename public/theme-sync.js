// Add this script to all pages that import the header

// Function to apply theme to the current document
function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme)

    // Update any theme toggle checkboxes in the current document
    const themeToggles = document.querySelectorAll('.theme-switch input[type="checkbox"]')
    themeToggles.forEach((toggle) => {
        toggle.checked = theme === "dark"
    })
}

// Check for theme in localStorage when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme) {
        applyTheme(savedTheme)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        applyTheme("dark")
        localStorage.setItem("theme", "dark")
    }
})

// Listen for theme changes from the header or other sources
document.addEventListener("themeChanged", (e) => {
    const newTheme = e.detail.theme || e.detail // Handle both formats
    applyTheme(newTheme)
    localStorage.setItem("theme", newTheme)
})

// Listen for the header loaded event
document.addEventListener("headerLoaded", (e) => {
    const headerTheme = e.detail.theme
    applyTheme(headerTheme)
})

// Listen for system theme changes
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    // Only change theme if user hasn't set a preference
    if (!localStorage.getItem("theme")) {
        const newTheme = e.matches ? "dark" : "light"
        applyTheme(newTheme)

        // Dispatch event to notify other components
        document.dispatchEvent(
            new CustomEvent("themeChanged", {
                detail: { theme: newTheme },
                bubbles: true,
                composed: true,
            }),
        )
    }
})  