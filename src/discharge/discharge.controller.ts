import { BadRequestException, Body, Controller, Get, Patch, Post, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UserRoles } from 'src/decorators/roles/roles.decorator';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { Roles } from 'src/users/users.service';
import { DischargeService } from './discharge.service';
import { CreateDischargeDto } from './dto/create-discharge.dto';
import { GetDischargeRequestsDto } from './dto/get-discharge-requests';
import { UpdateDischargeRequestDto } from './dto/update-discharge-request.dto';
import { GetDischargeRequestDto } from './dto/get-discharge-request';

@Controller('discharge')
export class DischargeController {
  constructor(private readonly dischargeService: DischargeService) { }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.FACILITY)
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

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Patch('update')
  updateDischarge(@Body() body: UpdateDischargeRequestDto) {
    return this.dischargeService.updateDischarge(body);
  }

  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('requests')
  findDischargeRequests(@Query() query: GetDischargeRequestsDto) {
    return this.dischargeService.findDischargeRequests(query);
  }


  @UseGuards(RolesGuard)
  @UserRoles(Roles.ADMIN)
  @Get('request')
  getDischargeRequest(@Query() query: GetDischargeRequestDto) {
    return this.dischargeService.getDischargeRequest(query);
  }

}
