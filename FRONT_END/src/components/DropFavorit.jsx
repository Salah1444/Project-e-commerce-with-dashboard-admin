import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToggleFavorit } from "../store/storeSlice";
import { ToggleFavorite } from "../store/favoriteSlice";
import { AddToCart } from "../store/cartSlice";
import {  FaX } from "react-icons/fa6";
import { TrashIcon } from "lucide-react";

function DropFavorit() {
  const favorit = useSelector((state) => state.favorite.favorites);
  const dispatch = useDispatch();

  return (
    <div className="bg-white z-50 fixed right-0 top-0 md:w-1/4 w-1/2 dark:bg-slate-800 h-full p-5">
      <h1 className="text-2xl flex justify-between mb-6 text-center">
        Favorits
        <FaX
          className="cursor-pointer"
          onClick={() => dispatch(ToggleFavorit())}
          size={24}
        />
      </h1>
      <hr />
      <ul className="divide-y overflow-y-scroll h-[85%]">
        {favorit.map((el) => (
          <React.Fragment key={el._id}>
            <li className="flex justify-between gap-x-6 py-5">
              <div className="flex gap-x-4">
                <img
                  src={`${import.meta.env.VITE_BACKEND_URL}/uploads/products/${el.image}`}
                  alt={el.name}
                  className="size-12 rounded-full bg-gray-200"
                />

                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-slate-50">
                    {el.name}
                  </p>
                </div>
              </div>

              <TrashIcon
                className="cursor-pointer dark:text-slate-50 text-gray-500 hover:text-red-500 transition-colors"
                onClick={() => dispatch(ToggleFavorite(el._id))}
              />
            </li>

            <button
              onClick={() => dispatch(AddToCart(el._id))}
              className="w-full bg-amber-600 py-2 text-white hover:opacity-80"
            >
              Add To Cart
            </button>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default DropFavorit;
