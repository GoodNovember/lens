const Bundler = require('parcel-bundler')
const concurrently = require('concurrently')
const path = require('path')

const PORT = 3000

const entryFile = path.join(__dirname, `./index.html`)

const options = {
  port: PORT,
  target: 'electron',
  outDir: './build',
  useMaps: false,
  watch: true,
  // detailedReport: true,
  autoInstall: false
}

const bundler = new Bundler(entryFile, options)
bundler.serve(PORT).then(server => {
  concurrently(['electron .']).then(() => {
    server.close()
    process.exit(0)
  }).catch(error => {
    console.error(error)
  })
})
