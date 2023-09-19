import BaseScene from './BaseScene';

const BEST_SCORE_KEY = 'bestScore';

class ScoreScene extends BaseScene{
	constructor(config){
		super('ScoreScene', { ...config, isBackBtn: true });
	}

	create(){
		super.create();

		this.createScoreText();
	}

	createScoreText(){
		const score = localStorage.getItem(BEST_SCORE_KEY) || 0;
		const scoreText = `Your best score: ${score}`;
		this.add.text(this.screenCenter.x, this.screenCenter.y, scoreText, this.fontOptions).setOrigin(0.5, 1);
	}
}

export default ScoreScene;