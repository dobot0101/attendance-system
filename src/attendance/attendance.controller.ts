import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/user/user.entity';
import { AttendanceService } from './attendance.service';


@Controller('attendance')
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) { }

  @Post('check-in')
  checkIn(@Req() req) {
    console.log(req.user)
    return this.attendanceService.checkIn(req.user);
  }

  @Post('check-out')
  checkOut(@Req() req) {
    return this.attendanceService.checkOut(req.user);
  }

  @Get('me')
  getMyRecords(@Req() req) {
    return this.attendanceService.findMyRecords(req.user);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAll() {
    return this.attendanceService.findAll();
  }
}
