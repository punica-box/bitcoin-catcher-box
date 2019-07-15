var Alert = {
    _alert: null, // prefab
    _detailLabel: null,
    _cancelButton: null,
    _enterButton: null,
    _enterCallBack: null,
    _cancelCallBack: null,
    _duration: 0.3,
};

Alert.show = function (detailString, enterCallBack, cancelCallBack, needCancel, duration) {

    var self = this;

    if (Alert._alert != undefined) {
        return;
    }
 
    duration = duration ? duration : Alert._duration;

    cc.loader.loadRes("Alert", cc.Prefab, function (error, prefab) {

        if (error) {
            cc.error(error);
            return;
        }

        var alert = cc.instantiate(prefab);
        Alert._alert = alert;

        var cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
        var cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
        self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(duration, 255), cc.scaleTo(duration, 1.0)), cbFadeIn);
        self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(duration, 0), cc.scaleTo(duration, 2.0)), cbFadeOut);

        Alert._detailLabel = cc.find("alertBackground/detailLabel", alert).getComponent(cc.Label);
        Alert._cancelButton = cc.find("alertBackground/cancelButton", alert);
        Alert._enterButton = cc.find("alertBackground/enterButton", alert);

        Alert._enterButton.on('click', self.onButtonClicked, self);
        Alert._cancelButton.on('click', self.onButtonClicked, self);

        Alert._alert.parent = cc.find("Canvas");

        self.startFadeIn();

        self.configAlert(detailString, enterCallBack, cancelCallBack, needCancel, duration);

    });

    self.configAlert = function (detailString, enterCallBack, cancelCallBack, needCancel, duration) {

        Alert._detailLabel.string = detailString;

        Alert._enterCallBack = enterCallBack;
        Alert._cancelCallBack = cancelCallBack;

        if (needCancel || needCancel == undefined) {
            Alert._cancelButton.active = true;
        } else {
            Alert._cancelButton.active = false;
            Alert._enterButton.x = 0;
        }

        Alert._duration = duration;

    };

    self.startFadeIn = function () {
        cc.eventManager.pauseTarget(Alert._alert, true);
        Alert._alert.position = cc.p(0, 0);
        Alert._alert.setScale(2);
        Alert._alert.opacity = 0;
        Alert._alert.runAction(self.actionFadeIn);
    };

    self.startFadeOut = function () {
        cc.eventManager.pauseTarget(Alert._alert, true);
        Alert._alert.runAction(self.actionFadeOut);
        self.onDestory();
    };

    self.onFadeInFinish = function () {
        cc.eventManager.resumeTarget(Alert._alert, true);
    };

    self.onFadeOutFinish = function () {
        self.onDestory();
    };

    self.onButtonClicked = function (event) {
        if (event.target.name == "enterButton") {
            if (self._enterCallBack) {
                self._enterCallBack();
            }
        }
        if (event.target.name == "cancelButton") {
            if (self._cancelCallBack) {
                self._cancelCallBack();
            }
        }
        self.startFadeOut();
    };

    self.onDestory = function () {
        Alert._alert.destroy();
        Alert._enterCallBack = null;
        Alert._alert = null;
        Alert._detailLabel = null;
        Alert._cancelButton = null;
        Alert._enterButton = null;
        Alert._duration = 0.3;
    };
};