	fetch("sampleflipnotes/demofilestructure.json")
	  .then(res => res.json())
	  .then(data => handleFolderFromJson(data));


	async function handleFolderFromJson(jsonData) {
	  globalPpmFilesByFolder = {};
	  const filenameMap = {};

	  const rootDir = Object.keys(jsonData)[0];
	  const folderMap = jsonData[rootDir];

	  usingFolders = rootDir.startsWith("4B47554");

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


	  console.log("PPM files loaded from JSON:", globalPpmFilesByFolder);
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