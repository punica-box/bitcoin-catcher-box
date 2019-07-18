// const { ccclass, property } = cc._decorator;

// import { client } from 'ontology-dapi';

// @ccclass
// export default class GameOnchain extends cc.Component {

//     @property(cc.Node)
//     ontologyer: cc.Node = null;

//     @property(cc.Prefab)
//     bitCoinPreFab: cc.Prefab = null;

//     @property(cc.Float)
//     maxCoinShowTime: number = 0;

//     @property(cc.Float)
//     minCoinShowTime: number = 0;

//     @property(cc.Float)
//     groundY: number = 0;

//     @property(cc.Float)
//     private score: number = 0;

//     @property(cc.Label)
//     scoreLabel: cc.Label = null;

//     @property(cc.Float)
//     timer: number = 0;

//     @property(cc.Float)
//     showDuration: number = 0;

//     @property({
//         type: cc.AudioClip
//     })
//     scoreAudio: cc.AudioClip = null;

//     private gasPrice = 500;

//     private gasLimit = 20000;

//     private contractAddress: string = "6fa5b9c9bd8ae8e74773d910619622625e36d4d8";

//     // LIFE-CYCLE CALLBACKS:

//     async onLoad() {
//         this.score = 0;
//         this.timer = 0;
//         try {
//             await client.registerClient({});
//         }
//         catch (e) {
//             console.log(e);
//         }
//         this.newBitCoin();
//     }

//     start() {

//     }

//     newBitCoin() {
//         let newCoin = cc.instantiate(this.bitCoinPreFab);
//         this.node.addChild(newCoin);
//         newCoin.setPosition(this.getNewCoinPostion());
//         newCoin.getComponent('bitcoin').game = this;
//         this.showDuration = this.minCoinShowTime + Math.random() * (this.maxCoinShowTime - this.minCoinShowTime);
//         this.timer = 0;
//     }

//     getNewCoinPostion() {
//         var randX = 0;
//         var randY = this.groundY + Math.random() * this.ontologyer.getComponent('ontologyer').jumpHeight + 50;
//         var maxX = this.node.width / 2;
//         randX = (Math.random() - 0.5) * 2 * maxX;
//         return cc.v2(randX, randY);
//     }

//     async update(dt) {
//         if (this.timer > this.showDuration) {
//             await Alert.show("Score: " + this.score, async f => {
//                 let accountAddress: String = await client.api.asset.getAccount();
//                 let txHash = "";
//                 try {
//                     let result = await client.api.smartContract.invoke({
//                         scriptHash: this.contractAddress,
//                         operation: "update_score",
//                         args: [{ type: "String", value: accountAddress }, { type: 'Integer', value: this.score }],
//                         gasPrice: this.gasPrice,
//                         gasLimit: this.gasLimit
//                     });
//                     txHash = result['transaction'];
//                     Alert.show("TxHash:" + txHash, function () {
//                         cc.sys.openURL("https://explorer.ont.io/transaction/" + result['transaction'] + "/testnet");
//                         cc.director.loadScene("BitcoinCatcherOnchain");
//                     }, function () {
//                         cc.director.loadScene("Index");
//                     });
//                 } catch (e) {
//                     console.log(e);
//                 }
//             }, this.loadIndex);
//             this.ontologyer.stopAllActions();
//             this.ontologyer.active = false;
//             try {
//                 this.node.getChildByName("bitcoin").active = false;
//             } catch (e) {
//                 console.log(e);
//             }
//             this.enabled = false;
//             return;
//         }
//         this.timer += dt;
//     }

//     async loadIndex() {
//         cc.director.loadScene("Index");
//     }

//     gainScore() {
//         this.score += 1;
//         this.scoreLabel.string = 'Score: ' + this.score;
//         cc.audioEngine.playEffect(this.scoreAudio, false);
//     }
// }
