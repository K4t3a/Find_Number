const zmq = require("zeromq");
const sock = new zmq.Reply();

(async function () {
  await sock.bind("tcp://127.0.0.1:3000");
  console.log("Готов к игре...");

  let min, max;

  while (true) {
    const [msg] = await sock.receive();
    const data = JSON.parse(msg.toString());

    if (data.range) {
      
      [min, max] = data.range.split("-").map(Number);
      console.log(`Получен диапазон: ${min}-${max}`);

      const guess = Math.floor((min + max) / 2);
      console.log(`Отправляем первое предположение: ${guess}`);
      await sock.send(JSON.stringify({ answer: guess }));
    } else if (data.hint === "more") {
      
      min = Math.floor((min + max) / 2) + 1;
      const guess = Math.floor((min + max) / 2);
      console.log(`Новое предположение: ${guess} (Больше)`);
      await sock.send(JSON.stringify({ answer: guess }));
    } else if (data.hint === "less") {
      
      max = Math.floor((min + max) / 2) - 1;
      const guess = Math.floor((min + max) / 2);
      console.log(`Новое предположение: ${guess} (Меньше)`);
      await sock.send(JSON.stringify({ answer: guess }));
    }
  }
})();
