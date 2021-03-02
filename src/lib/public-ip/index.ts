import * as os from "os";

export function getPublicIP() {
  const ifaces = os.networkInterfaces();
  let address = null;

  for (var dev in ifaces) {
    const iface = ifaces[dev].filter(function(details) {
      return details.family === 'IPv4' && details.internal === false;
    });

    if(iface.length > 0) {
      address = iface[0].address;
    }
  }

  return address;
}