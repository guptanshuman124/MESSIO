"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RandomID {
    // Generate random string of a specified length
    static generateRandomString(length) {
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    // Generate room ID with the format "XXX-XXXX-XXX"
    static generateRoomId() {
        const part1 = this.generateRandomString(3); // 3 characters
        const part2 = this.generateRandomString(4); // 4 characters
        const part3 = this.generateRandomString(3); // 3 characters
        return `${part1}-${part2}-${part3}`;
    }
}
exports.default = RandomID;
