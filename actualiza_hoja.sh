SPREADSHEETS_CELLS="https://spreadsheets.google.com/feeds/cells/";
idHoja='1aqUcciExhpOpFWxUM3KlJmJvHbHoFecwWL4IpzBNVNU';
SPREADSHEETS_JSON="/public/values?alt=json";
numPestanya=0;

if [ "$1" != "" ]
then
  idHoja=$1;
fi

while [ $? == 0 ]
do
  numPestanya=$(($numPestanya+1))
  url=$SPREADSHEETS_CELLS$idHoja"/"$numPestanya$SPREADSHEETS_JSON;
  wget $url -O hoja$numPestanya.json -o log.txt;
done

rm hoja$numPestanya.json;
