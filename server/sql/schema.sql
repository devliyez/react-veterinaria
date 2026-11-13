CREATE DATABASE IF NOT EXISTS veterinaria;
USE veterinaria;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(150) NOT NULL UNIQUE,
  contraseña VARCHAR(100) NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  precio DECIMAL(10,2) NOT NULL,
  duracion_min INT NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  servicio_id INT NOT NULL,
  cliente VARCHAR(100) NOT NULL,
  mascota VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL,
  telefono char(9) NOT NULL,
  fecha_hora DATETIME NOT NULL,
  estado ENUM('pendiente','confirmado','cancelado') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reserva_servicio FOREIGN KEY (servicio_id)
    REFERENCES servicios(id) ON DELETE RESTRICT,
  INDEX idx_fecha (fecha_hora),
  INDEX idx_estado (estado)
);
