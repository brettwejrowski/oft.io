import { Link } from "react-router-dom";
import { useMe, useSignOut } from "@placewise/shared";
import { useAuthDialog } from "../contexts/AuthContext";

export default function Navbar() {
  const { data: user } = useMe();
  const { openAuthDialog } = useAuthDialog();
  const signOut = useSignOut();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        Placewise
      </Link>
      <div className="flex items-center gap-4">
        <Link to="/submit" className="text-sm text-gray-600 hover:text-indigo-600">
          + Submit
        </Link>
        {user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-800">{user.username}</span>
            <button
              onClick={signOut}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={openAuthDialog}
            className="text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
          >
            Sign in
          </button>
        )}
      </div>
    </nav>
  );
}
