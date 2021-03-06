//COMMANDS
import CMDR_resetFn from "./pallet-commands/CMDR_resetFn";
import CMD_marginsZero from "./pallet-commands/CMD_marginsZero";
import resetOpenModule from "./pallet-commands/resetOpenModule";
import resetAllModules from "./pallet-commands/resetAllModules";
import marginsZeroOpenModule from "./pallet-commands/marginsZeroOpenModule";
import marginZeroAllModules from "./pallet-commands/marginZeroAllModules";
import resetAllRows from "./pallet-commands/resetAllRows";
import resetText from "./pallet-commands/resetText";
import resetAllColumns from "./pallet-commands/resetAllColumns";
import initChangeAllModulesWithArgs from "./pallet-commands/initChangeAllModulesWithArgs";
import editModuleByType from "./pallet-commands/editModuleByType";
import createArgForm from "./util/createArgForm";

/**
 * function to create a form to add arguments to a function.
 * @param {STRING} inputNameClass class name of the input youll get the input name from
 * @param {STRING} newValueClass class name of the input you put your new value in
 */

function createPalette() {
  const el = document.createElement("div");
  const searchInput = document.createElement("input");
  const executeBtn = document.createElement("BUTTON");
  const datalist = document.createElement("DATALIST");

  el.classList.add("bb_cmdr_palette");
  executeBtn.setAttribute("type", "button");
  searchInput.setAttribute("type", "text");
  searchInput.setAttribute("list", "commands");
  datalist.id = "commands";
  executeBtn.innerText = "Execute";
  const container = document.createElement("form");
  container.classList.add("bb_cmdr_container");

  container.appendChild(searchInput);
  container.appendChild(executeBtn);
  el.appendChild(container);
  el.appendChild(datalist);
  document.body.appendChild(el);
}
function hideCommandsSearch() {
  //hides the command search and execute button
  document
    .querySelector(".bb_cmdr_container")
    .style.setProperty("display", "none");
}

const BBCommander = {
  /**
   * resets the open settings form.
   * to my defaults {empty string or default text}
   * or the first
   * option in a select
   */
  reset_Open_Module: {
    title: "reset Open Modules",
    fn: resetOpenModule,
    description: "the open module settings input put will be set to a default",
    hasArgs: false
  },

  /**
   * resets all modules on a page to empty string or the first
   * option in a select
   */
  reset_All_Modules: {
    title: "Reset All Modules",
    description: "every module settings input put will be set to a default",
    fn: resetAllModules,
    hasArgs: false
  },

  /*
   open modules will have 0 margins 
  */
  margins_Zero_Open_Module: {
    title: "Zero Margin Open Module",
    description: "the open module margins will be set to zero",
    fn: marginsZeroOpenModule,
    hasArgs: false
  },

  /**
   *  All modules will have 0 margins
   */
  marginZeroAllModules: {
    title: "Zero Margin All Modules",
    fn: marginZeroAllModules,
    description: "all modules margins will be set to zero",
    hasArgs: false
  },

  // resetText, //!this dont work */

  resetAllColumns: {
    title: "Reset All Columns",
    fn: resetAllColumns,
    description: "every column settings input put will be set to a default",
    hasArgs: false
  },

  /**
   * resets all rows on a page to empty string or the first
   * option in a select
   */
  resetAllRows: {
    title: "Reset All Rows",
    fn: resetAllRows,
    description: "every rows settings input put will be set to a default",
    hasArgs: false
  },

  /**
   * start of 2 step functions
   * or
   * functions with arguments
   */
  initChangeAllModulesWithArgs: {
    title: "Change All Modules with Custom Args",
    description:
      "give a selector and what value the input you select should have",
    fn: initChangeAllModulesWithArgs,
    hasArgs: true
  },
  editModuleByType: {
    title: "Edit Modules By Module Type",
    description: "only selects the module given in the given modules",
    fn: editModuleByType,
    hasArgsWithType: true
  }
};

function executeCommand(e) {
  e.preventDefault();
  const input = document.querySelector(
    ".bb_cmdr_palette .bb_cmdr_container input"
  );
  const commands = Object.keys(BBCommander);
  const selectedCommand = commands.find(
    cmd => BBCommander[cmd].title === input.value
  );

  if (BBCommander[selectedCommand].hasArgs) {
    hideCommandsSearch();
    createArgForm({
      moduleType: false,
      inputNameClass: "inputName",
      newValueClass: "toValue",
      fnToListenFor: BBCommander[selectedCommand].fn
    });
  } else if (BBCommander[selectedCommand].hasArgsWithType) {
    hideCommandsSearch();
    createArgForm({
      moduleType: true,
      inputNameClass: "inputName",
      newValueClass: "toValue",
      fnToListenFor: BBCommander[selectedCommand].fn
    });
  } else {
    BBCommander[selectedCommand].fn();
    cleanupPalette();
  }
}

const ALL_COMMANDS = Object.keys(BBCommander).map(key => ({
  ...BBCommander[key]
}));

//this should eventually render select list like downshift
function showCommands() {
  const searchStr = this.value;
  const searchedCMDs = ALL_COMMANDS.filter(({ title, description }) => {
    return (
      searchStr === "" ||
      title.toLowerCase().includes(searchStr.toLowerCase()) ||
      description.toLowerCase().includes(searchStr.toLowerCase())
    );
  });

  const list = searchedCMDs
    .map(cmd => {
      const item = `<option value="${cmd.title}" >${cmd.description}</option>`;
      return item;
    })
    .join("");
  const datalist = document.querySelector(".bb_cmdr_palette datalist");
  datalist.innerHTML = list;
}

function removeList() {
  document.querySelector(".bb_cmdr_palette input").value = "";
}

function removeListOnClick(e) {
  if (
    e.target.closest(".bb_cmdr_palette") ||
    e.target.classList.contains(".bb_cmdr_palette")
  ) {
    return;
  }
  //removeList();
}
document.body.setAttribute("data-commanderstate", "closed");

export function cleanupPalette() {
  const palette = document.querySelector(".bb_cmdr_palette");
  if (palette) {
    palette.parentElement.removeChild(palette);
  }
  document.body.setAttribute("data-commanderstate", "closed");
}
function cleanupPaletteOnExit(e) {
  if (e.target.classList.contains("fl-builder-button-primary")) {
    if (
      e.target.dataset.action === "publish" ||
      e.target.dataset.action === "draft" ||
      e.target.dataset.action === "discard"
    ) {
      cleanupPalette();
    }
  }
}

/* 
this is the parent function that calls everything
*/
(function() {
  function openCommandPalette() {
    if (document.body.dataset.commanderstate === "closed") {
      createPalette();
      document.body.dataset.commanderstate = "open";
      const executeBtn = document.querySelector(
        ".bb_cmdr_palette .bb_cmdr_container button"
      );
      const input = document.querySelector(
        ".bb_cmdr_palette .bb_cmdr_container input"
      );
      const form = document.querySelector(
        ".bb_cmdr_palette .bb_cmdr_container"
      );

      input.addEventListener("focus", showCommands);
      input.addEventListener("input", showCommands);
      form.addEventListener("submit", executeCommand);

      executeBtn.addEventListener("click", executeCommand);
    } else {
      const palette = document.querySelector(".bb_cmdr_palette");
      if (palette) {
        palette.parentElement.removeChild(palette);
        document.body.dataset.commanderstate = "closed";
      }
    }
  }
  //this allows beaverbuilder to use the function
  function startCommander() {
    // Register a hook listener using the key that you registered
    // your shortcut with along with the function it should fire.
    FLBuilder.addHook("openCommandPalette", openCommandPalette);
  }
  window.addEventListener("load", startCommander);
  window.addEventListener("click", e => cleanupPaletteOnExit(e));
})();
