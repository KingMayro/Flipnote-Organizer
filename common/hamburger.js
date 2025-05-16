	const hambutton = document.getElementById("hambutton");
	const hammenu = document.getElementById("hammenu");

	hambutton.addEventListener("click", (e) => {
	  e.stopPropagation();
	  hammenu.classList.toggle("open");
	});

	document.addEventListener("click", (e) => {
	  if (!document.getElementById("hamburger").contains(e.target)) {
		hammenu.classList.remove("open");
	  }
	});