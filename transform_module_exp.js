// version : 07/03/2024 ( 2143 octets )

if (typeof exports !== "undefined") {
		if (typeof module !== "undefined" && module.exports) {
		module.exports = bar
		}
		exports._ = bar
} else {
	globalThis["transform"] = bar
}

function bar(x,params){

	let opt = { index:true, title:true, style:true, keys:true } // title keys

	if( params ) Object.assign( opt, params )

	return foo(x)

	function foo(m){

	// text-align:left;
	// let content = "<style>table{font-family:sans-serif;border-collapse:collapse;}td,th{border:1px solid #dddddd;padding:8px;white-space:nowrap;}</style><table>"

	let style = "<style>table{font-family:sans-serif;border-collapse:collapse;}td,th{border:1px solid #dddddd;padding:8px;white-space:nowrap;}</style>"

	let content = "<table>"

	if( opt.style )
	content = style + content
	
	if( opt.style === 1 ){
	console.log("opt.style === 1")
	return style
	}

	if( m.length === 0 ){
	console.log("m.length === 0...")
	return ""
	}

	m = ( Object.prototype.toString.call(m) === "[object Object]" ) ? Object.values(m) : m

	let every_obj = m.every( x => Object.prototype.toString.call(x) === "[object Object]" )
	let every_arr = m.every( x => Object.prototype.toString.call(x) === "[object Array]" )

	if( ( every_obj || every_arr ) && ( opt.title && opt.keys ) ) {

		let index = m.reduce( (o,x,i,arr) => {
			let len = Object.keys(x).length

			if( i === arr.length-1 ){
				return o[1]
			}

			return len > o[0] ? [len,i] : o

		},[0,0])

		content += [ ( x => x ? "<th></th>" : "" )(opt.index), ...Object.keys(m[index]).map(x=>`<th>${x}</th>`) ].join( new String )
	}

	for ( let [i,x] of m.entries() ){
		content += `<tr>`
		if(opt.index) content += `<td style="text-align:center">${i+1}</td>`
			if( Object.prototype.toString.call(x) === "[object Object]" )
				for ( let v of Object.values(x) ){
					content += `<td>${v}</td>`
				}
			else if( Object.prototype.toString.call(x) === "[object Array]" )
				for ( let v of x ){
					content += `<td>${v}</td>`
				}
			else
				content += `<td>${x}</td>`
		content += "</tr>"
	}
	content += "</table>"

	return content

	}

}