const zmq = require("zeromq");
const sock = new zmq.Request();
const [min, max] = process.argv.slice(2).map(Number);
const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

console.log(`Загадано число: ${randomNum}`);

(async function () {
  await sock.connect("tcp://127.0.0.1:3000");
  console.log("Подключено к серверу");

  await sock.send(JSON.stringify({ range: `${min}-${max}` }));
  
  while (true) {
    const [msg] = await sock.receive();
    const data = JSON.parse(msg.toString());

    if (data.answer < randomNum) {
      console.log(`Ответ сервера: ${data.answer} - Больше`);
      await sock.send(JSON.stringify({ hint: "more" }));
    } else if (data.answer > randomNum) {
      console.log(`Ответ сервера: ${data.answer} - Меньше`);
      await sock.send(JSON.stringify({ hint: "less" }));
    } else {
      console.log(`Ответ сервера: ${data.answer} - Угадано!`);
      break;
    }
  }
})();
