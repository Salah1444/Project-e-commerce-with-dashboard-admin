import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDown, Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '@/store/userSlice';
import { Link } from 'react-router-dom';
import { useDarkMode } from '@/hooks/use-darkMode';
export default function DropDown() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);
     const [dark, setDark] = useDarkMode();
  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full    rounded-full   text-sm font-semibold text-white inset-ring-1 outline-0 inset-ring-white/5 hover:bg-white/20">
        <div
    className="
      flex h-10 w-10 items-center justify-center
      rounded-full
      bg-gradient-to-br
      from-amber-400
      via-orange-500
      to-red-500
      font-bold
      text-white
      shadow-md
      transition-transform duration-300
      group-hover:rotate-6
      group-hover:scale-110
    "
  >
    {user?.FullName?.slice(0,2).toUpperCase()}
  </div>
        <ChevronDown aria-hidden="true" className="-mr-1 hidden size-5 text-gray-400" />
      </MenuButton>
      <MenuItems
        transition
        className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          <MenuItem as={Link} to="/profile" className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden hover:bg-amber-600">
            Account settings
          </MenuItem>
          {user?.is_admin && (
            <MenuItem
              as={Link}
              to={"/admin"}
              className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden hover:bg-amber-600"
            >
              Admin Dashboard
            </MenuItem>
          )}
          <MenuItem as="button" className="block w-full px-4 py-2 text-left text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden" onClick={() => dispatch(logout())}>
            Sign out
          </MenuItem>
          <MenuItem>
  <button
    onClick={() => setDark(!dark)}
    className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-300 hover:bg-white/5 transition-colors"
  >
    <div className="flex items-center gap-3">
      {dark ? (
        <Moon className="h-5 w-5 text-blue-400" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}

      <div className="flex flex-col items-start">
        <span className="font-medium">
          Appearance
        </span>

        <span className="text-xs text-gray-500">
          {dark ? "Dark mode enabled" : "Light mode enabled"}
        </span>
      </div>
    </div>

    <div
      className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
        dark ? "bg-blue-500" : "bg-gray-600"
      }`}
    >
      <div
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300 ${
          dark ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </div>
  </button>
</MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}