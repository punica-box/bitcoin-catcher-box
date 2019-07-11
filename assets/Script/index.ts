const { ccclass, property } = cc._decorator;

import { client } from "ontology-dapi";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    scoreButton: cc.Button = null;

    private contractAddress: string = "c389de61bd436a68945581b1e2d2eec395ce4d8e";

    // LIFE-CYCLE CALLBACKS:

    async onLoad() {
        await client.registerClient({});
        this.playButton.node.on('click', this.startScene, this);
        this.scoreButton.node.on('click', this.startScene, this);
    }

    async register() {
        let accountAddress: String = await client.api.asset.getAccount();
        let txHash = await client.api.smartContract.invoke({
            scriptHash: this.contractAddress,
            operation: "register",
            args: [{ type: "String", value: accountAddress }, { type: 'String', value: "NashMiao" }]
        });
        console.log(txHash);
    }

    async getUserName() {
        let accountAddress = await client.api.asset.getAccount();
        console.log(accountAddress);
        let result = await client.api.smartContract.invokeRead({
            scriptHash: this.contractAddress,
            operation: 'get_user_name',
            args: [{ type: 'String', value: accountAddress }]
        });
        console.log(result);
        if (!result) {
            return "";
        }
        console.log(result);
    }

    async startScene(event) {
        console.log(event);
        switch (event.node.name) {
            case 'playButton':
                let userName = await this.getUserName();
                if (userName.length !== 0) {
                    cc.director.loadScene('BitcoinCatcher');
                    break;
                }
                await this.register();
                break;
            case 'scoreButton':
                break;
            default:
                break
        }
    }
}
