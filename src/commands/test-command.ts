import {ICommand} from "./icommand";

const Mfrc522:any = require("mfrc522-rpi");
const SoftSPI:any = require("rpi-softspi");

export class TestCommand implements ICommand {

    softSPI: any;
    mfrc522: any;

    args: any;

    constructor() {

        this.softSPI = new SoftSPI({
            clock: 23, // pin number of SCLK
            mosi: 19, // pin number of MOSI
            miso: 21, // pin number of MISO
            client: 24 // pin number of CS
        });


        this.mfrc522 = new Mfrc522(this.softSPI).setResetPin(22);
    }

    async run(args: any): Promise<boolean> {
        this.args = args;


        return false;
    }

    runSync(): boolean {

        console.log(this.mfrc522);

        setInterval(() => {
            //# reset card
            this.mfrc522.reset();

            //# Scan for cards
            let response = this.mfrc522.findCard();
            console.log("---------------------");
            if (response.bitSize == 0) {
                console.log("No Card", response);
                return;
            }
            console.log("Card detected, CardType: " + response.bitSize);

            //# Get the UID of the card
            response = this.mfrc522.getUid();
            if (!response.status) {
                console.log("UID Scan Error", response);
                return;
            }
            //# If we have the UID, continue

            const uid = response.data;
            console.log(
                "Card read UID: %s %s %s %s",
                uid[0].toString(16),
                uid[1].toString(16),
                uid[2].toString(16),
                uid[3].toString(16)
            );

            //# Select the scanned card
            const memoryCapacity = this.mfrc522.selectCard(uid);
            console.log("Card Memory Capacity: " + memoryCapacity);

            //# This is the default key for authentication
            const key = [0xff, 0xff, 0xff, 0xff, 0xff, 0xff];

            //# Authenticate on Block 8 with key and uid
            if (!this.mfrc522.authenticate(8, key, uid)) {
                console.log("Authentication Error");
                return;
            }

            //# Dump Block 8
            console.log("Block: 8 Data: " + this.mfrc522.getDataForBlock(8));

            //# Stop
            this.mfrc522.stopCrypto();
        }, 500);

        return false;
    }
}