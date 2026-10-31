// Diagnostic (Electron upgrades): what powerMonitor reports.
exports.run=async({app})=>{const {powerMonitor}=require('electron');
 console.log('POWER',JSON.stringify({battery:powerMonitor.isOnBatteryPower(),onBattery:powerMonitor.onBatteryPower,thermal:powerMonitor.getCurrentThermalState?.(),idle:powerMonitor.getSystemIdleState?.(60)}));
 console.log('POWER pmset',require('node:child_process').execFileSync('/usr/bin/pmset',['-g']).toString().split('\n').filter(l=>/lowpowermode|powermode/i.test(l)).join(' | '));
 console.log('POWER batt',require('node:child_process').execFileSync('/usr/bin/pmset',['-g','batt']).toString().replace(/\n/g,' | '));
 app.exit(0);};
