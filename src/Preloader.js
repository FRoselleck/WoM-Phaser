
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		// this.background = this.add.sprite(0, 0, 'preloaderBackground');
		this.preloadBar = this.add.sprite(400, 400, 'preloaderBar');
		this.preloadBar.anchor.set(0.5,0.5);
    	this.stage.backgroundColor=0xFFFFFF;

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, the lines below won't work as the files themselves will 404, they are just an example of use.
		this.load.image('titlepage', 'assets/WoM.png');
		// this.load.image('playButton', 'images/Play.png');
		// this.load.atlas('playButton', 'images/play_button.png', 'images/play_button.json');

		// this.load.audio('titleMusic', ['audio/outgamemusic.mp3']);
		// this.load.audio('gameMusic', ['audio/gamemusic.mp3']);

		// this.load.bitmapFont('caslon', 'fonts/caslon.png', 'fonts/caslon.xml');
		//	+ lots of other required assets here

		this.load.image('BG', 'assets/BG_800_800.png');
		this.load.image('N0', 'images/0.png');
		this.load.image('N1', 'images/1.png');
		this.load.image('N2', 'images/2.png');
		this.load.image('N3', 'images/3.png');
		this.load.image('N4', 'images/4.png');
		this.load.image('N5', 'images/5.png');
		this.load.image('N6', 'images/6.png');
		this.load.image('M0', 'images/M0.png');
		this.load.image('M1', 'assets/M1.png');
		this.load.image('M2', 'images/M2.png');
		this.load.image('M3', 'images/M3.png');
		this.load.image('M4', 'images/M4.png');
		this.load.image('M5', 'images/M5.png');
		this.load.image('M-1', 'assets/M-1.png');
		this.load.image('M-2', 'images/M-2.png');
		this.load.image('M-3', 'images/M-3.png');
		this.load.image('M-4', 'images/M-4.png');
		this.load.image('M-5', 'images/M-5.png');
		this.load.image('mars', 'images/Mars.png');
		this.load.image('marble', 'images/Marble.png');
		this.load.image('B0', 'images/B0.png');
		this.load.image('B1', 'images/B1.png');
		this.load.image('EE', 'assets/EE.png');
		this.load.image('E0', 'images/E0.png');
		this.load.image('E1', 'assets/E1.png');
		this.load.image('E2', 'assets/E2.png');
		this.load.image('E3', 'assets/E3.png');
		this.load.image('E4', 'assets/E4.png');
		this.load.spritesheet('Fire', 'assets/Fire.png', 64, 64, 16);
		// this.load.image('Fire', 'assets/Fire.png');
		this.load.image('Water', 'assets/Water.png');
		this.load.image('Earth', 'assets/Earth.png');
		this.load.image('Wind', 'assets/Wind.png');
		this.load.image('Back', 'assets/Back.png');
		this.load.image('Play', 'assets/Play.png');
		this.load.audio('sfx', 'assets/fx_mixdown.ogg');
		// this.load.physics('mask', 'assets/mask.json');


	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		// if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		if (this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
