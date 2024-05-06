
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import generateOTP from '../utils/otpGenerator';
import { SendsmsService } from '../sendsms/sendsms.service';

@Injectable()
export class OtpService {
  constructor(private prismaService: PrismaService, private sendSmsService:SendsmsService){}

  async generateOTPFn(userId: string, phone: string, purpose: string){
    try {
      const otp = await generateOTP();

      await this.prismaService.otp.upsert({
        where: {id: userId},
        update: {otp: otp},
        create: {userId: userId, otp: otp, purpose: purpose},
      })

      await this.sendSmsService.sendSMSFn({
        phoneNumber: phone,
        message: 'Your OTP is'+ otp,
      })

      return otp
    } catch (error) {
      console.log(error)
      throw new Error(error)
    }
  }

  async verifyOTP(userId: string, otp: string): Promise<boolean> {
    try {
      
      const otpRecord = await this.prismaService.otp.findUnique({
        where: { id: userId },
      });

      
      if (!otpRecord) {
        return false;
      }

      
      return otpRecord.otp === otp;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error('Failed to verify OTP');
    }
  }
}
