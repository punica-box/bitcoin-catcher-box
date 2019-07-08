const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    startButton: cc.Button = null;

    @property(cc.Button)
    ScoreButton: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.startButton.node.on('click', this.changeScene, this);
    }

    changeScene(event) {
        switch (event.node.name) {
            case  'startButton':
                cc.director.loadScene('BitcoinCatcher');
                break;
            default:
                break
        }
    }
}
