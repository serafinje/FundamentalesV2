/**
 * Javascript específico para crear las series de datos que necesita Flot, y pasárselas.
 * - Magnitudes: € / % / M
 * - Probar cookies en servidor
 * - PER 10 años
 */
var series = [];
var seriesDibujar = [];


function inicializacion() {
    // Recorremos la lista de empresas y para cada una generamos todas las series
    var clr=0;
    Object.keys(empresas).sort().forEach(key => {
        var empresa = empresas[key];

        // Añadimos empresa al desplegable y su div correspondiente
        crearDiv(empresa.nombreID,empresa.nombreTexto);

        // Creamos las series a mostrar
       getSeries(empresa).forEach(nombreSerie => {
            var clave = codifica(nombreSerie)+empresa.nombreID;
            var datosSerie = calculaSerie(empresa,nombreSerie,false);
            var ejeSerie = empresa["ejes"][nombreSerie];
            var colorSerie = empresa["colores"][nombreSerie];
            if (!ejeSerie) ejeSerie=1;
            if (!colorSerie) colorSerie=clr;
            if (datosSerie.length>0) {
                addSerie(ejeSerie,empresa.nombreTexto,datosSerie,clave,nombreSerie,colorSerie,false,true);
                var datosSerieVariacion = calculaSerie(empresa,nombreSerie,true);
                addSerie(ejeSerie,empresa.nombreTexto,datosSerieVariacion,clave+"var","Variación "+nombreSerie,colorSerie,false,true);
                creaOpciones(empresa.nombreID,clave,nombreSerie);
            }
            clr++;
       });
    });
}


// Creamos serie y para cada año calculamos el dato
function calculaSerie(empresa,propiedad,esVariacion)
{
    var serie = [];
    if (!esVariacion) {
        for (var year in empresa.historico) {
            // Sacamos el conjunto de datos de cada año
            var datosAnuales = empresa.historico[year];
            if (datosAnuales) {
                // Sacamos el dato que necesitamos de ese año
                var dato = datosAnuales[propiedad];
                if (dato) {
                    // Y añadimos el par a la serie
                    serie.push([year, dato]);
                }
            }
        }
    } else {
        for (var year in empresa.historico) {
            // Sacamos el conjunto de datos de un año y del año anterior
            var datosAnuales = empresa.historico[year];
            var datosPrevios = empresa.historico[year-1];
            if (datosAnuales && datosPrevios) {
                var dato = variacionDato(datosPrevios[propiedad],datosAnuales[propiedad]);
                if (dato) {
                    serie.push([year, dato]);
                }
            }
        }
    }
    return serie;
}



/**
 * Añade una serie a la lista de series para dibujar (variable global "series") y al div proporcionado.
 * @param {Array} series Objeto global que contiene todas las series (checked o not checked)
 */
function addSerie(ejeY,empresa,serie,clave,lbl,clr,mostrarBars,mostrarLines,rellenar)
{
    // Metemos los datos de dibujado (etiqueta/datos/color) de cada serie
    var objSerie = {
        label: empresa+": "+lbl,
        data: serie,
        color: clr,
        bars: { show: false, fill: true },
        lines: { show: true, fill: true },
        yaxis: ejeY
        //points: {show: false }
    }
    series[clave] = objSerie;
}



/**
 * Dibuja el gráfico en un div, y usa otro div como tooltip para mostrar datos de los puntos cuando el ratón pasa sobre ellos (evento plothover).
 * @param {Element} grafico
 * @param {Element} tooltip
 */
function dibujar(grafico,tooltip)
{
    // Definimos diferentes tipos de opciones generales (independientes de la serie)
    var opcionesLineas = {
        points: {show: true }       // Puntos va a mostrar siempre. El resto de tipos (lines, bars, lines.fill, bars.fill) se parametrizan por serie.
    };
    var opcionesRejilla = {
        hoverable: true,
        clickable: true
    };
    var opcionesEjeY = {
        tickFormatter: formatoNumeros       // Funcion que formatea las cifras para que se vean mejor
    };
    var opcionesEjeX = {
        minTickSize: 1,
        tickDecimals: 0
    };

    // Juntamos todas las opciones y dibujamos las series con ellas
    var opcionesGenerales = {
        series: opcionesLineas
        ,grid: opcionesRejilla
        ,yaxis: opcionesEjeY
        ,xaxis: opcionesEjeX
    }
    var plot = $.plot("#"+grafico, seriesDibujar, opcionesGenerales);

    // Enganchamos evento al grafico, para controlar respuestas a acciones de ratón
    $("#"+grafico).bind("plothover", function (event, pos, item) {
        if (item) { // Para evitar que se dibujen valores nulos. Pendiente de pulir, por lo que veo.
            var x = item.datapoint[0].toFixed();
            var	y = formatoNumeros(item.datapoint[1]);  // Formateamos el dato del tooltip igual que en el eje (tickFormatter).

            var texto = x+": "+y;
            $("#"+tooltip).html(texto)
                .css({top: item.pageY+5, left: item.pageX+5})
                //.fadeIn(200);
                .show();
        } else {
            $("#"+tooltip).hide();
        }
    });
}


/**
 * Formatea para que las cifras sean más manejables.
 * @param {Number} numero
 * @param {*} axis
 */
function formatoNumeros(numero,axis) {
    if (numero>1.00E6 || numero<-1.00E6) {
        numero = (numero/1.00E6).toFixed(2)+"M";
    } else {
        numero = numero.toFixed(2);
    }
    return numero;
}




/**
 * Función para calcular la variación de cualquier dato.
 * @param {Function} funcion
 * @param {Object} empresa
 * @param {Number} year
 *
/**/

function variacionDato(datoAnterior,datoActual) {
    if (datoActual && datoAnterior) {
        return 100*(datoActual-datoAnterior)/datoAnterior;
    } else {
        return 0;
    }
}
