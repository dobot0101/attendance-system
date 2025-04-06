import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post('check-in')
  checkIn(@Req() req) {
    return this.attendanceService.checkIn(req.user);
  }

  @Post('check-out')
  checkOut(@Req() req) {
    return this.attendanceService.checkOut(req.user);
  }

  @Get('me')
  getMyRecords(@Req() req) {
    return this.attendanceService.checkOut(req.user);
  }

  @Get()
  getAll() {
    return this.attendanceService.findAll();
  }
}
