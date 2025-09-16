import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { CompleteGoogleRegistrationDto } from "./dto/complete-google-registration.dto";
import { codeVerificationDto } from "./dto/code.verification.dto";
import { FirebaseAdminService } from "src/firebase/firebase.service";
import { PrismaService } from "src/prisma/prisma.service";
import { EmailService } from "src/common/email/email.service";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { ResetPasswordDto } from "./dto/reset-password.dto";
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private firebaseService: FirebaseAdminService,
    private prisma: PrismaService,
    private emailServ: EmailService
  ) {}

  //REGISTRAR USUARIO
  async register(registerDto: RegisterAuthDto) {
    const existUsu = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    const existDni = await this.prisma.user.findUnique({
      where: { dni: registerDto.dni },
    });

    if (existUsu) {
      throw new UnauthorizedException(
        "La dirección de correo electrónica ya se encuentra registrada."
      );
    }

    if (existDni) {
      throw new UnauthorizedException("El DNI ya se encuentra registrado.");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 30 * 60 * 1000);

    const createdUser = await this.prisma.user.create({
      data: {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
        password: hashedPassword,
        role: (registerDto.role as Role) || Role.student,
        dni: registerDto.dni,
        isEmailVerified: false,
        resetCode: code,
        resetCodeExpires: expiration,
      },
    });

    await this.emailServ.sendEmailVerification({
      email: registerDto.email,
      code,
    });

    return {
      message:
        "Usuario creado. Verifique su correo electrónico a través del código que se le enviará a su correo electrónico. El mismo expirará en 30 minutos.",
      userId: createdUser.id,
    };
  }

  //VERIFICAR CORREO
  async verifyEmailCode(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Correo no registrado");
    }

    if (user.resetCode !== code) {
      throw new UnauthorizedException("Código inválido");
    }
    if (!user.resetCodeExpires || user.resetCodeExpires < new Date()) {
      throw new UnauthorizedException("Código expirado");
    }

    await this.prisma.user.update({
      where: { email },
      data: {
        isEmailVerified: true,
        resetCode: null,
        resetCodeExpires: null,
      },
    });

    return { message: "Correo verificado con éxito" };
  }

  //REENVIAR CORREO
  async resendVerificationEmail(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Correo no registrado");
    }

    if (user.isEmailVerified) {
      throw new BadRequestException("El correo ya fue verificado");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 30 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expiration;
    await this.prisma.user.update({ where: { email }, data: user });

    await this.emailServ.sendEmailVerification({ email: user.email, code });

    return {
      message:
        "Se ha reenviado el código de verificación. Expira en 30 minutos",
    };
  }

  //INICIAR SESIÓN
  async login(dto: LoginAuthDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException([
        "email: El correo electrónico no está registrado en nuestro sistema",
      ]);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException([
        "password: La contraseña es incorrecta",
      ]);
    }

    if (!user.isEmailVerified) {
      throw new UnauthorizedException([
        "email: Por favor, verifica tu correo electrónico antes de iniciar sesión",
      ]);
    }

    const payload = {
      sub: user.id,
      sessionVersion: user.sessionVersion + 1,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return { token };
  }

  //INICIAR SESIÓN CON GOOGLE
  async loginWithGoogle(idToken: string) {
    const decoded = await this.firebaseService.verifyToken(idToken);
    const { email, name } = decoded;

    if (!email) {
      console.log("no hay mail en fire");
      throw new UnauthorizedException("Token sin email");
    }

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        needsRegistration: true,
        partialUserData: {
          email,
          name: name || "",
        },
      };
    }

    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
      await this.prisma.user.update({ where: { email }, data: user });
    }

    const payload = {
      sub: user.id,
      sessionVersion: user.sessionVersion,
      role: user.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      needsRegistration: false,
    };
  }

  //COMPLETAR REGISTRO CON GOOGLE
  async completeGoogleRegistration(
    userData: CompleteGoogleRegistrationDto,
    googleEmail: string
  ) {
    if (userData.email !== googleEmail) {
      throw new BadRequestException(
        "El correo electrónico no coincide con el autenticado en Google"
      );
    }

    const existing = await this.prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existing) {
      throw new BadRequestException("El usuario ya existe");
    }

    const randomPassword = crypto.randomBytes(12).toString("hex") + "A1";
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const createdUser = await this.prisma.user.update({
      where: { email: userData.email },
      data: {
        email: userData.email,
        dni: userData.dni,
        role: userData.role || Role.student,
        password: hashedPassword,
        isEmailVerified: true,
      },
    });

    const payload = {
      sub: createdUser.id,
      sessionVersion: createdUser.sessionVersion,
      role: createdUser.role,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      message: "Registro con Google completado exitosamente",
    };
  }

  //RECUPERAR CONTRASEÑA
  async requestPasswordReset(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email: email } });
    if (!user) {
      throw new Error("El correo electrónico no existe");
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    user.resetCode = code;
    user.resetCodeExpires = expires;
    await this.prisma.user.update({ where: { email }, data: user });

    await this.emailServ.sendPasswordResetCode({ email, code });

    return {
      message:
        "Se ha enviado un código de recuperación al correo, este expirará en 10 minutos",
    };
  }

  //VERIFICAR CODIGO DEL CORREO
  async verifyResetCode(email: string, code: string, dto: codeVerificationDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(
        "El correo electrónico no está registrado"
      );
    }

    if (
      !user.resetCode ||
      !user.resetCodeExpires ||
      user.resetCode !== code ||
      user.resetCodeExpires < new Date()
    ) {
      throw new UnauthorizedException("El código es inválido o ha expirado");
    }

    return { message: "Código válido" };
  }

  //CAMBIAR CONTRASEÑA
  async resetPassword(dto: ResetPasswordDto) {
    const { email, code, newPassword } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException(
        "El correo electrónico no está registrado"
      );
    }

    // Validar el código
    if (
      !user.resetCode ||
      user.resetCode !== code ||
      !user.resetCodeExpires ||
      user.resetCodeExpires < new Date()
    ) {
      throw new BadRequestException("El código es inválido o ha expirado");
    }

    // Validar que la nueva contraseña no sea igual a la actual
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        "La nueva contraseña no puede ser igual a la anterior"
      );
    }

    // Guardar nueva contraseña
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = null;
    user.resetCodeExpires = null;
    user.sessionVersion = (user.sessionVersion ?? 0) + 1;

    await this.prisma.user.update({ where: { email }, data: user });

    return { message: "La contraseña ha sido actualizada exitosamente" };
  }
}
