import { useDispatch, useSelector } from "react-redux";
import { AddToCart } from "@/store/cartSlice";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useEffect, useState } from "react";
import API from "@/services/api";
import { toast } from "react-toastify";
import { fetchReviews } from "@/store/reviewsSlice";
import { Link, useParams } from "react-router-dom";
import { fetchProducts } from "@/store/productsSlice";
import Loading from "./Loading";

function Details() {
   
  const {id} = useParams();
  const { loading } = useSelector((s) => s.products)
    const products = useSelector((s) => s.products.allProducts)
    const { reviews } = useSelector((s) => s.reviews)
    const product = products?.find((p) => p._id === id)
  
    
  
    useEffect(() => { if (!products?.length) dispatch(fetchProducts()) }, [])
    useEffect(() => { dispatch(fetchReviews(id)) }, [id])
  const dispatch = useDispatch();
  const [comment, SetComment] = useState("");
  const [showRevForm, SetShowRevForm] = useState(false);
  // const product = useSelector((state) => state.store.product);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    API.post("/users/reviews/add-review/" + product._id, { comment })
      .then((res) => {
        res.data.success
          ? toast.success(res.data.message)
          : toast.error(res.data.message);
      })
      .catch((err) => console.error(err));
    SetShowRevForm(false);
  };
  if(loading){
    return <Loading />
  }
  return (
    <div
      className="fixed right-0 top-16 pb-16 w-full h-full overflow-y-auto z-30
                 bg-slate-50 dark:bg-slate-950
                 text-slate-700 dark:text-slate-300
                 transition-colors duration-300"
    >
      {/* Back button */}
      <Link to={'/'} className="sticky top-0 z-10 flex items-center gap-3 px-8 py-4
                      bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm
                      border-b border-slate-200 dark:border-slate-800">
        <FaArrowLeftLong
          
          size={20}
          className="cursor-pointer text-slate-500 dark:text-slate-400
                     hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
        />
        <span  className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Back to store
        </span>
      </Link>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* ── Product overview ───────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-10 items-start">

          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700
                          bg-white dark:bg-slate-900 shadow-md dark:shadow-black/30 shrink-0">
            <img
              className="hover:scale-105 transition-transform duration-300 ease-in-out"
              src={import.meta.env.VITE_BACKEND_URL + "/uploads/products/" + product?.image}
              width={300}
              height={300}
              alt={product?.name}
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100
                           after:block after:w-10 after:h-[3px] after:mt-2
                           after:rounded-full after:bg-amber-400">
              Informations
            </h2>

            <ul className="space-y-2 text-sm">
              {[
                ["Name", product?.name],
                ["Stock", product?.stock],
                ["Category", product?.category?.name],
                ["Warranty", product?.warranty],
                ["SKU", product?.sku],
                ["Brand", product?.brand],
                ["Price", `${product?.price} $`],
                ["Rating", "⭐".repeat(product?.rating)],
              ].map(([label, value]) => (
                <li key={label} className="flex items-baseline gap-2">
                  <span className="font-semibold text-slate-500 dark:text-slate-400 w-20 shrink-0">
                    {label}
                  </span>
                  <span className="text-slate-800 dark:text-slate-100">{value}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => dispatch(AddToCart(product?._id))}
              disabled={product?.stock === 0}
              className="mt-6 w-full py-2.5 rounded-lg font-semibold text-white
                         bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400
                         disabled:opacity-50 disabled:cursor-not-allowed
                         transition-colors duration-200 shadow-md hover:shadow-lg cursor-pointer"
            >
              {product?.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </button>
          </div>
        </div>

        {/* ── Description + QR ───────────────────────────── */}
        <div className="flex flex-col md:flex-row gap-10">

          <div className="flex-1">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100
                           after:block after:w-10 after:h-[3px] after:mt-2
                           after:rounded-full after:bg-amber-400">
              Description
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
              {product?.description}
            </p>
          </div>

          <div className="shrink-0">
            <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-100
                           after:block after:w-10 after:h-[3px] after:mt-2
                           after:rounded-full after:bg-amber-400">
              QR Code
            </h2>
            <div className="p-3 rounded-xl bg-white dark:bg-slate-100 inline-block shadow">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(product?.image)}`}
                alt="QR Code"
                width={150}
                height={150}
              />
            </div>
          </div>
        </div>

        {/* ── Reviews ────────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-bold mb-5 text-slate-800 dark:text-slate-100
                         after:block after:w-10 after:h-[3px] after:mt-2
                         after:rounded-full after:bg-amber-400">
            Reviews
          </h2>

          <ul className="space-y-3">
            {reviews
              ?.filter((rev) => rev.rating > 3)
              .map((rev, index) => (
                <li
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl
                             border border-slate-200 dark:border-slate-700
                             bg-white dark:bg-slate-900
                             shadow-sm dark:shadow-black/20"
                >
                  <img
                    src="https://filmvacatures.nl/img/placeholder.png"
                    alt=""
                    className="size-10 rounded-full object-cover shrink-0
                               ring-2 ring-amber-400/40"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                      {rev.user?.FullName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {rev.comment}
                    </p>
                  </div>
                </li>
              ))}
          </ul>

          <button
            onClick={() => SetShowRevForm(true)}
            className="mt-5 px-6 py-2.5 rounded-lg font-semibold text-white text-sm
                       bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400
                       transition-colors duration-200 shadow-md cursor-pointer"
          >
            Add Review
          </button>
        </div>
      </div>

      {/* ── Review modal ───────────────────────────────── */}
      {showRevForm && (
        <div
          onClick={() => SetShowRevForm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/70 dark:bg-black/80 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900
                       border border-transparent dark:border-slate-700/60
                       rounded-2xl p-8 w-full max-w-md shadow-xl dark:shadow-black/40
                       transition-colors duration-300"
          >
            <h1 className="text-center text-2xl font-bold mb-1
                           text-amber-500 dark:text-amber-400
                           font-['Playfair_Display']">
              Add a Review
            </h1>
            <p className="text-center text-sm text-slate-400 dark:text-slate-500 mb-6">
              Share your experience with this product
            </p>

            <label
              htmlFor="message"
              className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
            >
              Comment
            </label>
            <textarea
              id="message"
              name="comment"
              rows={4}
              onChange={(e) => SetComment(e.target.value)}
              placeholder="Write your comment here…"
              className="w-full rounded-lg px-4 py-3 text-sm outline-none
                         border border-amber-400 dark:border-amber-500/60
                         bg-white dark:bg-slate-800/80
                         text-slate-800 dark:text-slate-100
                         placeholder:text-slate-400 dark:placeholder:text-slate-500
                         focus:ring-2 focus:ring-amber-400 dark:focus:ring-amber-500
                         transition-colors"
              defaultValue=""
            />

            <button
              type="submit"
              className="mt-4 w-full py-2.5 rounded-lg font-semibold text-white
                         bg-amber-500 hover:bg-amber-600 dark:hover:bg-amber-400
                         transition-colors duration-200 shadow-md cursor-pointer"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Details;