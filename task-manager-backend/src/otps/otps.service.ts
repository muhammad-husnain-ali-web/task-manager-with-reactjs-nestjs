import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OTP } from './entities/otp-entity';
import { Repository } from 'typeorm';
import { UpdateOtpDto } from './dto/update-otp.dto';
import { CreateOtpDto } from './dto/create-otp.dto';

@Injectable()
export class OtpsService {
    constructor(
            @InjectRepository(OTP)
            private otpsRepository: Repository<OTP>,
        ) { }

    async CreateOtp(createOtpDto: CreateOtpDto){
        const newOtp = this.otpsRepository.create({ ...createOtpDto });
            return await this.otpsRepository.save(newOtp)
    }

    async UpdateOtp(email: string, updateOtpDto: UpdateOtpDto){
        const otp = await this.otpsRepository.update({ email: email }, updateOtpDto)
        return otp
    }

    async findOtp(email: string){
        const otp = await this.otpsRepository.findOneBy( {email: email})
        return otp
    }

    async otpNull(email: string){
        const otpNull = {otp: null, resendAllowedAfter: null, otpExpiry: null} as any;
        const otp = await this.otpsRepository.update( {email: email}, otpNull)
        return otp
    }

}
