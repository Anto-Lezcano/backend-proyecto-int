import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { verificationDto } from "./dto/verification.dto";
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "insightfinance485@gmail.com",
        pass: process.env.EMAIL_PASS || "orduimfudewyublr",
      },
    });
  }

  async sendPasswordResetCode(dto_verifi: verificationDto) {
    await this.transporter.sendMail({
      from: `"ClimaGuard" <${process.env.EMAIL_USER || "insightfinance485@gmail.com"}>`,
      to: dto_verifi.email,
      subject: "Código de recuperación de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Recuperación de contraseña</h2>
          <p>Hola,</p>
          <p>Este es tu código para restablecer la contraseña:</p>
          <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${dto_verifi.code}</div>
          <p>Este código expirará en 10 minutos.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        </div>
      `,
    });
  }

  async sendEmailVerification(dto_verifi: verificationDto) {
    await this.transporter.sendMail({
      from: `"ClimaGuard" <${process.env.EMAIL_USER || "insightfinance485@gmail.com"}>`,
      to: dto_verifi.email,
      subject: "Verificación de correo",
      html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <h2>Verificación de correo</h2>
            <p>Hola,</p>
            <p>Para completar tu registro, por favor verifica tu correo electrónico:</p>
            <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${dto_verifi.code}</div>
            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
          </div>
        `,
    });
  }
}
