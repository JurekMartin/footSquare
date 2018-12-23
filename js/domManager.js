
const domManager = {
    
    toggleElementById(element, hideOrShow) {

        const menu = $("#" + element);
        if (hideOrShow !== undefined) {
            return menu.toggle(hideOrShow);
        }
        menu.toggle();
    },

    async loadTemplates() {
        const game = await $.get('../templates/game.html', function (data) {
            var template=Handlebars.compile(data);
            $("#game").html(template());
        }, 'html');
    
        const menu = await $.get('../templates/menu.html', function (data) {
            var template=Handlebars.compile(data);
            $("#menu").html(template());
        }, 'html');
    }

};

export {domManager};