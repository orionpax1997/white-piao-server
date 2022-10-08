import Image from 'next/image';
import Link from 'next/link';

import { useSession, signIn, signOut } from 'next-auth/react';

const Layout: React.FC = ({ children }) => (
  <div className="container mx-auto min-h-screen">
    <Navbar />
    <div className="flex flex-col justify-around h-[calc(100vh-66px)]">{children}</div>
  </div>
);

const Navbar = () => {
  const { data: session, status } = useSession();
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <Link href={`/`}>
          <a className="btn btn-ghost normal-case text-xl">WhitePiaoServer</a>
        </Link>
      </div>
      {status === 'authenticated' ? (
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {session.user?.image && <Image src={session.user?.image} alt="avatar" width={40} height={40} />}
            </div>
          </label>
          <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
            <li>
              <a>{session.user?.name}</a>
            </li>
            <li>
              <a onClick={() => signOut()}>Logout</a>
            </li>
          </ul>
        </div>
      ) : (
        <button className="btn btn-outline" onClick={() => signIn('github')}>
          Sign in
        </button>
      )}
    </div>
  );
};

export default Layout;
