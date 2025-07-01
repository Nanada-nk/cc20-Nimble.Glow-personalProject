### Use pnpm

----------ApiServer----------  

1.สร้างโปรเจกต์ใหม่
- pnpm init

2.ติดตั้งแพ็กเกจที่ต้องใช้
- pnpm add express cors jsonwebtoken bcryptjs yup morgan multer dotenv express-rate-limit compression argon2

3.ติดตั้ง Prisma และ Client
- pnpm add -D prisma          # ติดตั้ง prisma CLI (ใช้ตอน dev)
- pnpm add @prisma/client    # ติดตั้ง Prisma Client (ใช้ทั้ง dev/prod)

4.สร้างไฟล์ตั้งต้นและ schema
- pnpm exec prisma init      # สร้าง prisma/schema.prisma และ .env

5.อัปเดตฐานข้อมูลจาก schema
- pnpm exec prisma db push # แบบไม่มี migration history (ใช้ตอน dev/test)
- pnpm exec prisma migrate dev --name init # แบบมี migration (แนะนำสำหรับ production)

6.Generate Prisma Client
- pnpm exec prisma generate

7.เปิด Prisma Studio (GUI สำหรับดู/แก้ไขข้อมูล)
- pnpm exec prisma studio

8.อัปเดตฐานข้อมูลบน Production
- pnpm exec prisma migrate deploy

9.รีเซ็ตฐานข้อมูล (ลบข้อมูลทั้งหมด & apply schema ใหม่)
- pnpm exec prisma db reset

---

----------web----------  

1.สร้างโปรเจกต์ Vite
- pnpm create vite@latest .  

2.ติดตั้ง Tailwind CSS และปลั๊กอิน
- pnpm add tailwindcss @tailwindcss/vite  

3.ติดตั้ง DaisyUI (Tailwind component library)
- pnpm add -D daisyui@latest  

4.ติดตั้ง state management และ utility libraries
- pnpm add zustand react-router lucide-react yup react-toastify axios  

5.ติดตั้ง React Hook Form และ Resolver
- pnpm add @hookform/resolvers react-hook-form  

6.เริ่มรันโปรเจกต์
- pnpm dev
