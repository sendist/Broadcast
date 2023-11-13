CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create TYPE role_t as enum('superadmin', 'admin');

CREATE TABLE IF NOT EXISTS "user" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role role_t NOT NULL
);

-- admin and superadmin password: "admin"
INSERT INTO "user" (username, password, role) VALUES ('admin', '$2y$10$4vdkuf1yNPX.AVchl1He/u4nWkZD5SEh9.D7cznNfZ5ozz5AGbqC6', 'admin');
INSERT INTO "user" (username, password, role) VALUES ('superadmin', '$2y$10$4vdkuf1yNPX.AVchl1He/u4nWkZD5SEh9.D7cznNfZ5ozz5AGbqC6', 'superadmin');

CREATE TABLE IF NOT EXISTS "masjid" (
    id BIGSERIAL PRIMARY KEY,
    nama_masjid TEXT NOT NULL,
    nama_ketua_dkm TEXT NOT NULL,
    no_hp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "mubaligh" (
    id BIGSERIAL PRIMARY KEY,
    nama_mubaligh TEXT NOT NULL,
    no_hp TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "pengajian" (
    id BIGSERIAL PRIMARY KEY,
    tanggal DATE NOT NULL,
    waktu TEXT NOT NULL,
    id_masjid BIGINT NOT NULL,
    id_mubaligh BIGINT NOT NULL,
    broadcasted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_masjid) REFERENCES masjid(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mubaligh) REFERENCES mubaligh(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "jumatan" (
    id BIGSERIAL PRIMARY KEY,
    tanggal DATE NOT NULL,
    id_masjid BIGINT NOT NULL,
    id_mubaligh BIGINT NOT NULL,
    broadcasted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (id_masjid) REFERENCES masjid(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mubaligh) REFERENCES mubaligh(id) ON DELETE CASCADE
);

create TYPE template_t as enum('pengajian_bulanan', 'pengajian_reminder', 'jumatan_reminder');

CREATE TABLE IF NOT EXISTS "template" (
    id BIGSERIAL PRIMARY KEY,
    nama_template TEXT UNIQUE NOT NULL, 
    content TEXT NOT NULL,
    type template_t NOT NULL
);

create TYPE message_status_t as enum('success', 'failed');

CREATE TABLE IF NOT EXISTS "message_logs" (
    id BIGSERIAL PRIMARY KEY,
    no_hp TEXT NOT NULL,
    message TEXT NOT NULL,
    status message_status_t NOT NULL,
    send_time TIMESTAMPTZ NOT NULL,
    error_reason TEXT
);

CREATE TABLE IF NOT EXISTS "broadcast_schedule" (
    id template_t PRIMARY KEY,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    force_broadcast BOOLEAN NOT NULL DEFAULT FALSE,
    h INT NOT NULL DEFAULT 0,
    jam timetz NOT NULL DEFAULT '00:00:00',
    id_template_dkm BIGINT,
    id_template_mubaligh BIGINT,
    FOREIGN KEY (id_template_dkm) REFERENCES template(id) ON DELETE NO ACTION,
    FOREIGN KEY (id_template_mubaligh) REFERENCES template(id) ON DELETE NO ACTION
);

INSERT INTO "broadcast_schedule" (id, active, force_broadcast, h, jam) VALUES
('pengajian_bulanan', FALSE, FALSE, 0, '00:00:00'),
('pengajian_reminder', FALSE, FALSE, 0, '00:00:00'),
('jumatan_reminder', FALSE, FALSE, 0, '00:00:00');