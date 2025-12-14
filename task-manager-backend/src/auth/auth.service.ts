import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyOtpAuthDto } from './dto/verifyOtp-auth.dto';
import { forgotPasswordAuthDto } from './dto/forgotpassword-auth.dto';
import { ResetPasswordDto } from './dto/resetpassword-auth.dto';
import { NameChangeAuthDto } from './dto/namechange-auth.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UploadsService } from 'src/uploads/uploads.service';
import { loginUserDto } from './dto/login-user.dto';
import { MailsService } from 'src/mails/mails.service';
import { OtpsService } from 'src/otps/otps.service';
import { Purpose } from 'src/otps/enum/purpose.enum';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private readonly otpsService: OtpsService,
    private readonly uploadsService: UploadsService,
    private jwtService: JwtService,
    private mailsService: MailsService
  ) { }

  async register(createAuthDto: CreateAuthDto) {
    if (createAuthDto.password != createAuthDto.confirmPassword) {
      throw new BadRequestException({ success: false, message: "Passwords do not match" });

    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(createAuthDto.password, saltOrRounds);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOTP = await bcrypt.hash(otp, saltOrRounds)

    const user = { name: createAuthDto.name, email: createAuthDto.email, password: hash }
    const OTP = { email: createAuthDto.email, otp: hashOTP, otpExpiry: new Date(Date.now() + 5 * 60 * 1000), resendAllowedAfter: new Date(Date.now() + 60 * 1000), purpose: Purpose.Register }

    await this.usersService.signUp(user)
    await this.otpsService.CreateOtp(OTP)
    await this.mailsService.sendmail(Purpose.Register, user.name, user.email, otp)


    return { status: 200, success: true, message: 'User register successfully', email: createAuthDto.email };
  }


  async login(loginUserDto: loginUserDto, respone: any) {
    const user = await this.usersService.findUser(loginUserDto.email)

    if (!user) {
      throw new UnauthorizedException({ success: false, message: "Invalid credentials" })
    }
    const isMatch = await bcrypt.compare(loginUserDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException({ success: false, message: "Invalid credentials" });
    }
    if (!user.twoFactorEnabled) {
      await this.setCookiees(user, respone)
      return { success: true, twofa: false, message: "User found successfully", user: { _id: user.id, name: user.name, role: user.role, image: (user.profilePic || null), twofa: user.twoFactorEnabled }}
    }

    const saltOrRounds = 10;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOTP = await bcrypt.hash(otp, saltOrRounds)

    const OTP = { otp: hashOTP, otpExpiry: new Date(Date.now() + 5 * 60 * 1000), resendAllowedAfter: new Date(Date.now() + 60 * 1000), purpose: Purpose.Login }

    await this.otpsService.UpdateOtp(user.email, OTP)
    await this.mailsService.sendmail(Purpose.Login, user.name, user.email, otp)

    return { success: true, twofa: true, message: 'User found successfully', email: loginUserDto.email };
  }

  async forgotPassword(forgotPasswordDto: forgotPasswordAuthDto) {
    const { email } = forgotPasswordDto

    const user = await this.usersService.findUser(email)

    if (!user) {
      throw new UnauthorizedException({ success: false, message: "User not found'" })
    }

    const saltOrRounds = 10;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOTP = await bcrypt.hash(otp, saltOrRounds)

    const OTP = { otp: hashOTP, otpExpiry: new Date(Date.now() + 5 * 60 * 1000), resendAllowedAfter: new Date(Date.now() + 60 * 1000), purpose: Purpose.ForgotPassword }

    await this.otpsService.UpdateOtp(user.email, OTP)
    await this.mailsService.sendmail(Purpose.ForgotPassword, user.name, user.email, otp)

    return { success: true, message: "OTP send to your email. Please verify", email }
  }

  async resendOtp(resendOtpDto: forgotPasswordAuthDto) {
    const { email } = resendOtpDto

    const user = await this.usersService.findUser(email)
    if (!user) {
      throw new UnauthorizedException({ success: false, message: "User not found'" })
    }

    const userOtp = await this.otpsService.findOtp(user.email)
    if (!userOtp) {
      throw new UnauthorizedException({ success: false, message: "User not found'" })
    }
    if (!userOtp.otp) {
      throw new UnauthorizedException({ success: false, message: "User not found'" })
    }
    const resendAllowed = userOtp.resendAllowedAfter.getTime() > Date.now()
    if (resendAllowed) {
      throw new BadRequestException({ success: false, message: "Please wait before resending OTP" })
    }

    const saltOrRounds = 10;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashOTP = await bcrypt.hash(otp, saltOrRounds)

    const OTP = { otp: hashOTP, otpExpiry: new Date(Date.now() + 5 * 60 * 1000), resendAllowedAfter: new Date(Date.now() + 60 * 1000), purpose: userOtp.purpose }

    await this.otpsService.UpdateOtp(user.email, OTP)
    await this.mailsService.sendmail(userOtp.purpose, user.name, user.email, otp)

    return { success: true, message: "OTP resent successfully", email }

  }

  async verifyOtp(verifyOtpDto: VerifyOtpAuthDto, respone: Response) {

    const user = await this.usersService.findUser(verifyOtpDto.email)
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const userOtp = await this.otpsService.findOtp(user.email)
    if (!userOtp) {
      throw new UnauthorizedException('User not found')
    }
    if (!userOtp.otp) {
      throw new UnauthorizedException('Invalid otp')
    }

    const isExpired = userOtp.otpExpiry.getTime() < Date.now()
    if(isExpired) {
      throw new BadRequestException("Otp has expired")
    }

    const isMatch = await bcrypt.compare(verifyOtpDto.otp, userOtp.otp);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid otp or email')
    }

    if (userOtp.purpose === "register") {
      await this.usersService.verifyUser(user.email, user.isVerified)
      await this.otpsService.otpNull(user.email)
      await this.setCookiees(user, respone)
      return { success: true, message: "Email verified successfully", purpose: 'register', user: { _id: user.id, name: user.name, role: user.role, image: (user.profilePic || null), twofa: user.twoFactorEnabled } }
    }
    else if (userOtp.purpose === "login") {
      await this.usersService.verifyUser(user.email, user.isVerified)
      await this.otpsService.otpNull(user.email)
      await this.setCookiees(user, respone)
      return { success: true, message: "Login successfully", purpose: 'login', user: { _id: user.id, name: user.name, role: user.role, image: (user.profilePic || null), twofa: user.twoFactorEnabled } }
    }
    else if (userOtp.purpose === "forgot-password") {
      await this.usersService.verifyUser(user.email, user.isVerified)
      await this.otpsService.otpNull(user.email)

      const payload = { _id: user.id, email: user.email };
      const tempToken = await this.jwtService.signAsync(payload, { expiresIn: '5m' });
      return { success: true, message: "OTP verified, proceed to reset password", purpose: 'forgot-password', token: tempToken }
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let payload = undefined as any
    try {
      payload = await this.jwtService.verifyAsync(resetPasswordDto.token, { secret: process.env.JWT_SECERET });
    } catch (e) {
      throw new UnauthorizedException({ success: false, message: "Invalid credentials" });
    }

    const user = await this.usersService.findUser(payload.email)
    if (!user) {
      throw new UnauthorizedException({ success: false, message: "User is not found" })
    }
    if (resetPasswordDto.password != resetPasswordDto.confirmPassword) {
      throw new BadRequestException({ success: false, message: "Passwords do not match" });
    }

    const saltOrRounds = 10;
    const hash = await bcrypt.hash(resetPasswordDto.password, saltOrRounds);

    await this.usersService.resetUserPassword(payload.email, hash)

    return { success: true, message: "Password Chenge you can login" }
  }

  async me(request: any) {
    const payload = await this.verifyToken(request.cookies.token)

    if (payload === null) {
      throw new UnauthorizedException({ success: false, auth: false, user: null });
    }
    const user = await this.usersService.findUserById(payload.id)

    return { success: true, auth: true, user: { _id: payload.id, name: user?.name, role: payload.role, image: (user?.profilePic || null), twofa: user?.twoFactorEnabled } }
  }

  async logout(response: any) {
    response.clearCookie("token", {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { success: true, message: "Logout successfully" }
  }

  async twofa(request: any) {
    await this.usersService.twofaEnabled(request.user.id)
    return { success: true, message: "twofo is enebled" }
  }

  async nameChange(nameChangeDto: NameChangeAuthDto, request: any){
    await this.usersService.nameChangeUser(request.user.id, nameChangeDto.name)
    return { success: true, message: "Name change successfully", name: nameChangeDto.name }
  }

  async imageUpload(file: Express.Multer.File, request: any){
    const user = await this.usersService.findUserById(request.user.id)
    if(user?.cloudinaryId){
      await this.uploadsService.deleteImage(user.cloudinaryId)
    }

    const result = await this.uploadsService.uploadImage(file.path, request.user.id)
    await this.usersService.imageSave(request.user.id, result)
    return { success: true, message: "Profile picture updated", url: result.secure_url }
  }


  private async setCookiees(user: any, response: any) {
    const payload = { id: user?.id, name: user?.name, role: user?.role };
    const token = await this.jwtService.signAsync(payload);
    response.cookie('token', token, {
      httpOnly: true,
      secure: false,
      path: '/',
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });
  }

  private async verifyToken(token: any) {
    try {
      return await this.jwtService.verifyAsync(token, { secret: process.env.JWT_SECERET });
    } catch (e) {
      return null
    }
  }

}
