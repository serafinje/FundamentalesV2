// 0) Carga de la hoja de cálculo de Google
// https://spreadsheets.google.com/feeds/cells/1aqUcciExhpOpFWxUM3KlJmJvHbHoFecwWL4IpzBNVNU/1/public/values?alt=json
var SPREADSHEETS_CELLS = "https://spreadsheets.google.com/feeds/cells/";
var idHoja = '1aqUcciExhpOpFWxUM3KlJmJvHbHoFecwWL4IpzBNVNU';
var SPREADSHEETS_JSON = "/public/values?alt=json";

var empresas = [];

/**
 * Columna 1 -> Nombre serie
 * Columna 2 -> Eje de la serie
 *                  El eje implica usar una escala,
 *                  El mismo concepto en cada empresa usa el mismo número, para que usen el mismo eje.
 *                  Conceptos de mangnitud parecida deberían usar el mismo número:
 *                  Por ejemplo, todos los porcentajes en un eje, los millones en otro.
 * Columna 3 -> Color de la serie
 * Columna 4 en adelante: Añadir dato a la serie empresa[nombreSerie]
 */
function jsonToEmpresa(empresa,json) {
    var variable="";
    var fin_datos = false;
    var fila_anterior=0;
    var years=[];   // Aquí tendremos la correspondencia columna -> año

    empresa.historico= new Map();
    datos = json.feed.entry;
    for (i=0; i<datos.length && !fin_datos; i++) {
        var celda = datos[i];
        var fila = celda.gs$cell.row-1;
        if (fila==0) {
            variable='years';
        }
        if (fila-fila_anterior>2) {
            fin_datos=true;
        } else {
            fila_anterior=fila;
        }
        var columna = celda.gs$cell.col-1;
        switch (columna) {
            case 0: // Nombre de cada serie
                variable = celda.gs$cell.$t;
                if (variable=="Año" || variable=="Años" || variable=="Year" || variable=="año" || variable=="años" || variable=="year" || variable=="Years") {
                    variable='years';
                } //else variable=codifica(variable);
                break;
            case 1:  // Eje Y de la serie
                if (variable=='Sector') {
                    empresa.sector=celda.gs$cell.$t;
                } else
                if (variable!='years') {
                    if (celda.gs$cell.numericValue)
                        empresa["ejes"][variable] = Math.round(celda.gs$cell.numericValue);
                    else
                        empresa["ejes"][variable] = texto_eje(celda.gs$cell.$t);
                }
                break;
            case 2:  // Color de la serie
                if (variable!='years')
                    empresa["colores"][variable] = celda.gs$cell.$t;
                break;
            default: // A partir de la columna 3, son los datos de la serie
                var valor = celda.gs$cell.numericValue;
                if (!valor) {
                    valor=0;
                }
                if (variable=='years') {
                    valor = Math.round(valor);
                    years[columna] = valor;
                }
                // Los datos que empiezan por "_" están marcados así para que se ignoren.
                if (!variable.startsWith("_")) {
                    var year = years[columna];
                    if (empresa[variable]) {
                        //empresa[variable].push(valor);
                        empresa[variable][columna] = valor;
                    } else {
                        //empresa[variable] = [valor];
                        empresa[variable] = [];
                        empresa[variable][columna] = valor;
                    }
                }
        }
    };

    console.log(empresa);
    inicializa(empresa);
}




function cargaDatosGoogle(json) {
    if ("feed" in json) {
        // El nombre de la empresa es el título de la pestaña.
        // Mejor poner el ticker para evitar caracteres no permitidos en variables: Espacios, puntos,...
        nombreEmpresa=json.feed.title.$t;
        //console.log("Pestaña: "+nombreEmpresa);
        if (!nombreEmpresa.startsWith("_")) {
            console.log("Pestaña: "+nombreEmpresa);
            var e = creaEmpresa(nombreEmpresa,'');
            jsonToEmpresa(e,json);
        }
        return false;
    } else {
        // Aquí parece que no entramos nunca.
        console.log("****************"+json+"*******************");
        return true;
    }
}

function cargaHoja(numPestanya) {
    //$.get(SPREADSHEETS_CELLS+idHoja+"/"+numPestanya+SPREADSHEETS_JSON,
    $.get("json/hoja"+numPestanya+".json", 
        function(json) {
            salir=cargaDatosGoogle(json);
        })
        .success(function() {
            //console.log("Cargada pestaña "+numPestanya);
            if (!salir) {
                cargaHoja(numPestanya+1);
            }
        })
        .error(function(jqXHR, textStatus, errorThrown) {
            salir=true;
            console.log("Fin de carga de pestañas.");
            inicializacion();

            empresa.click();
            dibujar('divGrafica','tooltip')
        });
}



function texto_eje(texto) {
    var ejes = {
        'Porcentajes': 1,
        'Unidades': 2,
        'Millones': 3
    };
    return ejes[texto];
}

/**
 * Define los datos básicos de la empresa.
 */
function creaEmpresa(nombre,sector) {
    var obj = {
        nombreID : codifica(nombre)
        ,nombreTexto  : nombre
        ,sector : sector
        ,ejes: []
        ,colores: []
    }
    empresas[obj.nombreID] = obj;
    return obj;
}

// Aquí la función que genera el histórico a partir de las series
function inicializa(empresa) {
    empresa.historico= new Map();
    var i=0;
    for (i=0; i<empresa.years.length; i++) {
        var year = empresa.years[i];
        empresa.historico[year] = {};
        getSeries(empresa).forEach(function(val, idx, array) {
            //console.log("["+year+"]"+val + " -> " + empresa[val][i]);
            empresa.historico[year][val] = empresa[val][i];
        });
    }
}


function getSeries(empresa) {
    var ret=[];
    Object.getOwnPropertyNames(empresa).forEach(function(val, idx, array) {
        if (val!='years' && empresa[val] instanceof Array) {
            ret.push(val);
        }
    });
    return ret.sort();
}


function codifica(nombre) {
    nombre = nombre.replace(/&/g,'_');
    nombre = nombre.replace(/ /g,'_');
    nombre = nombre.replace(/-/g,'_');
    nombre = nombre.replace(/\./g,'_');
    nombre = nombre.replace(/\?/g,'');
    nombre = nombre.replace(/\//g,'_');
    nombre = nombre.replace(/\(/g,'_');
    nombre = nombre.replace(/\)/g,'_');
    return nombre;
}
