import {
  Controller,
  Post,
  Body,
  Get,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { CompleteGoogleRegistrationDto } from "./dto/complete-google-registration.dto";
import { verificationDto } from "src/common/email/dto/verification.dto";
import { EmailService } from "src/common/email/email.service";
import { Response } from "express";
import { ResetPasswordDto } from "./dto/reset-password.dto";
import { codeVerificationDto } from "./dto/code.verification.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/guard/jwt-auth.guard";
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private mailService: EmailService
  ) {}

  //VALIDAR TOKEN
  @UseGuards(JwtAuthGuard)
  @Get("protected-routes")
  getProfile() {}

  //registro

  @Post("register")
  register(@Body() registerDto: RegisterAuthDto) {
    return this.authService.register(registerDto);
  }

  //iniciar sesion
  @Post("login")
  async login(
    @Body() loginDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.login(loginDto);
    res.cookie("access_token", result.token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { message: "Se ha iniciado sesión exitosamente" };
  }

  //Iniciar sesion con google
  @Post("login-with-google")
  async loginWithGoogle(
    @Body() idToken: string,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const result = await this.authService.loginWithGoogle(idToken);

      if (result.needsRegistration) {
        return {
          needsRegistration: true,
          partialUserData: result.partialUserData,
        };
      }

      res.cookie("access_token", result.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return { message: "Se ha iniciado sesión exitosamente" };
    } catch (error) {
      throw new UnauthorizedException("Token inválido o expirado");
    }
  }

  // Completar el registro con google
  @Post("complete-google-registration")
  completeGoogleRegistration(
    @Body() userData: CompleteGoogleRegistrationDto,
    googleEmail: string
  ) {
    return this.authService.completeGoogleRegistration(userData, googleEmail);
  }

  // Reenviar el correo
  @Post("resend-verification-email")
  resendVerificationEmail(@Body() email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  // Verificar el código
  @Post("verify-email-code")
  verifyEmailCode(@Body() verificationDto: verificationDto) {
    return this.authService.verifyEmailCode(
      verificationDto.email,
      verificationDto.code
    );
  }

  // Cerrar sesión
  @Post("logout")
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token");
    return { message: "Se ha cerrado sesión exitosamente" };
  }

  // Primero: solicitar codigo para recuperar contraseña
  @Post("forgot-password")
  async forgotPassword(@Body("email") email: string) {
    return this.authService.requestPasswordReset(email);
  }

  // Segundo: cambiar la contraseña la contraseña (recuperar)
  @Post("reset-password")
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  // Primero: verificar el código
  @Post("verify-reset-code")
  async verifyResetCode(
    @Body("email") email: string,
    @Body("code") code: string,
    dto: codeVerificationDto
  ) {
    return this.authService.verifyResetCode(email, code, dto);
  }

  @Post("verify-email")
  async verifyEmail(@Body("email") email: string, @Body("code") code: string) {
    await this.authService.verifyEmailCode(email, code);
    return { verified: true };
  }

  @Post("resend-verification-email")
  async resendVerification(@Body("email") email: string) {
    return await this.authService.resendVerificationEmail(email);
  }
}
