
BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		// this.music = this.add.audio('titleMusic');
		// this.music.play();
		// this.physics.startSystem(Phaser.Physics.ARCADE);



		this.add.sprite(0, 0, 'BG');

		this.playButton = this.add.button(600, 400, 'Play', this.startGame, this);
		this.playButton.anchor.set(0.5,0.5);

        // this.physics.arcade.enable(this.playButton);


		this.titlepage=this.add.sprite(300, 400, 'titlepage');
		this.titlepage.anchor.set(0.5,0.5);
	},

	update: function () {

		//	Do some nice funky main menu effect here
		// this.playButton.body.angularVelocity=100;

	},

	startGame: function (pointer) {

           // this.tween = this.add.tween(this.playButton.scale).to( { x: 1, y: 1 }, 1000, Phaser.Easing.Elastic.Out, true);

		//	Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
		// this.music.stop();

		//	And start the actual game
		this.state.start('Game');

	}

};
