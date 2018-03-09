# Evolución y comparación de series de datos (fundamentales)

Una pequeña aplicación web para mostrar gráficas de evolución de datos de empresas, y para así poder ver al mismo tiempo varios datos de una empresa, o de diferentes empresas.<br>
<br>
Puedes probarla en [mi versión online](https://serafinje.github.io/fundamentales.html).<br>
<br>
He intentado que cualquiera pueda modificar y añadir información sobre los datos fundamentales de la empresa, aunque no se tengan conocimientos de programación. Solamente hay que editar un fichero con un editor de textos como el bloc de notas, aunque sería mejor usar un editor que muestre la sintaxis en colores, como Notepad++, PsPad,...  Yo he usado Visual Studio Code para el desarrollo.<br>
<br>
También he intentado que sea fácil añadir nuevos tipos de datos, mediante el desarrollo de nuevas funciones. En este caso ya se hace necesario saber un poco de programación, pero creo que no mucho.<br>
<br>
Quien quiera hacer modificaciones puede descargar los ficheros en un [zip](https://github.com/serafinje/serafinje.github.io/archive/master.zip) y modificar los dos ficheros que explicaré a continuación.<br>
<br>
# Añadir empresas y datos
Para añadir empresas y sus datos vamos a editar el fichero [<b>datos.js</b>](https://github.com/serafinje/serafinje.github.io/blob/master/datos.js) y añadimos dos tipos de información, en las dos secciones que hay:
<br>
1) En la parte de arriba del fichero, sección "1) LISTA DE EMPRESAS", añadimos el comando para crearla.<br>
Creamos la estructura de la empresa llamando a la función creaEmpresa() y pasando el nombre y el sector:<br>
<code>var inditex = creaEmpresa( "Inditex", "Distribución");</code>
2) En la siguiente parte, "2) Datos históricos de las empresas", le asignamos los datos anuales que tengamos.<br>
Añadimos la lista de años (imprescindible) y los datos que tengamos de cada año:<br>
```javascript
inditex.years = [2016, 2015, 2014, 2013, 2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001, 2000];
inditex.NumAcciones = [3116652000, 3116652000, 3116652000, 3116652000, 3116652000, 3116652000, 3116652000, 3116652000, 3116652000,	 3116652000, 3116652000, 3116652000, 3116652000, 3116652000, 3116652000, 3116652000];
inditex.dpa = [0.6800, 0.6000, 0.5200, 0.4840, 0.4400, 0.3600, 0.3200, 0.2400, 0.2100, 0.2100, 0.1680, 0.1340, 0.0960, 0.0700, 0.0280, 0.0220];
```
3) Finalmente invocamos la función que organiza la información en un objeto manejable por el programa:
```javascript
inicializa(inditex);
```
<br>
Y así el resto de información. No hace falta añadir todos los datos. Los datos que no se tengan no se dibujarán.<br>
Reglas importantes:
- Los puntos de miles y millones no se ponen.
- Los decimales se indican con un punto, no una coma.
- La coma es el separador de datos.
- Los datos todos van en unidades (euros, dólares, libras,...). Para poner algo en millones, se puede usar "E6" para indicar que el número lleva 6 ceros detrás, por ejemplo: 42E6 = 42000000,  42.34E6 = 42340000.  Lo mismo se podría hacer para miles de millones (E9), por ejemplo.


# Añadir nuevas funciones
Si queremos añadir nueva información para mostrar, <i>por ejemplo la cantidad total de dividendo</i>, tenemos que hacer una función para devolver el dato. Esto lo haremos en el fichero [<b>fundamentales.js</b>](https://github.com/serafinje/serafinje.github.io/blob/master/fundamentales.js), en dos secciones:
1) Arriba del todo, apartado "1) LISTA DE DATOS QUE DEBEMOS TENER DISPONIBLES", añadimos el nombre de la nueva función.<br>
En la lista de funciones añadimos una nueva entrada con el nombre de la función que vamos a crear, la etiqueta que se mostrará, y el eje "Y" donde va:<br>
```javascript
    ,{eje: 3,etiqueta: "Dividendo total"            ,funcion: dividendoTotal  }
```
<br>
El gráfico puede tener varios ejes "Y", de forma cada serie tenga un rango (Y mínima -> Y máxima) diferente, según la magnitud a la que se refiera. Por ejemplo una serie que muestre el DPA de una acción normalmente tendrá valores entre 0 y 10, poco más. En cambio una serie que muestre los activos totales tendrá un rango en los cientos o miles de millones. Por lo tanto estos dos datos no deben ir en el mismo eje, ya que el dato de DPA no se vería. Mi decisión arbitraria ha sido asignar el eje 1 para los porcentajes y ratios, el 2 para magnitudes relacionadas con el valor de la acción (cotización, DPA, BPA,...), y el 3 para datos relacionados con el tamaño de la empresa (ingresos, gastos, número de acciones,...).<br>
En este caso parece que el eje correcto sería el 3.<br><br>

2) En la sección "2) FUNCIONES PARA DEVOLVER DATOS FUNDAMENTALES" programamos la nueva función.<br>
La función recibe como parámetro un objeto con los datos fundamentales de una empresa en un año determinado. Los datos que podemos usar son los que le hemos asignado en <b>datos.js</b>, y en la función inicializa() podemos ver cómo se asignan los datos; y si queremos guardar nueva información, siempre podemos modificar esta función.<br>
```javascript
function dividendoTotal(empresa) {
    if (empresa.DividendoTotal) {
        return empresa.DividendoTotal;
    } else
    if (empresa.DPA && empresa.NumAcciones) {
        return empresa.DPA*empresa.NumAcciones;
    }
    else {
        return null;
    }
}
```

Como se puede ver, se intenta usar un dato "empresa.DividendoTotal" que no existe pero que se podría asignar al objeto, en la función inicializa(), si lo tenemos.

# Dudas y problemas

<b>Estas son las fórmulas que uso:</b><br>
<br>
 * numAcciones = DATO
 * vc_accion = DATO
 *       ¿vc_accion = patrimonioNeto / NumAcciones? En caso de que tuviese patrimonioNeto
 * ingresos = DATO
 * ebitda = DATO
 *       ¿ebitda = ingresos - gastos?
 * ebit = DATO
 * beneficioNeto = DATO
 * dpa = DATO
 * deudaNeta = DATO
 *      deudaNeta = deuda total - efectivo [pero por ahora no veo necesario manejar esos datos]
 * cotizacionMaxima = DATO
 * cotizacionMinima = DATO
 * cashFlowExplotacion = DATO
 * cashFlowFinanciacion = DATO
 * cashFlowInversion = DATO
 * roa = DATO
 *      roa = EBIT / Activo [beneficio respecto a los activos totales (¡pero no tengo Activo!)]
 *
 * ebitda_ventas = ebitda / ingresos
 * ebit_ventas = ebit / ingresos
 * bpa = beneficioNeto / NumAcciones
 * payout = 100 * dpa / bpa
 * deudaNeta_ebitda = deudaNeta / ebitda
 * cashFlowNeto = cashFlowExplotacion + cashFlowFinanciacion + cashFlowInversion     (cashFlowInversion en su valor negativo, no pasado a positivo)
 * cotizacionMedia = (cotizacionMaxima + cotizacionMinima)/2
 * perMaximo = cotizacionMaxima / bpa
 * perMinimo = cotizacionMinima / bpa
 * perMedio = cotizacionmedia / bpa
 * rpdMaxima = (100*dpa)/cotizacionMaxima
 * rpdMedia = (100*dpa)/cotizacionMedia
 * rpdMinima = (100*dpa)/cotizacionMinima
 * patrimonioNeto = VC_Accion * NumAcciones  [preferiría usar Activo-Pasivo pero no los tengo]
 * activo = ebit / roa
 * pasivo = activo - patrimonioNeto
 * gastos = ingresos - ebitda
 * capitalizacionMedia = cotizacionMedia * NumAcciones
 * deudaNeta_cfe = deudaNeta / cashFlowExplotacion
 * roe = beneficioNeto / patrimonioNeto
  
 <b>ME FALTAN:</b>
 * ROCE
 * CFE-CFI-PID (???)
 * EV / EBITDA medio
 
 ¿Están bien? ¿Qué datos debería proporcionar y qué datos deberían calcularse?
 Mi objetivo es ante todo sencillez y comodidad, antes que precisión. No quiero bucear en los informes de la empresa para sacar la cantidad exacta de cada concepto, sino que me sirve tener cantidades aproximadas que sirvan para hacerse una imagen apropiada de la evolución, incluso con distorsiones puntuales debidas a extraordinarios.
 
