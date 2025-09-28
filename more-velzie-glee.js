body.insertAdjacentHTML('beforeend', `<style>
.actor.status-mutation .statusfx-mutation {
    height: 150%;
    width: 125%;
    left: -12.5%;
    background-image: url(/img/textures/regen.png);
    background-size: 100%;
    animation: portrait-wiggle 1s cubic-bezier(.55,0,.39,1.26) infinite alternate;
}


.actor.status-mutation .statusfx-mutation {
    background: url(https://adrfurret.neocities.org/corrumods/img/textures/mutation.gif)
}

.statusfx-critical_boon {
    background-image: url(/img/sprites/combat/allycrosshair.gif);
    background-size: auto 90%;
    background-position: 3% 50%;
    background-repeat: no-repeat;
}


.actor.status-numb .statusfx-numb {
    background-image: radial-gradient(circle, rgb(0, 0, 0) 50%, rgba(0,0,0,0) 100%), url(/img/textures/static.gif);
    background-position: center;
    background-size: auto 100%;
    mix-blend-mode: hue;
}

body[quality="low"] .actor.status-numb .statusfx-numb {
    mix-blend-mode: unset;
    opacity: 0.75;
}

.statusfx-insane_surge {
    background-image: url(/img/textures/yneural.gif);
}

.actor.status-dazed .statusfx-dazed {
    height: 300%;
    width: 300%;
    background-image: url(/img/textures/stun.gif);
    background-size: auto;
    animation: status-spin 5s cubic-bezier(.6,-0.28,.74,.05) infinite;
    left: unset;
    top: unset;
    bottom: unset;
    right: unset;
}

.actor.status-enlightenment .statusfx-enlightenment {
    content: "";
    z-index: 10;
    background-size: 50% auto;
    background-position: bottom;	
    background-repeat: repeat-x;
    width: 200%;
    animation: status-drift 1s linear infinite;
}

.actor.status-enlightenment .statusfx-enlightenment {
    background-image: url(/img/textures/bflametran.gif);
}

.statusfx-denial {
    background-image: url(https://adrfurret.neocities.org/corrumods/img/textures/denial.gif);
}

</style>`);
document.addEventListener('corru_resources_added', (ev)=>{
const arrayOfStringURLsLoaded = ev.detail.resList
if (arrayOfStringURLsLoaded.includes("/js/beneath_embassy.js")){
if(typeof env.STATUS_EFFECTS != "undefined") {
env.STATUS_EFFECTS.mutation = {
        slug: "mutation",
        name: "Mutation",
        beneficial: true,
        help: "+(T:MUTATION) HP/turn (min:1), max: +90HP\nI.E. 4T:MUTATION = +4 HP",
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/mutation.gif",
        events: {
            onTurn: function() {
                let amt = Math.min(this.status.duration, 90)
                console.log("mutating for", amt)
                reactDialogue(this.status.affecting, 'mutation');
                combatHit(this.status.affecting, {amt: -amt, beneficial: true, type: "hp"});
                play('mend', 0.75);
            },
        },
        removes: ["rot"],
        opposite: "rot"
    };

if(typeof env.STATUS_EFFECTS.rot.removes != "undefined") {
  if(!env.STATUS_EFFECTS.rot.removes.includes("mutation")) {
  env.STATUS_EFFECTS.rot.removes.push("mutation");
  }
} else { 
    env.STATUS_EFFECTS.rot.removes = ["mutation"];
}
if(typeof env.STATUS_EFFECTS.rot.opposite == "undefined") { env.STATUS_EFFECTS.rot.opposite = "mutation" }

env.STATUS_EFFECTS.critical_boon = { 
        slug: "critical_boon",
        name: "Critical Boon",
        beneficial: true,
        help: "when evading an attack, also gain 10% of current HP (min:1)\nremoved upon evasion loss",
        infinite: true,
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/critical_boon.gif",
        events: {
            onBeforeCombatHit: function() {
                if(!hasStatus(this.status.affecting, "evasion")) {
                    removeStatus(this.status.affecting, "critical_boon")
                }
            },

            onEvade: function({subject, attack, beneficial}) {
                if(beneficial) return;

                let dmg = (Math.floor(this.status.affecting.hp * 0.1) || 1)
                reactDialogue(this.status.affecting, 'regen');
                combatHit(this.status.affecting, {amt: -dmg, autohit: true, redirectable: false, beneficial: true,  runEvents: false})
            
                sendFloater({
                    target: this.status.affecting,
                    type: "arbitrary",
                    arbitraryString: "CRITICAL BOON!",
                    beneficial: true,
                    size: 1.5,
                })

                readoutAdd({
                    message: `${this.status.affecting.name} gains ${dmg} extra critical health! (<span definition="${processHelp(this.status, {caps: true})}">${this.status.name}</span>)`, 
                    name: "sourceless", 
                    type: "sourceless combat minordetail",
                    show: false,
                    sfx: false
                })    
            },

            onRemoveStatus: function({target, removingStatusName}) {
                if(removingStatusName == "evasion") removeStatus(this.status.affecting, "critical_boon")
            },
        },
        opposite: "critical_flaw"
    };

if(typeof env.STATUS_EFFECTS.critical_flaw.opposite == "undefined") { env.STATUS_EFFECTS.critical_flaw.opposite = "critical_boon" }


env.STATUS_EFFECTS.numb = { 
        slug: "numb",
        name: "Numb",
        incomingMult: -0.5,
        outgoingMult: -0.5,
        tickType: "onTurnEnd",
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/numb.gif",
        
        events: {
            onTurn: function() { reactDialogue(this.status.affecting, 'numb') },
        },

        help: "-50% incoming/outgoing damage/heal",
        removes: ["destabilized"],
        opposite: "destabilized"
    };
if(typeof env.STATUS_EFFECTS.destabilized.removes != "undefined") {
  if(!env.STATUS_EFFECTS.destabilized.removes.includes("numb")) {
  env.STATUS_EFFECTS.destabilized.removes.push("numb");
  }
} else { 
    env.STATUS_EFFECTS.destabilized.removes = ["numb"];
}

if(typeof env.STATUS_EFFECTS.destabilized.opposite == "undefined") { env.STATUS_EFFECTS.destabilized.opposite = "numb" }

env.STATUS_EFFECTS.denial = { 
        slug: "denial",
        name: "Denial",
        outgoingCrit: -1,
        outgoingFlat: -2,
        infinite: true,
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/denial.gif",
        events: {
            onTurn: function() { reactDialogue(this.status.affecting, 'denial') },

            onAction: function({user, action, target}) {
                removeStatus(this.status.affecting, "denial")
            },
        },
        help: "-2 base outgoing damage/heal, -100% crit%, consumed by next action",
        removes: ["sacrifice"],
        opposite: "sacrifice"
    };
if(typeof env.STATUS_EFFECTS.sacrifice.removes != "undefined") {
  if(!env.STATUS_EFFECTS.sacrifice.removes.includes("denial")) {
  env.STATUS_EFFECTS.sacrifice.removes.push("denial");
  }
} else { 
    env.STATUS_EFFECTS.sacrifice.removes = ["denial"];
}

if(typeof env.STATUS_EFFECTS.sacrifice.opposite == "undefined") { env.STATUS_EFFECTS.sacrifice.opposite = "denial" }

if(typeof env.STATUS_EFFECTS.stun.opposite == "undefined") { env.STATUS_EFFECTS.stun.opposite = "surge" }
if(typeof env.STATUS_EFFECTS.surge.opposite == "undefined") { env.STATUS_EFFECTS.surge.opposite = "stun" }

env.STATUS_EFFECTS.insane_surge = { 
        slug: "insane_surge",
        name: "Insane Surge",
        beneficial: true,
        infinite: true,
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/insane_surge.gif",
        events: {
            onTurn: function() { 
                reactDialogue(this.status.affecting, 'surge') 
                delete this.status.justGotSurge
            },
            
            onAction: function({user, action, target, beingUsedAsync}) {
                if(
                    this.status.justGotSurge || 
                    beingUsedAsync || 
                    ["incoherent_", "steer", "floor", "windup", "intrusive"].some(slugpart => action.slug.includes(slugpart)) ||
                    !action.type.includes("target") ||
                    (!action.beneficial && target.team.name == "ally") ||
                    (action.beneficial && target.team.name == "enemy")
                ) return;

                setTimeout(()=>{
            
                    sendFloater({
                        target: user,
                        type: "arbitrary",
                        arbitraryString: "INSANE SURGE!",
                        size: 1.5,
                    })

                    readoutAdd({
                        message: `${user.name} severely overexerts themselves to act again and again and again and again! (<span definition="${processHelp(this.status, {caps: true})}">${this.status.name}</span>)`, 
                        name: "sourceless", 
                        type: "sourceless combat minordetail", 
                        show: false,
                        sfx: false
                    })

                    env.GENERIC_ACTIONS.teamWave({
                        team: target.team,
                        exec: (actor, i) => {
                            if(actor == target) return; // we skip the original target
                            useAction(user, action, actor, {triggerActionUseEvent: false, beingUsedAsync: true, reason: "insane surge"})
                            useAction(user, action, actor, {triggerActionUseEvent: false, beingUsedAsync: true, reason: "insane surge (2)"})
                        }
                    })
                    
                }, 500)

                removeStatus(this.status.affecting, "insane_surge")
                if(!hasStatus(this.status.affecting, "fish_solo")) addStatus({target: this.status.affecting, origin: this.status.affecting, status: "dazed", length: 1})
            },

            onCreated: function({statusObj}) {
                if(statusObj.slug == this.status.slug) this.status.justGotSurge = true
            },
        },
        help: "on next active targeted action, gain 1T:DAZED, and use across the entire target team\nif beneficial, action used twice on all allies\nif offensive, action used twice on all foes",
        opposite: "hyperstun"
    };

if(typeof env.STATUS_EFFECTS.fish_solo != "undefined") {
env.STATUS_EFFECTS.fish_solo.events.onCreated = function({statusObj}) {
                if(statusObj.slug == "fish_solo" && !this.status.initialized) {
                    this.status.affecting.statusImmunities = ["stun", "fear", "dazed"]
                    this.status.initialized = true
                    addStatus({target: this.status.affecting, status: "wild_surge", noReact: true, length: 1})
                    setTimeout(()=>this.status.affecting.box.classList.add("daemonactor"), 100)
                } else if(statusObj.slug == "wild_surge") {
                    setTimeout(()=>delete statusObj.justGotSurge, 50)
                }
            };
}

env.STATUS_EFFECTS.dazed = { 
        slug: "dazed",
        name: "Dazed",
        incomingMult: 1,
        substitute: 'vulnerable',
        skipTurn: true,
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/dazed.gif",
        
        events: {
            onTurn: function() { reactDialogue(this.status.affecting, 'dazed') },
        },

        help: "skip turn, +100% incoming damage/heal",
        removes: ["windup"],
        opposite: "wild_surge"
    };

if(typeof env.STATUS_EFFECTS.hyperstun.opposite == "undefined") { env.STATUS_EFFECTS.hyperstun.opposite = "insane_surge" }
if(typeof env.STATUS_EFFECTS.wild_surge.opposite == "undefined") { env.STATUS_EFFECTS.wild_surge.opposite = "dazed" }
if(typeof env.STATUS_EFFECTS.hyperstun != "undefined") {
env.STATUS_EFFECTS.hyperstun.events.onTurn = function() { reactDialogue(this.status.affecting, 'dazed') }; // sorry for the replace !!
}

env.STATUS_EFFECTS.enlightenment = { 
        slug: "enlightenment",
        name: "Enlightenment",
        help: "outgoing targeted actions have a 50% chance to be acted upon again to a random actor\nremoved upon focused loss",
        beneficial: true,
        infinite: true,
        icon: "https://adrfurret.neocities.org/corrumods/img/sprites/combat/statuses/enlightenment.gif",
        
        events: {
            onBeforeAction: function(context) {
                if(!hasStatus(this.status.affecting, "focused")) {
                    removeStatus(this.status.affecting, "enlightenment")
                    return
                }

                if(!context.settings.action.type.includes("target")) return;
                
                // alter target maybe
                if(Math.random() < 0.5) {
                    //select from whole turnorder
                    let subject = context.user
                    let oldTarget = context.settings.target
                    let newTarget = env.rpg.turnOrder.filter(actor=>actor.state != "dead" && actor.state != "lastStand" && actor.slug != oldTarget.slug)
                    if(newTarget.length) {
                        newTarget = newTarget.sample()
                    } else return;

                    console.log("old target was", context.settings.target, "new target is", newTarget)

                    useAction(context.settings.user, context.settings.action, newTarget, {triggerActionUseEvent: false, beingUsedAsync: true, reason: "enlightenment"})

                    sendFloater({
                        target: subject,
                        type: "arbitrary",
                        arbitraryString: "ENLIGHTENMENT!",
                        beneficial: true,
                        size: 2,
                    })

                    readoutAdd({
                        message: `${subject.name}'s action upon ${oldTarget.name} is doubled over to ${newTarget.name}! (<span definition="${processHelp(this.status, {caps: true})}">${this.status.name}</span>)`, 
                        name: "sourceless", 
                        type: "sourceless combat minordetail",
                        show: false,
                        sfx: false
                    })
                }
            },

            onRemoveStatus: function({target, removingStatusName}) {
                if(removingStatusName == "focused") removeStatus(this.status.affecting, "enlightenment")
            },
        },
        opposite: "madness"
    };

    if(typeof env.STATUS_EFFECTS.madness.opposite == "undefined") { env.STATUS_EFFECTS.madness.opposite = "enlightenment" }
    
    if(typeof env.COMBAT_ACTORS.generic.reactions.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactions.mutation = ["feels weird"] }
    if(typeof env.COMBAT_ACTORS.generic.reactions.numb == "undefined") { env.COMBAT_ACTORS.generic.reactions.numb = ["..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactions.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactions.recieve_numb = ["can not feel"] }
    if(typeof env.COMBAT_ACTORS.generic.reactions.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactions.dazed = ["ouuuuuu","ouaaaaaa"] }

    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.mutation = ["feeling odd..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.numb = ["..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.recieve_numb = ["what is..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.denial == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.denial = ["ÃŽÂ¢ÃƒÃ¤Â¾!!"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.ichor.dazed = ["everything hurts..."] }

    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.mutation = ["recovering, but..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.numb = ["..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.recieve_numb = ["can not move..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.eyes.dazed = ["i..."] }

    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.claws.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.claws.mutation = ["yes!! YES!!!","healing FASTER!!"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.claws.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.claws.numb = ["...","...","...","...feel FÃ&STER ALREADY!!"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.claws.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.claws.recieve_numb = ["what? WHAT??","why am i NOT DOING THIS??"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.claws.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.claws.dazed = ["eÃ¥eeeaaÃ¥aaÃ¥auuuÃ¥uu"] }

    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.bone.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.bone.mutation = ["better..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.bone.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.bone.numb = ["..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.bone.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.bone.recieve_numb = ["i feel so frail...","i can not feel..."] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.bone.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.bone.dazed = ["wait--"] }

    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.light.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.light.mutation = ["YESSÂ¬Â¬","aHAHAâ€˜ÃŒÂ¥â€¹"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.light.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.light.numb = ["pÈ‡acÈ‡Â¬Ä•","qui&Iâ€˜et"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.light.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.light.recieve_numb = ["wh[y cÃ¤n i NO~T huâ€œrt thÂµem??","leÂ¨t me THRÂ±OUGH!!","É‡it tâ€œunes ~it oÂ¨ut"] }
    if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.light.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.light.dazed = ["zzzÂ¬zzz","v bor{ed","want my t5Â«urn"] }
    
    if(typeof env.COMBAT_ACTORS.efgy != "undefined") {
    if(typeof env.COMBAT_ACTORS.efgy.reactions.mutation == "undefined") { env.COMBAT_ACTORS.efgy.reactions.mutation = ["EEHEHEHEHHEHE", "YESS!!"] }
    if(typeof env.COMBAT_ACTORS.efgy.reactions.numb == "undefined") { env.COMBAT_ACTORS.efgy.reactions.numb = ["my bullets gone!! isabebl help!"] }
    if(typeof env.COMBAT_ACTORS.efgy.reactions.recieve_numb == "undefined") { env.COMBAT_ACTORS.efgy.reactions.recieve_numb = ["woaooaough..."] }
    if(typeof env.COMBAT_ACTORS.efgy.reactions.dazed == "undefined") { env.COMBAT_ACTORS.efgy.reactions.dazed = ["the dream is shattered!! help!"] }
    if(typeof env.COMBAT_ACTORS.efgy.reactions.laugh == "undefined") { env.COMBAT_ACTORS.efgy.reactions.laugh = ["eheheeeaaahahaha", "YAYAYAYA!!", "EEHEHEHEHHEHE"] }
    }
    
    if(typeof env.morevelziesglee == "undefined") {
    env.morevelziesglee = {}
    }

    if(typeof env.morevelziesglee.stagecheck == "undefined") {
      env.morevelziesglee.stagecheck = false;
    }
    
    if(page.path == "/local/beneath/embassy/"){
        if(!env.morevelziesglee.stagecheck){
        env.morevelziesglee.stagecheck = true
        function adrmorevelziesgleepostcheck() {

            if(typeof env.COMBAT_COMPONENTS.flesh != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.mutation = ["m u  t a ti ng","g r o ww i n g"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.recieve_mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.recieve_mutation = ["m o oÃ¸ r rr Â«ee e"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.numb = ["d e t u n e d"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.recieve_numb = ["â–ˆ shâ–ˆrp lâ–ˆmb strâ–ˆkâ–ˆs mâ–ˆ mâ–ˆndcâ–ˆrâ–ˆ"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.flesh.dazed = ["Â£Â¢Ã‡Å’Â³Å’Â¼Ã’Â¼Ã’Å’Â³"] }
            }

            if(typeof env.COMBAT_COMPONENTS.dull != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.dull.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.dull.mutation = ["far better","excellent"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.dull.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.dull.numb = ["terrible","can not feel","everything feels fuzzy"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.dull.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.dull.recieve_numb = ["everything feels fuzzy","what...","can not feel"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.dull.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.dull.dazed = ["oouaaaouuu","eeouuuoaoaoa"] }
            }

            if(typeof env.COMBAT_COMPONENTS.spirestone != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.mutation = ["thank you!!!","feeling far better"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.numb = ["odd...","i feel less..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.recieve_numb = ["everything feels less","what is happening??"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.spirestone.dazed = ["oouaaaouuu","eeouuuoaoaoa","hurts!!"] }
            }

            if(typeof env.COMBAT_COMPONENTS.hands != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hands.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hands.mutation = ["an unnatural blessing?","a speedy recovery"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hands.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hands.numb = ["..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hands.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hands.recieve_numb = ["everything tunes out..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hands.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hands.dazed = ["cannot move!","agh!"] }
            }

            if(typeof env.COMBAT_COMPONENTS.metal != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.metal.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.metal.mutation = ["repairs accelerating!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.metal.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.metal.numb = ["..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.metal.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.metal.recieve_numb = ["tuned out?!","i can not feel!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.metal.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.metal.dazed = ["my attacks!","come on!!"] }
            }

            if(typeof env.COMBAT_COMPONENTS.pain != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.pain.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.pain.mutation = ["thÃ†Ã«Ã£ nk youuiu"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.pain.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.pain.numb = ["..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.pain.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.pain.recieve_numb = ["i can not feel anâ†¹ything"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.pain.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.pain.dazed = ["Ã¶PÃ¼LÃ‰Ã¦BXASÃ®uUSEÃLEÃ§Ã§TÅ¾tÃšâ€˜Â½MEâ‚¬Å’1ÃÃ»OUâ€“Â°T"] } // PLEASE LET ME OUT
            }
            
            if (check("modList").includes("narra_morehumors")) { // special just because .intrusive exists in the basegame too
            if(typeof env.COMBAT_COMPONENTS.intrusive != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.mutation = ["((/q,6â–ˆâ–ˆL"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.numb = ["'+]X", " â–ˆâ–ˆL", "'+BM"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.recieve_numb = ["'+]X", " â–ˆâ–ˆL", "'+BM"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.intrusive.dazed = ["eP,69R@â–ˆâ–ˆL"] }
            }
            }

            if(typeof env.COMBAT_COMPONENTS.lightning != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.mutation = ["Â½Ã·YESSÃ˜Â¬_SSSÃ·"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.numb = ["ÂºAhh|â€”5z Aâ€žAe","Ã¼ÃŽHAÃ®1Ã…j ","givâ€že me my t*Â¼u-â€žrn!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.recieve_numb = ["Â£w5ÃCOME O|N!!!","pe~Â¼ace..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.lightning.dazed = ["bo/:Â£rring","zzAAÃ¿A|Azzzzzz"] }
            }

            if(typeof env.COMBAT_COMPONENTS.heart != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.heart.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.heart.numb = ["Ã·no!Â²Â²ave rs i onÂ¬_.g?Ã§","pe@cÂ¨e <YCNlevÂ½Ã¢F"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.heart.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.heart.recieve_numb = ["Ã·no!Â²Â²ave rs i onÂ¬_.g?Ã§","pe@cÂ¨e <YCNlevÂ½Ã¢F"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.heart.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.heart.dazed = ["s/:Â£tÃ•p","xÃ¼â€ºÃ»Ã˜Ãµ"] }
            }
            
            if(typeof env.COMBAT_COMPONENTS.chaos != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.mutation = ["YIPPEE !"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.numb = ["THIS SUCKSE >:(","COME ONNNNN","GIVE ME MY BULLETS BACK!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.recieve_numb = ["LESS BULLETS THIS SUCKSE >:("] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.chaos.dazed = ["NOOOOOOOO!!!", "COME ONNNNN", "i want my TURN!! >:(("] }
            }
            
            if(typeof env.COMBAT_COMPONENTS.order != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.order.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.order.mutation = ["GRT",">:D"] } // great, >:D
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.order.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.order.numb = ["..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.order.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.order.recieve_numb = ["NMB","DTND","SCRY"] } // numb, detuned, scary
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.order.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.order.dazed = ["SCRY","OWW","SKPPD"] } // scary, oww, skipped
            }
            
            if(typeof env.COMBAT_COMPONENTS.cmb != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.mutation = ["lock, cauterize, stabilize","isolate, expose, administer","amputate, zero, confirm","pressure, sword, sterilize","sacrifice, coagulate, clamp"] } // different combine overwatch "code: " lines related to medical words
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.numb = ["warning: counter-resonant singularity device detected","warning. malignant viral interface bypass detected","polyphasic core reprogramming detected"] } // combine overwatch lines that relate to unauthorized weapons, in proximity to the final citadel lines to match the destabilized lines
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.recieve_numb = ["warning: counter-resonant singularity device detected","warning. malignant viral interface bypass detected","polyphasic core reprogramming detected"] } // ditto
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.cmb.dazed = ["attention occupants: your block is now charged with permissive inactive coercion","warning. surveillance and detection systems inactive","alert: community ground protection units: local unrest structure detected"] } // misc combine overwatch lines related to inaction/citizen searches
            }
            
            if(typeof env.COMBAT_COMPONENTS.zuka != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.mutation = ["more!! MORE!!","moremoreMORE!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.numb = ["...","...","...","Â¦sÃ·Â¤Ã«Â¾Ã¨â€ Ã¹RÃ€â€ >Ã¦6Ã¶yÂ¯Â¨CoÅ“Ãš"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.recieve_numb = ["GAHHHGHG!!!", "Å½qâ€ AÃ«Â¾Ã¨ZÅ’jFKÅ¡Ã“Å’â€ Ã¹RÃ€â€ >Å’jFKKÅ¡Ã“Å’â€ Ã¹R!!!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.zuka.dazed = ["WHY!!!","KILLTHEMKILLTHEMKILLTHEM!!!"] } 
            }
            
            if(typeof env.COMBAT_COMPONENTS.hook != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hook.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hook.mutation = ["FIË‡NAL-LY~!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hook.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hook.numb = ["REË‡Ë‡MOVE STAT~US Ã‹FË‡FÃ‹CT!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hook.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hook.recieve_numb = ["Ã£Ã£Ã…Ë‡Ã…Ã…Ã…!!!!", "WH~*Y!!!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.hook.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.hook.dazed = ["I %HÂºÃ…TEÃ£Â¿ GLÃ‹]Ã‹!!","Ã£ÃšÃ£Ã‹Â«C!!!"] }
            }
            document.removeEventListener('stage_changed', adrmorevelziesgleepostcheck);
        }
        document.addEventListener('stage_changed', adrmorevelziesgleepostcheck)
    }
          
    }
}
}
if (arrayOfStringURLsLoaded.includes("https://glass-memoirs.github.io/Chaos-beta/ChaosBeta.js") || arrayOfStringURLsLoaded.includes("https://glass-memoirs.github.io/Chaos-beta/ChaosBetaBeta.js")){
              if(typeof env.COMBAT_COMPONENTS.entropy != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.mutation = ["I... live so much more??"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.numb = ["can not feel anything"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.recieve_numb = ["Â´ Ã§]  Â´  Â´ "] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.denial == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.denial = ["fuck off"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.entropy.dazed = ["NONONONONONONONONONONONONONO"] }
            }
            
            if(typeof env.COMBAT_COMPONENTS.surging != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.surging.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.surging.mutation = ["VELZZZIIEEE NOOOOOO!!!!","VELLZIE HAS CAST MMMYYYY ETERNAL PUNISHMENTTT"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.surging.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.surging.numb = ["CAnnNNNnnnNNOT SHOWW OFFF!!","MMMmmMMmmYYYY SCRIPPTTT DOES NOT CALL FOR THIS!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.surging.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.surging.recieve_numb = ["MMMYYY ACTT IS DISRUPTEDD!!","IIII CANNOTTTT WORKK WITH THIS SCRIPTTT!!","VELZIE PPLEASE DO NOT CURSE ME SOOO"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.surging.denial == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.surging.denial = ["OHHH WWELL! THE SCRIPPT DEEMANDDS FORR ITTT"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.surging.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.surging.dazed = ["LEEETTTT MEEEE GOOOOOOOOOO","III NEEED TO PERFORMMMMMM NOWWW"] }
            }
            
            if(typeof env.COMBAT_COMPONENTS.stupidhorrible != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.mutation = ["Ooogh give me some of that nightmare blunt rotation"] } // continuing the original line with nightmare blunt rotation
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.numb = ["h"] } // h
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.recieve_numb = ["only heaven punishes its cutest little babygirls"] } // misremembered tumblr post i think
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.denial == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.denial = ["can't have shit in detroit"] } // obvious
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.stupidhorrible.dazed = ["bwanna see me run to that mountain and back. wanna see me do it again"] } // spongebob meme quote in line of original stun message
            }
            
              if(typeof env.COMBAT_COMPONENTS.smog != "undefined"){ // note that we have, shockingly, not played OFF yet so apologies if these are out of tone
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.smog.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.smog.mutation = ["That felt good.","Stop it."] } 
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.smog.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.smog.numb = ["Huh?"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.smog.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.smog.recieve_numb = ["You, Specter--!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.smog.denial == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.smog.denial = ["My job is done."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.smog.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.smog.dazed = ["Why can I not move?"] }
            }
            
              if(typeof env.COMBAT_COMPONENTS.life != "undefined"){
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.life.mutation == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.life.mutation = ["a-ah..!","this feels weird..."] } 
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.life.numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.life.numb = ["let us be friends!","thank you for some peace!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.life.recieve_numb == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.life.recieve_numb = ["peace...","quiet..."] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.life.denial == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.life.denial = ["w-waaah!!"] }
                if(typeof env.COMBAT_ACTORS.generic.reactionPersonalities.life.dazed == "undefined") { env.COMBAT_ACTORS.generic.reactionPersonalities.life.dazed = ["st-stop!!"] }
            }
}
})
