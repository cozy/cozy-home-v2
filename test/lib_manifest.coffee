should = require 'should'

{Manifest} = require '../server/lib/manifest'

describe 'Manifest', ->

    manifest = new Manifest()

    it 'download (npm app)', (done) ->
        app =
            name: 'contacts'
            package: 'cozy-contacts'

        manifest.download app, (err, appManifest) ->
            appManifest.name.should.equal 'cozy-contacts'
            should.not.exist err
            should.exist appManifest.version
            should.exist appManifest.scripts.start

            app =
                name: 'contacts'
                package:
                    type: 'npm'
                    name: 'cozy-contacts'

            manifest.download app, (err, appManifest) ->
                appManifest.name.should.equal 'cozy-contacts'
                should.not.exist err
                should.exist appManifest.version
                should.exist appManifest.scripts.start

                app =
                    name: 'contacts'
                    package:
                        type: 'python'
                        name: 'cozy-contacts'

                manifest.download app, (err, appManifest) ->
                    should.not.exist err
                    Object.keys(appManifest).length.should.be.equal 0
                    Object.keys(manifest.config).length.should.be.equal 0
                    done()


    it 'download (git app)', (done) ->
        app =
            name: 'contacts'
            git: 'https://github.com/cozy/cozy-contacts.git'

        manifest.download app, (err, appManifest) ->
            should.not.exist err
            appManifest.name.should.equal 'cozy-contacts'
            should.exist appManifest.version
            should.exist appManifest.scripts.start
            done()


    it 'download (wrong type)', (done) ->
        app =
            name: 'contacts'

        manifest.download app, (err, appManifest) ->
            Object.keys(appManifest).length.should.be.equal 0
            Object.keys(manifest.config).length.should.be.equal 0
            done()


