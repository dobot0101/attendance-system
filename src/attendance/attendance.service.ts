import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(@InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>, @InjectRepository(User) private readonly userRepository: Repository<User>) { }

  async checkIn(userDto: User): Promise<Attendance> {
    console.log('checkIn user: ', userDto);
    const user = await this.userRepository.findOne({ where: { id: userDto.id } })
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const latest = await this.attendanceRepository.findOne({
      where: {
        user: { id: user.id },
        checkInAt: MoreThanOrEqual(today),
      }, order: {
        checkInAt: 'DESC'
      }
    })
    if (latest) throw new Error('이미 출근 기록이 있습니다.');

    const attendance = this.attendanceRepository.create({
      user,
      checkInAt: new Date(),
    });

    return this.attendanceRepository.save(attendance);
  }

  async checkOut(userDto: User): Promise<Attendance> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await this.attendanceRepository.findOne({
      where: {
        user: { id: userDto.id },
        checkInAt: MoreThanOrEqual(today)
        // checkOutAt: IsNull()
      }, order: {
        checkInAt: 'DESC'
      }
    });

    if (!record) throw new Error('출근 기록이 없습니다.');
    if (record.checkOutAt) throw new Error('이미 퇴근 처리 되었습니다.');

    record.checkOutAt = new Date();
    return this.attendanceRepository.save(record);
  }


  async findMyRecords(userDto: User): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      where: {
        user: {
          id: userDto.id
        }
      },
      order: {
        checkInAt: 'DESC'
      }
    });
  }

  async findAll(): Promise<Attendance[]> {
    return this.attendanceRepository.find({
      relations: ['user'],
      order: {
        checkInAt: 'DESC'
      }
    })
  }
}
