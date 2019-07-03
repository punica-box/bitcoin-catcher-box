const { ccclass, property } = cc._decorator;

@ccclass
export default class Ontologyer extends cc.Component {

    @property
    jumpHeight: number = 0;

    @property
    jumpDuration: number = 0;

    @property
    squashDuration: number = 0;

    @property
    maxSpeed: number = 0;

    @property
    xSpeed: number = 0;

    @property
    acceleration: number = 0;

    @property
    accLeft: boolean = false;

    @property
    accRight: boolean = false;

    @property(cc.AudioClip)
    jumpAudio: cc.AudioClip = null;

    onLoad() {
        var jumpAction = this.setJumpAction();
        this.node.runAction(jumpAction);
        this.xSpeed = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    setJumpAction() {
        var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());

        var squash = cc.scaleTo(this.squashDuration, 1, 0.6);
        var stretch = cc.scaleTo(this.squashDuration, 1, 1.2);
        var scaleBack = cc.scaleTo(this.squashDuration, 1, 1);

        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(squash, stretch, scaleBack, jumpUp, jumpDown, callback));
    }

    playJumpSound() {
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = true;
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this.accRight = false;
                break;
        }
    }

    update(dt) {
        if (this.accLeft) {
            this.xSpeed -= this.acceleration * dt;
        } else if (this.accRight) {
            this.xSpeed += this.acceleration * dt;
        }
        if (Math.abs(this.xSpeed) > this.maxSpeed) {
            this.xSpeed = this.maxSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        this.node.x += this.xSpeed * dt;

        if (this.node.x > this.node.parent.width / 2) {
            this.node.x = this.node.parent.width / 2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width / 2) {
            this.node.x = -this.node.parent.width / 2;
            this.xSpeed = 0;
        }
    }
}
