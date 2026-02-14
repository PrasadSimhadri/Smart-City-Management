document.addEventListener("DOMContentLoaded", function () {
    fetch("footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
            // console.log("footer.js loaded and executed");
        })
        .catch(error => console.log("Error loading footer:", error));
});