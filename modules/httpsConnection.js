import axios from 'axios';
import serverCert from './serverCert';

const httpsAgent = new https.Agent({
  ca: serverCert
});

const httpsConnection = axios.create({
  httpsAgent: httpsAgent
});

export default httpsConnection;