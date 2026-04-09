import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

app.get("/", (req, res) => {
  res.send("Servidor de Mercado Pago funcionando");
});

app.post("/crear-pago", async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No hay productos para pagar" });
    }

    const preference = new Preference(client);

    const response = await preference.create({
      body: {
        items: items.map((item) => ({
          title: item.nombre,
          unit_price: Number(item.precio),
          quantity: Number(item.cantidad),
          currency_id: "MXN",
        })),
        back_urls: {
          success: "http://localhost:5173",
          failure: "http://localhost:5173",
          pending: "http://localhost:5173",
        },
        auto_return: "approved",
      },
    });

    res.json({
      id: response.id,
      init_point: response.init_point,
    });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    res.status(500).json({ error: "Error al crear el pago" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});