const { ccclass, property } = cc._decorator;

import { client } from "ontology-dapi";

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    playButton: cc.Button = null;

    @property(cc.Button)
    scoreButton: cc.Button = null;

    private contractAddress: string = "a6be9cfd13c40be773c4dac2b9ca3c258c698214";

    // LIFE-CYCLE CALLBACKS:

    async onLoad() {
        await client.registerClient({});
        await this.getUserName();


        this.playButton.node.on('click', this.startScene, this);
        this.scoreButton.node.on('click', this.startScene, this);
    }
    async getUserName() {
        console.log("here");
        let result = await client.api.smartContract.invokeRead({
            scriptHash: this.contractAddress,
            operation: 'get_user_name',
            args: []
        });
        if (!result) {
            console.log("");
            return "";
        }
        console.log(result);
    }

    startScene(event) {
        console.log(event);
        switch (event.node.name) {
            case 'playButton':
                cc.director.loadScene('BitcoinCatcher');
                break;
            case 'scoreButton':
                break;
            default:
                break
        }
    }
}
