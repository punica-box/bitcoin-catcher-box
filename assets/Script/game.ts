import { Node } from './../../creator.d';
const { ccclass, property } = cc._decorator;

import { client } from "ontology-dapi";

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    ontologyer: cc.Node = null;

    @property(cc.Prefab)
    bitCoinPreFab: cc.Prefab = null;

    @property(cc.Float)
    maxCoinShowTime: number = 0;

    @property(cc.Float)
    minCoinShowTime: number = 0;

    @property(cc.Float)
    groundY: number = 0;

    @property(cc.Float)
    private score: number = 0;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property(cc.Float)
    timer: number = 0;

    @property(cc.Float)
    showDuration: number = 0;

    @property({
        type: cc.AudioClip
    })
    scoreAudio: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    async onLoad() {
        this.score = 0;
        this.timer = 0;
        await client.registerClient({});
        this.newBitCoin();
    }

    start() {

    }

    newBitCoin() {
        let newCoin = cc.instantiate(this.bitCoinPreFab);
        this.node.addChild(newCoin);
        console.log(this.node);
        newCoin.setPosition(this.getNewCoinPostion());
        newCoin.getComponent('bitcoin').game = this;
        this.showDuration = this.minCoinShowTime + Math.random() * (this.maxCoinShowTime - this.minCoinShowTime);
        this.timer = 0;
    }

    getNewCoinPostion() {
        var randX = 0;
        var randY = this.groundY + Math.random() * this.ontologyer.getComponent('ontologyer').jumpHeight + 50;
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX, randY);
    }

    update(dt) {
        if (this.timer > this.showDuration) {
            Alert.show("Score: " + this.score, this.loadGame, this.loadIndex);
            this.ontologyer.stopAllActions();
            this.ontologyer.active = false;
            try{
                this.node.getChildByName("bitcoin").active = false;
            }catch(e){
                console.log(e);
            }
            this.enabled = false;
            return;
        }
        this.timer += dt;
    }

    loadIndex() {
        cc.director.loadScene("Index");
    }

    loadGame() {
        cc.director.loadScene("BitcoinCatcher");
    }

    gainScore() {
        this.score += 1;
        this.scoreLabel.string = 'Score: ' + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }
}
