import { randomBytes } from "crypto";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { 
      nome, 
      email, 
      senha, 
      dataNascimento,
      telefone, 
      endereco, 
      numero, 
      complemento, 
      bairro, 
      cidade, 
      estado, 
      cep 
    } = await req.json();

    // Validações básicas
    if (!nome || !email || !senha || !dataNascimento) {
      return NextResponse.json(
        { error: "Nome, email, senha e data de nascimento são obrigatórios" }, 
        { status: 400 }
      );
    }

    // Validar data de nascimento
    const nascimentoDate = new Date(dataNascimento);
    const hoje = new Date();
    const idade = hoje.getFullYear() - nascimentoDate.getFullYear();
    
    if (idade < 13) {
      return NextResponse.json(
        { error: "É necessário ter pelo menos 13 anos para se cadastrar" }, 
        { status: 400 }
      );
    }

    if (idade > 120) {
      return NextResponse.json(
        { error: "Data de nascimento inválida" }, 
        { status: 400 }
      );
    }

    // Verificar se o usuário já existe
    const existingUser = await prisma.usuarios.findUnique({ 
      where: { email } 
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Já existe um usuário com este email" }, 
        { status: 400 }
      );
    }

    // Criptografar a senha
    const hashed = await bcrypt.hash(senha, 10);
    
    // Gerar token único
    const token = randomBytes(6).toString("hex");
    
    // Gerar token único maior (se necessário para outro propósito)
    const tokenSenha = randomBytes(32).toString("hex");

    // Criar o usuário no banco de dados
    const novoUsuario = await prisma.usuarios.create({
      data: {
        nome,
        email,
        senha: hashed,
        dataNascimento: new Date(dataNascimento),
        token,
        telefone: telefone || null,
        endereco: endereco || null,
        numero: numero || null,
        complemento: complemento || null,
        bairro: bairro || null,
        cidade: cidade || null,
        estado: estado || null,
        cep: cep || null, // Usando o campo "esp" para armazenar o CEP
        status: "ATIVO",
        roles: "USER", // Definindo um valor padrão para roles
        perfil: "PADRAO", // Definindo um valor padrão para perfil
        tokenSenha: tokenSenha,
        data: new Date(),
        dataUltimoAcesso: new Date(),
      },
    });

    // Remover a senha hash da resposta
    const { senha: _, ...usuarioSemSenha } = novoUsuario;

    return NextResponse.json(
      { 
        message: "Usuário cadastrado com sucesso", 
        usuario: usuarioSemSenha 
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    );
  }
}
