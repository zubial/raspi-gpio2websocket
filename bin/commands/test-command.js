"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCommand = void 0;
var Mfrc522 = require("mfrc522-rpi");
var SoftSPI = require("rpi-softspi");
var CMD = require("mfrc522-rpi/commands");
var TestCommand = /** @class */ (function () {
    function TestCommand() {
        this.softSPI = new SoftSPI({
            clock: 23,
            mosi: 19,
            miso: 21,
            client: 24
        });
        this.mfrc522 = new Mfrc522(this.softSPI).setResetPin(22);
    }
    TestCommand.prototype.run = function (args) {
        var _this = this;
        setInterval(function () {
            //# reset card
            _this.reset();
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
                console.log("UID Scan Error", response);
                return;
            }
            var uid = response.data;
            console.log("Card read UID: %s %s %s %s", uid[0].toString(16), uid[1].toString(16), uid[2].toString(16), uid[3].toString(16));
            //# Select the scanned card
            var memoryCapacity = _this.mfrc522.selectCard(uid);
            console.log("Card Memory Capacity: " + memoryCapacity);
            //# Dump Block 8
            console.log("Block: 8 Data: " + _this.mfrc522.getDataForBlock(8));
        }, 1000);
        return false;
    };
    TestCommand.prototype.reset = function () {
        this.mfrc522.writeRegister(CMD.CommandReg, CMD.PCD_RESETPHASE); // reset chip
        this.mfrc522.writeRegister(CMD.TModeReg, 0x8d); // TAuto=1; timer starts automatically at the end of the transmission in all communication modes at all speeds
        this.mfrc522.writeRegister(CMD.TPrescalerReg, 0x3e); // TPreScaler = TModeReg[3..0]:TPrescalerReg, ie 0x0A9 = 169 => f_timer=40kHz, ie a timer period of 25??s.
        this.mfrc522.writeRegister(CMD.TReloadRegL, 30); // Reload timer with 0x3E8 = 1000, ie 25ms before timeout.
        this.mfrc522.writeRegister(CMD.TReloadRegH, 0);
        this.mfrc522.writeRegister(CMD.TxAutoReg, 0x40); // Default 0x00. Force a 100 % ASK modulation independent of the ModGsPReg register setting
        this.mfrc522.writeRegister(CMD.ModeReg, 0x3d); // Default 0x3F. Set the preset value for the CRC coprocessor for the CalcCRC command to 0x6363 (ISO 14443-3 part 6.2.4)
        this.mfrc522.writeRegister(CMD.RFCfgReg, (0x07 << 4)); // Increase range (gain max)
        this.mfrc522.antennaOn(); // Enable the antenna driver pins TX1 and TX2 (they were disabled by the reset)
    };
    return TestCommand;
}());
exports.TestCommand = TestCommand;
