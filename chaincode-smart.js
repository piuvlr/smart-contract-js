const shim = require('fabric-shim');

var serbetChainCode = class {
    async Init(stub) {
        console.info('========= Inicializando o contrato =========');
        return shim.success();
    }

    async Invoke(stub) {
        let ret = stub.getFunctionAndParameters();
        let method = this[ret.fcn];

        if (!method) {
            console.log('no method of name:' + ret.fcn + ' found');
            return shim.success();
        }

        try {
            let payload = await method(stub, ret.params);
            return shim.success(payload);
        } catch (err) {
            console.log(err);
            return shim.error(err);
        }

    }

    async invoke(stub, args) {
	console.log("DEBUG - " + args);
        if (args.length != 3) {
            throw new Error('Incorrect number of arguments. Expecting 3');
        }

        let jsonData = args[0];
        let tableName = args[1];
        let alpuid  = args[2];
        
        console.log("DEBUG - KEY: + " + alpuid + tableName);

        await stub.putState(alpuid + tableName, jsonData);
    }

    async query(stub, args) {
	    console.log("DEBUG - " + args);

        if (args.length != 2) {
            throw new Error('Incorrect number of arguments. Expecting name of the person to query')
        }

        let jsonResp = {};
        let tableName = args[0];
        let alpuid = args[1];

        let key = alpuid + tableName;

        console.log("DEBUG - KEY: + " + alpuid + tableName);

        let Avalbytes = await stub.getState(key);

        if (!Avalbytes) {
            jsonResp.error = 'Failed to get state for ' + key;
            throw new Error(JSON.stringify(jsonResp));
        }

        console.info(jsonResp);
        return Avalbytes;
    }
};

shim.start(new serbetChainCode());