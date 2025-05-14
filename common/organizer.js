	// what a trainwreck
	// dont let me code again lmao
	
	
	const palette = [
	  '#FFFFFF', '#525252', '#FFFFFF', '#9C9C9C',
	  '#FF4844', '#C8514F', '#FFADAC', '#00FF00',
	  '#4840FF', '#514FB8', '#ADABFF', '#00FF00',
	  '#B657B7', '#00FF00', '#00FF00', '#00FF00'
	];
	
	const clickDownSound = new Audio("sound/SE_SY_BUTTON_IN.wav");
	const playSound = new Audio("sound/SE_SY_MOVIE_PLAY.wav");
	const pauseSound = new Audio("sound/SE_SY_MOVIE_STOP.wav");
	const folderListOpenSound = new Audio("sound/SE_SY_POPUP.wav");
	const folderListCloseSound = new Audio("sound/SE_SY_POPUP_SELECT.wav");
	const dupListOpenSound = new Audio("sound/SE_SY_PHOTO_CAPTURE.wav");
	const dupListCloseSound = new Audio("sound/SE_SY_PHOTO_CANCEL.wav");


	const releaseSounds = {
	  thumb: new Audio("sound/SE_SY_CURSOR_MOVE.wav"),
	  returnTop: new Audio("sound/SE_SY_FRAME_RETURN_TOP.wav"),
	  closePlayer: new Audio("sound/SE_SY_DRAW_TOOL_BTN_OFF.wav"),
	  folderstufflist: new Audio("sound/SE_SY_POPUP_SELECT.wav")
	};
	
	document.addEventListener("DOMContentLoaded", () => {
	  document.addEventListener("mousedown", (e) => {
		if (e.target.closest("#thumb, #folderSelect, #returnTop, #closePlayer, .folderstufflist, .dupbutton, .playstateicon")) {
		  clickDownSound.currentTime = 0;
		  clickDownSound.play();
		}
	  });

	  document.addEventListener("mouseup", (e) => {
		const el = e.target.closest("[id], [class]");

		if (!el) return;

		if (el.id && releaseSounds[el.id]) {
		  const snd = releaseSounds[el.id];
		  snd.currentTime = 0;
		  snd.play();
		  return;
		}

		for (const cls of el.classList) {
		  if (releaseSounds[cls]) {
			const snd = releaseSounds[cls];
			snd.currentTime = 0;
			snd.play();
			break;
		  }
		}
	  });
	});



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

	
	closePlayerButton.addEventListener('click', () => {
		player.style.display = 'none';
		player.src = '';
		
		  if (activeThumb) {
			activeThumb.classList.remove('playeractive');
			activeThumb = null;
		  }
		  
		  if (playPauseIcon) {
			playPauseIcon.remove();
			playPauseIcon = null;
		  }
	});

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
	  player.src = '';
	  if (activeThumb) {
		activeThumb.classList.remove('playeractive');
		activeThumb = null;
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
			playSound.currentTime = 0;
			playSound.play();
		  } else {
			player.pause();
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



	let globalPpmFilesByFolder = {};
	let usingFolders = false;

	async function renderFolder(folderName) {
	  showFrog();
  try {
	
	  const files = globalPpmFilesByFolder[folderName];
	  const flipnotesList = document.getElementById("flipnotesList");
	  const header = document.getElementById("flipnotesListHeader");
	  flipnotesList.innerHTML = "";
	  header.innerHTML = `
		${folderName !== "no_folder" ? `<h1 class="nomargin">${folderName}</h1>` : ""}
		<p class="nomargin"><b>${files.length}</b> Flipnotes</p>
	  `;

	  for (const file of files) {
		const arrayBuffer = await file.arrayBuffer();
		const data = new Uint8Array(arrayBuffer);

		const authorBytes = data.slice(0x40, 0x40 + 22);
		const rawAuthor = new TextDecoder("utf-16le").decode(authorBytes).replace(/\0/g, "");
		const author = sudofontRemap(rawAuthor);

		const lockFlag = data[0x10] | (data[0x11] << 8);
		const isLocked = lockFlag === 1;

		const currentAuthorId = readAuthorId(data, 0x10 + 0x4E);
		const parentAuthorId = readAuthorId(data, 0x10 + 0x46);
		const isSpinoff = currentAuthorId !== parentAuthorId;

		const thumbnailDataUrl = decodeThumbnail(arrayBuffer);

		const div = document.createElement("div");
		div.className = "flipnote";
		div.innerHTML = `
		  <img id="thumb" src="${thumbnailDataUrl}">
		  <div>
			<div><b>Creator:</b> ${author}
			  <span class="icons">
				${isSpinoff ? `<img src="graphics/spinoff.svg" class="spinofficon">` : ""}
				${isLocked ? `<img src="graphics/lock.svg" class="spinofficon">` : ""}
			  </span>
			</div>
			<div class="filename"><b>FSID:</b> ${currentAuthorId}</div>
			<div class="filename">${file.name}</div>
		  </div>
		`;
		flipnotesList.appendChild(div);

		const thumb = div.querySelector('#thumb');
		thumb.onclick = () => openPlayer(file, thumb);
		
	  }
  } finally {
    hideFrog();
  }
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
		folderBox.style.opacity = "0.6";
	  }
	  await handleFolder(files);
	});

	
async function handleFolder(files) {
  const rootDirName = files[0].webkitRelativePath.split("/")[0];
  globalPpmFilesByFolder = {};
  files.sort((a, b) => a.name.localeCompare(b.name));
  usingFolders = rootDirName.startsWith("4B47554");

  const filenameMap = {};

  for (const file of files) {
    if (!file.name.toLowerCase().endsWith(".ppm")) continue;
    const pathParts = file.webkitRelativePath.split("/");
    const folder = usingFolders ? pathParts[1] : "no_folder";

    if (!globalPpmFilesByFolder[folder]) globalPpmFilesByFolder[folder] = [];
    globalPpmFilesByFolder[folder].push(file);

    const nameKey = file.name.toLowerCase();
    if (!filenameMap[nameKey]) filenameMap[nameKey] = [];
    filenameMap[nameKey].push({ file, folder });
  }

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

        const card = document.createElement("div");
        card.className = "flipnote dupFlex";
		groupDiv.className = "dupflips";
        card.innerHTML = `
          <img id="thumb" src="${thumbnailDataUrl}">
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
    await renderFolder("All Flipnotes");

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
      renderFolder(folder);
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
	  snd.currentTime = 0;
	  snd.play();
	};

	document.addEventListener("click", function (e) {
	  if (!document.getElementById("folderSelectWrapper").contains(e.target)) {
		if (dropdownOpen) {
		  folderListCloseSound.currentTime = 0;
		  folderListCloseSound.play();
		}
		dropdownOpen = false;
		optionsDiv.style.display = "none";
		updateSelectText();
	  }
	});


  await renderFolder(currentFolder);
} else {
  document.getElementById("headbuttons").style.display = "none";
  await renderFolder("no_folder");
}

function truncateFolderName(name, maxLength) {
  if (name.length > maxLength) {
    return name.slice(0, maxLength) + "...";
  }
  return name;
}


}