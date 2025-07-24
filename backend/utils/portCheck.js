const net = require('net');

function isPortAvailable(port) {
    return new Promise((resolve) => {
        const server = net.createServer();
        
        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false);
            }
        });
        
        server.once('listening', () => {
            server.close();
            resolve(true);
        });
        
        server.listen(port);
    });
}

async function waitForPortToFree(port, retries = 5, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        const available = await isPortAvailable(port);
        if (available) {
            return true;
        }
        console.log(`Port ${port} is busy, waiting ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    return false;
}

module.exports = {
    isPortAvailable,
    waitForPortToFree
}; 