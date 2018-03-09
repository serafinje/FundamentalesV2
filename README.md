# Evolución y comparación de series de datos (fundamentales)

Una pequeña aplicación web para mostrar gráficas de evolución de datos de empresas, y para así poder ver al mismo tiempo varios datos de una empresa, o de diferentes empresas.<br>
<br>
Puedes probarla en [mi versión online](http://serafinje.ddns.net/fundamentalesv2/fundamentales.html).<br>
<br>
Los datos los saca de una Hoja de cálculo de Google.<br>
En el futuro pretendo que la hoja a usar sea parametrizable, pero por ahora uso la mía: https://docs.google.com/spreadsheets/d/1aqUcciExhpOpFWxUM3KlJmJvHbHoFecwWL4IpzBNVNU/edit?usp=sharing
<br>
La consulta no se hace directamente a esta hoja. El script actualiza_hoja.sh debe ejecutarse en el servidor para que se descargue todas las pestañas, una en cada fichero hoja<N>.json.<br>
Después la página web irá leyendo todos los json.<br>
<br>
De todas formas, está comentada en <datos.js> una linea que lee directamente de la hoja:
'''javascript
    $.get(SPREADSHEETS_CELLS+idHoja+"/"+numPestanya+SPREADSHEETS_JSON, ....
'''
en lugar de lo que uso ahora:
'''javascript
    $.get("json/hoja"+numPestanya+".json", ....
'''
<br>
- En proyecto: Campo para introducir otra hoja.
- En proyecto: Botón para invocar al script que descarga las pestañas a JSON.
