class EC {
    static STR = [
        EC.readString(CC.STD, CC.STR[0]),
        EC.readString(CC.STD, CC.STR[1])
    ];
    static SLI = [
        EC.readString(CC.SLI[0][0], CC.SLI[0][1]),
        EC.readString(CC.SLI[1][0], CC.SLI[1][1]),
        EC.readString(CC.SLI[2][0], CC.SLI[2][1])
    ];

    static readString(str1, str2) {
        const result = [];
        for (let i = 0; i < str1.length; i++) {
            result.push([str1[i], str2[i]]);
        }
        return result;
    }

    static encryptChar(a, x, y) {
        const lclStr = EC.STR[x];
        const lclSli = EC.SLI[y];
        for (const pair of lclStr) {
            if (a === pair[0]) {
                a = pair[1];
                break;
            }
        }
        for (const pair of lclSli) {
            if (a === pair[0]) {
                a = pair[1];
                break;
            }
            if (a === pair[1]) {
                a = pair[0];
                break;
            }
        }
        return a;
    }

    static decryptChar(a, x, y) {
        const lclSli = EC.SLI[y];
        const lclStr = EC.STR[x];
        for (const pair of lclSli) {
            if (a === pair[1]) {
                a = pair[0];
                break;
            }
            if (a === pair[0]) {
                a = pair[1];
                break;
            }
        }
        for (const pair of lclStr) {
            if (a === pair[1]) {
                a = pair[0];
                break;
            }
        }
        return a;
    }

    static encrypt(str) {
        let val = "";
        for (let i = 0; i < str.length; i++) {
            val += EC.encryptChar(str[i], i % 2, i % 3);
        }
        return val;
    }

    static decrypt(str) {
        let val = "";
        for (let i = 0; i < str.length; i++) {
            val += EC.decryptChar(str[i], i % 2, i % 3);
        }
        return val;
    }
}