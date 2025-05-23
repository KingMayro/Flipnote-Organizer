	// what a trainwreck
	// dont let me code again lmao
	
	const clickDownSound = new Audio("sound/SE_SY_BUTTON_IN.wav");
	const playSound = new Audio("sound/SE_SY_MOVIE_PLAY.wav");
	const pauseSound = new Audio("sound/SE_SY_MOVIE_STOP.wav");
	const folderListOpenSound = new Audio("sound/SE_SY_POPUP.wav");
	const folderListCloseSound = new Audio("sound/SE_SY_POPUP_SELECT.wav");
	const dupListOpenSound = new Audio("sound/SE_SY_FRAME_BUTTON.wav");
	const dupListCloseSound = new Audio("sound/SE_SY_FRAME_RETURN.wav");
	const shiftDownSound = new Audio('sound/SE_SY_SHIFT_MODE_ON.wav');
	const shiftReleaseSound = new Audio('sound/SE_SY_SHIFT_MODE_OFF.wav');
	const frogcroak = new Audio('sound/introfrog/frog1.wav');


	const buttonSounds = {
	  thumb: new Audio("sound/SE_SY_CURSOR_MOVE.wav"),
	  largethumb: new Audio("sound/SE_SY_CURSOR_MOVE.wav"),
	  returnTop: new Audio("sound/SE_SY_FRAME_RETURN_TOP.wav"),
	  closePlayer: new Audio("sound/SE_SY_DRAW_TOOL_BTN_OFF.wav"),
	  folderstufflist: new Audio("sound/SE_SY_POPUP_SELECT.wav"),
	  prev: new Audio("sound/SE_SY_PAGE_BACKWARD.wav"),
	  next: new Audio("sound/SE_SY_PAGE_FORWARD.wav"),
	  sure: new Audio("sound/SE_SY_OK.wav"),
	  nothanks: new Audio("sound/SE_SY_CANCEL.wav"),
	  resbut: new Audio("sound/SE_SY_REGULAR_BUTTON.wav")
	};
	
	
	document.addEventListener("DOMContentLoaded", () => {
	  document.addEventListener("mousedown", (e) => {
		if (e.target.closest("#thumb, #folderSelect, #returnTop, #closePlayer, .folderstufflist, .dupbutton, .playstateicon, #digitalShift, .largethumb, .tutorialbutton")) {
		  clickDownSound.volume = sfxVolume;
		  clickDownSound.currentTime = 0;
		  clickDownSound.play();
		}
	  });

	  document.addEventListener("mouseup", (e) => {
		const el = e.target.closest("[id], [class]");

		if (!el) return;

		if (el.id && buttonSounds[el.id]) {
		  const snd = buttonSounds[el.id];
		  snd.volume = sfxVolume;
		  snd.currentTime = 0;
		  snd.play();
		  return;
		}

		for (const cls of el.classList) {
		  if (buttonSounds[cls]) {
			const snd = buttonSounds[cls];
			snd.volume = sfxVolume;
			snd.currentTime = 0;
			snd.play();
			break;
		  }
		}
	  });
	});


// I could never get the perfect sizes for the inter alt elements, so this will have to do :happee:
	function flipdetailheight() {
	  const cards = document.querySelectorAll('.flipnote');

	  cards.forEach(card => {
		const flipDets = card.querySelector('.flipdetails');
		const altFlipDets = card.querySelector('.altflipdetails');

		if (!flipDets || !altFlipDets) return;

		const flipDetsStyle = window.getComputedStyle(flipDets);
		
		if (flipDetsStyle.display === 'none') return;

		const flipDetsHeight = flipDets.getBoundingClientRect().height;
		const altFlipDetsHeight = parseFloat(altFlipDets.style.height) || 0;

		if (Math.abs(flipDetsHeight - altFlipDetsHeight) > 0.2) {
		  altFlipDets.style.height = `${flipDetsHeight}px`;
		}
	  });
	}


	let shiftEnabled = localStorage.getItem("shiftEnabled");
	shiftEnabled = shiftEnabled === null ? true : shiftEnabled === "true";

	let digitalShiftenabled = localStorage.getItem("digitalShiftenabled") === "true";
	let shiftPushed = false;
	let digitalshifton = false;

	const visibleFlipnotes = new Set();

	const shiftToggle = document.getElementById("shiftToggle");
	const digitalshifttoggle = document.getElementById("digitalShiftToggle");
	const digitalshift = document.getElementById("digitalShift");
	const returnTop = document.getElementById("returnTop");

	function updateCardAltDetails(card, showAlt) {
	  const flipDets = card.querySelector('.flipdetails');
	  const detailsDiv = card.querySelector('.altflipdetails');

	  if (showAlt) {
		if (flipDets) flipDets.style.display = 'none';
		if (detailsDiv) detailsDiv.style.display = 'block';
	  } else {
		if (flipDets) flipDets.style.display = 'block';
		if (detailsDiv) detailsDiv.style.display = 'none';
	  }
	}

	const observer = new IntersectionObserver(entries => {
	  for (const entry of entries) {
		const card = entry.target;

		if (entry.isIntersecting) {
		  visibleFlipnotes.add(card);
		  updateCardAltDetails(card, shiftPushed);
		} else {
		  visibleFlipnotes.delete(card);
		}
	  }
	}, {
	  root: null,
	  threshold: 0.01
	});

	document.querySelectorAll('.flipnote').forEach(card => observer.observe(card));

	function shifttogglechange() {
	  shiftToggle.classList.toggle("off", !shiftEnabled);
	}

	function digitalshiftchange() {
	  digitalshifttoggle.classList.toggle("off", !digitalShiftenabled);
	  digitalshifttoggle.classList.toggle("disabled", !shiftEnabled);

	  if (!shiftEnabled) {
		digitalshift.classList.remove("visible");
		digitalshift.classList.remove("held");
		returnTop.classList.remove("shifttopbutton");
		digitalshifton = false;
		shiftPushed = false;
		visibleFlipnotes.forEach(card => updateCardAltDetails(card, false));
		return;
	  }

	  if (digitalShiftenabled) {
		digitalshift.classList.add("visible");
		returnTop.classList.add("shifttopbutton");
	  } else {
		digitalshift.classList.remove("visible");
		returnTop.classList.remove("shifttopbutton");
		if (digitalshifton) {
		  digitalshifton = false;
		  shiftPushed = false;
		  digitalshift.classList.remove("held");
		  shiftReleaseSound.volume = sfxVolume;
		  shiftReleaseSound.currentTime = 0;
		  shiftReleaseSound.play();
		  visibleFlipnotes.forEach(card => updateCardAltDetails(card, false));
		}
	  }
	}

	// Toggle events
	shiftToggle.addEventListener("click", () => {
	  shiftEnabled = !shiftEnabled;
	  localStorage.setItem("shiftEnabled", shiftEnabled);
	  shifttogglechange();
	  digitalshiftchange();

	  if (!shiftEnabled && shiftPushed) {
		shiftPushed = false;
		visibleFlipnotes.forEach(card => updateCardAltDetails(card, false));
	  }
	});

	digitalshifttoggle.addEventListener("click", () => {
	  if (!shiftEnabled) return;

	  digitalShiftenabled = !digitalShiftenabled;
	  localStorage.setItem("digitalShiftenabled", digitalShiftenabled);
	  digitalshiftchange();
	});

	digitalshift.addEventListener("click", () => {
	  if (!shiftEnabled || !digitalShiftenabled) return;

	  if (!digitalshifton) {
		shiftPushed = true;
		digitalshifton = true;
		digitalshift.classList.add("held");
		shiftDownSound.volume = sfxVolume;
		shiftDownSound.currentTime = 0;
		shiftDownSound.play();
		visibleFlipnotes.forEach(card => updateCardAltDetails(card, true));
	  } else {
		shiftPushed = false;
		digitalshifton = false;
		digitalshift.classList.remove("held");
		shiftReleaseSound.volume = sfxVolume;
		shiftReleaseSound.currentTime = 0;
		shiftReleaseSound.play();
		visibleFlipnotes.forEach(card => updateCardAltDetails(card, false));
	  }
	});

	document.addEventListener("keydown", (e) => {
	  if (!shiftEnabled || digitalShiftenabled) return;

	  if (e.key === 'Shift' && !shiftPushed) {
		shiftPushed = true;
		shiftDownSound.volume = sfxVolume;
		shiftDownSound.currentTime = 0;
		shiftDownSound.play();
		visibleFlipnotes.forEach(card => updateCardAltDetails(card, true));
	  }
	});

	document.addEventListener("keyup", (e) => {
	  if (!shiftEnabled || digitalShiftenabled) return;

	  if (e.key === 'Shift') {
		shiftPushed = false;
		shiftReleaseSound.volume = sfxVolume;
		shiftReleaseSound.currentTime = 0;
		shiftReleaseSound.play();
		visibleFlipnotes.forEach(card => updateCardAltDetails(card, false));
	  }
	});

	shifttogglechange();
	digitalshiftchange();



	function updateCardAltDetails(card, showAlt) {
	  const flipDets = card.querySelector('.flipdetails');
	  const detailsDiv = card.querySelector('.altflipdetails');
	  flipdetailheight();

	  if (showAlt) {
		if (flipDets) flipDets.style.display = 'none';
		if (detailsDiv) detailsDiv.style.display = 'block';
	  } else {
		if (flipDets) flipDets.style.display = 'block';
		if (detailsDiv) detailsDiv.style.display = 'none';
	  }
	}

	//true
	function watchflipnotes() {
	  document.querySelectorAll('.flipnote').forEach(card => observer.observe(card));
	}

	watchflipnotes();

    const player = document.getElementById("flipnotePlayer");
	const playerSlider = player.querySelector('flipnote-player-slider');
	const closePlayerButton = document.getElementById('closePlayer');	

	let ndsUnicode = {};

	async function sudofontBootleg() {
	  const response = await fetch('font/sudofont_emoji_mappings.json');
	  const data = await response.json();

	  for (const key in data) {
		const { nds_text, unicode_text } = data[key];
		if (nds_text && unicode_text) {
		  ndsUnicode[nds_text] = unicode_text;
		}
	  }
	}

	function sudofontRemap(input) {
	  return input.split('').map(char => ndsUnicode[char] || char).join('');
	}

	sudofontBootleg();


	const returnToTop = document.getElementById('returnTop');

	window.addEventListener('scroll', () => {
	  if (window.scrollY > 650) {
		returnToTop.classList.add('visible');
	  } else {
		returnToTop.classList.remove('visible');
	  }
	});


	returnToTop.addEventListener('click', () => {
	  window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	closePlayerButton.addEventListener('click', () => {
	  player.style.display = 'none';
	  player.pause();
	  if (activeThumb) {
		activeThumb.classList.remove('playeractive');
		activeThumb = null;
	  }
	  
	  if (playPauseIcon) {
		playPauseIcon.remove();
		playPauseIcon = null;
	  }

	  closePlayerButton.classList.remove('visible');
	  setTimeout(() => {
	  }, 300);
	});

	
	let holdTheLoad;
	let frogShown = false;
	let frogTimerStarted = false;

	function showFrog() {
		if (frogTimerStarted) return;
		frogTimerStarted = true;

		holdTheLoad = setTimeout(() => {
			document.getElementById("loadingfrog").style.display = "block";
			frogShown = true;
		}, 500);
	}

	function hideFrog() {
		clearTimeout(holdTheLoad);

		if (frogShown) {
			setTimeout(() => {
				document.getElementById("loadingfrog").style.display = "none";
				resetFrogFlags();
			}, 200);
		} else {
			resetFrogFlags();
		}
	}

	function resetFrogFlags() {
		frogShown = false;
		frogTimerStarted = false;
	}


		let activeThumb = null;

	function openPlayer(file, thumbEl) {
	  const reader = new FileReader();
	  reader.onload = () => {
		player.src = reader.result;
		player.style.display = "block";
		closePlayerButton.style.display = "block";
		requestAnimationFrame(() => closePlayerButton.classList.add('visible'));


		if (activeThumb) {
		  activeThumb.classList.remove('playeractive');
		  if (playPauseIcon) {
			playPauseIcon.remove();
			playPauseIcon = null;
		  }
		}

		thumbEl.classList.add('playeractive');
		activeThumb = thumbEl;

		playPauseIcon = document.createElement('img');
		playPauseIcon.className = 'playstateicon';
		playPauseIcon.src = player.paused ? 'graphics/play.svg' : 'graphics/pause.svg';
		
		playPauseIcon.addEventListener('click', (e) => {
		  e.stopPropagation();
		  if (player.paused) {
			player.play();
			playSound.volume = sfxVolume;
			playSound.currentTime = 0;
			playSound.play();
		  } else {
			player.pause();
			pauseSound.volume = sfxVolume;
			pauseSound.currentTime = 0;
			pauseSound.play();
		  }
		});

		const flipnoteDiv = thumbEl.closest('.flipnote');
		if (flipnoteDiv) {
		  flipnoteDiv.insertBefore(playPauseIcon, thumbEl);
		}

		const handleLoad = () => {
		  player.removeEventListener('load', handleLoad);
		  player.play();
		  updatePlayPauseIcon();
		};
		player.addEventListener('load', handleLoad);
	  };
	  reader.readAsArrayBuffer(file);
	}

	
	function updatePlayPauseIcon() {
	  if (playPauseIcon) {
		playPauseIcon.src = player.paused ? 'graphics/play.svg' : 'graphics/pause.svg';
	  }
	}

	player.addEventListener('play', updatePlayPauseIcon);
	player.addEventListener('pause', updatePlayPauseIcon);


	let isDragging = false;
	let offsetX, offsetY;
	let initialX, initialY;
	const moveThreshold = 5;

	function getEventCoords(e) {
	  if (e.touches && e.touches.length > 0) {
		return { x: e.touches[0].clientX, y: e.touches[0].clientY };
	  } else {
		return { x: e.clientX, y: e.clientY };
	  }
	}

	function startDrag(e) {
	  const path = e.composedPath ? e.composedPath() : (e.path || []);
	  const interactingWithSlider = path.some(el =>
		el.tagName && el.tagName.toLowerCase() === 'flipnote-player-slider'
	  );

	  if (interactingWithSlider) return;

	  const coords = getEventCoords(e);
	  isDragging = true;
	  initialX = coords.x;
	  initialY = coords.y;
	  offsetX = coords.x - player.offsetLeft;
	  offsetY = coords.y - player.offsetTop;

	  if (e.type === 'touchstart') {
		e.preventDefault();
	  }
	}

	function onDrag(e) {
	  if (!isDragging) return;

	  const coords = getEventCoords(e);
	  const deltaX = coords.x - initialX;
	  const deltaY = coords.y - initialY;

	  player.style.left = `${coords.x - offsetX}px`;
	  player.style.top = `${coords.y - offsetY}px`;

	  if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
		player.style.pointerEvents = 'none';
	  }

	  if (e.type === 'touchmove') {
		e.preventDefault();
	  }
	}

	function stopDrag() {
	  if (isDragging) {
		player.style.pointerEvents = 'auto';
		isDragging = false;
	  }
	}

	player.addEventListener('mousedown', startDrag);
	document.addEventListener('mousemove', onDrag);
	document.addEventListener('mouseup', stopDrag);

	player.addEventListener('touchstart', startDrag, { passive: false });
	document.addEventListener('touchmove', onDrag, { passive: false });
	document.addEventListener('touchend', stopDrag);



	let sfxVolume = parseFloat(localStorage.getItem('sfxVolume'));
	if (isNaN(sfxVolume)) sfxVolume = 1;

	let wasVolume = parseFloat(localStorage.getItem('wasVolume'));
	if (isNaN(wasVolume) || wasVolume === 0) wasVolume = 1;

	let isDraggingVol = false;

	const wrapper = document.getElementById("sfxvol");
	const track = document.getElementById("sfxvolslider");
	const fill = document.getElementById("sfxvolssliderbg");
	const handle = document.getElementById("sfxvolhandle");
	const icon = document.getElementById("sfxvolicon");

	function moveslider() {
	  fill.style.width = (sfxVolume * 100) + "%";
	  handle.style.left = (sfxVolume * 100) + "%";
	}

	function updateIcon() {
	  icon.src = sfxVolume === 0 ? "graphics/mute.svg" : "graphics/vol.svg";
	}

	function changesliderandicon() {
	  moveslider();
	  updateIcon();
	}

	function setvolumeFromX(x) {
	  const rect = track.getBoundingClientRect();
	  let percentage = (x - rect.left) / rect.width;
	  percentage = Math.max(0, Math.min(1, percentage));
	  sfxVolume = percentage;

	  if (sfxVolume > 0) {
		wasVolume = sfxVolume;
	  }

	  localStorage.setItem("sfxVolume", sfxVolume);
	  changesliderandicon();
	}

	wrapper.addEventListener("mousedown", (e) => {
	  isDraggingVol = true;
	  handle.style.display = "block";
	  setvolumeFromX(e.clientX);

	  const onMouseMove = (e) => setvolumeFromX(e.clientX);
	  const onMouseUp = () => {
		isDraggingVol = false;
		if (!track.matches(':hover')) handle.style.display = "none";
		document.removeEventListener("mousemove", onMouseMove);
		document.removeEventListener("mouseup", onMouseUp);
	  };

	  document.addEventListener("mousemove", onMouseMove);
	  document.addEventListener("mouseup", onMouseUp);
	});

	wrapper.addEventListener("touchstart", (e) => {
	  isDraggingVol = true;
	  handle.style.display = "block";
	  setvolumeFromX(e.touches[0].clientX);
	  e.preventDefault();

	  const onTouchMove = (e) => {
		setvolumeFromX(e.touches[0].clientX);
		e.preventDefault();
	  };

	  const onTouchEnd = () => {
		isDraggingVol = false;
		handle.style.display = "none";
		document.removeEventListener("touchmove", onTouchMove);
		document.removeEventListener("touchend", onTouchEnd);
	  };

	  document.addEventListener("touchmove", onTouchMove, { passive: false });
	  document.addEventListener("touchend", onTouchEnd);
	}, { passive: false });

	wrapper.addEventListener("mouseenter", () => {
	  handle.style.display = "block";
	});
	wrapper.addEventListener("mouseleave", () => {
	  if (!isDraggingVol) {
		handle.style.display = "none";
	  }
	});

	icon.addEventListener("click", () => {
	  if (sfxVolume === 0) {
		sfxVolume = wasVolume || 1;
	  } else {
		wasVolume = sfxVolume;
		sfxVolume = 0;
	  }
	  localStorage.setItem("sfxVolume", sfxVolume);
	  changesliderandicon();
	});

	changesliderandicon();

	
	let whichthumbnail = localStorage.getItem("whichthumbnail");
	whichthumbnail = whichthumbnail === null ? true : whichthumbnail === "true";

	const thumbToggle = document.getElementById("thumbToggle");

	function thumbtogglechange() {
	  thumbToggle.classList.toggle("off", !whichthumbnail);
	}

	thumbToggle.addEventListener("click", () => {
	  whichthumbnail = !whichthumbnail;
	  localStorage.setItem("whichthumbnail", whichthumbnail);
	  thumbtogglechange();

	  const hasFolders = globalPpmFilesByFolder && Object.keys(globalPpmFilesByFolder).length > 0;
	  if (hasFolders && typeof renderFolder === 'function' && typeof currentlySelectedFolder !== 'undefined') {
		renderFolder(currentlySelectedFolder);
	  }
	});

	thumbtogglechange();
	
	
	let usefnsort = localStorage.getItem("usefnsort");
	usefnsort = usefnsort === null ? false : usefnsort === "true";

	const fnSortToggle = document.getElementById("fnSortToggle");

	function fnSortTogglechange() {
	  fnSortToggle.classList.toggle("off", !usefnsort);
	}

	fnSortToggle.addEventListener("click", async () => {
	  usefnsort = !usefnsort;
	  localStorage.setItem("usefnsort", usefnsort);
	  fnSortTogglechange();

	  await setFnSorting();
	  if (typeof renderFolder === 'function' && typeof currentlySelectedFolder !== 'undefined') {
		renderFolder(currentlySelectedFolder);
	  }
	});

	fnSortTogglechange();
	
	
	
	let sudoeq = localStorage.getItem("sudoeq");
	sudoeq = sudoeq === null ? false : sudoeq === "true";

	const sudoEQToggle = document.getElementById("sudoEQToggle");

	function sudoEQTogglechange() {
	  sudoEQToggle.classList.toggle("off", !sudoeq);
	  if (typeof player !== "undefined" && typeof player.setAudioEq === "function") {
		player.setAudioEq(sudoeq);
	  }
	}

	sudoEQToggle.addEventListener("click", async () => {
	  sudoeq = !sudoeq;
	  localStorage.setItem("sudoeq", sudoeq);
	  sudoEQTogglechange();
	});

	sudoEQTogglechange();


	let fixedheader = localStorage.getItem("fixedheader");
	fixedheader = fixedheader === null ? false : fixedheader === "true";

	const fixHeaderToggle = document.getElementById("fixHeaderToggle");

	function headerToggleChange() {
	  fixHeaderToggle.classList.toggle("off", !fixedheader);

	  const therealheader = document.querySelector(".therealheader");
	  const theheader = document.querySelector(".header");
	  if (therealheader) {
		if (fixedheader) {
		  therealheader.style.position = "fixed";
		  theheader.style.paddingTop = "106px";
		} else {
		  therealheader.style.position = "";
		  theheader.style.paddingTop = "";
		}
	  }
	}

	fixHeaderToggle.addEventListener("click", () => {
	  fixedheader = !fixedheader;
	  localStorage.setItem("fixedheader", fixedheader);
	  headerToggleChange();
	});

	headerToggleChange();

	
	
	const palette = [
	  '#FFFFFF', '#525252', '#FFFFFF', '#9C9C9C',
	  '#FF4844', '#C8514F', '#FFADAC', '#00FF00',
	  '#4840FF', '#514FB8', '#ADABFF', '#00FF00',
	  '#B657B7', '#00FF00', '#00FF00', '#00FF00'
	];


	function decodeThumbnail(arrayBuffer) {
	  const data = new Uint8Array(arrayBuffer, 0xA0, 1536);
	  const canvas = document.createElement("canvas");
	  canvas.width = 64;
	  canvas.height = 48;
	  const ctx = canvas.getContext("2d");
	  const imgData = ctx.createImageData(64, 48);
	  let offset = 0;

	  for (let tileY = 0; tileY < 48; tileY += 8) {
		for (let tileX = 0; tileX < 64; tileX += 8) {
		  for (let line = 0; line < 8; line++) {
			for (let pixel = 0; pixel < 8; pixel += 2) {
			  const x = tileX + pixel;
			  const y = tileY + line;
			  const byte = data[offset++];
			  const px1 = byte & 0x0F;
			  const px2 = (byte >> 4) & 0x0F;

			  const setPixel = (ix, val) => {
				const color = palette[val] || "#FF00FF";
				const [r, g, b] = color.match(/\w\w/g).map(hex => parseInt(hex, 16));
				const index = (y * 64 + ix) * 4;
				imgData.data[index] = r;
				imgData.data[index + 1] = g;
				imgData.data[index + 2] = b;
				imgData.data[index + 3] = 255;
			  };

			  setPixel(x, px1);
			  setPixel(x + 1, px2);
			}
		  }
		}
	  }

	  ctx.putImageData(imgData, 0, 0);
	  return canvas.toDataURL();
	}

	function readAuthorId(data, offset) {
	  return [...data.slice(offset, offset + 8)].reverse().map(b => b.toString(16).padStart(2, '0').toUpperCase()).join('');
	}

	const dirmemokey = [
	  0xF7, 0x4C, 0x6A, 0x3A, 0xFB, 0x82, 0xA6, 0x37,
	  0x6E, 0x11, 0x38, 0xCF, 0xA0, 0xDD, 0x85, 0xC0,
	  0xC7, 0x9B, 0xC4, 0xD8, 0xDD, 0x28, 0x8A, 0x87,
	  0x53, 0x20, 0xEE, 0xE0, 0x0B, 0xEB, 0x43, 0xA0,
	  0xDB, 0x55, 0x0F, 0x75, 0x36, 0x37, 0xEB, 0x35,
	  0x6A, 0x34, 0x7F, 0xB5, 0x0F, 0x99, 0xF7, 0xEF,
	  0x43, 0x25, 0xCE, 0xA0, 0x29, 0x46, 0xD9, 0xD4,
	  0x4D, 0xBB, 0x04, 0x66, 0x68, 0x08, 0xF1, 0xF8
	];
	
	
	async function readdirmemo(file) {
	  const arrayBuffer = await file.arrayBuffer();
	  const encrypted = new Uint8Array(arrayBuffer);

	  const decrypted = new Uint8Array(encrypted.length);
	  for (let i = 0; i < encrypted.length; i++) {
		decrypted[i] = encrypted[i] ^ dirmemokey[i % dirmemokey.length];
	  }

	  const decodedText = new TextDecoder("utf-8").decode(decrypted);
	  return decodedText
		.trim()
		.split("\n")
		.map(name => name.trim())
		.filter(name => name.length > 0);
	}




	let globalPpmFilesByFolder = {};
	let usingFolders = false;
	let whotorender = 0;
	let flipnoteNumber = "";

	async function renderFolder(folderName) {
	currentlySelectedFolder = folderName;
	const renderjob = ++whotorender;
	
	  showFrog();
  try {
	  const files = globalPpmFilesByFolder[folderName].filter(file => file.name.toLowerCase().endsWith(".ppm"));
      if (!usefnsort || folderName === "All Flipnotes") {
        files.sort((a, b) => a.name.localeCompare(b.name));
      }
	  
	  const flipnotesList = document.getElementById("flipnotesList");
	  const header = document.getElementById("flipnotesListHeader");
	  flipnotesList.innerHTML = "";
	  header.innerHTML = `
		${folderName !== "no_folder" ? `<h1 class="nomargin">${folderName}</h1>` : ""}
		<p class="nomargin"><b>${files.length}</b> Flipnotes</p>
	  `;

	  const showFlipnoteNumber = usefnsort && folderName !== "All Flipnotes";
	  for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const arrayBuffer = await file.arrayBuffer();
		const data = new Uint8Array(arrayBuffer);

		const authorBytes = data.slice(0x40, 0x40 + 22);
		const rawAuthor = new TextDecoder("utf-16le").decode(authorBytes).replace(/\0/g, "");
		const author = sudofontRemap(rawAuthor);

		const lockFlag = data[0x10] | (data[0x11] << 8);
		const isLocked = lockFlag === 1;
		const playbackstuff = getPlaybackstuff(arrayBuffer);

		const currentAuthorId = readAuthorId(data, 0x10 + 0x4E);
		const parentAuthorId = readAuthorId(data, 0x10 + 0x46);
		const isSpinoff = currentAuthorId !== parentAuthorId;

		const thumbnailDataUrl = decodeThumbnail(arrayBuffer);
		
		let flipnoteNumber = "";
		if (folderName !== "All Flipnotes") {
		  const index = files.indexOf(file);
		  if (index !== -1 && index < 100) {
			flipnoteNumber = `${String(index + 1).padStart(3, "0")}`;
		  }
		}
		
		let thumbnailversion;
		if (whichthumbnail) {
		  const thumbnailDataUrl = decodeThumbnail(arrayBuffer);
		  thumbnailversion = `<img id="thumb" src="${thumbnailDataUrl}">`;
		} else {
		  thumbnailversion = `<flipnote-image src="${URL.createObjectURL(file)}" class="largethumb"></flipnote-image>`;
		}

		const div = document.createElement("div");
		div.className = "flipnote";
		div.innerHTML = `
		<span class="flipnumber">${showFlipnoteNumber ? (i + 1).toString().padStart(3, "0") : ""}</span>
		${thumbnailversion}
		  <div>
			<div><b>Creator:</b> ${author}
			  <span class="icons">
				${isSpinoff ? `<img src="graphics/spinoff.svg" class="spinofficon">` : ""}
				${isLocked ? `<img src="graphics/lock.svg" class="spinofficon">` : ""}
			  </span>
			</div>
			
			<div class="flipdetails">
				<div class="filename"><b>FSID:</b> ${currentAuthorId}</div>
				<div class="filename">${file.name}</div>
			</div>
			
			<div class="altflipdetails" style="display: none;vertical-align:middle;">
				<div class="filename">
					<?xml version="1.0" encoding="UTF-8" standalone="no"?><!-- Created with Inkscape (http://www.inkscape.org/) --><svg width="28.789799mm" height="6.125494mm" viewBox="0 0 28.789798 6.1254941" version="1.1" id="svg1" xml:space="preserve" sodipodi:docname="test.svg" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview id="namedview1" pagecolor="#505050" bordercolor="#ffffff" borderopacity="1" inkscape:showpageshadow="0" inkscape:pageopacity="0" inkscape:pagecheckerboard="1" inkscape:deskcolor="#505050" inkscape:document-units="mm" inkscape:zoom="5.9351837" inkscape:cx="57.706722" inkscape:cy="19.460223" inkscape:window-width="1920" inkscape:window-height="1121" inkscape:window-x="-9" inkscape:window-y="-9" inkscape:window-maximized="1" inkscape:current-layer="svg1" /><defs id="defs1" /><g id="layer1" style="display:inline" transform="matrix(1.1577575,0,0,1.1577575,-130.2987,-204.94108)"><rect style="display:inline;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" id="rect17" width="24.866865" height="5.2908263" x="112.54404" y="177.01555" ry="0" /><rect style="display:inline;opacity:1;fill:#ffffff;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" id="rect18" width="24.167439" height="4.7311234" x="112.89412" y="177.29564" /><path id="num1" style="display:none;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.96034,178.39108 v 0.6268 h 0.2901 v 1.89635 h 0.63109 v -2.52315 h -0.28948 -0.34161 z" /><path id="num2" style="display:inline;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.28325,178.39108 v 0.62619 h 1.87979 v 0.31953 h -1.54186 c -0.005,-1.9e-4 -0.008,-6.2e-4 -0.0135,-6.2e-4 -0.17379,0 -0.31401,0.14023 -0.31401,0.31402 v 0.95062 c 0,0.007 7.4e-4,0.0143 10e-4,0.0215 v 0.29193 h 0.31279 2.17785 v -0.63355 h -1.86445 v -0.31033 h 1.5627 v -6.2e-4 c 0.17061,-0.004 0.30666,-0.14189 0.30666,-0.31339 v -0.95064 c 0,-0.17214 -0.13702,-0.31136 -0.3085,-0.31401 v -6.2e-4 z" /><path id="num3" style="display:none;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 116.47398,178.3917 c -0.004,0 -0.007,5e-4 -0.0107,6.1e-4 h -2.17847 v 0.62435 h 1.8804 v 0.32138 h -1.8804 v 0.63293 h 1.8804 v 0.31155 h -1.8804 v 0.63293 h 2.18889 0.008 c 6.3e-4,0 10e-4,1e-5 0.002,0 0.17002,-0.001 0.30665,-0.13822 0.30665,-0.30849 v -1.90677 c 0,-0.17089 -0.1376,-0.30849 -0.30849,-0.30849 z" /><path id="num4" style="display:none;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.27774,178.3917 v 0.94634 h -10e-4 v 0.63293 h 10e-4 0.62557 1.25359 v 0.94448 h 0.62557 v -2.52375 h -0.62557 v 0.94634 h -1.25359 v -0.94634 z" /><path id="num5" style="display:none;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.2949,178.38986 v 0.29193 c -4.5e-4,0.007 -0.001,0.0144 -0.001,0.0215 v 0.85434 0.0962 0.31463 h 1.86936 v 0.3183 h -1.8798 v 0.62619 h 2.19871 v -6.1e-4 c 0.17148,-0.002 0.3085,-0.14188 0.3085,-0.31401 v -0.95063 c 0,-0.1715 -0.13606,-0.30985 -0.30666,-0.31341 v -6e-4 h -1.5627 v -0.31033 h 1.86445 v -0.63355 h -2.17786 z" /><path id="num6" style="display:none;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.59359,178.3917 c -0.1709,0 -0.3085,0.1376 -0.3085,0.30849 v 1.90677 c 0,0.17029 0.13661,0.30751 0.30666,0.30849 6.1e-4,1e-5 10e-4,0 0.002,0 h 0.008 1.88224 v -6e-4 c 0.17033,-0.004 0.30665,-0.14102 0.30665,-0.31219 v -0.95123 c 0,-0.17117 -0.13631,-0.30888 -0.30665,-0.31217 v -0.001 h -1.57375 v -0.32138 h 1.8804 v -0.62435 h -2.17846 c -0.004,-1.2e-4 -0.007,-6e-4 -0.0107,-6e-4 z m 0.31707,1.57927 h 1.25483 v 0.31155 h -1.25483 z" /><path id="num7" style="display:none;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.28509,178.39231 v 0.62435 h 1.67617 l -0.75805,0.79791 h -0.002 v 1.10088 h 0.62557 v -0.87948 l 0.96781,-1.01931 -0.001,-6.2e-4 v -0.62373 z" /><path id="num8" style="display:none;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 114.59297,178.3917 c -0.1709,0 -0.30849,0.1376 -0.30849,0.30849 v 1.90677 c 0,0.17089 0.13759,0.30849 0.30849,0.30849 h 0.008 c 0.004,0 0.007,-4.9e-4 0.0107,-6e-4 h 1.85096 c 0.004,1e-4 0.007,6e-4 0.0107,6e-4 h 0.008 c 0.17091,0 0.30851,-0.1376 0.30851,-0.30849 v -1.90677 c 0,-0.17089 -0.1376,-0.30849 -0.30851,-0.30849 h -0.008 c -0.004,0 -0.007,5e-4 -0.0107,6.1e-4 h -1.85096 c -0.004,-1.2e-4 -0.007,-6.1e-4 -0.0107,-6.1e-4 z m 0.31709,0.62496 h 1.25482 v 0.32076 h -1.25482 z m 0,0.95369 h 1.25482 v 0.31156 h -1.25482 z" /><path id="numque" style="display:inline;fill:#fbcb79;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 116.47596,178.3911 c -0.004,0 -0.007,4e-4 -0.0109,5.2e-4 h -2.18126 v 0.62529 h 1.87844 v 0.31987 h -1.15652 v 0.63304 h 1.4702 c 0.001,0 0.003,2e-5 0.004,0 0.17178,-0.002 0.30954,-0.14135 0.30954,-0.31368 v -0.95136 c 0,-0.16988 -0.13395,-0.30715 -0.3023,-0.31316 -1.8e-4,-1e-5 -3.5e-4,1e-5 -5.2e-4,0 -0.004,-1.2e-4 -0.007,-5.2e-4 -0.0109,-5.2e-4 z m -1.4702,1.89033 v 0.63303 h 0.77928 v -0.63303 z" /><path id="arrow1" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 208.84834,31.624264 c -0.0591,0.05907 -0.0954,0.140916 -0.0954,0.231444 l 3e-5,0.286083 c 0,0.181054 0.14553,0.326586 0.32658,0.326586 l 1.05067,2.7e-4 2.7e-4,1.05067 c 0,0.181055 0.14554,0.326587 0.32659,0.326587 l 0.28608,2.9e-5 c 0.18106,0 0.32681,-0.145753 0.32681,-0.326808 l 4e-5,-1.35872 c 3.5e-4,-0.0063 5.4e-4,-0.01234 5.4e-4,-0.01868 l -3e-5,-0.286083 c 0,-0.0456 -0.009,-0.08889 -0.026,-0.128247 -0.004,-0.0095 -0.008,-0.01889 -0.0133,-0.02789 -1.5e-4,-2.84e-4 -5.4e-4,-4.14e-4 -7e-4,-6.98e-4 -0.005,-0.009 -0.01,-0.01788 -0.0155,-0.02632 -1.8e-4,-2.75e-4 -5.1e-4,-4.22e-4 -7e-4,-6.98e-4 -0.006,-0.0083 -0.0115,-0.01629 -0.0179,-0.02401 -3.1e-4,-3.78e-4 -7.3e-4,-6.71e-4 -0.001,-0.001 -0.006,-0.0078 -0.013,-0.01527 -0.0201,-0.02244 -2.4e-4,-2.33e-4 -4.7e-4,-4.64e-4 -7e-4,-6.97e-4 -0.007,-0.007 -0.0148,-0.01376 -0.0224,-0.02013 -3.8e-4,-3.12e-4 -6.7e-4,-7.37e-4 -0.001,-10e-4 -0.008,-0.0064 -0.0156,-0.01216 -0.024,-0.01786 -2.6e-4,-1.8e-4 -4.3e-4,-5.19e-4 -6.9e-4,-6.98e-4 -0.0171,-0.01155 -0.0357,-0.02135 -0.0549,-0.02953 -0.0394,-0.01673 -0.0826,-0.02598 -0.12825,-0.02598 l -0.28608,-2.9e-5 c -0.006,0 -0.0124,1.87e-4 -0.0187,5.4e-4 l -1.35872,3.5e-5 c -0.0905,0 -0.17238,0.03629 -0.23145,0.09537 z" transform="matrix(0.67202893,0.7405249,-0.67202893,0.7405249,0,0)" /><path id="arrow2" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 121.20397,178.07595 c -0.0794,0 -0.15878,0.0337 -0.21962,0.10077 l -0.19224,0.21188 c -0.12167,0.13407 -0.12167,0.34961 0,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12168,0.13407 -0.12167,0.34962 0,0.48369 l 0.19224,0.21187 c 0.12167,0.13408 0.31757,0.13408 0.43925,0 l 0.91312,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19224,-0.21187 c 0.0306,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -8e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 6e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 4e-5,-5.1e-4 -4e-5,-0.001 0,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 0,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.8e-4,-0.0211 -0.002,-0.0315 -4e-5,-5.1e-4 5e-5,-0.001 0,-0.002 -9.2e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -6e-5,-3.3e-4 5e-5,-7.1e-4 0,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19223,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91312,-1.00614 c -0.0608,-0.067 -0.14024,-0.10078 -0.21963,-0.10078 z" /><path id="arrow3" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 123.32891,178.07595 c -0.0794,0 -0.15879,0.0337 -0.21963,0.10077 l -0.19223,0.21188 c -0.12168,0.13407 -0.12168,0.34961 -1e-5,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12167,0.13407 -0.12167,0.34962 1e-5,0.48369 l 0.19223,0.21187 c 0.12168,0.13408 0.31758,0.13408 0.43925,0 l 0.91313,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19223,-0.21187 c 0.0307,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -9e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 7e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 5e-5,-5.1e-4 -4e-5,-0.001 1e-5,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 -1e-5,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.9e-4,-0.0211 -0.002,-0.0315 -5e-5,-5.1e-4 4e-5,-0.001 -1e-5,-0.002 -9.1e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -5e-5,-3.3e-4 6e-5,-7.1e-4 1e-5,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19224,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91313,-1.00614 c -0.0608,-0.067 -0.14023,-0.10078 -0.21962,-0.10078 z" /><path id="arrow4" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 125.43317,178.07595 c -0.0794,0 -0.15878,0.0337 -0.21962,0.10077 l -0.19224,0.21188 c -0.12167,0.13407 -0.12167,0.34961 0,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12168,0.13407 -0.12167,0.34962 0,0.48369 l 0.19224,0.21187 c 0.12167,0.13408 0.31757,0.13408 0.43925,0 l 0.91312,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19224,-0.21187 c 0.0306,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -8e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 6e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 4e-5,-5.1e-4 -4e-5,-0.001 0,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 0,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.8e-4,-0.0211 -0.002,-0.0315 -4e-5,-5.1e-4 5e-5,-0.001 0,-0.002 -9.2e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -6e-5,-3.3e-4 5e-5,-7.1e-4 0,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19223,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91312,-1.00614 c -0.0608,-0.067 -0.14024,-0.10078 -0.21963,-0.10078 z" /><path id="arrow5" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 127.55861,178.07595 c -0.0794,0 -0.15879,0.0337 -0.21963,0.10077 l -0.19223,0.21188 c -0.12167,0.13407 -0.12168,0.34961 -1e-5,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12167,0.13407 -0.12166,0.34962 1e-5,0.48369 l 0.19223,0.21187 c 0.12168,0.13408 0.31758,0.13408 0.43925,0 l 0.91313,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19223,-0.21187 c 0.0306,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -9e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 7e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 5e-5,-5.1e-4 -4e-5,-0.001 1e-5,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 0,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.9e-4,-0.0211 -0.002,-0.0315 -5e-5,-5.1e-4 4e-5,-0.001 -1e-5,-0.002 -9.1e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -5e-5,-3.3e-4 6e-5,-7.1e-4 1e-5,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19224,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91312,-1.00614 c -0.0608,-0.067 -0.14024,-0.10078 -0.21963,-0.10078 z" /><path id="arrow6" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 129.66287,178.07595 c -0.0794,0 -0.15878,0.0337 -0.21962,0.10077 l -0.19224,0.21188 c -0.12167,0.13407 -0.12167,0.34961 0,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12168,0.13407 -0.12167,0.34962 0,0.48369 l 0.19224,0.21187 c 0.12167,0.13408 0.31757,0.13408 0.43925,0 l 0.91312,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19224,-0.21187 c 0.0306,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -8e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 6e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 4e-5,-5.1e-4 -4e-5,-0.001 0,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 0,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.8e-4,-0.0211 -0.002,-0.0315 -4e-5,-5.1e-4 5e-5,-0.001 0,-0.002 -9.2e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -6e-5,-3.3e-4 5e-5,-7.1e-4 0,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19223,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91312,-1.00614 c -0.0608,-0.067 -0.14024,-0.10078 -0.21963,-0.10078 z" /><path id="arrow7" style="opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 131.78781,178.07595 c -0.0794,0 -0.15879,0.0337 -0.21963,0.10077 l -0.19223,0.21188 c -0.12168,0.13407 -0.12168,0.34961 -10e-6,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12167,0.13407 -0.12167,0.34962 10e-6,0.48369 l 0.19223,0.21187 c 0.12168,0.13408 0.31758,0.13408 0.43925,0 l 0.91313,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19223,-0.21187 c 0.0307,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -9e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 7e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 5e-5,-5.1e-4 -4e-5,-0.001 10e-6,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 -1e-5,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.9e-4,-0.0211 -0.002,-0.0315 -5e-5,-5.1e-4 4e-5,-0.001 -10e-6,-0.002 -9.1e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -5e-5,-3.3e-4 6e-5,-7.1e-4 1e-5,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19224,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91313,-1.00614 c -0.0608,-0.067 -0.14023,-0.10078 -0.21962,-0.10078 z" /><path id="arrow8" style="display:inline;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 133.89207,178.07595 c -0.0794,0 -0.15878,0.0337 -0.21962,0.10077 l -0.19224,0.21188 c -0.12167,0.13407 -0.12167,0.34961 0,0.48368 l 0.7059,0.77825 -0.7059,0.77825 c -0.12168,0.13407 -0.12167,0.34962 0,0.48369 l 0.19224,0.21187 c 0.12167,0.13408 0.31757,0.13408 0.43925,0 l 0.91312,-1.00613 c 0.004,-0.004 0.009,-0.009 0.0129,-0.0134 l 0.19224,-0.21187 c 0.0306,-0.0338 0.0535,-0.0727 0.0687,-0.11421 0.004,-0.01 0.007,-0.0202 0.01,-0.0305 9e-5,-3.2e-4 -8e-5,-7.1e-4 0,-0.001 0.003,-0.0103 0.005,-0.0206 0.007,-0.031 6e-5,-3.4e-4 -6e-5,-6.9e-4 0,-0.001 0.002,-0.0103 0.003,-0.0206 0.004,-0.031 4e-5,-5.1e-4 -4e-5,-0.001 0,-0.002 9.2e-4,-0.0106 0.002,-0.0209 0.002,-0.0315 0,-3.5e-4 0,-6.9e-4 0,-0.001 0,-0.0104 -6.8e-4,-0.0211 -0.002,-0.0315 -4e-5,-5.1e-4 5e-5,-0.001 0,-0.002 -9.2e-4,-0.0105 -0.002,-0.0206 -0.004,-0.031 -6e-5,-3.3e-4 5e-5,-7.1e-4 0,-0.001 -0.004,-0.0212 -0.01,-0.0422 -0.0171,-0.0625 -0.0152,-0.0415 -0.0381,-0.0804 -0.0687,-0.11421 l -0.19223,-0.21187 c -0.004,-0.005 -0.008,-0.009 -0.0129,-0.0134 l -0.91312,-1.00614 c -0.0608,-0.067 -0.14024,-0.10078 -0.21963,-0.10078 z" /></g></svg>
					<?xml version="1.0" encoding="UTF-8" standalone="no"?><!-- Created with Inkscape (http://www.inkscape.org/) --><svg width="9.1864014mm" height="6.125mm" viewBox="0 0 9.1864014 6.125" version="1.1" id="svg1" xml:space="preserve" inkscape:version="1.3.2 (091e20e, 2023-11-25, custom)" sodipodi:docname="test.svg" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg"><sodipodi:namedview id="namedview1" pagecolor="#505050" bordercolor="#ffffff" borderopacity="1" inkscape:showpageshadow="0" inkscape:pageopacity="0" inkscape:pagecheckerboard="1" inkscape:deskcolor="#505050" inkscape:document-units="mm" inkscape:zoom="11.313709" inkscape:cx="13.258252" inkscape:cy="14.71666" inkscape:window-width="1920" inkscape:window-height="1121" inkscape:window-x="-9" inkscape:window-y="-9" inkscape:window-maximized="1" inkscape:current-layer="layer1" /><defs id="defs1" /><g inkscape:label="Layer 1" inkscape:groupmode="layer" id="layer1" transform="translate(-104.63155,-144.64876)"><rect style="display:inline;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" id="rect17" width="9.1864014" height="6.125" x="104.63155" y="144.64876" ry="0" /><rect style="display:inline;fill:#ffffff;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" id="rect18" width="8.3745823" height="5.4770522" x="105.03683" y="144.97301" /><path id="loopicon" style="display:inline;opacity:1;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 110.05144,145.38373 v 0.86327 h -2.69745 c -0.28031,0 -0.50612,0.2258 -0.50612,0.50612 0,0.005 4.5e-4,0.009 6e-4,0.015 h -6e-4 v 2.56645 h 6e-4 c 0.007,0.26868 0.22544,0.48278 0.49594,0.48278 h 3.81856 c 0.26706,0 0.48284,-0.20875 0.49534,-0.4726 h 6.1e-4 v -0.0108 c 9e-5,-0.004 5.9e-4,-0.008 5.9e-4,-0.0122 0,-0.004 -5e-4,-0.008 -5.9e-4,-0.0121 v -1.91018 l -1.01163,0.83634 v 0.58987 h -2.7872 v -1.565 h 2.19135 v 0.82677 l 1.60509,-1.33467 z" inkscape:label="loop" /><path id="noloopicon" style="display:none;fill:#fbcb79;fill-opacity:1;stroke:#39317c;stroke-width:0;-inkscape-stroke:none;paint-order:markers stroke fill" d="m 109.89262,146.60821 v 0.63881 h -1.34893 v 0.74898 h 1.34893 v 0.61192 l 1.18838,-0.98769 z m -2.36834,0.63881 v 0.74898 h 0.27356 v -0.74898 z m 0.51681,0 v 0.74898 h 0.2808 v -0.74898 z" transform="matrix(1.2101807,0,0,1.2101807,-23.031787,-31.025158)" inkscape:label="noloop" sodipodi:nodetypes="cccccccccccccccccc" /></g></svg>
				</div>
				<div class="filename" style="line-height:0.5;"><b>Size:</b> ${(file.size / 1024).toFixed(1)} KB</div>
			</div>
			
		  </div>
		`;
		if (renderjob !== whotorender) return;
		flipnotesList.appendChild(div);
		

		const frameSpeed = playbackstuff.frameSpeed;
		const validframespeed = frameSpeed >= 1 && frameSpeed <= 8;

		for (let i = 1; i <= 8; i++) {
		  const speednumber = div.querySelector(`#num${i}`);
		  if (speednumber) {
			speednumber.style.display = (validframespeed && i === frameSpeed) ? 'inline' : 'none';
		  }
		}
		const questionmark = div.querySelector('#numque');
		if (questionmark) {
		  questionmark.style.display = validframespeed ? 'none' : 'inline';
		}

		for (let i = 1; i <= 8; i++) {
		  const speedarrows = div.querySelector(`#arrow${i}`);
		  if (speedarrows) {
			if (validframespeed && i <= frameSpeed) {
			  speedarrows.style.fill = '#fb5151';
			} else {
			  speedarrows.style.fill = '#fbcb79';
			}
		  }
		}

		const loopIcon = div.querySelector('#loopicon');
		const noLoopIcon = div.querySelector('#noloopicon');
		if (loopIcon && noLoopIcon) {
		  if (playbackstuff.loops) {
			loopIcon.style.display = 'inline';
			noLoopIcon.style.display = 'none';
		  } else {
			loopIcon.style.display = 'none';
			noLoopIcon.style.display = 'inline';
		  }
		}



		const thumb = div.querySelector('#thumb') || div.querySelector('flipnote-image');
		thumb.onclick = () => openPlayer(file, thumb);
		
	  }
  } finally {
    hideFrog();
  }
}

	function getPlaybackstuff(buffer) {
	  const view = new DataView(buffer);
	  const bufferLength = buffer.byteLength;

	  const animationDataSize = view.getUint32(0x04, true);
	  const frameCount = view.getUint16(0x0C, true) + 1;

	  const animationHeaderOffset = 0x06A0;
	  const animationFlags = view.getUint16(animationHeaderOffset + 6, true);
	  const loops = (animationFlags & 0x2) !== 0;

	  const soundEffectFlagsSize = Math.ceil(frameCount / 4) * 4;
	  const soundHeaderOffset = animationHeaderOffset + animationDataSize + soundEffectFlagsSize;

	  const rawFrameSpeedOffset = soundHeaderOffset + 16;

	  let rawFrameSpeed;
	  if (rawFrameSpeedOffset < bufferLength) {
		rawFrameSpeed = view.getUint8(rawFrameSpeedOffset);
	  } else {
		rawFrameSpeed = 8;
	  }

	  const frameSpeed = 8 - rawFrameSpeed;

	  return { frameSpeed, loops };
	}


	const folderBox = document.getElementById("folderinputbox");
	const folderPicker = document.getElementById("folderPicker");

	folderBox.addEventListener("dragover", e => e.preventDefault());

	folderBox.addEventListener("drop", async (e) => {
	  e.preventDefault();
	  folderBox.style.opacity = "0.5";

	  const items = e.dataTransfer.items;
	  const files = [];

	  for (const item of items) {
		if (item.webkitGetAsEntry) {
		  const entry = item.webkitGetAsEntry();
		  if (entry.isDirectory) {
			const readAll = async (dirEntry) => {
			  const reader = dirEntry.createReader();
			  const entries = await new Promise(resolve => reader.readEntries(resolve));
			  for (const ent of entries) {
				if (ent.isFile) {
				  await new Promise(res => ent.file(f => {
					f.webkitRelativePath = `${dirEntry.fullPath}/${f.name}`.replace(/^\//, '');
					files.push(f);
					res();
				  }));
				} else if (ent.isDirectory) {
				  await readAll(ent);
				}
			  }
			};
			await readAll(entry);
		  }
		}
	  }

	  await handleFolder(files);
	});

	folderBox.addEventListener("click", () => {
	  folderPicker.click();
	});

	folderPicker.addEventListener("change", async (e) => {
	  const files = Array.from(e.target.files);
	  if (files.length > 0) {
		folderBox.style.opacity = "0.5";
	  }
	  await handleFolder(files);
	});


	function isgoodbrowser() {
	  return navigator.userAgent.toLowerCase().includes("firefox");
	}
	
	function cacabrowser() {
	  return navigator.userAgent.toLowerCase().includes("iphone");
	}

	function removesfxvol() {
	  const menutitlec = document.querySelectorAll(".menutitle");
	  const sfxvolc = document.querySelectorAll(".sfxvol");

	  if (cacabrowser()) {
		menutitlec.forEach(el => el.style.display = "none");
		sfxvolc.forEach(el => el.style.display = "none");
	  }
	}
	
	function changeinputtext() {
	  const folderInputBox = document.getElementById("folderinputbox");
	  
	  if (isgoodbrowser()) {
		folderInputBox.textContent = "Click or drag and drop a folder in here!!!";
	  } else {
		folderInputBox.textContent = "Click here to load a folder!!!";
	  }
	}

	changeinputtext();
	removesfxvol();


async function setFnSorting() {
  if (!usefnsort) {
    for (const folder in globalPpmFilesByFolder) {
      globalPpmFilesByFolder[folder].sort((a, b) => a.name.localeCompare(b.name));
    }
    return;
  }

  for (const folder in globalPpmFilesByFolder) {
    if (folder === "All Flipnotes") continue;

    const filesInFolder = globalPpmFilesByFolder[folder];
    const dirmemofile = filesInFolder.find(f => f.name.toLowerCase() === "dirmemo2.lst");

    if (!dirmemofile) {
      filesInFolder.sort((a, b) => a.name.localeCompare(b.name));
      continue;
    }

    try {
      const dirmemofilenames = await readdirmemo(dirmemofile);
      const fileMap = new Map(filesInFolder.map(f => [f.name.toLowerCase(), f]));
      const sorted = dirmemofilenames
        .map(name => fileMap.get(name.toLowerCase()))
        .filter(Boolean);
      const extras = filesInFolder.filter(f => !dirmemofilenames.includes(f.name));
      globalPpmFilesByFolder[folder] = [...sorted, ...extras];
    } catch (err) {
      console.error(`Error reading dirmemo2.lst for folder ${folder}:`, err);
      filesInFolder.sort((a, b) => a.name.localeCompare(b.name));
    }
  }
}

	
async function handleFolder(files) {
  const rootDirName = files[0].webkitRelativePath.split("/")[0];
  globalPpmFilesByFolder = {};
  usingFolders = rootDirName.startsWith("4B4755");

  const filenameMap = {};

  for (const file of files) {
    const lower = file.name.toLowerCase();
    if (!lower.endsWith(".ppm") && !lower.endsWith(".lst")) continue;

    const pathParts = file.webkitRelativePath.split("/");
    const folder = usingFolders ? pathParts[1] : "no_folder";

    if (!globalPpmFilesByFolder[folder]) globalPpmFilesByFolder[folder] = [];
    globalPpmFilesByFolder[folder].push(file);

    if (lower.endsWith(".ppm")) {
      if (!filenameMap[lower]) filenameMap[lower] = [];
      filenameMap[lower].push({ file, folder });
    }
  }

  await setFnSorting();


document.getElementById("flipnotesList").classList.add("flipnotesList");

const toggleContainer = document.getElementById("dupbutton");
const dupDiv = document.getElementById("duplicateNotice");
toggleContainer.innerHTML = "";
dupDiv.innerHTML = "";

const duplicates = Object.entries(filenameMap).filter(([_, entries]) => entries.length > 1);
if (duplicates.length > 0) {
  const toggleButton = document.createElement("div");
  toggleButton.textContent = "You've got Duplicates! ▼";
  toggleButton.className = "dupbutton";

  const content = document.createElement("div");
  content.style.display = "none";

	toggleButton.onclick = () => {
	  const isHidden = content.style.display === "none";
	  content.style.display = isHidden ? "block" : "none";
	  content.className = "duplist";
	  toggleButton.textContent = isHidden
		? "You've got Duplicates! ▲"
		: "You've got Duplicates! ▼";

	  const snd = isHidden ? dupListOpenSound : dupListCloseSound;
	  snd.volume = sfxVolume;
	  snd.currentTime = 0;
	  snd.play();
	};


  for (const [filename, entries] of duplicates) {
    const groupDiv = document.createElement("div");

    for (const { file, folder } of entries) {
      const arrayBuffer = await file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      const authorBytes = data.slice(0x40, 0x40 + 22);
      const author = new TextDecoder("utf-16le").decode(authorBytes).replace(/\0/g, "");

      const lockFlag = data[0x10] | (data[0x11] << 8);
      const isLocked = lockFlag === 1;

      const currentAuthorId = readAuthorId(data, 0x10 + 0x4E);
      const parentAuthorId = readAuthorId(data, 0x10 + 0x46);
      const isSpinoff = currentAuthorId !== parentAuthorId;

      const thumbnailDataUrl = decodeThumbnail(arrayBuffer);

	  let thumbnailversion;
	  if (whichthumbnail) {
		const thumbnailDataUrl = decodeThumbnail(arrayBuffer);
	    thumbnailversion = `<img id="thumb" src="${thumbnailDataUrl}">`;
	  } else {
		thumbnailversion = `<flipnote-image src="${URL.createObjectURL(file)}" class="largethumb"></flipnote-image>`;
	  }

        const card = document.createElement("div");
        card.className = "flipnote dupFlex";
		groupDiv.className = "dupflips";
        card.innerHTML = `
        ${thumbnailversion}
          <div class="">
            <div><b>Creator:</b> ${author}
              <span class="icons">
                ${isSpinoff ? `<img src="graphics/spinoff.svg" class="spinofficon">` : ""}
                ${isLocked ? `<img src="graphics/lock.svg" class="spinofficon">` : ""}
              </span>
            </div>
            <div><b>Inside:</b> ${folder}</div>
            <div class="filename"> ${file.name}</div>
          </div>
        `;
      groupDiv.appendChild(card);
    }

    content.appendChild(groupDiv);
  }

  toggleContainer.appendChild(toggleButton);
  dupDiv.appendChild(content);
}


async function renderAllFlipnotes() {
  showFrog();
  try {
    const filesOnly = Object.entries(globalPpmFilesByFolder)
      .filter(([folderName]) => folderName !== "All Flipnotes")
      .map(([_, files]) => files)
      .flat();

    globalPpmFilesByFolder["All Flipnotes"] = filesOnly;
    await renderFolder("All Flipnotes").then(() => {
	watchflipnotes();
	});

    const header = document.getElementById("flipnotesListHeader");
    header.innerHTML = `
      <h1 class="nomargin">All Flipnotes</h1>
      <p class="nomargin"><b>${filesOnly.length}</b> Flipnotes</p>
    `;
  } finally {
    hideFrog();
  }
}


const folderNames = Object.keys(globalPpmFilesByFolder).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

if (usingFolders) {
  document.getElementById("headbuttons").className = "headbuttonvisible";
  document.getElementById("folderCount").textContent = `(${folderNames.length} folders)`;

  const selectDiv = document.getElementById("folderSelect");
  const optionsDiv = document.getElementById("folderList");

  let currentFolder = folderNames[0] || "Select a folder";
  let dropdownOpen = false;

  const updateSelectText = () => {
    selectDiv.innerHTML = `${truncateFolderName(currentFolder, 7)} ${dropdownOpen ? "▲" : "▼"}`;
  };

  updateSelectText();
  optionsDiv.className = "folderstufflist";
  optionsDiv.innerHTML = "";

  folderNames.forEach(folder => {
    const opt = document.createElement("div");
    opt.textContent = truncateFolderName(folder, 10);
    opt.onclick = () => {
      currentFolder = folder;
      dropdownOpen = false;
      optionsDiv.style.display = "none";
      updateSelectText();
      renderFolder(folder).then(() => {
	  watchflipnotes();
	  });
    };
    optionsDiv.appendChild(opt);
  });
  
  const allOpt = document.createElement("div");
	allOpt.textContent = "View All";
	allOpt.style.fontWeight = "bold";
	allOpt.onclick = async () => {
	  currentFolder = "All";
	  dropdownOpen = false;
	  optionsDiv.style.display = "none";
	  updateSelectText();
	  await renderAllFlipnotes();
	};
	optionsDiv.appendChild(allOpt);
	
	selectDiv.onclick = () => {
	  dropdownOpen = !dropdownOpen;
	  optionsDiv.style.display = dropdownOpen ? "block" : "none";
	  updateSelectText();

	  const snd = dropdownOpen ? folderListOpenSound : folderListCloseSound;
	  snd.volume = sfxVolume;
	  snd.currentTime = 0;
	  snd.play();
	};

	document.addEventListener("click", function (e) {
	  if (!document.getElementById("folderSelectWrapper").contains(e.target)) {
		if (dropdownOpen) {
		  folderListCloseSound.volume = sfxVolume;
		  folderListCloseSound.currentTime = 0;
		  folderListCloseSound.play();
		}
		dropdownOpen = false;
		optionsDiv.style.display = "none";
		updateSelectText();
	  }
	});


  await renderFolder(currentFolder).then(() => {
  watchflipnotes();
  });
} else {
  document.getElementById("headbuttons").classList.remove("headbuttonvisible");
  await renderFolder("no_folder").then(() => {
  watchflipnotes();
  });
}

function truncateFolderName(name, maxLength) {
  if (name.length > maxLength) {
    return name.slice(0, maxLength) + "...";
  }
  return name;
}


}


	let frogclicked = 0;
	let viewdevsettings = localStorage.getItem("viewdevsettings") === "true";

	const loadingFrog = document.getElementById("loadingfrog");
	const potentialsettings = document.getElementById("potentialsettings");

	function showdevsettings() {
	  if (potentialsettings) {
		potentialsettings.style.display = viewdevsettings ? "unset" : "none";
	  }
	}

	loadingFrog.addEventListener("click", () => {
	  frogclicked++;
	  if (frogclicked >= 10) {
		frogclicked = 0;
		frogcroak.currentTime = 0;
		frogcroak.play();
		viewdevsettings = !viewdevsettings;
		localStorage.setItem("viewdevsettings", viewdevsettings);
		showdevsettings();
	  }
	});

	showdevsettings();
