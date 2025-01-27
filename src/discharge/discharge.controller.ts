import { BadRequestException, Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { DischargeService } from './discharge.service';
import { CreateDischargeDto } from './dto/create-discharge.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('discharge')
export class DischargeController {
  constructor(private readonly dischargeService: DischargeService) { }

  @Post('request')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
  ], {
    fileFilter: (req, file, cb) => {
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
        return cb(new BadRequestException('Invalid file type'), false);
      }
      cb(null, true);
    }
  }))
  uploadFile(@Body() body: CreateDischargeDto, @UploadedFiles() files: { files: Express.Multer.File[] }) {


    const url = process.env.API_URL || 'http://localhost:4500/';



    const paths = files.files.map(file => url + file.path);


    return this.dischargeService.create(body, paths);
  }

}
