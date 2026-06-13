import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

const app = express();
app.use(express.json());

const PORT = 3000;

app.post("/api/send-email", async (req, res) => {
  try {
    const { clientName, clientEmail, eventType, eventLocation, eventDate, details, equipments } = req.body;
    
    const eqList = equipments && equipments.length > 0 ? equipments.join(', ') : 'Nenhum especifico';

    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail', // Recomendado usar Gmail
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: `"Atmos Iluminação" <${process.env.SMTP_USER}>`,
        to: clientEmail,
        subject: 'Confirmação de Solicitação - Atmos',
        text: `Olá ${clientName},\n\nRecebemos sua solicitação para ${eventType} em ${eventLocation} no dia ${eventDate}.\n\nNossa equipe de técnicos de iluminação entrará em contato em breve via WhatsApp.\n\nEquipamentos de interesse: ${eqList}\n\nDetalhes:\n${details || 'Nenhum'}\n\nObrigado,\nEquipe Atmos`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Email de confirmação enviado para o cliente: ${clientEmail}`);
    } else {
      console.log(`[SIMULADOR] Email para o cliente: ${clientEmail}`);
      console.log(`Configure SMTP_USER e SMTP_PASS nas variáveis de ambiente para enviar emails reais.`);
    }

    res.json({ success: true, message: "Request processed successfully." });
  } catch (error: any) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

