function openPage(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closePage() {
  document.querySelectorAll(".page").forEach(p => {
    p.classList.add("hidden");
  });
}