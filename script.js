// PARAMETERS

PROBA_PROPAGATION = 0.3
PROBA_EXTINCTION_BINOMIAL = [3, 1]
PROBA_REGENERATION_HYPER = [5, 1]

SPEED = 0.2

PRINT_CLEAR = " "
PRINT_ON_FIRE = "x"
PRINT_OUT_FIRE = "."

IMAGE_BURNER_CONTRAST_THRESHOLD = 0.3



// TECHNICAL CONSTANTS

CASE_WIDTH = 10
CASE_HEIGHT = 10

ON_FIRE = 1
CASE_OUT_FIRE = 2
CLEAR = 0
CASE_BLOCK = 3

PRINT_MODE_SQUARE = false






var canvas = document.getElementById("main");
document.addEventListener("keydown", doKeyDown, false);
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;


function doKeyDown(e) {
    if (e.keyCode == 72) { // "h" key
        var params_div = document.getElementById("params")
        if (params_div.style.display == "block") {
            params_div.style.display = "none"
        }
        else {
            params_div.style.display = "block"
        }
    }
    else if (e.keyCode == 71) { // "g" key


        init_with_image()
    }
}

function create_tab(n, m) {
    var tab = []
    for (var i = 0; i < n; i++) {
        tab.push([])
        for (var j = 0; j < m; j++) {
            tab[i].push({})
            tab[i][j].type = CLEAR
        }
    }
    return tab
}

function copy_tab_into(tab1, tab2) {
    for (var i = 0; i < tab1.length; i++) {
        for (var j = 0; j < tab1[i].length; j++) {
            tab2[i][j] = { type: CLEAR, time: 1 }
            tab2[i][j].type = tab1[i][j].type
            tab2[i][j].time = tab1[i][j].time
        }
    }
}

function there_is_fire(t) {
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j].type == ON_FIRE)
                return True
        }
    }
    return False
}

function choisir_feu() {
    var liste = []
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j].type == ON_FIRE)
                liste.push([i, j])
        }
    }
    var r = Math.floor(Math.random() * liste.length)
    return liste[r]
}

function get_random_binomial(n, p) {
    var r = 0
    for (var k = 0; k < n; k++) {
        if (Math.random() < p) {
            r++
        }
    }
    return r
}

function put_out_fire(i, j) {
    t[i][j].type = CASE_OUT_FIRE
    t[i][j].time = get_random_binomial(PROBA_REGENERATION_HYPER[0], PROBA_REGENERATION_HYPER[1])
}

function put_clear(i, j) {
    t[i][j].type = CLEAR
}

function put_fire(tab, i, j) {
    tab[i][j].type = ON_FIRE
    tab[i][j].time = get_random_binomial(PROBA_EXTINCTION_BINOMIAL[0], PROBA_EXTINCTION_BINOMIAL[1])
}




function update_life(t) {
    var feu_a_garder = choisir_feu()
    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j].type == CASE_OUT_FIRE) {
                t[i][j].time--
                if (t[i][j].time < 0) {
                    put_clear(i, j);
                }
            }
            else if (t[i][j].type == ON_FIRE) {
                if (!(feu_a_garder[0] == i && feu_a_garder[1] == j)) {
                    t[i][j].time--;
                    if (t[i][j].time < 0) {
                        put_out_fire(i, j);
                    }
                }
            }
        }
    }
}


function print_tab(t) {
    ctx.beginPath()
    ctx.fillStyle = "black"
    ctx.rect(0, 0, window.innerWidth, window.innerHeight);
    ctx.fill();

    ctx.font = "20px Arial";
    ctx.fillStyle = "white";

    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j].type == CLEAR) {
                ctx.fillText(PRINT_CLEAR, i * CASE_WIDTH, j * CASE_HEIGHT)

                if (PRINT_MODE_SQUARE) {
                    ctx.beginPath()
                    ctx.fillStyle = "black"
                    ctx.rect(i * CASE_WIDTH, j * CASE_HEIGHT, CASE_WIDTH, CASE_HEIGHT);
                    ctx.fill();
                }

            }
            else if (t[i][j].type == CASE_OUT_FIRE) {
                ctx.fillText(PRINT_OUT_FIRE, i * CASE_WIDTH, j * CASE_HEIGHT)

                if (PRINT_MODE_SQUARE) {
                    ctx.beginPath()
                    ctx.fillStyle = "gray"
                    ctx.rect(i * CASE_WIDTH, j * CASE_HEIGHT, CASE_WIDTH, CASE_HEIGHT);
                    ctx.fill();
                }

            }
            else if (t[i][j].type == ON_FIRE) {
                ctx.fillText(PRINT_ON_FIRE, i * CASE_WIDTH, j * CASE_HEIGHT)

                if (PRINT_MODE_SQUARE) {
                    ctx.beginPath()
                    ctx.fillStyle = "red"
                    ctx.rect(i * CASE_WIDTH, j * CASE_HEIGHT, CASE_WIDTH, CASE_HEIGHT);
                    ctx.fill();
                }

            }
        }
    }
}

function propagate(t, p) {
    var v = create_tab(t.length, t[0].length)
    copy_tab_into(t, v)

    for (var i = 0; i < t.length; i++) {
        for (var j = 0; j < t[i].length; j++) {
            if (t[i][j].type == ON_FIRE) {
                if (Math.random() < p && i - 1 >= 0 && v[i - 1][j].type == CLEAR) {
                    put_fire(v, i - 1, j)
                }
                if (Math.random() < p && j - 1 >= 0 && v[i][j - 1].type == CLEAR) {
                    put_fire(v, i, j - 1)
                }
                if (Math.random() < p && i + 1 < t.length && v[i + 1][j].type == CLEAR) {
                    put_fire(v, i + 1, j)
                }
                if (Math.random() < p && j + 1 < t[i].length && v[i][j + 1].type == CLEAR) {
                    put_fire(v, i, j + 1)
                }
            }
        }
    }
    copy_tab_into(v, t)
}

function console_tab(tab) {
    console.log("---")
    var s = ""
    for (var j = 0; j < tab[0].length; j++) {
        for (var i = 0; i < tab.length; i++) {
            s += tab[i][j].type + " "
        }
        s += "\n"
    }
    console.log(s)
}

function main_function() {
    propagate(t, PROBA_PROPAGATION);
    update_life(t)
    requestAnimationFrame(function () { print_tab(t) })
}



function init_random(tab, n, m) {
    var rn = Math.floor(Math.random() * n)
    var rm = Math.floor(Math.random() * m)
    put_fire(tab, rn, rm)
}


function fire(n, m) {
    n = Math.floor(n)
    m = Math.floor(m)
    t = create_tab(n, m)
    //init_with_image()
    init_random(t, n, m)
    requestAnimationFrame(function () { print_tab(t) })


    main_interval = setInterval(function () {
        main_function()
    }, SPEED * 1000)
}


fire(window.innerWidth / CASE_WIDTH, window.innerHeight / CASE_HEIGHT)


function set_span_params() {
    document.getElementById("param_proba_propagation_span").innerHTML = PROBA_PROPAGATION
    document.getElementById("param_proba_propagation").value = PROBA_PROPAGATION
    document.getElementById("param_proba_regeneration_n_span").innerHTML = PROBA_REGENERATION_HYPER[0]
    document.getElementById("param_proba_regeneration_n").value = PROBA_REGENERATION_HYPER[0]
    document.getElementById("param_proba_regeneration_p_span").innerHTML = PROBA_REGENERATION_HYPER[1]
    document.getElementById("param_proba_regeneration_p").value = PROBA_REGENERATION_HYPER[1]
    document.getElementById("param_proba_extinction_n_span").innerHTML = PROBA_EXTINCTION_BINOMIAL[0]
    document.getElementById("param_proba_extinction_n").value = PROBA_EXTINCTION_BINOMIAL[0]
    document.getElementById("param_proba_extinction_p_span").innerHTML = PROBA_EXTINCTION_BINOMIAL[1]
    document.getElementById("param_proba_extinction_p").value = PROBA_EXTINCTION_BINOMIAL[1]
    document.getElementById("param_speed_span").innerHTML = (1 - SPEED)
    document.getElementById("param_speed").value = (1 - SPEED)
    document.getElementById("param_print_clear").value = PRINT_CLEAR
    document.getElementById("param_print_fire").value = PRINT_ON_FIRE
    document.getElementById("param_print_out").value = PRINT_OUT_FIRE
    document.getElementById("param_ib_threshold").value = IMAGE_BURNER_CONTRAST_THRESHOLD
}

set_span_params()

function change_param(param_name, value) {
    if (param_name == "param_print_fire") {
        PRINT_ON_FIRE = value
    }
    if (param_name == "param_print_out") {
        PRINT_OUT_FIRE = value
    }
    if (param_name == "param_print_clear") {
        PRINT_CLEAR = value
    }
    if (param_name == "param_proba_extinction_n") {
        PROBA_EXTINCTION_BINOMIAL[0] = value
        document.getElementById(param_name + "_span").innerHTML = value
    }
    if (param_name == "param_proba_extinction_p") {
        PROBA_EXTINCTION_BINOMIAL[1] = value
        document.getElementById(param_name + "_span").innerHTML = value
    }
    if (param_name == "param_proba_regeneration_n") {
        PROBA_REGENERATION_HYPER[0] = value
        document.getElementById(param_name + "_span").innerHTML = value
    }
    if (param_name == "param_proba_regeneration_p") {
        PROBA_REGENERATION_HYPER[1] = value
        document.getElementById(param_name + "_span").innerHTML = value
    }
    if (param_name == "param_proba_propagation") {
        PROBA_PROPAGATION = value
        document.getElementById(param_name + "_span").innerHTML = value
    }
    else if (param_name == "param_speed") {
        SPEED = (1 - value)
        document.getElementById(param_name + "_span").innerHTML = value
        clearInterval(main_interval)
        main_interval = setInterval(function () {
            main_function()
        }, SPEED * 1000)
    }
    if (param_name == "param_ib_threshold") {
        IMAGE_BURNER_CONTRAST_THRESHOLD = value
    }
}




// -------------------
//  IMAGE LOAD 

document.getElementById('myFile').onchange = function (evt) {
    var tgt = evt.target
    var files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => init_with_image(fr);
        fr.readAsDataURL(files[0]);
    }
}




function init_with_image(fileReader) {
    // var n = Math.floor(window.innerWidth / CASE_WIDTH);
    // var m = Math.floor(window.innerHeight / CASE_HEIGHT);
    var n = t.length;
    var m = t[0].length;

    var img = new Image();
    img.src = fileReader.result;
    var icanvas = document.createElement('canvas');
    var ictx = icanvas.getContext('2d');

    img.onload = function () {
        console.log("image loader")
        ictx.canvas.width = img.width;
        ictx.canvas.height = img.height;
        ictx.drawImage(img, 0, 0);

        for (var i = 0; i < n; i++) {
            for (var j = 0; j < m; j++) {
                put_out_fire(i, j);
            }
        }

        var mimg = m;
        var m0 = 0;
        var nimg = n;
        var n0 = 0;

        if (n / m >= img.width / img.height) {
            nimg = Math.floor((m * img.width) / img.height)
            n0 = Math.floor((n - nimg) / 2)
        }
        else {
            mimg = Math.floor((n * img.height) / img.width)
            m0 = Math.floor((m - mimg) / 2)
        }

        for (var i = 0; i < nimg; i++) {
            for (var j = 0; j < mimg; j++) {
                var x = Math.floor(i * img.width / nimg);
                var y = Math.floor(j * img.height / mimg);
                var pixel = ictx.getImageData(x, y, 1, 1);
                var data = pixel.data;

                var avg = (data[0] + data[1] + data[2]) / 3
                var xi = i + n0
                var xj = j + m0
                if (avg < 255 * IMAGE_BURNER_CONTRAST_THRESHOLD) {
                    put_clear(xi, xj);
                    if (Math.random() < 0.01) {
                        put_fire(t, xi, xj);
                    }
                }
                else {
                    put_out_fire(xi, xj);
                }
            }
        }
    }
}