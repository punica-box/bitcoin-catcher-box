const { ccclass, property } = cc._decorator;

import Game from './game';

@ccclass
export default class BitCoin extends cc.Component {

    @property
    eatRadius: number = 0;

    @property(cc.Node)
    public game: Game = null;

    update(dt) {
        if (this.getOntDistance() < this.eatRadius) {
            this.onPicked();
            return;
        }
        var opacityRatio = 1 - this.game.timer / this.game.showDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }

    getOntDistance() {
        if (this.game) {
            var ontPos = this.game.ontologyer.getPosition();
            var dist = this.node.position.sub(ontPos).mag();
            return dist;
        }
        else {
            return Number.MAX_SAFE_INTEGER.toFixed(2);
        }
    }

    onPicked() {
        this.game.newBitCoin();
        this.game.gainScore();
        this.node.destroy();
    }
    
}
