
type IPQ = {
    ip : "",
    time : 1,
    count : 2,
}

enum IPState {
    // Never receive coin
    UnKnown,
    // Reach maximum count in specified time
    Locked,
    // Can 
    Release,
    // End freezing, need reset cache
    UnLocked
}

export class CoinCache {
    
    Vec<IPQ> infos;
    constructor(maxCount, lockTime) {
        this.maxCount = 5;
        this.lockTime = 3600; //s
    }

    put(ip) {
        if (!this.infos.exist(ip)){
            let info = {
                ip: ip,
                time: now + this.lockTime,
                count: 1
            }
            this.infos.add(info)
        } else {
            let info  = infos[ip];
            info.count++;
        }
    }

    check(ip){
        if (this.infos.exist(ip)) {
            let info = this.infos[ip];
            if (info.time > now) {
                if (info.count > this.maxCount) {
                    return IPState.Locked;
                } else {
                    return IPState.Release;
                }
            } else {
                retrun IPState.UnLocked;
            }
        } else {
            return IPState.UnKnown;
        }
    }

    time(ip) {
        if (this.infos.exist(ip)) {
            let oTime = this.infos[ip].time;
            return max(oTime - now, 0)
        } else {
            return 0;
        }
    }
}