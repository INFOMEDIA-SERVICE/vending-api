CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL CHECK (name <> ''),
    price BIGINT NOT NULL,
    image text,
    machine_id TEXT NOT NULL CHECK (machine_id <> ''),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    constraint pk_products primary key(id)
);

CREATE TABLE IF NOT EXISTS vendings(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL CHECK (name <> ''),
    machine_id TEXT NOT NULL UNIQUE CHECK (machine_id <> ''),
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    constraint pk_vendings primary key(id)
);

CREATE TABLE IF NOT EXISTS users(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    first_name text NOT NULL CHECK (username <> ''),
    last_name text NOT NULL CHECK (username <> ''),
    email text NOT NULL UNIQUE,
    password text NOT NULL,
    requests int NOT NULL DEFAULT 0,
    role int NOT NULL DEFAULT 0,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    constraint pk_users primary key(id)
);

-- CREATE TABLE IF NOT EXISTS clients(
--     id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
--     name text NOT NULL CHECK (name <> ''),
--     email text NOT NULL UNIQUE,
--     password text NOT NULL,
--     requests int NOT NULL DEFAULT 0,
--     status BOOLEAN DEFAULT true,
--     created_at TIMESTAMP DEFAULT NOW(),
--     updated_at TIMESTAMP DEFAULT NOW(),
--     constraint pk_clients primary key(id)
-- );

SELECT * FROM products;
