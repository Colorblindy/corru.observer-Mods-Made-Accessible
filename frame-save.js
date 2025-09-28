// ::/FRAME/SAVE/ v1.0
// https://files.catsoften.net/framesave.js

env.dialogues["frame_save_resp"] = generateDialogueObject(`
RESPOBJ::
	RESPONSES::self
		about this<+>about
		save<+>END
			FAKEEND::(save file)
			EXEC::downloadFrameSave()
		load<+>load
			FAKEEND::(load file)
		nevermind<+>END
`.replaceAll("\t", "    "));

env.dialogues["frame_save_about_resp"] = generateDialogueObject(`
RESPOBJ::
	RESPONSES::self
		where did you...<+>where
		yo dawg<+>yodawg
		nevermind<+>loop
			FAKEEND::(back)
`.replaceAll("\t", "    "));

env.dialogues["frame_save"] = generateDialogueObject(`
loop
	RESPOBJ::frame_save_resp

aboutloop
	RESPOBJ::frame_save_about_resp

start
	sys
		USER REQUEST::'select operation'

____SHOWIF::["TEMP!!frame_save_seen", false]
	moth
		oh you found that?
		i don't want to hold you up, but keep in mind the save feature is experimental
		don't yell at me if you end up starting over is what i'm saying lol

____SHOWIF::[["TEMP!!frame_save_seen", false], ["TEMP!!frame_save_other_mods"], ["TEMP!!frame_save_other_mods_seen", false]]
	moth
		also it looks like you have some other modifications loaded on your mindspike
		i can't guarantee those will work with the save feature, but i'll assume you know what you're doing
			EXEC::change("TEMP!!frame_save_other_mods_seen", true);
____END

____SHOWIF::[["TEMP!!frame_save_seen"], ["TEMP!!frame_save_other_mods"], ["TEMP!!frame_save_other_mods_seen", false]]
	moth
		it looks like you've added some other modifications on your mindspike
		i can't guarantee those will work with the save feature, but i'll assume you know what you're doing
		that's all, i'll let you get back to work
			EXEC::change("TEMP!!frame_save_other_mods_seen", true);
____END

____SHOWIF::["TEMP!!frame_save_seen", false]
	moth
		that's all, i'll let you get back to work
			EXEC::change("TEMP!!frame_save_seen", true);
____END

	RESPOBJ::frame_save_resp

load
	sys
		WARNING::'loading save will overwrite current state'
		ADVISE::'export current state if valued'

	RESPONSES::self
		continue<+>END
			FAKEEND::(overwrite)
			EXEC::showFrameSaveFileMenu(true)
		cancel<+>END
			FAKEEND::(keep)

about
	self
		tell me more about this

	moth
		well, when i got the framing device from my friend i noticed it didn't have a good way of saving progress
		"hardcore mode" or something idk, but annoying for our purposes
		so i found a patch from <span definition=\"NOTE::'@catsoften on Discord'\">someone else</span> that added that functionality
		it wasn't to much of a problem in the embassy, but here it seems to have come in helpful

____SHOWIF::"PAGE!!dream"
		probably shouldn't tell jelly of whatever we're messing with her dream though lol
____END

____SHOWIF::["PAGE!!dream", false]
		probably shouldn't tell cstrd or whatever we're messing with it's evil mode though lol
____END

		but the save feature should let you keep your party, items, etc. if you need to take a break

	RESPONSES::self
		neat<+>aboutloop
			FAKEEND::(back)

where
	self
		where did you find this?

	moth
		uh
		not important
		anything else?

	RESPONSES::self
		concerning<+>aboutloop
			FAKEEND::(back)

yodawg
	self
		yo dawg i heard you like framing devices so i put a framing device inside your framing device

	moth
		uhh... yeah
		like that...
		i guess?
		idk i didn't make it lol

	RESPONSES::self
		cool<+>aboutloop
			FAKEEND::(back)
`.replaceAll("\t", "    "));

function initFrameSaveMod()
{
	if (document.getElementById("meta-sav") || page.name !== "frame")
	{
		return;
	}

	document.head.insertAdjacentHTML("beforeend", `
		<style>
			#meta-sav i
			{
				font-size: 0.7em;
				padding: 0.25em;
			}
			#mui-links #meta-sav:after { content: "SAV"; }
			body.mui-prohibited #meta-sav { display: none !important; }
			.ci-sav:before { content: "::/"; }
			#mui-links a:nth-child(${document.getElementById("mui-links").children.length + 1})
			{
				transition-delay: 1s;
				color: var(--bastard-color);
			}

			#frameSaveFileMenu
			{
				position: absolute;
				left: 50%;
				top: 50%;
				transform: translateX(-50%) translateY(-50%);
				padding: 10px;
				border: 2px solid var(--neutral-color);
				background-image: url("/img/textures/chromeb.gif");
				z-index: 1;
			}
			#frameSaveFileMenu > div
			{
				padding: 5px;
				background-color: black;
			}
			#frameSaveFileMenu > div > span { padding: 10px; }
			#frameSaveFileMenu > div > div
			{
				flex-wrap: nowrap;
				padding-top: 10px;
			}
			#frameSaveFileMenu > div > div > span.import { margin-left: 5px; }
			#frameSaveFileInput
			{
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 0;
				cursor: pointer;
			}
		</style>
	`);

	document.getElementById("mui-links").insertAdjacentHTML("beforeend", `
		<a id="meta-sav" definition="NOTE::'::/FRAME/ save management'">
			<i class="ci-sav"></i>
		</a>
	`);

	window.addEventListener("mousedown", (e)=>{
		if(!document.documentElement.classList.contains("cutscene") && !body.classList.contains("in-menu") && e.target.id == "meta-sav")
		{
			change("TEMP!!frame_save_other_mods", check("modList").split("\n").length > 1)
			startDialogue("frame_save");
		}
	});

	document.addEventListener("stage_change", (e)=>{
		document.getElementById("meta-sav").style.display = e.detail.stage === "vessel" ? "" : "none";
	});
	document.getElementById("meta-sav").style.display = env.stage.name === "vessel" ? "" : "none";

	document.body.insertAdjacentHTML("beforeend", `
		<div id="frameSaveFileMenu">
			<div>
				<span>Select a ::/FRAME/SAVE/ file</span>
				<div class="buttons">
					<span class="button" onclick="showFrameSaveFileMenu(false); MUI('deprohibit');">Cancel</span>
					<span class="button import primary">
						<input type="file" id="frameSaveFileInput" onchange="uploadFrameSave(event)" accept=".frame">
						Import File
					</span>
				</div>
			</div>
		</div>
	`);

	showFrameSaveFileMenu(false);
}

function showFrameSaveFileMenu(show)
{
	if (show)
	{
		MUI("prohibit");
	}
	document.getElementById("frameSaveFileMenu").style.display = show ? "" : "none";
}

function downloadFrameSave() // stolen :P
{
	const fullEncode = LZString.compressToBase64(JSON.stringify(getFrameData()));

	let saveEncode = "FRAMING DEVICE BINARY - DO NOT ALTER::";
	saveEncode += fullEncode;
	saveEncode += "::END FRAMING DEVICE BINARY";

	const blobURL = URL.createObjectURL(new Blob([saveEncode], { type: "text/plain" }));
	download(blobURL, "save.frame");
	setTimeout(()=>{ URL.revokeObjectURL(blobURL); }, 20);

	readoutAdd({message: `NOTE::'data exported as file'`, name:"sys"});
}

function uploadFrameSave(e) // stolen :P
{
	if (e.target.files.length)
	{
		showFrameSaveFileMenu(false);

		play("muiScanner", 1.5);
		const file = e.target.files[0];

		const reader = new FileReader();
		reader.onload = (e)=>{
			document.getElementById("frameSaveFileInput").value = "";
			mountFrameSave(e.target.result);
		};

		reader.readAsText(file);
	}
}

function mountFrameSave(savestring) // stolen :P
{
	if(!savestring)
	{
		readoutAdd({message: `ERROR::'data unspecified';'insert data into input slot'`, name:"sys"});
		return;
	}

	try
	{
		let saveVersion = savestring.split("::")[0];
		let saveData = savestring.split("::")[1];
		var decodedSave;

		if (saveVersion === "FRAMING DEVICE BINARY - DO NOT ALTER")
		{
			decodedSave = LZString.decompressFromBase64(saveData);
			if (decodedSave)
			{
				flash(true); cutscene(true); MUI("off");

				setTimeout(()=>{
					readoutAdd({message: `ALERT::OVERWRITING ENVIRONMENT STATE::...'`, name:"sys"});
					try
					{
						setFrameData(JSON.parse(decodedSave));
						setTimeout(()=>{
							readoutAdd({message: `NOTICE::'environment state loaded'`, name:"sys"});
							flash(false); cutscene(false); MUI("deprohibit");
						}, 1000);
					}
					catch
					{
						setTimeout(()=>{
							readoutAdd({message: `NOTICE::'error loading state';'contact <span definition=\"NOTE::'@catsoften on Discord'\">::/FRAME/SAVE/ author</span>'`, name:"sys"});
							flash(false); cutscene(false); MUI("deprohibit");
						}, 500);
					}
				}, 500);
			}
			else
			{
				readoutAdd({message: `ERROR::'data file corrupt';'contact <span definition=\"NOTE::'@catsoften on Discord'\">::/FRAME/SAVE/ author</span>'`, name:"sys"});
			}
		}
		else
		{
			throw "Incorrect saveVersion: " + saveVersion;
		}
	}
	catch(e)
	{
		readoutAdd({message: `ERROR::'data format invalid';'unable to process'`, name:"sys"});
		console.log(e);
	}
}

function getFrameMap()
{
	if(!env.e3a2.map)
	{
		content.insertAdjacentHTML("beforeend", "<critta-map></critta-map>");
		env.e3a2.map = content.querySelector("critta-map");
	}
	return env.e3a2.map;
}

function getFrameData()
{
	let map = getFrameMap();
	let ship = map.querySelector("critta-ship");
	return {
		"components": (()=>{
			let ret = {};
			for (const key in page.flags.components)
			{
				ret[key] = page.flags.components[key];
			}
			return ret;
		})(),
		"firmamentHealth": check("e3a2bosshp"),
		"inventory": (()=>{
			let ret = {};
			for (const i of page.party.inventory)
			{
				ret[i[0].slug] = i[1];
			}
			return ret;
		})(),
		"map": {
			"attr_rowsetting": map.getAttribute("rowsetting"),
			"baseFishChance": map.baseFishChance,
			"currentComponentIndex": map.currentComponentIndex,
			"currentRowSetting": map.currentRowSetting,
			"depth": map.depth,
			"globalModifiers": map.globalModifiers,
			"loops": map.loops,
			"playerShip": {
				"canMove": ship.canMove,
				"prop_x": ship.style.getPropertyValue("--x") || "50vmin",
				"prop_y": ship.style.getPropertyValue("--y") || "92vmin",
			},
			"possibleZoneComponents": map.possibleZoneComponents,
			"rows": (()=>{
				let ret = [];
				for (const row of map.querySelectorAll(".critta-row"))
				{
					ret.push({
						"nodes": (()=>{
							let ret = [];
							for (const node of row.children)
							{
								ret.push({
									"completed": node.completed || false,
									"component": node.component.slug,
									"difficulty": node.difficulty,
									"formation": node.formation,
									"id": node.id,
									"modifier": node.getAttribute("modifier") || false,
									"rewards": (()=>{
										let ret = [];
										for (const reward of node.rewards)
										{
											ret.push(reward.slug);
										}
										return ret;
									})(),
									"side": node.side,
									"sideLock": node.sideLock,
								});
							}
							return ret;
						})(),
					});
				}
				return ret;
			})(),
			"tension": map.tension,
			"weights": map.weights,
		},
		"party": (()=>{
			let ret = [];
			for (const member of page.party)
			{
				ret.push(member);
			}
			return ret;
		})(),
	};
}

function setFrameData(data)
{
	page.flags.components = {};
	for (const key in data.components)
	{
		page.flags.components[key] = data.components[key];
	}

	change("e3a2bosshp", data.firmamentHealth);

	page.party.inventory = [];
	for (const key in data.inventory)
	{
		addItem(key, data.inventory[key]);
	}

	let map = getFrameMap();
	let ship = map.querySelector("critta-ship");
	map.setAttribute("rowsetting", data.map.attr_rowsetting);
	map.baseFishChance = data.map.baseFishChance;
	map.currentComponentIndex = data.map.currentComponentIndex;
	map.currentRowSetting = data.map.currentRowSetting;
	// depth after rows
	map.globalModifiers = data.map.globalModifiers;
	for (modifier in map.globalModifiers)
	{
		if(map.globalModifiers[modifier])
		{
			let mod = env.MODIFIERS[modifier];
			let outerHTML = `
				<li
					mod="${modifier}"
					qty="${map.globalModifiers[modifier]}"
					style="--icon: url(${mod.icon});--priority: ${mod.priority};"
					definition="REVISION::${mod.name.toUpperCase()}\n${mod.getHelp(true).replace(/<\/?[^>]+(>|$)/g, "")}"
				></li>
			`;
			let el = map.globalList.querySelector(`li[mod=${modifier}]`);
			if(el)
			{
				el.outerHTML = outerHTML;
			}
			else
			{
				map.globalList.insertAdjacentHTML('beforeend', outerHTML);
			}
		}
		else
		{
			map.globalList.querySelectorAll(`li[mod=${modifier}]`).forEach((el)=>{ el.remove() });
		}
	}
	map.loops = data.map.loops;
	ship.canMove = data.map.playerShip.canMove;
	ship.style.setProperty("--x", data.map.playerShip.prop_x);
	ship.style.setProperty("--y", data.map.playerShip.prop_y);
	map.possibleZoneComponents = data.map.possibleZoneComponents;
	// rows after tension
	map.adjustTension("=", data.map.tension);
	for (row of document.querySelectorAll(".critta-row"))
	{
		row.remove();
	}
	let i = 0;
	for (row of data.map.rows)
	{
		map.map.insertAdjacentHTML("beforeend", `
			<section
				class="critta-row"
				style="--count: ${row.nodes.length};"
				depth="${i++}"
			></section>
		`);
		let rowElem = map.map.lastElementChild;
		for (node of row.nodes)
		{
			rowElem.insertAdjacentHTML("beforeend", `
				<critta-node
					id="${node.id}"
					difficulty="${node.difficulty}"
					component="${node.component}"
					${node.sideLock ? "sidelock='true'": ""}
				></critta-node>
			`);
			let nodeElem = rowElem.lastElementChild;
			nodeElem.setThisAndAttribute("completed", node.completed);
			nodeElem.formation = node.formation;
			if (node.modifier)
			{
				nodeElem.modifier = env.MODIFIERS[node.modifier];
				nodeElem.setAttribute("modifier", node.modifier);
			}
			nodeElem.rewards = [];
			nodeElem.firstElementChild.innerHTML = parseHTML("");
			for (reward of node.rewards)
			{
				nodeElem.rewards.push(CrittaReward.REWARDTYPES[reward]);
				nodeElem.firstElementChild.insertAdjacentHTML("beforeend", `
					<li
						class="reward"
						type="${reward}"
						definition="ANALYSIS::'${CrittaReward.REWARDTYPES[reward].name.toLowerCase()}';${CrittaReward.REWARDTYPES[reward].description}"
					></li>
				`);
			}
			nodeElem.setThisAndAttribute("side", node.side);
		}
	}
	map.rows = [... map.querySelectorAll('.critta-row')];
	map.adjustDepth(data.map.depth);
	map.weights = data.map.weights;

	while (page.party.length)
	{
		page.party.pop();
	}
	for (let i = 0; i < data.party.length; i++)
	{
		page.party.push(data.party[i]);
	}

	env.e3a2.mTotals = CrittaMenu.getTotals();
	env.e3a2.updateTubes();
	env.e3a2.updateExchangeScreen();
}

document.addEventListener('corru_entered', initFrameSaveMod);
initFrameSaveMod();