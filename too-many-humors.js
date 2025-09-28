/*

== LITERALLY TOO MANY HUMORS ==
by adenator / mikii

(not to be confused with Zyra's Too Many Humors, which actually adds humors)

*/

content.insertAdjacentHTML('beforeend', `<style>

#palette {
  width: 60%;
  justify-content: safe center;
  border: 1px solid var(--neutral-color);
  flex-shrink: 0;
  min-height: 12.5%;
  right: 25%;
  position: sticky;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-color: #ffff00b5 #000;
}

#palette .component {
  flex-shrink: 0;
  min-width: 3em;
}

critta-menu #cauldron .component.undiscovered {
  min-width: 1.5em;
}

</style>`)

env.adenator_toomanyhumors = true
console.log("LOADED::'literally too many humors'")