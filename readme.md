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

## Guide

1. Clone this repository.

2. copy `.env.example` to `.env` in app folder.

3. Install dependencies.
   ```console
   $ cd app && npm i
   $ cd src/client && npm i
   $ cd ../.. && npx prisma generate
   ```

   Worth noting:
   Before running the app, make sure you have concurrently installed locally by running this command:
   ```console
   $ npm i -D concurrently
   ```

4. Run the 'app'.
   ```console
   $ cd .. && npm run dev
   ```
