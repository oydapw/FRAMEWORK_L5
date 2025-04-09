const Framework = require('./src/Framework');
const machineRoutes = require('./src/routes/machineRoutes');
const workerRoutes = require('./src/routes/workerRoutes');
const requestLogger = require('./src/middlewares/requestLogger');
const errorHandler = require('./src/middlewares/errorHandler');

const app = new Framework();

app.use(requestLogger);

app.addRouter(machineRoutes);
app.addRouter(workerRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});