const Framework = require("./application");
const Router = require("./router");

const app = new Framework();
const router = new Router();
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
router.get("/", (req, res) => {
  res.json({ message: "LR5_Lepeshov" });
});

router.post("/data", (req, res) => {
  res.status(201).json({ received: req.body });
});

router.put("/data/:id", (req, res) => {
  res.json({ id: req.params.id, updated: req.body });
});

router.delete("/data/:id", (req, res) => {
  res.json({ id: req.params.id, deleted: true });
});

app.addRouter(router);

app.listen(3000, () => {
  console.log("Сервер запущен на порту 3000");
});