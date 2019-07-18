// const { ccclass, property } = cc._decorator;

// import { client } from "ontology-dapi";

// @ccclass
// export default class NewClass extends cc.Component {

//     @property(cc.Button)
//     playButton: cc.Button = null;

//     @property(cc.Button)
//     scoreButton: cc.Button = null;

//     private gasPrice = 500;

//     private gasLimit = 20000;

//     private provider = null;

//     private contractAddress: string = "6fa5b9c9bd8ae8e74773d910619622625e36d4d8";

//     // LIFE-CYCLE CALLBACKS:

//     async onLoad() {
//         try {
//             await client.registerClient({});
//             this.provider = await client.api.provider.getProvider();
//             console.log("Get provider: " + JSON.stringify(this.provider));
//         }
//         catch (e) {
//             await Alert.show("Please install cyano wallet first if you want to play it with blockchain.", function () {
//                 cc.sys.openURL("https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm?hl=en");
//             });
//         }
//         this.playButton.node.on('click', this.startScene, this);
//         this.scoreButton.node.on('click', this.startScene, this);
//     }

//     async startScene(event) {
//         console.log(event);
//         switch (event.node.name) {
//             case 'playButton':
//                 if (this.provider === null) {
//                     await Alert.show("Do you want to play it without blockchain?", function () {
//                         cc.director.loadScene('BitcoinCatcher');
//                     });
//                     break;
//                 }
//                 let userName = await this.getUserName();
//                 console.log("userName: " + userName);
//                 if (userName.length === 0) {
//                     await this.register();
//                     break;
//                 }
//                 await Alert.show("Welcome " + userName, function () {
//                     cc.director.loadScene('BitcoinCatcherOnchain');
//                 });
//                 break;
//             case 'scoreButton':
//                 if (this.provider === null) {
//                     await Alert.show("Please install cyano wallet first", function () {
//                         cc.sys.openURL("https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm?hl=en");
//                     });
//                     break;
//                 }
//                 let score = await this.getScore();
//                 await Alert.show("score: " + score, null, null, false);
//                 break;
//             default:
//                 break
//         }
//     }

//     async getScore() {
//         let accountAddress: String = await client.api.asset.getAccount();
//         try {
//             let result = await client.api.smartContract.invokeRead({
//                 scriptHash: this.contractAddress,
//                 operation: 'get_score',
//                 args: [{ type: 'String', value: accountAddress }]
//             });
//             if (result === "") {
//                 result = 0;
//             }
//             return result;
//         } catch (e) {
//             console.log(e);
//             return '';
//         }
//     }

//     async getUserName() {
//         let accountAddress: String = await client.api.asset.getAccount();
//         try {
//             let result = await client.api.smartContract.invokeRead({
//                 scriptHash: this.contractAddress,
//                 operation: 'get_user_name',
//                 args: [{ type: 'String', value: accountAddress }]
//             });
//             return result;
//         } catch (e) {
//             console.log(e);
//             return '';
//         }
//     }

//     async register() {
//         let accountAddress: String = await client.api.asset.getAccount();
//         let result = await client.api.smartContract.invoke({
//             scriptHash: this.contractAddress,
//             operation: "register",
//             args: [{ type: "String", value: accountAddress }, { type: 'String', value: "NashMiao" }],
//             gasPrice: this.gasPrice,
//             gasLimit: this.gasLimit
//         });
//         try {
//             let txHash = result['transaction'];
//             if (txHash !== "") {
//                 await Alert.show("TxHash: " + result['transaction'], function () {
//                     cc.sys.openURL("https://explorer.ont.io/transaction/" + result['transaction'] + "/testnet");
//                 });
//             }
//         } catch (e) {
//             console.log(result);
//             console.log(e);
//         }
//     }
// }
