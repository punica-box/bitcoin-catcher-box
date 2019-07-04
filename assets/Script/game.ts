// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import { RestClient } from "../ontology-ts-sdk/src"
import { Address } from "../ontology-ts-sdk/src/crypto";

@ccclass
export default class Game extends cc.Component {

    @property(cc.Node)
    ontologyer: cc.Node = null;

    @property(cc.Prefab)
    bitCoinPreFab: cc.Prefab = null;

    @property
    maxCoinShowTime: number = 0;

    @property
    minCoinShowTime: number = 0;

    @property
    groundY: number = 0;

    @property
    private score: number = 0;

    @property(cc.Label)
    scoreLabel: cc.Label = null;

    @property
    timer: number = 0;

    @property
    showDuration: number = 0;

    @property(cc.AudioClip)
    scoreAudio: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.score = 0;
        this.timer = 0;
        this.newBitCoin();

        const address = new Address('AdLUBSSHUuFaak9j169hiamXUmPuCTnaRz');
        const restClient = new RestClient();// default connects to Testnet
        restClient.url = "http://polaris1.ont.io:20334";
        const result = restClient.getBalance(address);
        console.log(result);
    }

    start() {

    }

    newBitCoin() {
        let newCoin = cc.instantiate(this.bitCoinPreFab);
        this.node.addChild(newCoin);
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
            this.gameOver();
            this.enabled = false;
            return;
        }
        this.timer += dt;
    }

    gainScore() {
        this.score += 1;
        this.scoreLabel.string = 'Score: ' + this.score;
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    gameOver() {
        this.ontologyer.stopAllActions();
        cc.director.loadScene('BitcoinCatcher');
    }
}
