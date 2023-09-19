import Phaser from 'phaser';

class BaseScene extends Phaser.Scene{
	constructor(key, config){
		super(key);
		this.config = config;

		this.screenCenter = { x: config.width / 2, y: config.height / 2 };
		this.fontOptions = { fontSize: '32px', fill: '#fff'};
		this.lineHeight = 42;
	}

	create(){
		this.add.image(0, 0, 'sky').setOrigin(0);

		this.config.isBackBtn && this.createBackBtn();
	}

	createMenu(menu, setMenuEvents){
		let screenCenterMultiplier = 0;
		menu.forEach( menuItem => {
			const screenCenterY = this.screenCenter.y + screenCenterMultiplier;
			menuItem.textGO = this.add.text( this.screenCenter.x, screenCenterY , menuItem.text, this.fontOptions).setOrigin(0.5, 1);
			screenCenterMultiplier += this.lineHeight;
			setMenuEvents(menuItem);
		})
	}

	createBackBtn(){
		const backBtn = this.physics.add.image(10, this.config.height - 10, 'backBtn')
										.setInteractive()
										.setScale(2)
										.setOrigin(0, 1);


		backBtn.on('pointerdown', () => this.scene.start('MenuScene') );
	}
}

export default BaseScene;