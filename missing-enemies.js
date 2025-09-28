body.insertAdjacentHTML('beforeend', `<style>

#enemy-graphic .daemon-mimic .lifter::before {
    background-image: url(https://adrfurret.neocities.org/corrumods/img/sprites/funfriend/funfriend_mimic.gif);
    background-size: auto 500%;
    background-position: center 98%;
}

#enemy-graphic .daemon-mimic .lifter {
    backface-visibility: unset;
    background: url(https://adrfurret.neocities.org/corrumods/img/local/embassy/liftfriend_mimic.gif);
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
}   

#enemy-graphic .daemon-mimic .lifter.sprite figure::after, .daemon-mimic .lifter.aggressormode figure::after {
    display: none;
}

#enemy-graphic [id^="enemy_movefriend_lowintensity_proxy"] .target {
    width: 25%;
    height: 25%;
    top: unset;
    left: unset;
}

#enemy-graphic .daemon-mimic .veilksprite.bstrdlight::before, #enemy-graphic .daemon-mimic .veilksprite.bstrdlight::after { background-image: url(https://adrfurret.neocities.org/corrumods/img/sprites/bstrd/bstrd_mimic.gif) }

.daemon-mimic.wordfriend .orb {
    background-image: url(/img/sprites/combat/foes/translator_sigil.gif), url(https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/translator_orb_mimic.gif);
}
</style>`);
document.addEventListener('corru_resources_added', (ev)=>{
const arrayOfStringURLsLoaded = ev.detail.resList
if (arrayOfStringURLsLoaded.includes("/js/beneath_embassy.js")){
if(typeof env.COMBAT_ACTORS != "undefined") {
env.COMBAT_ACTORS.enemy_movefriend_lowintensity_proxy = {
    slug: "enemy_movefriend_lowintensity_proxy",
    name: "Movefoe",
    maxhp: 60,
    hp: 60,
    statusImmunities: ["stun"],
    actions: ["movefriend_attack", "special_mass_destabilize", "special_movefriend_annihilate_proxy"],
    graphic: `
        <div class="sprite-wrapper" id="%SLUG-sprite-wrapper">
            <div class="lifter sprite"><figure></figure></div>
            <div class="target" entity="movefoe"></div>
        </div>
        `,
    reactions: {} //SILENT CREATURE
};

env.COMBAT_ACTORS.tendrils_proxy = {
        name: "Tendril",
        turnCheck: "tendrils",
        maxhp: 10,
        hp: 10,
        actions: ["swipe"],
        graphic: `
            <div class="sprite-wrapper" id="%SLUG-sprite-wrapper">
                <img class="sprite" src="https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/tendrils.gif" id="%SLUG-sprite">
                <div class="target" entity="tendrils"></div>
            </div>
            `,
        reactions: {}
    };
env.COMBAT_ACTORS.bstrdlight_proxy = {
        name: "BSTRDlight",
        maxhp: 40,
        hp: 30,
        actions: ["spy", "mend", "special_mass_destabilize", "swipe", "rez"],
        graphic: `
            <div class="sprite-wrapper" id="%SLUG-sprite-wrapper">
                <div class="veilksprite bstrdlight">
                    <img class="sprite" src="https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/bstrdlampbase.gif" id="%SLUG-sprite">
                </div>
                <div class="target" entity="bstrdlight"></div>
            </div>
            `,
        reactions: {
            catchall: ["1UiÃ«2Wâ€¡", "â€¡eÃŽKÃŸJÃ¤Ã¤", "/â€¦Â¿?Ã· Ã´LÃ£Ã˜", "CÂ©Ã‹", "0Eâ„¢NÃ³Â¨Ã½QÃ’", "â‚¬LWÃ©{Ã°Ã", "Ã‡Ã¦Ã½Ã™â€¡ÃŸâ€ C", "Â£~UÃ¾fÃ¢", "â€¦TÃº**"],
            dead: ["Â¿", "???"]
        },
        turnCheck: "lastRezzer"
    };
env.COMBAT_ACTORS.translation_golem_proxy = {
        name: "Translation Core",
        maxhp: 80,
        hp: 80,
        specialClass: "mainfoe",
        actions: ["special_chant_proxy"],
        statusImmunities: ["stun"],
        graphic: `
            <div class="sprite-wrapper wordfriend" id="%SLUG-sprite-wrapper">
                <div class="spinny">
                    <img src="https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/translator_core.gif" class="sprite diamond">
                    <img src="https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/translator_core.gif" class="sprite diamond">
                </div>
            
                <div class="orbs">
                    <div class="orb"></div>
                    <div class="orb"></div>
                    <div class="orb"></div>
                </div>
            
                <div class="orbs">
                    <div class="orb"></div>
                    <div class="orb"></div>
                </div>
            
                <div class="target" entity="translation core"></div>
            </div>
            `,
        reactions: {
            catchall: ["â–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆâ–ˆ â–ˆ â–ˆâ–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆ", "â–ˆ â–ˆâ–ˆâ–ˆâ–ˆ", "â–ˆâ–ˆâ–ˆâ–ˆ â–ˆ â–ˆ â–ˆ"],
            dead: ["â–ˆâ–ˆâ–ˆ â–ˆ â–ˆ â–ˆ â–ˆâ–ˆâ–ˆ"]
        }
    };
    

env.COMBAT_ACTORS.hallucination_proxy = {
        name: "Â»ÃµGQÃ Âº3Â¾Ãµâ€cR%",
        maxhp: 3,
        hp: 3,
        actions: ["speak", "husk_attack_weak"],
        graphic: `
            <div class="sprite-wrapper hallucination" id="%SLUG-sprite-wrapper">
                <div class="sprite-overflow spritestack">
                    <img class="sprite basis" src="/img/sprites/combat/foes/hallucinations/akizet.png" id="%SLUG-sprite">
                    <img class="sprite base" src="/img/sprites/combat/foes/hallucinations/akizet.png" id="%SLUG-sprite">
                    <img class="sprite eyes" src="/img/sprites/combat/foes/hallucinations/akizet_eyes.png" id="%SLUG-sprite">
                </div>
                <div class="target" entity="Â»ÃµGQÃ Âº3Â¾Ãµâ€cR%"></div>
            </div>
            `,
        reactions: {},
        initialStatusEffects: [["ethereal", 1]],
        turnCheck: "hallucinations",
        events: {
            onSpriteCreation: (sprite) => {
                if(!sprite) return
        
                let basis = sprite.querySelector('img.basis')
                let base = sprite.querySelector('img.base')
                let eyes = sprite.querySelector('img.eyes')
                let hallucinatorbase = false
                fetch(`https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/${env.hallucinator}.gif`).then(resp=>{if(resp.status != 404){hallucinatorbase = true}})

                if(env.hallucinator.slice(0, 7) == "generic") {
                    basis.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/generic.gif`
                    base.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/generic.gif`
                    eyes.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/generic_eyes.gif`
                } else if (hallucinatorbase == true){
                    basis.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/${env.hallucinator}.gif`
                    base.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/${env.hallucinator}.gif`
                    eyes.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/${env.hallucinator}_eyes.gif`                    
                } else {
                    basis.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/generic.gif`
                    base.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/generic.gif`
                    eyes.src = `https://adrfurret.neocities.org/corrumods/img/sprites/combat/foes/hallucinations/generic_eyes.gif`
                }
            }
        }
    };
}
if(typeof env.ACTIONS != "undefined") {
  
env.ACTIONS.special_movefriend_annihilate_proxy = {
        slug: "special_movefriend_annihilate_proxy",
        name: "Annihilation",
        type: 'special+nomimic',
        desc: "'utilize the walls to crush a target'",
        anim: "wobble",
        choiceAnim: "special_choice-movefriend",
        choiceAnimDuration: 200,
        help: "CHOOSE::100% -2HP ::OR:: 50% -2HP 50%C -2HP +1T:STUN",
        usage: {
            act: "THE WALLS GREW HOSTILE AROUND %TARGET",
            crit: "%TARGET BARELY STANDS",
            hit: "%TARGET DID THEIR BEST",
            miss: "%TARGET ESCAPED BY A HAIR"
        },
        accuracy: 1,
        crit: 0,
        noRepeat: true,
        exec: function(user, target) {
            actionMessage(user, "THE WALLS SHIFT AROUND %TARGET", target)
            user.sprite.classList.add('special_choice-movefriend')
            let action = this

            content.classList.add('painprep', 'painhalf')
            setTimeout(()=>{content.classList.add('painmode')}, 100)
            setTimeout(()=>{content.classList.remove('painmode')}, 1000)
            setTimeout(()=>{content.classList.remove('painprep', 'painhalf')}, 3000)

            //summon a div that lets the player click guaranteed or chance
            actionChoice({
                user: user,
                action: action,
                choiceText: `The walls close in around ${target.name}...`,
                options: [
                    {text: "Withstand the attack", definition: "NOTE::'100% -2HP'"},
                    {text: "Try a risky dodge", definition: "NOTE::'50% -2HP 50%C -2HP +1T:STUN'"},
                ],
                choiceCallback: (c) => {
                    //reap the consequences
                    user.sprite.classList.add(action.anim)
                        
                    var hit
                    switch(c) {
                        case "c0":
                            hit = combatHit(target, {amt: 2, acc: 1, crit: 0, origin: user});
                            break;
                        case "c1":
                            hit = combatHit(target, {amt: 2, acc: 0.5, crit: 0.5, origin: user})
                            break
                    }

                    actionMessage(user, action, target, hit)
                    switch(hit) {
                        case "crit":                                
                            playCombatCrit()
                            addStatus({target: target, origin: user, status: "stun", length: 1})
                            removeStatus(target, "windup")
                            break
                        case true:
                            reactDialogue(target, 'receive_hit')
                            play("hit", 0.75)
                            break;
                        case false:
                            reactDialogue(target, 'evade')
                            play("miss", 0.75)
                            break;
                    }

                    setTimeout(()=> user.sprite.classList.remove(action.anim), 600);
                    setTimeout(()=>advanceTurn(user), env.ADVANCE_RATE);
                }
            })
        }
    };
    

env.ACTIONS.special_chant_proxy = {
        slug: "special_chant_proxy",
        name: "â–ˆâ–ˆâ–ˆâ–ˆâ–ˆ",
        type: 'special+summon',
        desc: "'â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆ';'convey malignant thoughtforms via speech'",
        help: "FOES::80% -1HP, 30% x2 +1T:WEAKENED SUMMON::+1 HALLUCINATION (MAX:4)",
        anim: "orbshake",
        accuracy: 0.8,
        crit: 0.3,
        amt: 1,
        usage: {
            act: "%USER â–ˆâ–ˆâ–ˆâ–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆ â–ˆâ–ˆâ–ˆâ–ˆâ–ˆ"
        },
        noRepeat: true,
        exec: function(user, target, beingUsedAsync) {
            let action = this
            
            user.sprite.classList.add('orbshake')
            setTimeout(function(){user.sprite.classList.remove('orbshake')}, 1200);

            env.GENERIC_ACTIONS.teamWave({
                team: user.enemyTeam,
                exec: (actor, i) => {
                    env.GENERIC_ACTIONS.singleTarget({
                        action: action, 
                        user, 
                        target: actor,
                        hitSfx: { name: 'talksignal' },
                        critSfx: { name: 'fear', rate: 0.75 },
                        critStatus: {
                            name: 'weakened',
                            length: 1
                        },
                        critExec: ({target}) => {
                            user.lastSide = !user.lastSide
                            env.hallucinator = target.slug
                            if(user.team.members.filter(m=>m.slug.includes('hallucination')).length < 4) {
                                midCombatEnemyAdd('hallucination_proxy', user.lastSide ? "left" : "right")
                            }
                        }
                    })
                },
                advanceAfterExec: true, beingUsedAsync, user,
            })
        }
    };
}
if(typeof env.COMBAT_FORMATIONS != "undefined") {
env.COMBAT_FORMATIONS['c_collapse_movefoe'] = {
    name: "Movefoe",
    help: "'accompanied by tendrils';'channels groundsmindry techniques to:';'attack';'offer responsive choice';'destabilize thoughtspace'",
    enemies: ["tendrils_proxy", "enemy_movefriend_lowintensity_proxy", "tendrils_proxy"],
    class: "miniboss"
};

env.COMBAT_FORMATIONS['c_golem_translator'] = {
    name: "Translation Core",
    help: "'conjures fear-inflicting foes';'summoned foes are frail'",
    enemies: ["queen", "translation_golem_proxy", "queen"],
    class: "miniboss summonerboss"
};
}

if(typeof env.COMBAT_GROUPS != "undefined") {
  if(!env.COMBAT_GROUPS.collapse.queen.includes("bstrdlight_proxy")) {
  env.COMBAT_GROUPS.collapse.queen.push("bstrdlight_proxy");
  }

  if(!env.COMBAT_GROUPS.collapse.miniboss_formations.includes("c_collapse_movefoe")) {
  env.COMBAT_GROUPS.collapse.miniboss_formations.push("c_collapse_movefoe");
  }
  
  if(!env.COMBAT_GROUPS.golem.miniboss_formations.includes("c_golem_translator")) {
  env.COMBAT_GROUPS.golem.miniboss_formations.push("c_golem_translator");
  }
}
}
})