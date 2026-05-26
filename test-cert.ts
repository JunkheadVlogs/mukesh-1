import tls from 'tls';

function checkCert() {
  const socket = tls.connect(443, '145.223.17.203', { rejectUnauthorized: false }, () => {
    const cert = socket.getPeerCertificate();
    console.log('--- Peer Certificate Info ---');
    console.log('Subject:', cert.subject);
    console.log('Issuer:', cert.issuer);
    console.log('Valid from:', cert.valid_from);
    console.log('Valid to:', cert.valid_to);
    socket.end();
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
}

checkCert();
