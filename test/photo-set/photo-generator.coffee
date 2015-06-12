child_process = require('child_process')
numeral       = require('numeral')
fs            = require('fs')

numeral.language 'fr',
    delimiters:
        thousands : ' '
        decimal   : ','
    abbreviations:
        thousand: 'k'
        million: 'm'
        billion: 'b'
        trillion: 't'
    currency:
        symbol: '€'

numeral.language('fr');

MONTHS = [
            {nPhotos : 3  , month : '201504'},
            {nPhotos : 17 , month : '201503'},
            {nPhotos : 3  , month : '201502'},
            {nPhotos : 17 , month : '201501'},
            {nPhotos : 3  , month : '201412'},
            {nPhotos : 17 , month : '201411'},
            {nPhotos : 3  , month : '201410'},
            {nPhotos : 17 , month : '201409'},
            {nPhotos : 3  , month : '201408'},
            {nPhotos : 17 , month : '201407'},
            {nPhotos : 3  , month : '201406'},
            {nPhotos : 17 , month : '201405'},
            {nPhotos : 3  , month : '201404'},
            {nPhotos : 17 , month : '201403'},
            {nPhotos : 3  , month : '201402'},
            {nPhotos : 17 , month : '201401'},
            {nPhotos : 3  , month : '201312'},
            {nPhotos : 17 , month : '201311'},
            {nPhotos : 3  , month : '201310'},
            {nPhotos : 17 , month : '201309'},
            {nPhotos : 3  , month : '201308'},
            {nPhotos : 17 , month : '201307'},
            {nPhotos : 3  , month : '201306'},
            {nPhotos : 17 , month : '201305'},
            {nPhotos : 3  , month : '201304'},
            {nPhotos : 17 , month : '201303'},
            {nPhotos : 3  , month : '201302'},
            {nPhotos : 17 , month : '201301'},
            {nPhotos : 3  , month : '201212'},
            {nPhotos : 17 , month : '201211'},
            {nPhotos : 3  , month : '201210'},
            {nPhotos : 17 , month : '201209'},
            {nPhotos : 3  , month : '201208'},
            {nPhotos : 17 , month : '201207'},
            {nPhotos : 3  , month : '201206'},
            {nPhotos : 17 , month : '201205'},
            {nPhotos : 3  , month : '201204'},
            {nPhotos : 17 , month : '201203'},
            {nPhotos : 3  , month : '201202'},
            {nPhotos : 17 , month : '201201'},
            {nPhotos : 3  , month : '201112'},
            {nPhotos : 17 , month : '201111'},
            {nPhotos : 3  , month : '201110'},
            {nPhotos : 17 , month : '201109'},
            {nPhotos : 3  , month : '201108'},
            {nPhotos : 17 , month : '201107'},
            {nPhotos : 3  , month : '201106'},
            {nPhotos : 17 , month : '201105'},
            {nPhotos : 3  , month : '201104'},
            {nPhotos : 17 , month : '201103'},
            {nPhotos : 3  , month : '201102'},
            {nPhotos : 17 , month : '201101'},
            {nPhotos : 3  , month : '201012'},
            {nPhotos : 17 , month : '201011'},
            {nPhotos : 3  , month : '201010'},
            {nPhotos : 17 , month : '201009'},
            {nPhotos : 3  , month : '201008'},
            {nPhotos : 17 , month : '201007'},
            {nPhotos : 3  , month : '201006'},
            {nPhotos : 17 , month : '201005'},
            {nPhotos : 3  , month : '201004'},
            {nPhotos : 17 , month : '201003'},
            {nPhotos : 3  , month : '201002'},
            {nPhotos : 17 , month : '201001'},
            {nPhotos : 3  , month : '200912'},
            {nPhotos : 17 , month : '200911'},
            {nPhotos : 3  , month : '200910'},
            {nPhotos : 17 , month : '200909'},
            {nPhotos : 3  , month : '200908'},
            {nPhotos : 17 , month : '200907'},
            {nPhotos : 3  , month : '200906'},
            {nPhotos : 17 , month : '200905'},
            {nPhotos : 3  , month : '200904'},
            {nPhotos : 17 , month : '200903'},
            {nPhotos : 3  , month : '200902'},
            {nPhotos : 17 , month : '200901'},
            {nPhotos : 3  , month : '200812'},
            {nPhotos : 17 , month : '200811'},
            {nPhotos : 3  , month : '200810'},
            {nPhotos : 17 , month : '200809'},
            {nPhotos : 3  , month : '200808'},
            {nPhotos : 17 , month : '200807'},
            {nPhotos : 3  , month : '200806'},
            {nPhotos : 17 , month : '200805'},
            {nPhotos : 3  , month : '200804'},
            {nPhotos : 17 , month : '200803'},
            {nPhotos : 3  , month : '200802'},
            {nPhotos : 17 , month : '200801'},
            {nPhotos : 3  , month : '200712'},
            {nPhotos : 17 , month : '200711'},
            {nPhotos : 3  , month : '200710'},
            {nPhotos : 17 , month : '200709'},
            {nPhotos : 3  , month : '200708'},
            {nPhotos : 17 , month : '200707'},
            {nPhotos : 3  , month : '200706'},
            {nPhotos : 17 , month : '200705'},
            {nPhotos : 3  , month : '200704'},
            {nPhotos : 17 , month : '200703'},
            {nPhotos : 3  , month : '200702'},
            {nPhotos : 17 , month : '200701'}
        ]

spawn = require('child_process').spawn

startRk = 0

# child_process.execSync("mkdir photo")
for month, monthRk in MONTHS
    console.log  "mkdir photo/#{month.month}"
    child_process.execSync("mkdir photo/#{month.month}")
    yearString  = month.month.slice(0,4)
    monthString = month.month.slice(-2)
    monthLabel  = yearString + '-' + monthString
    lastDayOfMonth = new Date(yearString, monthString - 1,28).getTime()

    for localRk in [0..month.nPhotos-1] by 1
        file = "photo/#{month.month}/photo-#{month.month}-#{localRk}.gif"
        cmd  = "convert -size 300x300 -background lightblue -fill blue -pointsize 40 "
        cmd += "label:'"
        cmd += "rk: \n"
        cmd += "local rk:\n"
        cmd += "month rk:\n"
        cmd += "month:\n"
        cmd += "' "
        cmd += "-background none -gravity northeast label:'"
        cmd += "#{numeral(startRk+localRk).format('0,0')}\n"
        cmd += "#{numeral(localRk).format('0,0')}\n"
        cmd += "#{monthRk}\n"
        cmd += "#{yearString}-#{monthString}"
        cmd += "' -flatten #{file}"
        child_process.execSync(cmd)
        date = new Date(lastDayOfMonth-localRk*60000)
        fs.utimes(file,date,date)

    startRk += localRk

# convert -size 320x100 -background lightblue -fill blue -pointsize 18 label:'rk: 12365\nlocal rk:123\n2014-11' label.gif