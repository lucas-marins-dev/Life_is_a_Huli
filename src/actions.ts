'use server'

import { getServerSession } from "next-auth";

import { authOptions } from "../src/app/api/auth/[...nextauth]/route"





export async function verificarSessao(){

  const session = await getServerSession(authOptions);

  if (session) {
    return session
  }

  return null
}

export async function LogOut(){


}
