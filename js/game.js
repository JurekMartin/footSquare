var source   = document.getElementById("entry-template").innerHTML;
var template = Handlebars.compile(source);

const context = {
    pokus: "ABC",
    xxx: "XYZ",
    lala: false
}

let html = template(context);

document.getElementById("abc").innerHTML = html;

context.xxx = "AAAA!";
html = template(context);
document.getElementById("abc").innerHTML = html;

context.lala = true;