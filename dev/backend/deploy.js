var fs = require('fs'),
	uglifyJS = require('uglify-js'),
	minify = require('html-minifier').minify,
	cleanCSS = require('clean-css'),
	util = require('util'),
	exec = require('child_process').exec;//,
	//Regex = require('regex');

var d3 = fs.readFileSync('d3.v4.min.js', 'utf-8'),
	d3_selection = fs.readFileSync('d3-selection-multi.v0.4.min.js', 'utf-8'),
	uuid = uglifyJS.minify('uuid.js', {mangle: {toplevel:true} }).code,
	pressing_game = uglifyJS.minify('pressing-game.js', {mangle: {toplevel:true} }).code,
	css = new cleanCSS().minify(fs.readFileSync('pressing-game.css', 'utf-8')).styles;

var js =	"<style>" + css + "</style>" +
			//"<script type= text/javascript>" + d3 + "</script>" +
			//"<script type= text/javascript>" + d3_selection + "</script>" +
			//"<script type= text/javascript>" + uuid + "</script>" +
			"<script type= text/javascript>"+ pressing_game + "</script>";

var indexInlined = fs.readFileSync('index.htm', 'utf-8');

var indexMinified = minify(indexInlined, {
		caseSensitive : true,
		collapseWhiteSpace : true
	});

var R = new RegExp('<!--\\s+replace-start\\s+-->(.*)<!--\\s+replace-end\\s+-->'); // /<!--[\s]+replace-start[\s\S]*replace-end[\s]+-->/);

var src = indexMinified.replace('<!--\\s+replace-start\\s+-->(.*)<!--\\s+replace-end\\s+-->', js);
console.log(src);


/*
fs.writeFileSync('../release/index-min.htm', src);

var favicon = fs.readFile('favicon.ico', 'utf-8');
fs.writeFileSync('../release/favicon.ico', favicon);

exec('gzip -9 -c ../release/index-min.htm > ../release/index.htm', function (error, stdout, stderr) {

  if (error !== null) {
    console.log('exec error: ' + error);
  }

});*/
