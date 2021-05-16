"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCommand = void 0;
var Mfrc522 = require("mfrc522-rpi");
var SoftSPI = require("rpi-softspi");
var TestCommand = /** @class */ (function () {
    function TestCommand() {
        this.softSPI = new SoftSPI({
            clock: 23,
            mosi: 19,
            miso: 21,
            client: 24 // pin number of CS
        });
        this.mfrc522 = new Mfrc522(this.softSPI).setResetPin(22);
    }
    TestCommand.prototype.run = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.args = args;
                return [2 /*return*/, false];
            });
        });
    };
    TestCommand.prototype.runSync = function () {
        var _this = this;
        console.log(this.mfrc522);
        setInterval(function () {
            //# reset card
            _this.mfrc522.reset();
            //# Scan for cards
            var response = _this.mfrc522.findCard();
            console.log("---------------------");
            if (!response.status) {
                console.log("No Card", response);
                return;
            }
            console.log("Card detected, CardType: " + response.bitSize);
            //# Get the UID of the card
            response = _this.mfrc522.getUid();
            if (!response.status) {
                console.log("UID Scan Error");
                return;
            }
            //# If we have the UID, continue
            var uid = response.data;
            console.log("Card read UID: %s %s %s %s", uid[0].toString(16), uid[1].toString(16), uid[2].toString(16), uid[3].toString(16));
            //# Select the scanned card
            var memoryCapacity = _this.mfrc522.selectCard(uid);
            console.log("Card Memory Capacity: " + memoryCapacity);
            //# This is the default key for authentication
            var key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];
            //# Authenticate on Block 8 with key and uid
            if (!_this.mfrc522.authenticate(8, key, uid)) {
                console.log("Authentication Error");
                return;
            }
            //# Dump Block 8
            console.log("Block: 8 Data: " + _this.mfrc522.getDataForBlock(8));
            //# Stop
            _this.mfrc522.stopCrypto();
        }, 500);
        return false;
    };
    return TestCommand;
}());
exports.TestCommand = TestCommand;
