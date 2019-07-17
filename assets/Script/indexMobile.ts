const { ccclass, property } = cc._decorator;

import { client } from "cyanobridge";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    scoreButton: cc.Button = null;

    private gasPrice = 500;

    private gasLimit = 20000;

    private walletExist = false;

    private contractAddress: string = "6fa5b9c9bd8ae8e74773d910619622625e36d4d8";

    // LIFE-CYCLE CALLBACKS:

    async onLoad() {
        try {
            await client.registerClient();
            this.walletExist = true;
        }
        catch (e) {
            await Alert.show("Please open it in ONTO.", function () {
                cc.sys.openURL("https://onto.app/");
            });
        }
        this.playButton.node.on('click', this.startScene, this);
        this.scoreButton.node.on('click', this.startScene, this);
    }

    async startScene(event) {
        console.log(event);
        switch (event.node.name) {
            case 'playButton':
                if (this.walletExist === false) {
                    await Alert.show("Do you want to play it without blockchain?", function () {
                        cc.director.loadScene('BitcoinCatcher');
                    });
                    break;
                }
                let userName = await this.getUserName();
                console.log("userName: " + userName);
                if (userName.length === 0) {
                    await this.register();
                    break;
                }
                await Alert.show("Welcome " + userName, function () {
                    cc.director.loadScene('BitcoinCatcherOnchainMobile');
                });
                break;
            case 'scoreButton':
                if (this.walletExist === false) {
                    await Alert.show("Please install ONTO first", function () {
                        cc.sys.openURL("https://onto.app/");
                    });
                    break;
                }
                let score = await this.getScore();
                if (score !== "") {
                    await Alert.show("score: " + score, null, null, false);
                }
                break;
            default:
                break
        }
    }

    async getAcountAddress() {
        let response = await client.api.asset.getAccount({
            dappName: "Bitcoin Catcher",
            dappIcon: ""
        });
        let address = "";
        if (response["error"] === 0) {
            address = response['result'];
        }
        return address;
    }


    async getUserName() {
        let accountAddress = await this.getAcountAddress();
        console.log(accountAddress);
        try {
            let response = await client.api.smartContract.invokeRead({
                scriptHash: this.contractAddress,
                operation: "get_user_name",
                args: [{ type: 'String', value: accountAddress }],
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit
            });
            if (response["error"] !== 0) {
                return "";
            }
            return response["result"]["Result"];
        } catch (e) {
            console.log(e);
            return '';
        }
    }

    async getScore() {
        try {
            let accountAddress = await this.getAcountAddress();
            let response = await client.api.smartContract.invokeRead({
                scriptHash: this.contractAddress,
                operation: 'get_score',
                args: [{ type: 'String', value: accountAddress }],
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit
            });
            if (response["error"] !== 0) {
                await Alert.show(response["result"], null, null, false);
                return "";
            }
            let score = response["result"]["Result"];
            if (score === "") {
                score = 0;
            }
            return score;
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async register() {
        try {
            let accountAddress = await this.getAcountAddress();
            let response = await client.api.smartContract.invoke({
                scriptHash: this.contractAddress,
                operation: "register",
                args: [{ type: "String", value: accountAddress }, { type: 'String', value: "NashMiao" }],
                gasPrice: this.gasPrice,
                gasLimit: this.gasLimit,
                payer: accountAddress
            });
            if (response["error"] === 0) {
                let txHash = response['result'];
                Alert.show("TxHash:" + txHash, function () {
                    cc.director.loadScene("BitcoinCatcherOnchainMobile");
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
