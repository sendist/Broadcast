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

## Updates
1. Access 127.0.0.1:5173 or 127.0.0.1:5173/ to access the landing page
2. Access 127.0.0.1:5173/login to access the login page

## Development Guide

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
   $ cd .. && npm run dev
   ```

## Deployment Guide

1. Clone this repository.

2. copy `.env.example` to `.env` both in root folder and the app folder.

   > ⚠️ **WARNING!** ⚠️
   >
   > DO NOT FORGET TO CHANGE ALL THE PASSWORDS AND CREDENTIALS IN BOTH .env files

3. If you wish to not use nginx, you can comment out the nginx service in `docker-compose.yml` file.
4. run `docker-compose up -d --build` in root folder.
