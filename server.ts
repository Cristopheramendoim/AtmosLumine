import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import fs from "fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const app = express();
app.use(express.json());

const PORT = 3000;

// Load Firebase configuration
const configPath = path.join(process.cwd(), "firebase-applet-config.json");
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase, firebaseConfig.firestoreDatabaseId);

app.post("/api/send-email", async (req, res) => {
  try {
    const { clientName, clientEmail, clientPhone, eventType, eventLocation, eventDate, details, equipments } = req.body;

    // Fetch email settings from Firestore
    const settingsDoc = await getDoc(doc(db, "settings", "email"));
    
    let smtpUser = "";
    let smtpPass = "";
    let smtpHost = "smtp.gmail.com";
    let smtpPort = 465;
    let fallbackAndStepfatherEmail = "";

    if (settingsDoc.exists()) {
      const data = settingsDoc.data();
      smtpUser = data.smtpUser || "";
      smtpPass = data.smtpPass || "";
      smtpHost = data.smtpHost || "smtp.gmail.com";
      smtpPort = Number(data.smtpPort) || 465;
      fallbackAndStepfatherEmail = data.adminEmail || data.stepfatherEmail || "";
    }

    // Default fallback if nothing has been configured yet
    if (!fallbackAndStepfatherEmail) {
      fallbackAndStepfatherEmail = "semsalmanteguinha@gmail.com"; // Default user email
    }

    const eqList = equipments && equipments.length > 0 ? equipments.join(', ') : 'Nenhum específico';

    const emailSubject = `Resumo de Projeto SmartFlow - ${clientName}`;
    const emailBody = `
=== RESUMO DO PROJETO SMARTFLOW ===

Olá ${clientName},

Obrigado pelo seu contato! O seu resumo técnico de automação residencial foi gerado com sucesso.
Nossa equipe entrará em contato em breve via WhatsApp para alinhar os detalhes da visita e do orçamento físico.

--- DETALHES DO CLIENTE ---
Nome: ${clientName}
E-mail: ${clientEmail || 'Não informado'}
Telefone: ${clientPhone || 'Não informado'}

--- DETALHES DO PROJETO ---
Foco da Automação: ${eventType}
Data sugerida para visita: ${eventDate}
Endereço do Projeto: ${eventLocation}

--- DISPOSITIVOS SELECIONADOS ---
${eqList}

--- NOTAS ADICIONAIS / OBSERVAÇÕES ---
${details || 'Nenhuma'}

Atenciosamente,
Equipe SmartFlow
    `.trim();

    const adminEmailSubject = `[NOVO PEDIDO] Novo Trabalho: ${clientName}`;
    
    // Tratando o número de telefone para o link do WhatsApp (somos do Brasil, adicionar 55 se faltar)
    let cleanPhone = clientPhone ? clientPhone.replace(/\D/g, '') : '';
    // Adiciona código do país caso seja só (dd) + número (ex: 11999999999)
    if (cleanPhone && cleanPhone.length <= 11) {
      cleanPhone = '55' + cleanPhone;
    }
    const whatsappLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=Ol%C3%A1%20${encodeURIComponent(clientName)}%2C%20recebi%20seu%20pedido%20de%20projeto%20SmartFlow!` : 'Telefone não informado, verifique os dados.';

    const adminEmailBody = `
Olá! Uma nova solicitação de projeto/trabalho acaba de chegar.

Por favor, analise as informações abaixo e entre em contato com o cliente o mais rápido possível para fechar os detalhes.

--- DADOS DE CONTATO ---
Nome do Cliente: ${clientName}
Telefone/WhatsApp: ${clientPhone || 'Não informado'}
E-mail: ${clientEmail || 'Não informado'}

--- DETALHES DO TRABALHO ---
Objetivo/Foco: ${eventType}
Quando prefere a visita: ${eventDate}
Onde será (Endereço): ${eventLocation}

--- O QUE O CLIENTE QUER INSTALAR ---
${eqList}

--- OBSERVAÇÕES DO CLIENTE ---
${details || 'Nenhuma'}

=======================================================
👉 ENTRAR EM CONTATO:
Para falar direto com o cliente no WhatsApp, clique ou copie este link:
${whatsappLink}
=======================================================
    `.trim();

    if (smtpUser && smtpPass) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // 1. Send receipt/confirmation to client if they entered their email
      if (clientEmail) {
        try {
          await transporter.sendMail({
            from: `"SmartFlow Automação" <${smtpUser}>`,
            to: clientEmail,
            subject: emailSubject,
            text: emailBody
          });
          console.log(`E-mail de recibo enviado ao cliente: ${clientEmail}`);
        } catch (emailErr) {
          console.error("Erro ao enviar e-mail para o cliente:", emailErr);
        }
      }

      // 2. Send copy to stepfather's professional email (and fallback if clientEmail is blank)
      if (fallbackAndStepfatherEmail) {
        try {
          await transporter.sendMail({
            from: `"SmartFlow" <${smtpUser}>`,
            to: fallbackAndStepfatherEmail,
            subject: adminEmailSubject,
            text: adminEmailBody
          });
          console.log(`E-mail do integrador enviado para: ${fallbackAndStepfatherEmail}`);
        } catch (emailErr) {
          console.error("Erro ao enviar e-mail para o integrador:", emailErr);
        }
      }

      res.json({ success: true, message: "E-mails enviados com sucesso via SMTP!" });
    } else {
      console.log(`=== [SIMULADOR DE E-MAILS DE PROJETO] ===`);
      console.log(`Para e-mail cliente: ${clientEmail || 'Não fornecido'}`);
      console.log(`Assunto (Cliente): ${emailSubject}`);
      
      console.log(`\nPara e-mail padrasto/admin: ${fallbackAndStepfatherEmail}`);
      console.log(`Assunto (Admin): ${adminEmailSubject}`);
      console.log(`Conteúdo (Admin):\n${adminEmailBody}`);
      console.log(`=========================================`);
      console.log(`Configure os dados de SMTP no Painel Administrativo para ativar o envio de e-mails reais.`);
      
      res.json({ 
        success: true, 
        simulated: true, 
        message: "Solicitação processada no modo Demonstração! Entre no Painel do Integrador para configurar o SMTP real." 
      });
    }
  } catch (error: any) {
    console.error("Erro ao processar envio de e-mail:", error);
    res.status(500).json({ error: "Erro interno ao processar e-mail" });
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

