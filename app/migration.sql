
-- docker volume create --name broadcast
-- docker run --name broadcast -e POSTGRES_PASSWORD=broadcast -p 54321:54321 -v /broadcast:/var/lib/postgresql/data -d postgres

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- create table user with uuid as primary key and username as unique and password
CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);


-- admin password: admin
INSERT INTO "user" (username, password) VALUES ('admin', '$2y$10$4vdkuf1yNPX.AVchl1He/u4nWkZD5SEh9.D7cznNfZ5ozz5AGbqC6');

-- create table "masjid" with "id" bigint generated by default as identity not null
-- "nama_masjid" text not null
-- "nama_ketua_dkm" text not null
-- "no_hp" text not null

CREATE TABLE IF NOT EXISTS "masjid" (
    id BIGSERIAL PRIMARY KEY,
    nama_masjid TEXT NOT NULL,
    nama_ketua_dkm TEXT NOT NULL,
    no_hp TEXT NOT NULL
);

-- create table "mubaligh" with "id" bigint generated by default as identity not null
-- "nama_mubaligh" text not null
-- "no_hp" text not null

CREATE TABLE IF NOT EXISTS "mubaligh" (
    id BIGSERIAL PRIMARY KEY,
    nama_mubaligh TEXT NOT NULL,
    no_hp TEXT NOT NULL
);

-- create table "masjid_mubaligh"
-- "id_masjid" foreign key (id_masjid) references masjid(id) on delete cascade
-- "id_mubaligh" foreign key (id_mubaligh) references mubaligh(id) on delete cascade

CREATE TABLE IF NOT EXISTS "masjid_mubaligh" (
    id_masjid BIGINT NOT NULL,
    id_mubaligh BIGINT NOT NULL,
    FOREIGN KEY (id_masjid) REFERENCES masjid(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mubaligh) REFERENCES mubaligh(id) ON DELETE CASCADE,
    PRIMARY KEY (id_masjid, id_mubaligh)
);

-- create table "jemaah" with "id" bigint generated by default as identity not null
-- "no_hp" text not null
-- "id_masjid" foreign key (id_masjid) references masjid(id) on delete cascade

CREATE TABLE IF NOT EXISTS "jemaah" (
    id BIGSERIAL PRIMARY KEY,
    no_hp TEXT NOT NULL,
    id_masjid BIGINT NOT NULL,
    FOREIGN KEY (id_masjid) REFERENCES masjid(id) ON DELETE CASCADE
);

-- create table "pengajian" with "id" bigint generated by default as identity not null
-- "tanggal" date not null
-- "waktu" text not null
-- id_masjid foreign key (id_masjid) references masjid(id) on delete cascade
-- id_mubaligh foreign key (id_mubaligh) references mubaligh(id) on delete cascade

CREATE TABLE IF NOT EXISTS "pengajian" (
    id BIGSERIAL PRIMARY KEY,
    tanggal DATE NOT NULL,
    waktu TEXT NOT NULL,
    id_masjid BIGINT NOT NULL,
    id_mubaligh BIGINT NOT NULL,
    FOREIGN KEY (id_masjid) REFERENCES masjid(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mubaligh) REFERENCES mubaligh(id) ON DELETE CASCADE
);

-- create table "jumatan" with "id" bigint generated by default as identity not null
-- "tanggal" timestamptz not null
-- "id_masjid" foreign key (id_masjid) references masjid(id) on delete cascade
-- "id_mubaligh" foreign key (id_mubaligh) references mubaligh(id) on delete cascade

CREATE TABLE IF NOT EXISTS "jumatan" (
    id BIGSERIAL PRIMARY KEY,
    tanggal TIMESTAMPTZ NOT NULL,
    id_masjid BIGINT NOT NULL,
    id_mubaligh BIGINT NOT NULL,
    FOREIGN KEY (id_masjid) REFERENCES masjid(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mubaligh) REFERENCES mubaligh(id) ON DELETE CASCADE
);


-- create table "template" with "id" bigint generated by default as identity not null
-- "nama" text not null
-- "content" text not null

create TYPE template_t as enum('pengajian_bulanan', 'pengajian_reminder', 'jumatan_reminder');

CREATE TABLE IF NOT EXISTS "template" (
    id BIGSERIAL PRIMARY KEY,
    nama_template TEXT UNIQUE NOT NULL, 
    content TEXT NOT NULL,
    type template_t NOT NULL
);