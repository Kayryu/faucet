
// type IPQ = {
//     ip : "",
//     time : 1,
//     count : 2,
// }

const IPState = {
    // Never receive coin
    UnKnown : 0,
    // Reach maximum count in specified time
    Locked : 1,
    // Can receive coin
    Release : 2,
    // End freezing, need reset cache
    UnLocked : 3
}

class CoinCache {
    
    constructor(maxCount, lockTime) {
        this.infos = [];
        this.maxCount = maxCount;
        this.lockTime = lockTime; //s
    }

    exist(ip) {
        return this.infos.find((v) => v.ip == ip) != undefined;
    }

    get(ip) {
        return this.infos.find((v) => v.ip == ip);
    }

    delete(ip) {
        let index = this.infos.findIndex((v) => {return v.ip == ip;});
        if (index != -1) {
            this.infos.splice(index, 1);
        }
    }

    now() {
        let date = new Date();
        return date.getTime()
    }
    put(ip) {
        if (!this.exist(ip)){
            
            let info = {
                ip: ip,
                time: this.now() + this.lockTime * 1000,
                count: 1
            }
            this.infos.push(info)
        } else {
            let info  = this.get(ip);
            info.count++;
        }
    }

    check(ip){
        if (this.exist(ip)) {
            let info = this.get(ip);
            if (info.time > this.now()) {
                if (info.count >= this.maxCount) {
                    return IPState.Locked;
                } else {
                    return IPState.Release;
                }
            } else {
                return IPState.UnLocked;
            }
        } else {
            return IPState.UnKnown;
        }
    }

    time(ip) {
        if (this.exist(ip)) {
            let oTime = this.get(ip).time;
            return max(oTime - now, 0)
        } else {
            return 0;
        }
    }
}

module.exports = {
    IPState,
    CoinCache
}