import { Injectable } from '@nestjs/common';

@Injectable()
export class DatePicker {
  monthRange() {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return {
      startOfMonth,
      endOfMonth,
    };
  }
}
