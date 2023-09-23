# Broadcast

## About
This is the repository that maintains the development of web applications intended for **broadcasting** "Jadwal Pengajian" (or Congregational Recitations/Lectures Schedule) and "Jadwal Jumatan" (or Friday Prayer Schedule) through **WhatsApp**.

## Tech Stack Used
There are several tech stacks used, namely:
1. React
2. Vite
3. Node.js and Express.js
4. PostgreSQL
5. Typescript
6. Docker (as container)

## Guide

1. Clone this repository
2. copy `.env.example` to `.env`
3. Install dependencies

```console
$ cd app && npm i
$ cd src/client && npm i
$ cd ../.. && npx prisma generate
```

4. Run the app

```console
$ cd .. && npm run dev
```
