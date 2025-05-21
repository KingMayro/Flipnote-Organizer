
const dialogSteps = {
  "1": {
    text: "Hey there, welcome to the Flipnote Organizer! Before you get started, would you like to learn the basics of using the organizer?",
    image: "graphics/none.png", imageClass: "medium",
    buttons: [
      { text: "No thanks", next: "1a", class: "nothanks", target: "popupbut1" },
      { text: "Sure!", next: "2", class: "sure", target: "popupbut2" }
    ]
  },
  "1a": {
    text: "Alright! One more thing though, would you like to learn about and adjust some settings? If not, you can always do so from the hamburger menu.",
    image: "graphics/none.png", imageClass: "medium",
    buttons: [
      { text: "No thanks", next: "end1", class: "nothanks", target: "popupbut1" },
      { text: "Sure!", next: "7", class: "sure", target: "popupbut2" }
    ]
  },
  "2": {
    text: "Perfect! First of all, you can click or tap on the thumbnail of a Flipnote to play it. You can also drag the player around!",
    image: "graphics/introfrog/player.png", imageClass: "large rounded",
    buttons: [
	{ text: "", next: "1", class: "none", target: "popupbut1" },
	{ text: "Next", next: "3", class: "next", target: "popupbut2" }
	]
  },
  "3": {
    text: 'If you have any duplicate Flipnotes, you\'ll be able to quickly find them with the "You\'ve got duplicates" button.',
    image: "graphics/introfrog/duplicates.png", imageClass: "large rounded",
    buttons: [
      { text: "Previous", next: "2", class: "prev", target: "popupbut1" },
      { text: "Next", next: "4", class: "next", target: "popupbut2" }
    ]
  },
  "4": {
    text: "Holding shift or using the digital shift button will allow you to view extra details about a Flipnote.",
    image: "graphics/introfrog/shiftinfo.png", imageClass: "large rounded",
    buttons: [
      { text: "Previous", next: "3", class: "prev", target: "popupbut1" },
      { text: "Next", next: "5", class: "next", target: "popupbut2" }
    ]
  },
  "5": {
    text: "Finally, you can adjust certain settings from the hamburger menu on the header.",
    image: "graphics/introfrog/settings.png", imageClass: "large rounded",
    buttons: [
      { text: "Previous", next: "4", class: "prev", target: "popupbut1" },
      { text: "Next", next: "6", class: "next", target: "popupbut2" }
    ]
  },
  "6": {
    text: "Actually, speaking of settings... would you like to learn about and adjust some settings?",
    image: "graphics/none.png", imageClass: "large",
    buttons: [
      { text: "No thanks", next: "10", class: "nothanks", target: "popupbut1" },
      { text: "Sure!", next: "7", class: "sure", target: "popupbut2" }
    ]
  },
"7": {
  text: "Would you like to see original resolution thumbnails or high resolution ones? High resolution ones offer better readability and vibrancy; they're preferable on mobile.",
  image: "graphics/introfrog/thumbvhigh.png", imageClass: "medium",
  buttons: [
    {
      text: "Original Res", next: "8", class: "resbut", target: "popupbut1",
      settingEffect: () => {
        whichthumbnail = true;
        localStorage.setItem("whichthumbnail", whichthumbnail);
        thumbtogglechange();
      }
    },
    {
      text: "High Res", next: "8", class: "resbut", target: "popupbut2",
      settingEffect: () => {
        whichthumbnail = false;
        localStorage.setItem("whichthumbnail", whichthumbnail);
        thumbtogglechange();
      }
    }
  ]
},
"8": {
  text: "Do you want to see more details about a Flipnote when holding shift?",
  image: "graphics/introfrog/shiftinfo.png", imageClass: "large rounded",
  buttons: [
    {
      text: "No", next: "10", class: "nothanks", target: "popupbut1",
      settingEffect: () => {
        shiftEnabled = false;
        localStorage.setItem("shiftEnabled", shiftEnabled);
        shifttogglechange();
        digitalshiftchange();
      }
    },
    {
      text: "Yes", next: "9", class: "sure", target: "popupbut2",
      settingEffect: () => {
        shiftEnabled = true;
        localStorage.setItem("shiftEnabled", shiftEnabled);
        shifttogglechange();
        digitalshiftchange();
      }
    }
  ]
},
"9": {
  text: "Would you like to have a digital shift button? This can be preferable for those on mobile.",
  image: "graphics/introfrog/digitalshift.png", imageClass: "large rounded",
  buttons: [
    {
      text: "No", next: "10", class: "nothanks", target: "popupbut1",
      settingEffect: () => {
        digitalShiftenabled = false;
        localStorage.setItem("digitalShiftenabled", digitalShiftenabled);
        digitalshiftchange();
      }
    },
    {
      text: "Yes", next: "10", class: "sure", target: "popupbut2",
      settingEffect: () => {
        digitalShiftenabled = true;
        localStorage.setItem("digitalShiftenabled", digitalShiftenabled);
        digitalshiftchange();
      }
    }
  ]
},
  "10": {
    text: "Well that's all I will bug you with for now. Enjoy the Flipnote Organizer!",
    image: "graphics/none.png", imageClass: "large",
    buttons: [
	{ text: "", next: "1", class: "none", target: "popupbut1" },
	{ text: "", next: "1", class: "none", target: "popupbut2" }
	],
	next: "closefrogbox"
  },
  "end1": {
    text: "Got it! Enjoy the Flipnote Organizer!",
    image: "graphics/none.png", imageClass: "large",
    buttons: [
	{ text: "", next: "1", class: "none", target: "popupbut1" },
	{ text: "", next: "1", class: "none", target: "popupbut2" }
	],
	next: "closefrogbox"
  }
};

let currentStep = "1";

document.addEventListener("DOMContentLoaded", () => {
  Object.values(dialogSteps).forEach(step => {
    if (step.image) {
      const img = new Image();
      img.src = step.image;
    }
  });
	
  if (!localStorage.getItem("infoseen")) {
    const frogPopupBox = document.querySelector(".frogpopupbox");
    if (frogPopupBox) {
      frogPopupBox.style.display = "";
    }
    frogdialog(currentStep);
  }
});

function textfade(el, newText, callback) {
  el.style.opacity = 0;
  setTimeout(() => {
    if (typeof newText === "string") el.innerText = newText;
    else if (typeof newText === "function") newText();
    el.style.opacity = 1;
    if (callback) callback();
  }, 300);
}

function frogdialog(stepId) {
  const headers = document.querySelectorAll(".therealheader, .header, .slidebutton");
  const frogPopupBox = document.querySelector(".frogpopupbox");

  if (stepId !== "closefrogbox" && frogPopupBox && frogPopupBox.style.display !== "none") {
    headers.forEach(el => el.classList.add("donttouchie"));
  }

  if (stepId === "closefrogbox") {
    localStorage.setItem("infoseen", "true");

    const frogbox = document.querySelector(".frogboxholder");
    const mainbox = document.querySelector(".frogpopupbox");
    if (frogbox) {
      frogbox.classList.add("popupout");
      setTimeout(() => {
        mainbox.style.display = "none";
      }, 1000);
    } else {
      console.warn(".frogboxholder element not found!");
    }

    headers.forEach(el => el.classList.remove("donttouchie"));
    return;
  }


  currentStep = stepId;
  const step = dialogSteps[stepId];

  const speech = document.getElementById("speechbubbletext");
  textfade(speech, step.text);

	const img = document.getElementById("tutorialmain");

	if (step.image) {
	  img.style.opacity = 0;

	  setTimeout(() => {
		img.src = step.image;
		img.className = step.imageClass;
		img.style.opacity = 1;
	  }, 300);
	} else {
	  img.style.opacity = 0;
	  setTimeout(() => {
		img.src = "";
		img.className = "";
	  }, 300);
	}

  const popupbut1 = document.getElementById("popupbut1");
  const popupbut2 = document.getElementById("popupbut2");

  const thebuttons = ["sure", "nothanks", "resbut", "next", "prev", "none"];

  thebuttons.forEach(cls => {
    popupbut1.classList.remove(cls);
    popupbut2.classList.remove(cls);
  });

  popupbut1.onclick = null;
  popupbut2.onclick = null;

  if (step.buttons && step.buttons.length > 0) {
    const btn1 = step.buttons.find(btn => btn.target === "popupbut1");
    const btn2 = step.buttons.find(btn => btn.target !== "popupbut1");

    if (btn1) {
      popupbut1.textContent = btn1.text;
      popupbut1.classList.add(btn1.class);
      popupbut1.onclick = () => {
        if (btn1.settingEffect) btn1.settingEffect();
        frogdialog(btn1.next);
      };
    } else {
      popupbut1.textContent = "";
      popupbut1.onclick = null;
    }

    if (btn2) {
      popupbut2.textContent = btn2.text;
      popupbut2.classList.add(btn2.class);
      popupbut2.onclick = () => {
        if (btn2.settingEffect) btn2.settingEffect();
        frogdialog(btn2.next);
      };
    } else {
      popupbut2.textContent = "";
      popupbut2.onclick = null;
    }
  } else {
    popupbut1.textContent = "";
    popupbut1.onclick = null;
    popupbut2.textContent = "";
    popupbut2.onclick = null;
  }

  if ((!step.buttons || step.buttons.every(btn => !btn.text || btn.class === "none")) && step.next) {
    setTimeout(() => frogdialog(step.next), 3000);
  }

  
}


frogdialog(currentStep);