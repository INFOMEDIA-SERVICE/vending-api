CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    first_name text NOT NULL CHECK (first_name <> ''),
    last_name text NOT NULL CHECK (last_name <> ''),
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    requests int NOT NULL DEFAULT 0,
    role int NOT NULL DEFAULT 0,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT pk_users PRIMARY KEY(id)
);

CREATE SEQUENCE serial START 1001;

CREATE TABLE IF NOT EXISTS services(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    machine_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    reference smallint DEFAULT nextval('serial'),
    value integer NOT NULL,
    success boolean default true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT pk_services PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS dispensed_products(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    service_id varchar(64) NOT NULL CHECK (service_id <> ''),
    dispensed boolean default true,
    value real NOT NULL,
    key varchar(64) NOT NULL CHECK (key <> ''),
    FOREIGN KEY(service_id) REFERENCES services(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT pk_dispensed_products PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS tokens(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    refresh_token text NOT NULL CHECK (refresh_token <> ''),
    token text NOT NULL CHECK (token <> ''),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT pk_tokens PRIMARY KEY(id)
);
