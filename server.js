const http = require("http");
const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || process.env.API_PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is listinging on ${PORT}`);
});