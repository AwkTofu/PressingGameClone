1. Create the appropriate number/letter in Illustrator in Droid Sans Mono. 
2. In Illustrator, highlight text go to Type>Create Outline
3. Set the anchor point to the top left x=0 and y=0 position on the screen.
4. File>Save As> SVG
5. In SVG Profiles make sure to set to SVG Tiny 1.1
6. Other settings remain the same.
7. Move the .svg file to the same directory as the scour script.
8. python -m scour --set-precision 5 --enable-id-stripping --create-groups --shorten-ids --enable-id-stripping --enable-comment-stripping --disable-embed-rasters --remove-metadata --strip-xml-prolog -i (name of file).svg -o (name of file)_scoured.svg
9. The new file should now have a simplified path and metadata removed. 