import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  vus: 700,          // จำลองผู้ใช้ 700 คนพร้อมกัน
  duration: '30s',   // ให้รันเป็นเวลา 30 วินาที
};

export default function () {
  http.get('https://ncounit.inf-school.com/detail'); // URL ของเว็บคุณ
  sleep(1);
}
