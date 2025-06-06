// A lot of this is hacked together just so it barely works enough lol


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
	
	removesfxvol()

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

	fetch("sampleflipnotes/demofilestructure.json")
	  .then(res => res.json())
	  .then(data => handleFolderFromJson(data));


async function handleFolderFromJson(jsonData) {
  const holdtheload = setTimeout(() => {
    document.getElementById("loadingfrog").style.display = "block";
  }, 500);

  globalPpmFilesByFolder = {};
  const filenameMap = {};

  const rootDir = Object.keys(jsonData)[0];
  const folderMap = jsonData[rootDir];

  usingFolders = rootDir.startsWith("4B4755");

  try {
    for (const folderName in folderMap) {
      const ppmPaths = folderMap[folderName];
      globalPpmFilesByFolder[folderName] = [];

      for (const path of ppmPaths) {
        try {
          const response = await fetch(path);
          if (!response.ok) throw new Error(`Failed to fetch ${path}`);

          const blob = await response.blob();
          const filename = path.split("/").pop();
          const file = new File([blob], filename, {
            type: blob.type,
            lastModified: Date.now()
          });

          globalPpmFilesByFolder[folderName].push(file);

          const nameKey = filename.toLowerCase();
          if (!filenameMap[nameKey]) filenameMap[nameKey] = [];
          filenameMap[nameKey].push({ file, folder: folderName });

        } catch (err) {
          console.error(`Error loading file ${path}:`, err);
        }
      }
    }
  } finally {
    clearTimeout(holdtheload);
    document.getElementById("loadingfrog").style.display = "none";
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