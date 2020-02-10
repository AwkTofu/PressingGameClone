#!/usr/bin/env ruby

# Run from the local directory.

d3 = File.read("../d3.v4.min.js")
d3_selection = File.read("../d3-selection-multi.v0.4.min.js")
uuid = `uglifyjs -c -m sort,toplevel -- ../uuid.js`
pressing_game = `uglifyjs -c -m sort,toplevel -- ../pressing-game.js`

`cleancss -o ../../release/pressing-game.css ../pressing-game.css`

css = File.read("../../release/pressing-game.css");
index = File.read("../index.htm")

script = "<style>#{css}</style>"

[d3, d3_selection, uuid, pressing_game].each do |file|
   # use separate script tags for each file
  script += "<script type=\"text/javascript\">#{file}</script>"
end

scr = index.gsub!(/<!--[\s]+replace-start[\s\S]*replace-end[\s]+-->/, script)

f = File.open('../../release/index-inlined-scripts.htm', 'w+')
f.write(scr)
f.close

htm = `html-minifier --remove-comments --collapse-whitespace --case-sensitive ../../release/index-inlined-scripts.htm > ../../release/index-min.htm`

favicon = `cp ../favicon.ico ../../release/favicon.ico`

gzip = `gzip -9 -c ../../release/index-min.htm > ../../release/index.htm`

# TO DO:
# Rewrite in Javascript, since we are using node.js packages anyway.
# List deployment script dependencies somewhere in the repo.
# Upload with to S3 with public permissions and Content-Encoding=gzip.
# Add W3C validation API (html/css) and lint validation for js (uglify *may* include lint).
