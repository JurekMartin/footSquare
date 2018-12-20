
const domManager = {
    
    loadIframes() {
        $("#game")
        .attr("src", "templates/game.html")
        .on("load", () => {
            $("#menu").attr("src", "templates/menu.html")
        })
    },

    toggleMenu(element, hideOrShow) {

        const menu = $("#" + element);
        if (hideOrShow !== undefined) {
            return menu.toggle(hideOrShow);
        }
        menu.toggle();
    }

};

export {domManager};