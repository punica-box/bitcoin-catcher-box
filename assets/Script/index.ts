const { ccclass, property } = cc._decorator;

import { client } from "ontology-dapi";
import { utils } from "./utils";

@ccclass
export default class index extends cc.Component {

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    scoreButton: cc.Button = null;

    private walletExist = false;

    private withBlockchain = true;

    // LIFE-CYCLE CALLBACKS:

    async onLoad() {
        Alert.show("Do you want to play this game in blockchain?", async f => {
            this.withBlockchain = true;
        }, f => {
            this.withBlockchain = false;
        })

        try {
            await client.registerClient({});
            await client.api.provider.getProvider();
            this.walletExist = true;
        }
        catch (e) {
            this.walletExist = false;
        }

        if (this.walletExist === false && this.withBlockchain === true) {
            Alert.show("Please install cyano wallet first if you want to play it with blockchain.", function () {
                cc.sys.openURL("https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm?hl=en");
            }, f => {
                this.withBlockchain = false;
            });
        }

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
                    Alert.show("Do you want to play it without blockchain?", f => {
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
                }
                else {
                    Alert.show("Welcome " + userName, function () {
                        cc.director.loadScene('BitcoinCatcherOnchain');
                    });
                }
                break;
            case 'scoreButton':
                if (this.walletExist === false) {
                    Alert.show("Please install cyano wallet first", function () {
                        cc.sys.openURL("https://chrome.google.com/webstore/detail/cyano-wallet/dkdedlpgdmmkkfjabffeganieamfklkm?hl=en");
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
        return await client.api.asset.getAccount();;
    }

    async getScore() {
        const address: String = await this.getAcountAddress();
        try {
            let result = await client.api.smartContract.invokeRead({
                scriptHash: Globals.contractAddress,
                operation: 'get_score',
                args: [{ type: 'String', value: address }]
            });
            if (result === "") {
                result = 0;
            }
            return result;
        } catch (e) {
            console.log(e);
            return '';
        }
    }

    async getUserName() {
        const address: String = await this.getAcountAddress();
        try {
            const result = await client.api.smartContract.invokeRead({
                scriptHash: Globals.contractAddress,
                operation: 'get_user_name',
                args: [{ type: 'String', value: address }]
            });
            return utils.toUtf8(result);
        } catch (e) {
            console.log(e);
            return '';
        }
    }

    async register() {
        const address: String = await this.getAcountAddress();
        const result = await client.api.smartContract.invoke({
            scriptHash: Globals.contractAddress,
            operation: "register",
            args: [{ type: "String", value: address }, { type: 'String', value: "NashMiao" }],
            gasPrice: Globals.gasPrice,
            gasLimit: Globals.gasLimit
        });
        try {
            const txHash = result['transaction'];
            if (txHash !== "") {
                await Alert.show("TxHash: " + txHash, function () {
                    cc.sys.openURL("https://explorer.ont.io/transaction/" + txHash + "/testnet");
                });
            }
        } catch (e) {
            console.log(result);
            console.log(e);
        }
    }
}
