// Runs passkey-flow.cjs on its own and exits: PRISM_TEST_FLOW=passkey-check-flow.cjs electron . --smoke-test
exports.run=async args=>{try{const checks=await require('./passkey-flow.cjs').run(args);console.log('PASSKEY PASS '+JSON.stringify(checks));args.app.exit(0);}catch(error){console.error('PASSKEY FAIL',error);args.app.exit(1);}};
