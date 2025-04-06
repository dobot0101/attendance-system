import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { IsNull, MoreThan, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>) {
  }

  async checkIn(user: User): Promise<Attendance> {
    const today = new Date();
    const latest = await this.attendanceRepository.findOne({
      where: {
        user: { id: user.id },
        checkIn: MoreThan(new Date(today.setHours(0, 0, 0, 0))),
      }, order: {
        checkIn: 'DESC'
      }
    })
    if (latest) throw new Error('이미 출근 기록이 있습니다.');

    const attendance = this.attendanceRepository.create({
      user,
      checkIn: new Date(),
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(user: User): Promise<Attendance> {
    const latest = await this.attendanceRepository.findOne({
      where: {
        user: { id: user.id },
        checkOut: IsNull()
      }, order: {
        checkIn: 'DESC'
      }
    });

    if (!latest) throw new Error('출근 기록이 없습니다.');

    latest.checkOut = new Date();
    return this.attendanceRepository.save(latest);
  }


  async findMyRecords(user: User): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        user: {
          id: user.id
        }
      },
      order: {
        checkIn: 'DESC'
      }
    });
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['user'],
      order: {
        checkIn: 'DESC'
      }
    })
  }
}
