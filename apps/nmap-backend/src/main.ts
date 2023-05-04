import express from 'express';
import * as convert from 'xml-js';
const nmap = require('node-nmap');
const { exec } = require('child_process');
var cors = require('cors');
nmap.nmapLocation = 'nmap'; //default
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
}
const myCors =   cors({
  origin: '*',
  optionsSuccessStatus: 200,
}) 
app.options('*', myCors)
app.use(myCors);

app.get('/scan', async (req, res) => {
  const ipAddress = req.query.ip;
  console.log(`scan: ip=${ipAddress}`);

  if (!ipAddress) {
    res.status(400).send('Missing IP address query parameter');
    return;
  }

  // const quickscan = new nmap.NmapScan(`${ipAddress}`,`-T4 -A -v`);

  try {
    const nmapOutput = await runCommand(`nmap -T4 -A -v -oX - ${ipAddress}`);
    console.log(`${nmapOutput}`);
    const xmlToJsonOutput = convert.xml2json(`${nmapOutput}`, {
      compact: true,
      spaces: 4,
    });

    const jsonOutput = JSON.parse(`${xmlToJsonOutput}`);
    console.log(jsonOutput);

    res.send(jsonOutput);
  } catch (error) {
    console.error('Nmap scan error:', error);
    res.status(500).send('Nmap scan error');
  }
});

const server = app.listen(port, () => {
  console.log(`Listening at http://${host}:${port}`);
});

server.on('error', console.error);
