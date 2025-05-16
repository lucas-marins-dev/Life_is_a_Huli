import { getServerSession } from "next-auth";

import { authOptions } from "../../api/auth/[...nextauth]/route"

import LogoutButton from "@/components/LogoutButton";

import { redirect } from "next/navigation";

export default async function Page() {

  const session = await getServerSession(authOptions);


  return (<div>

    <div>
      {session&&session.user ?(<div>
      <p>Bem-vindo ao Dashboard, {session.user.email}!</p>
      <LogoutButton/>
      </div>
    ):(redirect('/login'))}
    </div>


  </div>
)
}


