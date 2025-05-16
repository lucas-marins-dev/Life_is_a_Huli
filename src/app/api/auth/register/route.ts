import { randomBytes } from "crypto";

import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";

import bcrypt from "bcryptjs";


const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  if (!email || !senha) {
    return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 });
  }

  const existingUser = await prisma.usuarios.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: "Usuário já existe" }, { status: 400 });
  }

  const hashed = await bcrypt.hash(senha, 10);
  const token = randomBytes(6).toString("hex");

  const novoUsuario = await prisma.usuarios.create({
    data: {
      nome:'Luquinhas 123',
      email,
      senha: hashed,
      token,
      status: "ATIVO",
    },
  });

  return NextResponse.json({ message: "Usuário cadastrado com sucesso", usuario: novoUsuario });
}
