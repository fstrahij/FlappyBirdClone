import BaseScene from './BaseScene';

class PauseScene extends BaseScene{
	constructor(config){
		super('PauseScene', config);

		this.menu = [
			{scene: 'PlayScene', text: 'Continue'},
			{scene: 'MenuScene', text: 'Main Menu'}
			];
	}

	create(){
		super.create();
		this.createMenu(this.menu, this.setMenuEvents.bind(this) )
	}

	setMenuEvents(menuItem){
		const textGO = menuItem.textGO;
		textGO.setInteractive();
		textGO.on('pointerover', ()=> textGO.setStyle( {fill: '#ff0'} ));
		textGO.on('pointerout', ()=> textGO.setStyle( {fill: '#fff'} ));
		textGO.on('pointerup', () => {
			if (!menuItem.scene) { return; }

			if (menuItem.scene === 'PlayScene') {
				this.scene.stop() && this.scene.resume(menuItem.scene);
			}
			else{				
				this.scene.stop('PlayScene') && this.scene.start(menuItem.scene);
			}
		});
	}
}

export default PauseScene;