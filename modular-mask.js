// Prepare all masks
delete env.masks.reality;
env.masks.unity.modular = true;
env.masks.hunger.modular = true;
env.masks.joy.modular = true;
env.masks.freedom.definition = "'enables free movement in spatial thoughtforms';'hold SHIFT for slower movement'";

// Apply modular masks (idk why it doesn't work in corru.js)
for(const name in env.masks) {
    const maskObj = env.masks[name]
    if(maskObj.modular && check(`mask-${name}`)) {
        mask({ name, retrigger: true, playSound: false, toggle: true })
    }
    
    // if the mask is modular and equipped as non-modular, change mask to reality
    if (maskObj.modular && check("mask", name)) {
        change("mask", "reality");
    }
}

// Update stuff that checks for "mask" flag

// globalents.js
document.addEventListener("corru_resources_added", (e) => {
    env.entities["fairy"].actions[2].showIf = () => (page.path == "/local/ozo/") && check("mask-unity");
    env.entities["fairy"].actions[4].showIf = () => (page.path != "/local/ozo/") && check("mask-unity");
    env.entities["rotwatcher"].actions[9].showIf = () => check("mask-unity");
    env.entities["Ã—Ã¨.Ã·Ã¹ÃÃÃ¸Ã¸"].actions[1].showIf = () => env.stage.name == "abyss" && check("mask-unity");
    env.entities["s w   al kk"].actions[0].showIf = () => !check("mask-joy");
    env.entities["s w   al kk"].actions[1].showIf = () => check("mask-unity") && !check("mask-joy");
    env.entities["s w   al kk"].actions[2].showIf = () => check("mask-joy");
    env.entities["s w   al kk"].actions.push({
        name: "unity",
        class: "act-ozo",
        showIf: () => check("mask-unity") && check("mask-joy"),
        exec: ()=>{

            chatter({actor: 's w   al kk', text: 'car fix   go plac ess', readout: true, delay: 2000})

            env.setTimeout(()=>{
                play("talkchoir", 0.75)
                vfx({type: 'beacon', state: true})
            }, 400)

            setTimeout(()=>{
                vfx({type: 'beacon', state: false})
            }, 2000)
        },
    });

    env.entities["Ã—Ã¨.Ã·Ã¹ÃÃÃ¸Ã¸"].exmExec = () => {
        if(check("mask-joy")) {
            if(!env.targetedEntity.text.includes("JOY_MASK") && env?.stage?.name != "abyss") {
                env.targetedEntity.text = env.targetedEntity.text += `\n<span definition="NOTE::'referencing third-party context installation'::JOY_MASK">::INTERNAL CONTEXT</span>::<span class="bright-color" definitio n="ANALYSIS::'like a subtle fog in the thoughtspace';'slippery and difficult to perceive until entered';'may obscure nearby entities';'commonly accidental';'but i have seen it used intentionally in a few   places'">'hidden via gradient obfuscation'</span>`
            }
        }
    };

    env.entities.proxyfriend.actions[2].showIf = () => check("mask-unity") && !check("TEMP!!proxyozo");
    
    env.globalActions[0].showIf = () => check("mask-unity");
    
    env.dialogues["++mothbeneath"].start.body[12].showIf = () => check("mask-hunger"); // something to do with "mask" things
    env.dialogues["++mothfj"].start.body[11].showIf = () => check("mask-hunger") // local negative GAD
    env.dialogues["++mothfj"].start.body[12].showIf = () => check("mask-hunger") // local negative GAD
    env.dialogues["++mothfj"].start.body[13].showIf = () => check("mask-hunger") // local negative GAD
});


// Update files when they are loaded

let file_overrides = {};
let page_overrides = {};


document.addEventListener("corru_resources_added", (e) => {
    console.info("Updating added resources");
    e.detail.resList.forEach((file) => {
        if (file in file_overrides) {
            file_overrides[file]();
        } else {
            console.warn(`Not updating mask checks for ${file}`);
        }
    });
    
    console.info("Updating page");
    if (page.path in page_overrides) {
        page_overrides[page.path]();
    } else {
        console.warn(`Not updating mask checks for ${page.path}`);
    }
});

document.addEventListener("corru_loaded", () => {
    console.info("Updating page");
    if (page.path in page_overrides) {
        page_overrides[page.path]();
    } else {
        console.warn(`Not updating mask checks for ${page.path}`);
    }
});

// File overrides

// jokziozo.js
file_overrides["/js/jokziozo.js"] = () => {
    env.entities["council"].actions[2].showIf = () => check("mask-unity") && check("stageroom", "ozo_council");
    env.entities["isabel"].actions[2].showIf = () => check("mask-unity");
    env.entities["effigy"].actions[1].showIf = () => check("mask-unity");
    env.entities["interviewer"].actions[1].showIf = () => check("mask-unity");
    env.entities["Ã¦kiZÂ¥Ã‰t"].actions[1].showIf = () => check("mask-unity") && check("stageroom", "ozo_stranger");
    
    env.stages['ozo_entrance'].getPlan = function() {
        if(check("mask-joy") || check("pit__f3_unity")) { // once you get her, it stays open
            return this.plans.joy
        } else {
            return this.plans.default
        }
    }
    env.stages['ozo_entrance'].planAdjustment = function (plan) {
        let newPlan = plan
    
        if(!check("effigy_sipper")) newPlan = plan.replace('P', '=')
    
        if(!check("mask-joy") || env?.buddy_globalRotwatcher?.currentLocation != page.path) {
            newPlan = newPlan.replace("â³‰", ".")
            newPlan = newPlan.replace("Ï§", ".")
        }
        
        if(this.eventModifier) newPlan = this.eventModifier(newPlan, this) 
    
        return newPlan
    }
    env.stages['ozo_adrift_dancers'].planAdjustment = (plan) => {
        let newPlan = plan
    
        if(content.getAttribute("event") == "c_effigies" || content.getAttribute("event") == "f_effigies") newPlan = plan.replace("Ã¤", "â–“")
    
        if(!check("mask-joy") || !check("car__intro")) newPlan = plan.replace('Ã¸', '.').replace('Â¤', '.').replaceAll("j", ".")
        if(this.eventModifier) newPlan = this.eventModifier(newPlan, this) 
    
        return newPlan
    }
}

// e3a2geli.js
file_overrides["/js/shared/e3a2geli.js"] = () => {
        env.entities["GELI"].actions[2].showIf = () => check("mask-unity");
        env.entities["dog"].actions[0].showIf = () => check("mask-unity") && check("e3a2__escapewin") && !check("unity_dog");
}

// hub.js
file_overrides["/js/hub.js"] = () => {
    env.entities["funfriend"].actions[1].showIf = () => check("mask-unity");
}

// /js/embassy_collapse.js
file_overrides["/js/embassy_collapse.js"] = () => {
    env.entities["bstrd door"].actions[5].showIf = () => check("mask-unity");
    env.entities["bstrd golem"].actions[0].showIf = () => check("mask-unity");
}

// /js/embassy_stages_golem.js
file_overrides["/js/embassy_stages_golem.js"] = () => {
    env.stages['g_lobby'].entities["Ï„"].lockExec = () => {
        if(check("mask-hunger") && (check("PAGE!!geliawake")) ) {
            if(check("geli_beacon", false)) {
                startDialogue("geli_beacon_fallback")
            } else {
                startDialogue("add2warn")                        
            }
        } else {
            chatter({actor: 'akizet', text: 'whatever this was connected to is gone now', readout: true})
        }
    };
}

// /js/embassy_golem.js
file_overrides["/js/embassy_golem.js"] = () => {
    env.entities["geli"].actions[2].showIf = () => check("mask-unity") && isStageClear();
    env.dialogues["geli_resp"][0].replies[0].showIf = () => check("mask-hunger") && check("gol__geli_beacon") && !check("e3a2__bstrdmeet");
}

// /js/embassy_stages_groundsmindry.js
file_overrides["/js/embassy_stages_groundsmindry.js"] = () => {
    env.stages['grm_lesser'].entities["Ï„"].blockIf = () => !check("mask-joy");
}


// Page overrides

// /local/orbit/
page_overrides["/local/orbit/"] = () => {
    env.entities["proxyfriend?"].actions[1].showIf = () => check("mask-unity");
}

// /local/city/street/
page_overrides["/local/city/street/"] = () => {
    env.entities["cashier"].actions[3].showIf = () => check("mask-unity");
    env.entities["envoy"].actions[5].showIf = () => check("mask-unity");
    env.entities["slim streetwalker"].actions[1].showIf = () => check("mask-unity");
    env.entities["cloaked streetwalker"].actions[2].showIf = () => check("mask-unity");
    env.entities["stre wal k"].actions[2].showIf = () => check("mask-unity");
    env.entities["electric face box"].actions[1].showIf = () => check("mask-unity");
    env.entities["beautiful parasite"].actions[2].showIf = () => check("mask-unity");
    env.entities["effigy"].actions[1].showIf = () => check("mask-unity");
    
    env.stages["city_office"].getPlan = function() {
        let plan = this.plans.default
        
        if (check("mask-joy")) {
            plan = this.plans.joy;
        }

        return plan
    };
    env.stages['city_cafe'].planAdjustment = (plan) => {
        console.log("hello.", plan)
        let newPlan = plan
        if(!check("mask-joy") || env?.buddy_globalRotwatcher?.currentLocation != page.path) {
            console.log("no joy")
            newPlan = newPlan.replace("â³‰", "r")
        } else {
            newPlan = newPlan.replace("t", "T")
        }

        console.log(plan)

        return newPlan
    };
    env.stages["city_street3"].leaveExec = () => {
        env.citystreet.buttonActive = false
        clearTimeout(env.citystreet.buttonTimeout)
        env.setTimeout(() => {
            if(env.stage.name != "city_street3" || !check("mask-joy")) {
                env.citystreet.wait.stop()
                env.citystreet.walk.stop()
                env.bgm.rate(1)
                content.classList.remove('hide-envoy')
            }            
        }, 50)
    };
    env.stages["city_street3"].getPlan = function() {
        let plan = this.plans.default
        
        if (check("mask-joy")) {
            plan = this.plans.joy
            env.citystreet.buttonActive = true
        } else {
            env.citystreet.buttonActive = false
        }

        return plan
    };
    env.stages["city_banks"].entities["â–“"].blockIf = () => !check("mask-hunger") && env.effectiveNet >= 0;
    env.stages["city_banks_flip"].planAdjustment = (plan) => {
        let newPlan = plan

        if(check("effigy_fawners")) newPlan = plan.replace("A", "â–‘").replace("a", "â–‘")
        if(!check("effigy_sipper")) newPlan = plan.replace("P", "â–‘")
            
        if(!check("mask-joy") || env?.buddy_globalRotwatcher?.currentLocation != page.path || !check("citystreet__rotmeet")) {
            console.log("no rot")
            newPlan = newPlan.replace("â³‰", "r")
            newPlan = newPlan.replace("Ï§", ".")
        }

        return newPlan
    }
    env.stages['office_hall'].entities["^"].lockFlag = "EXEC::check('mask-hunger')";
}

// /local/dullvessel/
page_overrides["/local/dullvessel/"] = () => {
    env.entities["pilot cyst"].actions[2].showIf = () => check("mask-unity");
    env.entities["glazika"].actions[1].showIf = () => check("mask-unity");
    
    env.stages["dullvessel_quarters"].planAdjustment = function(plan) { // Does nothing but included for future use
        let newPlan = plan

        if(check("mask-joy")) {
            
        } else {
            
        }

        return newPlan
    }
}

// /local/ocean/ship/interview/
page_overrides["/local/ocean/ship/interview/"] = () => {
    env.entities["interviewer"].actions[1].showIf = () => check("mask-unity");
    
    env.stages["remnants_room"].planAdjustment = function (plan) {
        let newPlan = plan

        if(!check("mask-joy") || env?.buddy_globalRotwatcher?.currentLocation != page.path) {
            newPlan = newPlan.replace("â³‰", ".")
            newPlan = newPlan.replace("Ï§", ".")
        }

        return newPlan
    }
}

// /local/ocean/ship/deck
page_overrides["/local/ocean/ship/deck"] = () => {
    env.entities["bright guardian"].actions[1].showIf = () => check("mask-unity");
}

// /local/city/aquarium
page_overrides["/local/city/aquarium"] = () => {
    env.entities["isabel"].actions[6].showIf = () => check("mask-unity");
}

// /local/beneath/
page_overrides["/local/beneath/"] = () => {
    env.entities["Æ˜Ã¸Â¿Æ¶á¸³Â¿Â±"].actions[3].showIf = () => check("mask-unity");
    env.entities["effigy"].actions[1].showIf = () => check("mask-unity");
}

// /local/uncosm/pit/
page_overrides["/local/uncosm/pit/"] = () => {
    env.entities["Ã¦kiZÂ¥Ã‰t"].actions[0].showIf = () => check("mask-unity");
}

// /local/beneath/parasite/
page_overrides["/local/beneath/parasite/"] = () => {
    env.entities["piece"].actions[1].showIf = () => check("mask-unity");
    env.entities["effigy"].actions[1].showIf = () => check("mask-unity");
    
    env.stages["parasite"].planAdjustment = function (plan) {
        let newPlan = plan

        if(!check("mask-joy") || env?.buddy_globalRotwatcher?.currentLocation != page.path) {
            newPlan = newPlan.replace("â³‰", ".")
            newPlan = newPlan.replace("Ï§", ".")
        }

        return newPlan
    }
}

// /local/ocean/ship/elsewhere/
page_overrides["/local/ocean/ship/elsewhere/"] = () => {
    env.stages['hull3'].planAdjustment = (plan) => {
        let newPlan = plan
        if(!check("mask-joy") || !check("car__intro")) newPlan = plan.replace('Ã¸', 'â–‘').replace('Â¤', 'â–‘')
        return newPlan
    }
}

// /local/beneath/embassy/
page_overrides["/local/beneath/embassy/"] = () => {
    env.entities["bstrd"].actions[2].showIf = () => check("mask-unity") && check("e3a2__bstrdmeet");
}