const _ = require("lodash")

const transform_to_html_table = require( "./transform_module_exp" )

;( async () => {

	_.mixin({server,transform_to_html_table,updateFlow})

	let short  = n => x => x.length > n ? x.slice(0,n) + "..." : x
	let a_span = x => `<span title="${x}">${short(63)(x)}</span>`
	let a_url  = x => `<a href="${x}">${short(63)(x)}</a>`

	// i use the Brave Browser, not Google Chrome ( but Brave is Chromium base, the path is similar )

	let USERNAME = require( "os" ).userInfo().username

	// close the browser or make a copy of the sqlite history, the file cloud be locked if the browser is open

	let sqlite_history_path = `C:/Users/${USERNAME}/AppData/Local/BraveSoftware/Brave-Browser/User Data/Default/History`

	let sqlite_history = await search( sqlite_history_path )

	_( sqlite_history )
	.sort( (a,b) => a.time - b.time )
	.slice(-150)
	.updateFlow( ["title","url","time"], [ [hexEncode,a_span],[a_url],[convert_timestamps]] )
	.transform_to_html_table()
	.server("html")
	.valueOf()

})()

function updateFlow(x,ai,af){

	// ai : tableau des clés a modifier

	// af : tableau de functions qui vont s'exécuter pour la clé dont l'index est le même que la fonction

	/* exemple :

		"title" => [hexEncode,a_span]
	
		"url"   => [a_url]

		"title" => [convert_timestamps]

	*/

	return _.each( x, y => { for( let k of Object.keys(ai) ) _.update( y, ai[k], _.flow(af[k]) ) } )


	// _.each est équivalent a "forEach" en javascript


	// _.update : modifie la valeur d'un objet ( _.update( object, path or key , updater/function ) )

	// ! This method mutates the object

	// https://lodash.com/docs/4.17.15#update


	// _.flow : fusionne plusieurs fonctions en une seul

	// https://lodash.com/docs/4.17.15#flow

}

async function search(filepath){

	const sqlite  = require("sqlite")
	const sqlite3 = require("sqlite3")

	let table = []

	let db = await sqlite.open({filename:filepath,
	driver:sqlite3.Database
	})

	let rows = await db.all("SELECT * FROM urls") // firefox : places.sqlite ( SELECT * FROM moz_places )

	let max = rows.length

	for ( let x of rows ){

		if ( x.last_visit_time != 0 && x.hidden != 1 )
		table.push({
		"title"  : x.title,
		"url"    : x.url,
		"time"   : x.last_visit_time,
		"origin" : filepath,
		})

	}

	return table

}

function server(x,n){

	const http = require( "http" )
	const PORT = 8080

	http.createServer(function (req, res){

		res.writeHead(200,{"content-type":`text/${n};charset=utf8`})

		res.end(x)

	}).listen(PORT)

	console.log(`Running at port ${PORT}`)

}

function convert_timestamps(x){

	const dayjs = require("dayjs")
	require("dayjs/locale/fr")
	dayjs.locale( "fr" )
	return dayjs( Math.trunc( x/1000 + Date.UTC(1601,0,1) ) ).format("dddd DD MMMM YYYY HH:mm:ss")

}

function hexEncode(x){
	return Buffer.from(x,"utf8").toString("hex")
}

function hexDecode(x){
	return Buffer.from(x,"hex").toString("utf8")
}
