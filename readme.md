# Broadcast

## About

This is the repository that maintains the development of web applications intended for **broadcasting** "Jadwal Pengajian" (or Congregational Recitations/Lectures Schedule) and "Jadwal Jumatan" (or Friday Prayer Schedule) through **WhatsApp**.

## Tech Stacks Used

We used these tech stacks to develop this app:

1. Node.js + Typescript
   - Vite + React.js + TailwindCSS
   - Express.js
2. PostgreSQL
3. Docker

## Important Update
1. Resolving the problem of `whatsapp-web.js` package: using this [source of information](https://stackoverflow.com/questions/78265879/whatsapp-web-js-how-can-i-fix-typeerror-cannot-read-properties-of-null-readin). For more information, refer to [Issues #34](https://github.com/sendist/Broadcast/issues/34) on how to solve such issue.

## Guide
### User Guide
1. Access 127.0.0.1:5173 or to access the landing page containing calendar view of every schedule has been made
2. Access 127.0.0.1:5173/login to access the login page

### Development Guide

1. Clone this repository.

2. copy `.env.example` to `.env` both in root folder and the app folder.

3. Install dependencies.

   ```console
   $ cd app && npm i
   $ cd src/client && npm i
   $ cd ../.. && npx prisma generate
   ```

4. Run the 'app'.
   ```console
   $ npm run dev
   ```

### Deployment Guide

1. Clone this repository.

2. copy `.env.example` to `.env` both in root folder and the app folder.

   > ⚠️ **WARNING!** ⚠️
   >
   > DO NOT FORGET TO CHANGE ALL THE PASSWORDS AND CREDENTIALS IN BOTH .env files

3. If you wish to not use nginx, you can comment out the nginx service in `docker-compose.yml` file.
4. run `docker-compose up -d --build` in root folder.

## Author
This repository is maintained by Pancaswastamita team (est. December 2023), and are being contributed by the following honorable members:
1. Jovan Shelomo
2. Mey Meizia Galtiady
3. Nayara Saffa
4. Rachmat Purwa Saputra
5. Sendi Setiawan

Mahasiswa Program Studi DIV-Teknik Informatika<br/>
Jurusan Teknik Komputer dan Informatika<br/>
Politeknik Negeri Bandung<br/>
Copyright © 2024
