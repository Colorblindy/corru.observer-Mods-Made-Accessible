/*

== JOY!!! HAPPY HAPPY JOY!! AHAHEAHEA ==
    -- LOADER -- (loader code by max (apparently, according to aden)) <--- thank you for da loader >:)

*/

document.addEventListener("corru_resources_added", ()=>{
  if(page.path == "/local/beneath/embassy/") { // 
    body.classList.add("loading") // forces loading state
    if(!env.narra_swarm) {
      addResources(["https://narrativohazard-expunged.neocities.org/codebases/narra_swarm.js"]) //TODO::put the actual link in here later :P
	  env.narra_swarm = true
    } else {
      console.log("ATTENTION::'::/FRAME/ SWARM BOSS is already loaded'")
    }
    body.classList.remove("loading") // removes loading state
  } else {
    env.narra_swarm = false
  }
});