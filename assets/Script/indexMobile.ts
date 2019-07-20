const { ccclass, property } = cc._decorator;

import { client } from "cyanobridge";
import { utils } from "./utils";
@ccclass
export default class IndexMobile extends cc.Component {

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    scoreButton: cc.Button = null;

    private walletExist = false;

    private withBlockchain = true;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Alert.show("Do you want to paly this game in blockchain?", async f => {
            this.withBlockchain = true;
            try {
                await client.registerClient();
                this.walletExist = true;
            }
            catch (e) {
                Alert.show("If you want to play with blockchain, please open it in ONTO.", function () {
                    cc.sys.openURL("https://onto.app/");
                }, f => {
                    this.withBlockchain = false;
                });
            }
        }, f => {
            this.withBlockchain = false;
        })
        this.playButton.node.on('click', this.startScene, this);
        this.scoreButton.node.on('click', this.startScene, this);
    }

    async startScene(event) {
        switch (event.node.name) {
            case 'playButton':
                if (this.withBlockchain === false) {
                    cc.director.loadScene('BitcoinCatcher');
                    break;
                }

                if (this.walletExist === false) {
                    await Alert.show("Do you want to play it without blockchain?", f => {
                        this.withBlockchain = false;
                        cc.director.loadScene('BitcoinCatcher');
                    }, f => {
                        this.withBlockchain = true;
                    });
                    break;
                }

                let userName = "";
                try {
                    userName = await this.getUserName();
                } catch (e) {
                    console.log(e);
                }

                if (userName.length === 1) {
                    Alert.show("Let's register first.", async f => {
                        await this.register();
                    })
                    return;
                } else {
                    Alert.show("Welcome " + userName, function () {
                        cc.director.loadScene('BitcoinCatcherOnchainMobile');
                    });
                }
                break;
            case 'scoreButton':
                if (this.walletExist === false) {
                    await Alert.show("Please install ONTO first", function () {
                        cc.sys.openURL("https://onto.app/");
                    });
                    break;
                }

                const score = await this.getScore();
                const address = await this.getAcountAddress();
                Alert.show("Address:\n" + address + "\n\nScore: " + score, null, null, false);
                break;
            default:
                break
        }
    }

    async getAcountAddress() {
        const response = await client.api.asset.getAccount({
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
        const accountAddress = await this.getAcountAddress();
        try {
            const response = await client.api.smartContract.invokeRead({
                scriptHash: Globals.contractAddress,
                operation: "get_user_name",
                args: [{ type: 'String', value: accountAddress }],
                gasPrice: Globals.gasPrice,
                gasLimit: Globals.gasLimit
            });
            if (response["error"] !== 0) {
                return "";
            }
            return utils.toUtf8(response["result"]["Result"]);
        } catch (e) {
            console.log(e);
            return '';
        }
    }

    async getScore() {
        try {
            const accountAddress = await this.getAcountAddress();
            const response = await client.api.smartContract.invokeRead({
                scriptHash: Globals.contractAddress,
                operation: 'get_score',
                args: [{ type: 'String', value: accountAddress }],
                gasPrice: Globals.gasPrice,
                gasLimit: Globals.gasLimit
            });
            if (response["error"] !== 0) {
                await Alert.show(response["result"], null, null, false);
                return 0;
            }
            let score = response["result"]["Result"];
            if (score === "") {
                score = 0;
            }
            return parseInt(score, 16);
        } catch (e) {
            console.log(e);
            return 0;
        }
    }

    async register() {
        try {
            const accountAddress = await this.getAcountAddress();
            const response = await client.api.smartContract.invoke({
                scriptHash: Globals.contractAddress,
                operation: "register",
                args: [{ type: "String", value: accountAddress }, { type: 'String', value: "NashMiao" }],
                gasPrice: Globals.gasPrice,
                gasLimit: Globals.gasLimit,
                payer: accountAddress
            });
            if (response["error"] === 0) {
                const txHash = response['result'];
                Alert.show("TxHash:" + txHash, function () {
                    cc.director.loadScene("BitcoinCatcherOnchainMobile");
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
}
