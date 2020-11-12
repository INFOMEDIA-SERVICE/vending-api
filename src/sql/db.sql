CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    name text NOT NULL CHECK (name <> ''),
    price integer NOT NULL,
    image text,
    description text,
    quantity integer DEFAULT 0,
    item text NOT NULL,
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
    errors integer DEFAULT 0,
    dispended integer DEFAULT 0,
    image text NOT NULL,
    requests integer DEFAULT 0,
    status BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    constraint pk_vendings primary key(id)
    constraint fk_user_id FOREIGN KEY (products) REFERENCES products (id)
);

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
    constraint pk_users primary key(id)
);

CREATE TABLE IF NOT EXISTS services(
    id varchar(64) NOT NULL DEFAULT uuid_generate_v4(),
    machine_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    products text[][],
    value integer NOT NULL,
    success boolean default true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    constraint pk_services primary key(id)
);

INSERT INTO services(machine_id, user_id, products, success) VALUES(
    'STM32-1234567891',
    '4a141b23-22e8-4807-b653-fe4615fb8687',
    '{{"id","9253f8c3-7988-43c2-a933-27964e5219a0","dispensed",true},{"id","9253f8c3-7988-43c2-a933-27964e5219a0","dispensed",true}}',
    true
) RETURNING *;


