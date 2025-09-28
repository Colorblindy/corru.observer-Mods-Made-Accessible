document.addEventListener('corru_resources_added', (ev)=>{
const arrayOfStringURLsLoaded = ev.detail.resList
if (arrayOfStringURLsLoaded.includes("/js/beneath_embassy.js")){
    if (typeof CrittaReward != "undefined") {
        if (typeof CrittaReward.REWARDTYPES.component.canDecline == "undefined") {
            CrittaReward.REWARDTYPES.component.canDecline = true;
        }
        if (typeof CrittaReward.REWARDTYPES.item.canDecline == "undefined") {
            CrittaReward.REWARDTYPES.item.canDecline = true;
        }
        if (typeof CrittaReward.REWARDTYPES.fish.canDecline == "undefined") {
            CrittaReward.REWARDTYPES.fish.canDecline = true;
        }
        
        CrittaReward.prototype.closeout = function() {
            if (!this.classList.contains("confirmed")) {
              if(typeof this.type.closeout != "undefined") {
                this.type.closeout(
                    this,
                    this.type.actorSelection ? page.party.find(member=>member.slug == this.selections.actor.value) : false
                )
              }
            }
            this.classList.add("pre-show", "fading")
            if (this.completeCallback) this.completeCallback();
            setTimeout(() => {
                this.remove()
            }, 2000)
        }

        CrittaReward.REWARDTYPES.component.closeout = function (thisReward) {
            addItem("sfer_cube",1);
            readoutAdd({message: `NOTICE::'refunded for 1 sfer cube'`, name:"sys"});
        }

        CrittaReward.REWARDTYPES.fish.closeout = function (thisReward) {
            addItem("sfer_cube",2);
            readoutAdd({message: `NOTICE::'refunded for 2 sfer cubes'`, name:"sys"});
        }

        CrittaReward.REWARDTYPES.item.closeout = function (thisReward) {
            addItem("sfer_cube",5);
            readoutAdd({message: `NOTICE::'refunded for 5 sfer cubes'`, name:"sys"});
        }

   //   for (var reward in CrittaReward.REWARDTYPES){
   //    if (typeof CrittaReward.REWARDTYPES[reward].closeout == "undefined") {
   //      CrittaReward.REWARDTYPES[reward].closeout = function (thisReward) {}
   //      CrittaReward.REWARDTYPES[reward].NoCloseout = true; // this sucks actually: previously "modders take note ! use this to check if u can safely override this"
   //     }
   //  }
    }
}
});