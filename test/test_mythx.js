const assert = require('assert');
const fs = require('fs');
const mythx = require('../lib/mythx');

describe('mythx.js', () => {
    it('should turn truffle contract json to mythx compatible object', done => {
        fs.readFile( `${__dirname}/sample-truffle/simple_dao/build/contracts/SimpleDAO.json`, 'utf8', (err, data) => {
            if (err) return done(err);
            const truffleJSON = JSON.parse(data);
            const mythXJSON = mythx.truffle2MythXJSON(truffleJSON, 'test-truffle-analyze');

            assert.deepEqual(mythXJSON,  {
                contractName: truffleJSON.contractName,
                bytecode: truffleJSON.bytecode,
                deployedBytecode: truffleJSON.deployedBytecode,
                sourceMap: truffleJSON.sourceMap,
                deployedSourceMap: truffleJSON.deployedSourceMap,
                sourceList: [ truffleJSON.sourcePath ],
                sources: {
                    'simple_dao.sol': {
                        source: truffleJSON.source,
                        ast: truffleJSON.ast,
                    },
                },
                toolId: 'test-truffle-analyze',
                version: truffleJSON.compiler.version,
            });
            done();
        });
    });

    // FIXME Daniyar
    /*
    it('should remap MythX Output object to array grouped by sourceLocation', () => {
        const mythXOutput = {
            'sourceType': 'solidity-file',
            'sourceFormat': 'text',
            'sourceList': [
                '/tmp/contracts/sol1.sol',
                '/tmp/contracts/sol2.sol'
            ],
            'issues': [
                {
                    'locations': [ { 'sourceMap': '0:23:0' } ],
                    'swcID': 'SWC-103',
                    'swcTitle': 'Floating Pragma',
                    'description': {
                        'head': 'A floating pragma is set.',
                        'tail': 'It is recommended to make a conscious choice on what version of Solidity is used for compilation. Currently any version equal or grater than "0.5.0" is allowed.'
                    },
                    'severity': 'Low',
                    'extra': {}
                },
                {
                    'locations': [
                        { 'sourceMap': '400:19:0' },
                        { 'sourceMap': '312:10:1' },
                    ],
                    'swcID': 'SWC-109',
                    'swcTitle': 'Uninitialized Storage Pointer',
                    'description': {
                        'head': 'Dangerous use of uninitialized storage variables.',
                        'tail': 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".'
                    },
                    'severity': 'Low',
                    'extra': {}
                }
            ],
            'meta': {
                'selected_compiler': '0.5.0',
                'error': [],
                'warning': []
            }
        };

        const remapedOutput = mythx.remapMythXOutput(mythXOutput);
        assert.deepEqual(remapedOutput, [{
            issues: [{
                description: {
                    head: 'A floating pragma is set.',
                    tail: 'It is recommended to make a conscious choice on what version of Solidity is used for compilation. Currently any version equal or grater than "0.5.0" is allowed.',
                },
                extra: {
                    head: 'A floating pragma is set.',
                    tail: 'It is recommended to make a conscious choice on what version of Solidity is used for compilation. Currently any version equal or grater than "0.5.0" is allowed.',
                },
                severity: 'Low',
                sourceMap: '0:23:0',
                swcID: 'SWC-103',
                swcTitle: 'Floating Pragma',
            }, {
                description: {
                    head: 'Dangerous use of uninitialized storage variables.',
                    tail: 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".',
                },
                extra: {
                    head: 'Dangerous use of uninitialized storage variables.',
                    tail: 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".',
                },
                severity: 'Low',
                sourceMap: '400:19:0',
                swcID: 'SWC-109',
                swcTitle: 'Uninitialized Storage Pointer',
            }],
            source: '/tmp/contracts/sol1.sol',
            sourceFormat: 'text',
            sourceType: 'solidity-file',
        }, {
            issues: [{
                description: {
                    head: 'Dangerous use of uninitialized storage variables.',
                    tail: 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".',
                },
                extra: {
                    head: 'Dangerous use of uninitialized storage variables.',
                    tail: 'Uninitialized storage variables of user-defined type can point to unexpected storage locations. Initialize variable "upgraded" or set the storage attribute "memory".',
                },
                severity: 'Low',
                sourceMap: '312:10:1',
                swcID: 'SWC-109',
                swcTitle: 'Uninitialized Storage Pointer',
            }],
            source: '/tmp/contracts/sol2.sol',
            sourceFormat: 'text',
            sourceType: 'solidity-file',
        }]
        );
    });
    */
});
