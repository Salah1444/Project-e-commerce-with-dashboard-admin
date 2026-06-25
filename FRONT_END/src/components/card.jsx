import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import { AddToCart } from "@/store/cartSlice";
import { ToggleFavorite } from "@/store/favoriteSlice";
import { Link } from "react-router-dom";


function Card({ item }) {
  const dispatch = useDispatch();
  const favor = useSelector(st => st.favorite.favorites);
  const api = import.meta.env.VITE_BACKEND_URL;
  const isFavorit = favor.some(f => (f.id || f._id) === (item.id || item._id));
 
  return (
    <div className="group text-center  ">
      <div className="relative">
        <FaHeart
          onClick={() => dispatch(ToggleFavorite(item._id))}
          size={27}
          className={`absolute right-2 top-2 cursor-pointer transition-colors
            ${isFavorit ? "text-red-500" : "text-amber-50 hover:text-red-500"}`}
        />
        <img
          src={`${api}/uploads/products/${item.image}`}
          alt={item.name}
          className="aspect-square w-full rounded-lg bg-gray-200 object-cover xl:aspect-7/8"
          loading="lazy"
        />
      </div>

      <h3 className="mt-4 text-sm text-gray-700 dark:text-slate-100">{item.name}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900 dark:text-green-500">{item.price} $</p>

      <button
        onClick={() => dispatch(AddToCart(item._id))}
        className="bg-amber-600 p-3 w-1/2 hover:opacity-75"
      >
        Add To Cart
      </button>

      <Link 
        to={`/details/${item._id}`}
        className="bg-amber-300 p-3 w-1/2 hover:opacity-75"
      >
        Learn more ...
      </Link>
      
    </div>
  );
}

export default Card;
