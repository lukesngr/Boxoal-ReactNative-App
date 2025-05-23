import axios from 'axios';
import fs from 'react-native-fs';
import { Buffer } from 'buffer';

const certPath = 'server-cert.pem';

const certificate = await fs.readFile(certPath, 'utf8');

const httpsAgent = new https.Agent({
  ca: Buffer.from(certificate)
});

const httpsConnection = axios.create({
  httpsAgent: httpsAgent
});

export default httpsConnection;