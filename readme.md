# Broadcast

## About
This is the repository that maintains the development of web applications intended for <bold>broadcasting</bold> "Jadwal Pengajian" (or Congregational Recitations/Lectures Schedule) and "Jadwal Jumatan" (or Friday Prayer Schedule) through <bold>WhatsApp</bold>.

## Tech Stack Used
There are several tech stacks used, namely:
<ol>
  <li>React</li>
  <li>Vite</li>
  <li>Node.js and Express.js</li>
  <li>PostgreSQL</li>
  <li>Typescript</li>
  <li>Docker (as container)</li>
</ol>

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
