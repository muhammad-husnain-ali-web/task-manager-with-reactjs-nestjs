import { Module } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OTP } from './entities/otp-entity';

@Module({
    imports: [TypeOrmModule.forFeature([OTP])],
    providers: [OtpsService],
    exports: [OtpsService]
})
export class OtpsModule {}
