const { ccclass, property } = cc._decorator;

@ccclass
export default class Ontologyer extends cc.Component {

    @property(cc.Float)
    jumpHeight: number = 0;

    @property(cc.Float)
    jumpDuration: number = 0;

    @property(cc.Float)
    squashDuration: number = 0;

    @property(cc.Float)
    public maxSpeed: number = 0;

    @property(cc.Float)
    private xSpeed: number = 0;

    @property(cc.Float)
    acceleration: number = 0;

    @property(cc.Boolean)
    private accLeft: boolean = false;

    @property(cc.Boolean)
    private accRight: boolean = false;

    @property({
        type: cc.AudioClip
    })
    jumpAudio: cc.AudioClip = null;

    onLoad() {
        var jumpAction = this.setJumpAction();
        this.node.runAction(jumpAction);
        this.xSpeed = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.on('touchstart', this.onTouchStart, this);
        touchReceiver.on('touchend', this.onTouchEnd, this);
    }

    onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        var touchReceiver = cc.Canvas.instance.node;
        touchReceiver.off('touchstart', this.onTouchStart, this);
        touchReceiver.off('touchend', this.onTouchEnd, this);
    }

    onTouchStart (event) {
        var touchLoc = event.getLocation();
        if (touchLoc.x >= cc.winSize.width/2) {
            this.accLeft = false;
            this.accRight = true;
        } else {
            this.accLeft = true;
            this.accRight = false;
        }
    }

    onTouchEnd (event) {
        this.accLeft = false;
        this.accRight = false;
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
