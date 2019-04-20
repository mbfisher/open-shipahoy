const CleanCSS = require('clean-css')
const fs = require('fs')

fs.readFile('node_modules/mapbox-gl/dist/mapbox-gl.css', 'utf8', (err, css) => {
  if (err) throw err
  // to display properly icons for controls
  const found = css.match(/(background-image: url\(.*?\);)/g)
  found.forEach(item => {
    const newItem = decodeURI(item).replace(new RegExp("'", 'g'), "%22").replace(new RegExp('"', 'g'), "'")
    css = css.replace(item, newItem)
  })
  const minified = new CleanCSS({}).minify(css)
  fs.readFile('node_modules/mapbox-gl/dist/mapbox-gl.js', 'utf8', (err, js) => {
    if (err) throw err
    js = js.replace('this', 'window')
    js = js.replace('//# sourceMappingURL=mapbox-gl.js.map', '')
    let newFileString = `
const $_documentContainer = document.createElement('template');
$_documentContainer.innerHTML = \`<dom-module id="mapboxgl-styles"><template><style>
${minified.styles}
</style></template></dom-module>\`;
document.head.appendChild($_documentContainer.content);
${js}`
    fs.writeFile('assets/ship-ahoy-mapbox-gl.js', newFileString, 'utf8', (err) => {
      if (err) throw err
      console.log('mapbox-gl postinstall step performed succesfully')
    })
  })
})
